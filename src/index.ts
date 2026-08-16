/**
 * Mascot surface plugin, node half. Mounts `GET /mascot/lines` on the host
 * webserver: each request resolves a TTL-cached batch of AI-generated idle
 * lines through the host's configured default model (`ctx.llm.stream` via
 * `ctx.agentDefaultModel.currentSelection()`). The browser half fetches this
 * route from its line rotator; failures degrade to built-in lines there.
 */
import type { Context } from '@deepseek-ai/cordis'
import { BlockAssembler } from '@deepseek-ai/dsh-llm'
import type { LlmRuntime } from '@deepseek-ai/dsh-llm'
import type { WebServer } from '@deepseek-ai/dsh-host-webserver'
import type { MascotModelSelection } from './host-lines.ts'
import {
  buildMascotLinesOptions, MascotLinesService, parseMascotLines,
  type MascotLineLocale,
} from './host-lines.ts'

declare module '@deepseek-ai/cordis' {
  interface Context {
    /** Registered provider/model adapters. */
    llm: LlmRuntime
    /** HTTP route registration (the webserver plugin's face). */
    webServer: WebServer
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
    const service = new MascotLinesService(async (locale: MascotLineLocale) => {
      const selection = ctx.agentDefaultModel.currentSelection()
      const assembler = new BlockAssembler()
      for await (const chunk of ctx.llm.stream(buildMascotLinesOptions(selection, locale))) {
        assembler.push(chunk)
      }
      const text = assembler.blocks()
        .filter((block): block is { type: 'text'; text: string } => block.type === 'text')
        .map(block => block.text)
        .join('')
      return parseMascotLines(text) ?? []
    })

    const disposeRoute = ctx.webServer.register({
      kind: 'exact',
      path: MASCOT_LINES_PATH,
      handler: async (req, res) => {
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
    return () => { disposeRoute() }
  }, 'mascot-lines: route')
}
