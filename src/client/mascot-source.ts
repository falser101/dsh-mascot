/**
 * Mascot mood fold: derives the companion's presentation state from the
 * current session's `ConversationSnapshot`. Pure presentation — nothing here
 * emits session events or reaches a model; the fold replays deterministically
 * from any snapshot sequence. The source subscribes to the sessions list
 * (current selection) and the selected session's snapshot, folds on every
 * notification, and republishes an immutable {@link MascotState}.
 */
import type {
  ConversationSnapshot, ISessions, ObservableSnapshot, PendingKind, SessionId,
} from '@deepseek-ai/dsh-client-runtime/client'
import type { MascotKey } from './locales'

/** The mood ladder the companion presents. */
export type MascotMood =
  | 'idle'
  | 'queued'
  | 'confirming'
  | 'thinking'
  | 'working'
  | 'streaming'
  | 'done'
  | 'error'
  | 'greeting'

/** One published companion frame: mood, bubble line, and transient expiry. */
export interface MascotState {
  readonly mood: MascotMood
  /** Locale key of the bubble line (resolved through the `mascot` namespace). */
  readonly textKey: MascotKey
  /** Interpolation params for `textKey` (the running tool name). */
  readonly params?: Record<string, unknown>
  /** Transient moods (greeting/done) expire at this epoch ms; steady moods omit it. */
  readonly until?: number
}

/** How long a transient mood (greeting/done) stays before folding back. */
export const MASCOT_TRANSIENT_MS = 4000

const EMPTY_TURN_ENDS: ReadonlyMap<number, number> = new Map()

function steady(
  mood: MascotMood,
  textKey: MascotKey,
  params?: Record<string, unknown>,
): MascotState {
  return { mood, textKey, ...(params === undefined ? {} : { params }) }
}

function transient(mood: 'greeting' | 'done'): MascotState {
  return { mood, textKey: `mood.${mood}`, until: Date.now() + MASCOT_TRANSIENT_MS }
}

/** Fallback copy for a merged future pending kind (see the documented default). */
const FALLBACK_CONFIRMING_KEY: MascotKey = 'mood.confirming.approval'

function confirmingKey(kind: PendingKind): MascotKey {
  switch (kind) {
    case 'approval': return 'mood.confirming.approval'
    case 'question': return 'mood.confirming.question'
    // PendingPayloads is merge-extensible; a merged kind gets the approval copy.
    default: return FALLBACK_CONFIRMING_KEY
  }
}

function streamingText(partial: ConversationSnapshot['partial']): boolean {
  if (partial === null) return false
  return partial.blocks.some(block => (block.kind === 'text' || block.kind === 'reasoning') && block.text.length > 0)
}

function sameFrame(a: MascotState, b: MascotState): boolean {
  return a.mood === b.mood
    && a.textKey === b.textKey
    && a.params?.tool === b.params?.tool
}

/**
 * Fold one conversation snapshot into the steady mood, honoring transitions
 * (session switch greeting, turn-end celebration) against the fold's own
 * previous evidence. Priority: error, greeting, confirming, queued, working,
 * streaming, thinking, done, idle.
 * @param snapshot - the session's current conversation snapshot.
 * @param lastSeenSessionId - the session id the previous fold derived from.
 * @param lastTurnEnds - the previous fold's turn-end map.
 * @returns the next published state.
 */
export function deriveMascotState(
  snapshot: ConversationSnapshot,
  lastSeenSessionId: SessionId | undefined,
  lastTurnEnds: ReadonlyMap<number, number>,
): MascotState {
  if (snapshot.lastAgentError !== null) return steady('error', 'mood.error')
  if (snapshot.sessionId !== lastSeenSessionId) {
    if (!snapshot.running) return transient('greeting')
  } else if (!snapshot.running && turnEndsAdvanced(snapshot.turnEnds, lastTurnEnds)) {
    return transient('done')
  }
  if (snapshot.pending.length > 0) return steady('confirming', confirmingKey(snapshot.pending[0].kind))
  if (snapshot.queue.length > 0 && !snapshot.running) return steady('queued', 'mood.queued')
  if (snapshot.runningCalls.length > 0) {
    return steady('working', 'mood.working', { tool: snapshot.runningCalls[0].name })
  }
  if (snapshot.running && streamingText(snapshot.partial)) return steady('streaming', 'mood.streaming')
  if (snapshot.running) return steady('thinking', 'mood.thinking')
  return steady('idle', 'mood.idle')
}

