/**
 * Host-side mascot-line generation: the prompt template, request assembly,
 * response parsing, and the TTL-cached service behind `GET /mascot/lines`.
 * Pure logic — the route handler and the LLM stream wiring live in
 * `src/index.ts`; tests exercise this module with a stubbed generator.
 */
import { createUserMessage } from '@deepseek-ai/dsh-llm'
import type { GenerateOptions } from '@deepseek-ai/dsh-llm'

/** One batch of AI-generated lines is cached this long before regenerating. */
export const MASCOT_LINES_TTL_MS = 10 * 60_000

/** Lines generated per batch (the client rotates them at ~1/5 of its cadence). */
export const MASCOT_LINES_BATCH = 6

/** Hard cap on one line's length; longer output is dropped as malformed. */
export const MASCOT_LINE_MAX_CHARS = 40

/** Token budget for one batch request. */
export const MASCOT_LINES_MAX_TOKENS = 400

/** Supported line locales (the UI's own locale vocabulary). */
export type MascotLineLocale = 'zh' | 'en'

/** The host default-model selection slice this plugin reads (structural; importing
 *  dsh-agent would pull its Context merges into the browser compile graph). */
export interface MascotModelSelection {
  /** Registered provider route. */
  provider: string
  /** Provider-owned model id. */
  model: string
  /** Adapter-owned reasoning effort, when selected. */
  reasoningEffort?: string
}

/** One served batch result. */
export interface MascotLinesResult {
  readonly lines: readonly string[]
  /** Epoch ms when the batch was generated (cache TTL anchor). */
  readonly refreshedAt: number
}

/** The generation directive handed to the model as its system prompt. */
export function mascotLinesPrompt(locale: MascotLineLocale): string {
  const tone = locale === 'zh'
    ? '你是一只悬浮在 AI 编程工具界面上的小宠物（卡通猫/狗），陪用户工作。根据用户当前等待的状态，生成温暖、俏皮、不油腻的短文案。\n要求：\n1. 只输出 JSON 数组，如 ["a","b","c","d","e","f"]，共 6 条，不要任何其他文字\n2. 每条不超过 20 个汉字\n3. 语气多样：温柔陪伴 / 俏皮卖萌 / 元气鼓励 各占一些\n4. 不要出现"AI"、"模型"、"助手"等词汇；不要解释；句式不要重复\n5. 语境：用户在等待 AI 干活或思考，文案要让人会心一笑或感到被陪伴'
    : 'You are a small floating pet (cartoon cat/dog) on the user\'s AI coding tool UI, keeping the user company. Write short, warm, playful lines for someone waiting on the assistant.\nRequirements:\n1. Output ONLY a JSON array like ["a","b","c","d","e","f"] with 6 lines and nothing else\n2. Each line at most 40 characters\n3. Vary the tone: gentle company / playful / energetic encouragement\n4. Never mention "AI", "model", or "assistant"; no explanations; no repeated sentence patterns\n5. Context: the user is waiting for the assistant to work or think — the line should raise a smile or feel like company'
  return tone
}

/**
 * Assemble the one-shot generation request for the configured default model.
 * @param selection - the host's default model selection.
 * @param locale - the line locale.
 * @returns the streamable request.
 */
export function buildMascotLinesOptions(
  selection: MascotModelSelection,
  locale: MascotLineLocale,
): GenerateOptions {
  return {
    provider: selection.provider,
    model: selection.model,
    system: mascotLinesPrompt(locale),
    messages: [
      createUserMessage({
        content: [{ type: 'text', text: locale === 'zh' ? '生成 6 条。' : 'Generate 6 lines.' }],
        source: { kind: 'plugin', plugin: '@falser101/mascot' },
      }),
    ],
    temperature: 1.2,
    maxTokens: MASCOT_LINES_MAX_TOKENS,
  }
}

/**
 * Parse and validate the model's raw output into a line batch. Accepts a
 * fenced JSON block; drops non-string, blank, and overlong entries and
 * deduplicates; returns undefined for anything that is not a usable array.
 * @param raw - the model's raw text output.
 * @returns the validated batch, or undefined when malformed.
 */
export function parseMascotLines(raw: string): readonly string[] | undefined {
  const cleaned = raw.trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')
  if (cleaned === '') return undefined
  let parsed: unknown
  try {
    parsed = JSON.parse(cleaned)
  } catch {
    return undefined
  }
  if (!Array.isArray(parsed)) return undefined
  const lines: string[] = []
  for (const entry of parsed) {
    if (typeof entry !== 'string') continue
    const line = entry.trim()
    if (line === '' || line.length > MASCOT_LINE_MAX_CHARS) continue
    if (!lines.includes(line)) lines.push(line)
  }
  return lines.length === 0 ? undefined : lines.slice(0, MASCOT_LINES_BATCH)
}

/**
 * TTL-cached, concurrency-safe line batch service. A generation failure
 * (throw, empty batch) keeps the previous batch; with no cache at all it
 * serves an empty batch so the client falls back to built-in lines.
 */
export class MascotLinesService {
  private cache: MascotLinesResult | undefined
  private inFlight: Promise<readonly string[]> | undefined

  /**
   * @param generate - one batch generator (the LLM call).
   */
  constructor(private readonly generate: (locale: MascotLineLocale) => Promise<readonly string[]>) {}

  /**
   * Resolve the current batch for one locale: the fresh cache, a freshly
   * generated batch (shared across concurrent callers), or the stale cache
   * when generation fails — finally an empty batch.
   * @param locale - the line locale.
   * @returns the batch to serve.
   */
  async lines(locale: MascotLineLocale): Promise<MascotLinesResult> {
    const now = Date.now()
    const cached = this.cache
    if (cached !== undefined && now - cached.refreshedAt < MASCOT_LINES_TTL_MS) {
      return cached
    }
    try {
      const lines = await this.generateFor(locale)
      if (lines.length > 0) {
        this.cache = { lines, refreshedAt: now }
        return this.cache
      }
    } catch {
      // A failed generation keeps the stale batch below.
    }
    if (cached !== undefined) return cached
    return { lines: [], refreshedAt: now }
  }

  private generateFor(locale: MascotLineLocale): Promise<readonly string[]> {
    this.inFlight ??= this.generate(locale).finally(() => { this.inFlight = undefined })
    return this.inFlight
  }
}
