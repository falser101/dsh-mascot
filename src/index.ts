/**
 * Mascot surface plugin, node half. Mounts `GET /mascot/lines` on the host
 * webserver: each request resolves a TTL-cached batch of AI-generated idle
 * lines through the host's configured default model (`ctx.llm.stream` via
 * `ctx.agentDefaultModel.currentSelection()`). The browser half fetches this
 * route from its line rotator; failures degrade to built-in lines there.
 */
import type { Context } from '@deepseek-ai/cordis'
import type { MascotModelSelection } from './host-lines.ts'
import {
  buildMascotLinesOptions, MascotLinesService, parseMascotLines,
  type MascotGenerateRequest, type MascotLineLocale,
} from './host-lines.ts'

/** One chunk from `ctx.llm.stream` — only the text fields this route reads. */
interface StreamChunk {
  readonly type: string
  readonly text?: string
  readonly block?: { readonly type?: string; readonly text?: string }
}

/** Concatenate text-delta chunks; fall back to a closed text block. */
async function collectStreamText(
  stream: AsyncIterable<StreamChunk>,
): Promise<string> {
  let text = ''
  for await (const chunk of stream) {
    if (chunk.type === 'text-delta' && typeof chunk.text === 'string') {
      text += chunk.text
    } else if (
      chunk.type === 'block-end'
      && chunk.block?.type === 'text'
      && typeof chunk.block.text === 'string'
      && text === ''
    ) {
      text = chunk.block.text
    }
  }
  return text
}

declare module '@deepseek-ai/cordis' {
  interface Context {
    /** Registered provider/model adapters. */
    llm: { stream(options: MascotGenerateRequest): AsyncIterable<StreamChunk> }
    /** HTTP route registration (the webserver plugin's face). */
    webServer: {
      register(route: {
        kind: 'exact'
        path: string
        handler: (req: { url?: string }, res: {
          writeHead: (status: number, headers: Record<string, string>) => void
          end: (body: string) => void
        }) => void | Promise<void>
      }): () => void
    }
    /** The host's configured default model selection (structural slice of
     *  dsh-agent-default-model; see {@link MascotModelSelection}). */
    agentDefaultModel: { currentSelection(): MascotModelSelection }
  }
}

/** Required services: the LLM runtime, the webserver, and the default model. */
export const inject = ['llm', 'webServer', 'agentDefaultModel']

/** Route path the browser half fetches. */
export const MASCOT_LINES_PATH = '/mascot/lines'

/**
 * Host plugin body: register the lines route for the fiber's lifetime.
 * @param ctx - host Cordis context.
 */
export function apply(ctx: Context): void {
  ctx.effect(() => {
    let disposed = false
    const service = new MascotLinesService(async (locale: MascotLineLocale) => {
      if (disposed) return []
      const selection = ctx.agentDefaultModel.currentSelection()
      const text = await collectStreamText(
        ctx.llm.stream(buildMascotLinesOptions(selection, locale)),
      )
      if (disposed) return []
      return parseMascotLines(text) ?? []
    })

    const disposeRoute = ctx.webServer.register({
      kind: 'exact',
      path: MASCOT_LINES_PATH,
      handler: async (req, res) => {
        if (disposed) {
          res.writeHead(503, { 'content-type': 'application/json; charset=utf-8' })
          res.end(JSON.stringify({ error: 'mascot lines unavailable' }))
          return
        }
        const locale: MascotLineLocale = new URL(req.url ?? '/', 'http://localhost')
          .searchParams.get('locale') === 'en' ? 'en' : 'zh'
        try {
          const result = await service.lines(locale)
          res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' })
          res.end(JSON.stringify(result))
        } catch (error) {
          res.writeHead(503, { 'content-type': 'application/json; charset=utf-8' })
          res.end(JSON.stringify({ error: 'mascot lines unavailable' }))
        }
      },
    })
    return () => {
      disposed = true
      disposeRoute()
    }
  }, 'mascot-lines: route')
}
