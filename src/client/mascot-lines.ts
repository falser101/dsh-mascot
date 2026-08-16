/**
 * Client-side idle-line rotator: publishes one line every tick, cycling the
 * built-in pool and mixing in an AI-generated line at every
 * {@link MASCOT_LINES_AI_EVERY}th position when the AI pool has one. The AI
 * pool is fetched from the host route (`/mascot/lines`), persisted to
 * localStorage, and refreshed only when empty (the host caches batches for
 * 10 minutes, so refills are cheap). Every failure degrades silently to the
 * built-in pool. The published value is either a locale key of the built-in
 * pool (`idle.line.N`) or an AI line prefixed with `ai:`; the view resolves
 * the former through its locale seat and renders the latter verbatim.
 */
import type { ObservableSnapshot } from '@deepseek-ai/dsh-client-runtime/client'
import type { MascotKey } from './locales'

/** Built-in idle pool keys, cycled in order. */
export const IDLE_LINE_KEYS: readonly MascotKey[] = [
  'idle.line.0', 'idle.line.1', 'idle.line.2', 'idle.line.3', 'idle.line.4', 'idle.line.5',
]

/** One rotation tick, ms. */
export const MASCOT_LINE_INTERVAL_MS = 30_000

/** Insert an AI line on every Nth tick (when the AI pool has one). */
export const MASCOT_LINES_AI_EVERY = 5

/** localStorage key for the persisted AI line pool. */
export const MASCOT_LINES_STORAGE_KEY = 'dsh-mascot-lines'

/** Published value prefix for AI-generated lines. */
export const AI_LINE_PREFIX = 'ai:'

/** A raw AI pool entry persisted under {@link MASCOT_LINES_STORAGE_KEY}. */
interface PersistedLines {
  readonly lines: readonly string[]
  readonly refreshedAt: number
}

/** Rotation dependencies (injected for tests). */
export interface MascotLineSourceOptions {
  /** Current UI locale ('zh' | 'en'), read at fetch time. */
  readonly locale: () => string
  /** Fetch one batch from the host route. */
  readonly fetchLines: (locale: string) => Promise<readonly string[]>
  /** Read the persisted AI pool (defaults to the localStorage adapter). */
  readonly load?: () => PersistedLines | undefined
  /** Persist a fresh AI pool (defaults to the localStorage adapter). */
  readonly save?: (pool: PersistedLines) => void
  /** Tick interval (defaults to {@link MASCOT_LINE_INTERVAL_MS}). */
  readonly intervalMs?: number
}

function loadPersisted(): PersistedLines | undefined {
  if (typeof localStorage === 'undefined') return undefined
  try {
    const raw = localStorage.getItem(MASCOT_LINES_STORAGE_KEY)
    if (raw === null) return undefined
    const parsed = JSON.parse(raw) as { lines?: unknown; refreshedAt?: unknown }
    if (!Array.isArray(parsed.lines) || typeof parsed.refreshedAt !== 'number') return undefined
    return {
      lines: parsed.lines.filter((line): line is string => typeof line === 'string'),
      refreshedAt: parsed.refreshedAt,
    }
  } catch {
    return undefined
  }
}

function savePersisted(pool: PersistedLines): void {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(MASCOT_LINES_STORAGE_KEY, JSON.stringify(pool))
  } catch {
    // Private mode / quota: persistence silently disabled.
  }
}

/**
 * The idle-line observable source. Start publishes the first built-in line
 * synchronously, then rotates on every tick; AI pool refills are requested
 * asynchronously and never block rotation.
 */
export class MascotLineSource implements ObservableSnapshot<string> {
  private current: string = IDLE_LINE_KEYS[0]
  private readonly listeners = new Set<() => void>()
  private readonly intervalMs: number
  private readonly aiQueue: string[]
  private aiEnabled = true
  private builtinIndex = 0
  private ticksSinceAi = 0
  private fetchInFlight = false
  private timer: ReturnType<typeof setInterval> | undefined

  /**
   * @param options - rotation dependencies.
   */
  constructor(private readonly options: MascotLineSourceOptions) {
    this.intervalMs = options.intervalMs ?? MASCOT_LINE_INTERVAL_MS
    const persisted = (options.load ?? loadPersisted)()
    this.aiQueue = [...(persisted?.lines ?? [])]
  }

  /** Publish the first line and start the rotation timer. */
  start(): void {
    // The first line is already current; each tick advances the rotation.
    this.timer = setInterval(() => { this.advance() }, this.intervalMs)
    this.refillIfNeeded()
  }

  getSnapshot(): string {
    return this.current
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener)
    return () => { this.listeners.delete(listener) }
  }

  /** Apply the user's AI-lines preference to the rotator. */
  setAiEnabled(enabled: boolean): void {
    this.aiEnabled = enabled
    if (enabled) this.refillIfNeeded()
  }

  /** Stop the rotation timer and any in-flight refill. */
  dispose(): void {
    if (this.timer !== undefined) {
      clearInterval(this.timer)
      this.timer = undefined
    }
  }

  private advance(): void {
    this.ticksSinceAi += 1
    if (this.aiEnabled && this.ticksSinceAi >= MASCOT_LINES_AI_EVERY && this.aiQueue.length > 0) {
      this.ticksSinceAi = 0
      this.current = AI_LINE_PREFIX + this.aiQueue.shift()
    } else {
      this.builtinIndex = (this.builtinIndex + 1) % IDLE_LINE_KEYS.length
      this.current = IDLE_LINE_KEYS[this.builtinIndex]
    }
    for (const listener of [...this.listeners]) listener()
    if (this.aiQueue.length === 0) this.refillIfNeeded()
  }

  private refillIfNeeded(): void {
    if (!this.aiEnabled || this.fetchInFlight) return
    this.fetchInFlight = true
    void this.options.fetchLines(this.options.locale()).then(
      (lines) => {
        if (lines.length === 0) return
        const pool: PersistedLines = { lines, refreshedAt: Date.now() }
        this.aiQueue.push(...lines)
        ;(this.options.save ?? savePersisted)(pool)
      },
      () => { /* network/model failure: stay on built-ins */ },
    ).finally(() => {
      this.fetchInFlight = false
    })
  }
}