function turnEndsAdvanced(
  next: ReadonlyMap<number, number>,
  previous: ReadonlyMap<number, number>,
): boolean {
  for (const [turn, seq] of next) {
    const before = previous.get(turn)
    if (before === undefined || seq > before) return true
  }
  return false
}

/**
 * Live fold source: subscribes to the sessions list for the current
 * selection, subscribes to that session's snapshot, and republishes the
 * derived frame. Disposal detaches both subscriptions and any pending
 * transient timer.
 */
export class MascotSource implements ObservableSnapshot<MascotState> {
  private state: MascotState = steady('idle', 'mood.idle')
  private readonly listeners = new Set<() => void>()
  private readonly detach: Array<() => void> = []
  private transientTimer: ReturnType<typeof setTimeout> | undefined
  private currentSession: SessionId | undefined
  private lastSnapshot: ConversationSnapshot | undefined
  private lastSeenSessionId: SessionId | undefined
  private lastTurnEnds: ReadonlyMap<number, number> = EMPTY_TURN_ENDS

  /**
   * @param sessions - the client sessions service (list + bindings).
   */
  constructor(private readonly sessions: ISessions) {
    this.detach.push(sessions.list.subscribe(() => this.syncSession()))
    this.syncSession()
  }

  getSnapshot(): MascotState {
    return this.state
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener)
    return () => { this.listeners.delete(listener) }
  }

  /** Detach the list and session subscriptions and cancel the transient timer. */
  dispose(): void {
    for (const detach of this.detach.splice(0)) detach()
    if (this.transientTimer !== undefined) {
      clearTimeout(this.transientTimer)
      this.transientTimer = undefined
    }
    this.currentSession = undefined
    this.lastSnapshot = undefined
  }

  private syncSession(): void {
    const current = this.sessions.list.getSnapshot().current
    if (current === this.currentSession) return
    for (const detach of this.detach.splice(1)) detach()
    this.currentSession = current
    this.lastSeenSessionId = undefined
    this.lastTurnEnds = EMPTY_TURN_ENDS
    if (current === undefined) {
      this.emit(steady('idle', 'mood.idle'))
      return
    }
    const session = this.sessions.binding(current)?.session
    if (session === undefined) return // not scoped yet; the next list notification retries
    this.detach.push(session.subscribe(() => this.fold(session.getSnapshot())))
    this.fold(session.getSnapshot())
  }

  private fold(snapshot: ConversationSnapshot): void {
    this.lastSnapshot = snapshot
    const next = deriveMascotState(snapshot, this.lastSeenSessionId, this.lastTurnEnds)
    this.lastSeenSessionId = snapshot.sessionId
    this.lastTurnEnds = snapshot.turnEnds
    this.emit(next)
  }

  private emit(next: MascotState): void {
    if (sameFrame(this.state, next)) return
    this.state = next
    if (this.transientTimer !== undefined) {
      clearTimeout(this.transientTimer)
      this.transientTimer = undefined
    }
    if (next.until !== undefined) {
      // Transient moods fold back to the steady mood after their window.
      this.transientTimer = setTimeout(() => {
        this.transientTimer = undefined
        if (this.lastSnapshot !== undefined) this.fold(this.lastSnapshot)
      }, MASCOT_TRANSIENT_MS)
    }
    for (const listener of [...this.listeners]) listener()
  }
}
