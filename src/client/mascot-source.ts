/**
 * Mascot mood fold: derives the companion's presentation state from the
 * current session's `ConversationSnapshot` plus the parallel-execution
 * context of the whole session list (other running sessions, loaded
 * subagents, background jobs). Pure presentation — nothing here emits
 * session events or reaches a model; the fold replays deterministically
 * from any snapshot/list sequence. The source subscribes to the sessions
 * list (selection + parallelism) and the selected session's snapshot,
 * folds on every notification, and republishes an immutable
 * {@link MascotState}.
 */
import type {
  ConversationSnapshot, ISessions, ObservableSnapshot, PendingKind, SessionId,
  SessionListState,
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
  /** The current session is quiet but other sessions/jobs are running. */
  | 'elsewhere'

/** One parallel execution unit shown in the hover detail list. */
export interface BusyPeer {
  /** Stable identity (session id, `job:<id>`, subagent id) — React key. */
  readonly id: string
  /** Display label: session title, job label, or subagent label. */
  readonly label: string
  readonly kind: 'session' | 'subagent' | 'job'
  /** Locale key of the status word; sessions may carry mood params. */
  readonly statusKey: MascotKey
  /** Interpolation params for `statusKey`. */
  readonly statusParams?: Record<string, unknown>
  /** True for the currently selected session (jump target affordance). */
  readonly current?: boolean
}

/** The mood half of a published frame (busy context is composed in by the fold). */
export type MascotMoodFrame = Omit<MascotState, 'busyCount' | 'peers'>

/** One published companion frame: mood, bubble line, and busy context. */
export interface MascotState {
  readonly mood: MascotMood
  /** Locale key of the bubble line (resolved through the `mascot` namespace). */
  readonly textKey: MascotKey
  /** Interpolation params for `textKey` (the running tool name). */
  readonly params?: Record<string, unknown>
  /** Transient moods (greeting/done) expire at this epoch ms; steady moods omit it. */
  readonly until?: number
  /** Parallel execution count across sessions and jobs (badge; shown when ≥2). */
  readonly busyCount: number
  /** Ordered peer list for the hover detail (current session first). */
  readonly peers: readonly BusyPeer[]
}

/** How long a transient mood (greeting/done) stays before folding back. */
export const MASCOT_TRANSIENT_MS = 4000

const EMPTY_TURN_ENDS: ReadonlyMap<number, number> = new Map()

function steady(
  mood: MascotMood,
  textKey: MascotKey,
  params?: Record<string, unknown>,
): MascotMoodFrame {
  return { mood, textKey, ...(params === undefined ? {} : { params }) }
}

function transient(mood: 'greeting' | 'done'): MascotMoodFrame {
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

/**
 * Fold one conversation snapshot into the steady mood, honoring transitions
 * (session switch greeting, turn-end celebration) against the fold's own
 * previous evidence. Priority: error, greeting, confirming, queued, working,
 * streaming, thinking, done, idle.
 * @param snapshot - the session's current conversation snapshot.
 * @param lastSeenSessionId - the session id the previous fold derived from.
 * @param lastTurnEnds - the previous fold's turn-end map.
 * @returns the next published mood frame (without the busy context).
 */
export function deriveMascotState(
  snapshot: ConversationSnapshot,
  lastSeenSessionId: SessionId | undefined,
  lastTurnEnds: ReadonlyMap<number, number>,
): MascotMoodFrame {
  if (snapshot.lastAgentError !== null) return steady('error', 'mood.error')
  if (snapshot.sessionId !== lastSeenSessionId) {
    if (!snapshot.running) return transient('greeting')
  } else if (!snapshot.running && turnEndsAdvanced(snapshot.turnEnds, lastTurnEnds)) {
    return transient('done')
  }
  if (snapshot.pending.length > 0) return steady('confirming', confirmingKey(snapshot.pending[0].kind))
  if (snapshot.queue.length > 0 && !snapshot.running) return steady('queued', 'mood.queued')
  if (snapshot.runningCalls.length > 0) {
    const tool = snapshot.runningCalls[0].name
    if (snapshot.runningCalls.length > 1) {
      return steady('working', 'mood.working.many', { tool, count: snapshot.runningCalls.length })
    }
    return steady('working', 'mood.working', { tool })
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
 * Derive the parallel-execution context from the session list: the current
 * session when active, every other running session (subagent rows included),
 * running children of loaded subagent catalogs, and live background jobs
 * across sessions (deduplicated by job id).
 * @param list - the sessions list snapshot.
 * @param current - the current session's conversation snapshot.
 * @returns the busy count and ordered peer list.
 */
export function deriveBusyContext(
  list: SessionListState,
  current: ConversationSnapshot,
): { busyCount: number; peers: readonly BusyPeer[] } {
  const peers: BusyPeer[] = []

  if (current.running || current.pending.length > 0 || current.queue.length > 0) {
    const currentMood = deriveMascotState(current, current.sessionId, EMPTY_TURN_ENDS)
    peers.push({
      id: current.sessionId,
      label: list.byId[current.sessionId]?.displayTitle ?? current.sessionId,
      kind: 'session',
      statusKey: currentMood.textKey,
      statusParams: currentMood.params,
      current: true,
    })
  }

  for (const id of list.ids) {
    if (id === current.sessionId) continue
    const summary = list.byId[id]
    if (summary === undefined || !summary.running) continue
    peers.push({
      id,
      label: summary.displayTitle,
      kind: summary.origin === 'subagent' ? 'subagent' : 'session',
      statusKey: 'peer.status.running',
    })
  }

  for (const catalog of Object.values(list.subagentsByParent)) {
    if (catalog.state !== 'ready') continue
    for (const entry of catalog.entries) {
      if (entry.kind !== 'child' || entry.activity !== 'running') continue
      const id = String(entry.id)
      if (peers.some(peer => peer.id === id)) continue
      peers.push({ id, label: entry.label ?? id, kind: 'subagent', statusKey: 'peer.status.running' })
    }
  }

  const seenJobs = new Set<string>()
  for (const jobs of Object.values(list.jobsBySession)) {
    for (const job of jobs) {
      if (job.status !== 'running' && job.status !== 'stopping') continue
      if (seenJobs.has(job.id)) continue
      seenJobs.add(job.id)
      peers.push({
        id: `job:${job.id}`,
        label: job.label,
        kind: 'job',
        statusKey: job.status === 'running' ? 'peer.status.running' : 'peer.status.stopping',
      })
    }
  }

  return { busyCount: peers.length, peers }
}

function sameFrame(a: MascotState, b: MascotState): boolean {
  if (a.mood !== b.mood || a.textKey !== b.textKey) return false
  if (a.params?.tool !== b.params?.tool || a.params?.count !== b.params?.count) return false
  if (a.busyCount !== b.busyCount) return false
  if (a.peers.length !== b.peers.length) return false
  return a.peers.every((peer, index) => {
    const other = b.peers[index]
    return other !== undefined
      && peer.id === other.id
      && peer.label === other.label
      && peer.kind === other.kind
      && peer.statusKey === other.statusKey
      && peer.statusParams?.tool === other.statusParams?.tool
  })
}

/**
 * Live fold source: subscribes to the sessions list (current selection plus
 * parallel activity) and the selected session's snapshot, and republishes
 * the derived frame. Disposal detaches both subscriptions and any pending
 * transient timer.
 */
export class MascotSource implements ObservableSnapshot<MascotState> {
  private state: MascotState = {
    ...steady('idle', 'mood.idle'),
    busyCount: 0,
    peers: [],
  }
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
    this.detach.push(sessions.list.subscribe(() => this.onListChange()))
    this.onListChange()
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

  private onListChange(): void {
    const before = this.currentSession
    this.syncSession()
    // A list notification that did not move the selection still changes the
    // parallel context (other sessions flipping running, jobs settling), so
    // refold the last snapshot against the fresh list.
    if (before === this.currentSession && this.lastSnapshot !== undefined) {
      this.fold(this.lastSnapshot)
    }
  }

  private syncSession(): void {
    const current = this.sessions.list.getSnapshot().current
    if (current === this.currentSession) return
    for (const detach of this.detach.splice(1)) detach()
    this.currentSession = current
    this.lastSeenSessionId = undefined
    this.lastTurnEnds = EMPTY_TURN_ENDS
    if (current === undefined) {
      this.emit({ ...steady('idle', 'mood.idle'), busyCount: 0, peers: [] })
      return
    }
    const session = this.sessions.binding(current)?.session
    if (session === undefined) return // not scoped yet; the next list notification retries
    this.detach.push(session.subscribe(() => this.fold(session.getSnapshot())))
    this.fold(session.getSnapshot())
  }

  private fold(snapshot: ConversationSnapshot): void {
    this.lastSnapshot = snapshot
    let next = deriveMascotState(snapshot, this.lastSeenSessionId, this.lastTurnEnds)
    this.lastSeenSessionId = snapshot.sessionId
    this.lastTurnEnds = snapshot.turnEnds
    const busy = deriveBusyContext(this.sessions.list.getSnapshot(), snapshot)
    // The quiet-current fallback: when this session is idle but other
    // executions run, the bubble says so (steady busy state).
    if (next.mood === 'idle' && busy.busyCount > 0) {
      next = steady('elsewhere', 'mood.elsewhere', { count: busy.busyCount })
    }
    this.emit({ ...next, ...busy })
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
