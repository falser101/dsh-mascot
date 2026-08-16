/**
 * Mascot mood fold: derives the companion's presentation state from the
 * current session's `ConversationSnapshot`. Pure presentation — nothing here
 * emits session events or reaches a model; the fold replays deterministically
 * from any snapshot sequence. The source subscribes to the sessions list
 * (current selection) and the selected session's snapshot, folds on every
 * notification, and republishes an immutable {@link MascotState}.
 */
import type { ConversationSnapshot, ISessions, ObservableSnapshot, SessionId } from '@deepseek-ai/dsh-client-runtime/client';
import type { MascotKey } from './locales';
/** The mood ladder the companion presents. */
export type MascotMood = 'idle' | 'queued' | 'confirming' | 'thinking' | 'working' | 'streaming' | 'done' | 'error' | 'greeting';
/** One published companion frame: mood, bubble line, and transient expiry. */
export interface MascotState {
    readonly mood: MascotMood;
    /** Locale key of the bubble line (resolved through the `mascot` namespace). */
    readonly textKey: MascotKey;
    /** Interpolation params for `textKey` (the running tool name). */
    readonly params?: Record<string, unknown>;
    /** Transient moods (greeting/done) expire at this epoch ms; steady moods omit it. */
    readonly until?: number;
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
 * @returns the next published state.
 */
export declare function deriveMascotState(snapshot: ConversationSnapshot, lastSeenSessionId: SessionId | undefined, lastTurnEnds: ReadonlyMap<number, number>): MascotState;
/**
 * Live fold source: subscribes to the sessions list for the current
 * selection, subscribes to that session's snapshot, and republishes the
 * derived frame. Disposal detaches both subscriptions and any pending
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
    private syncSession;
    private fold;
    private emit;
}
