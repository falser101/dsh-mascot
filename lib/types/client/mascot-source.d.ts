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
import type { ConversationSnapshot, ISessions, ObservableSnapshot, SessionId, SessionListState } from '@deepseek-ai/dsh-client-runtime/client';
import type { MascotKey } from './locales';
/** The mood ladder the companion presents. */
export type MascotMood = 'idle' | 'queued' | 'confirming' | 'thinking' | 'working' | 'streaming' | 'done' | 'error' | 'greeting'
/** The current session is quiet but other sessions/jobs are running. */
 | 'elsewhere';
/** One parallel execution unit shown in the hover detail list. */
export interface BusyPeer {
    /** Stable identity (session id, `job:<id>`, subagent id) — React key. */
    readonly id: string;
    /** Display label: session title, job label, or subagent label. */
    readonly label: string;
    readonly kind: 'session' | 'subagent' | 'job';
    /** Locale key of the status word; sessions may carry mood params. */
    readonly statusKey: MascotKey;
    /** Interpolation params for `statusKey`. */
    readonly statusParams?: Record<string, unknown>;
    /** True for the currently selected session (jump target affordance). */
    readonly current?: boolean;
}
/** The mood half of a published frame (busy context is composed in by the fold). */
export type MascotMoodFrame = Omit<MascotState, 'busyCount' | 'peers'>;
/** One published companion frame: mood, bubble line, and busy context. */
export interface MascotState {
    readonly mood: MascotMood;
    /** Locale key of the bubble line (resolved through the `mascot` namespace). */
    readonly textKey: MascotKey;
    /** Interpolation params for `textKey` (the running tool name). */
    readonly params?: Record<string, unknown>;
    /** Transient moods (greeting/done) expire at this epoch ms; steady moods omit it. */
    readonly until?: number;
    /** Parallel execution count across sessions and jobs (badge; shown when ≥2). */
    readonly busyCount: number;
    /** Ordered peer list for the hover detail (current session first). */
    readonly peers: readonly BusyPeer[];
}
/** How long a transient mood (greeting/done) stays before folding back. */
export declare const MASCOT_TRANSIENT_MS = 4000;
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
export declare function deriveMascotState(snapshot: ConversationSnapshot, lastSeenSessionId: SessionId | undefined, lastTurnEnds: ReadonlyMap<number, number>): MascotMoodFrame;
/**
 * Derive the parallel-execution context from the session list: the current
 * session when active, every other running session (subagent rows included),
 * running children of loaded subagent catalogs, and live background jobs
 * across sessions (deduplicated by job id).
 * @param list - the sessions list snapshot.
 * @param current - the current session's conversation snapshot.
 * @returns the busy count and ordered peer list.
 */
export declare function deriveBusyContext(list: SessionListState, current: ConversationSnapshot): {
    busyCount: number;
    peers: readonly BusyPeer[];
};
/**
 * Live fold source: subscribes to the sessions list (current selection plus
 * parallel activity) and the selected session's snapshot, and republishes
 * the derived frame. Disposal detaches both subscriptions and any pending
 * transient timer.
 */
export declare class MascotSource implements ObservableSnapshot<MascotState> {
    private readonly sessions;
    private state;
    private readonly listeners;
    private readonly detach;
    private transientTimer;
    private currentSession;
    private lastSnapshot;
    private lastSeenSessionId;
    private lastTurnEnds;
    /**
     * @param sessions - the client sessions service (list + bindings).
     */
    constructor(sessions: ISessions);
    getSnapshot(): MascotState;
    subscribe(listener: () => void): () => void;
    /** Detach the list and session subscriptions and cancel the transient timer. */
    dispose(): void;
    private onListChange;
    private syncSession;
    private fold;
    private emit;
}
