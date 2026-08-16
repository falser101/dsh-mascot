/** How long a transient mood (greeting/done) stays before folding back. */
export const MASCOT_TRANSIENT_MS = 4000;
const EMPTY_TURN_ENDS = new Map();
function steady(mood, textKey, params) {
    return { mood, textKey, ...(params === undefined ? {} : { params }) };
}
function transient(mood) {
    return { mood, textKey: `mood.${mood}`, until: Date.now() + MASCOT_TRANSIENT_MS };
}
/** Fallback copy for a merged future pending kind (see the documented default). */
const FALLBACK_CONFIRMING_KEY = 'mood.confirming.approval';
function confirmingKey(kind) {
    switch (kind) {
        case 'approval': return 'mood.confirming.approval';
        case 'question': return 'mood.confirming.question';
        // PendingPayloads is merge-extensible; a merged kind gets the approval copy.
        default: return FALLBACK_CONFIRMING_KEY;
    }
}
function streamingText(partial) {
    if (partial === null)
        return false;
    return partial.blocks.some(block => (block.kind === 'text' || block.kind === 'reasoning') && block.text.length > 0);
}
function sameFrame(a, b) {
    return a.mood === b.mood
        && a.textKey === b.textKey
        && a.params?.tool === b.params?.tool;
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
export function deriveMascotState(snapshot, lastSeenSessionId, lastTurnEnds) {
    if (snapshot.lastAgentError !== null)
        return steady('error', 'mood.error');
    if (snapshot.sessionId !== lastSeenSessionId) {
        if (!snapshot.running)
            return transient('greeting');
    }
    else if (!snapshot.running && turnEndsAdvanced(snapshot.turnEnds, lastTurnEnds)) {
        return transient('done');
    }
    if (snapshot.pending.length > 0)
        return steady('confirming', confirmingKey(snapshot.pending[0].kind));
    if (snapshot.queue.length > 0 && !snapshot.running)
        return steady('queued', 'mood.queued');
    if (snapshot.runningCalls.length > 0) {
        return steady('working', 'mood.working', { tool: snapshot.runningCalls[0].name });
    }
    if (snapshot.running && streamingText(snapshot.partial))
        return steady('streaming', 'mood.streaming');
    if (snapshot.running)
        return steady('thinking', 'mood.thinking');
    return steady('idle', 'mood.idle');
}
function turnEndsAdvanced(next, previous) {
    for (const [turn, seq] of next) {
        const before = previous.get(turn);
        if (before === undefined || seq > before)
            return true;
    }
    return false;
}
/**
 * Live fold source: subscribes to the sessions list for the current
 * selection, subscribes to that session's snapshot, and republishes the
 * derived frame. Disposal detaches both subscriptions and any pending
 * transient timer.
 */
export class MascotSource {
    sessions;
    state = steady('idle', 'mood.idle');
    listeners = new Set();
    detach = [];
    transientTimer;
    currentSession;
    lastSnapshot;
    lastSeenSessionId;
    lastTurnEnds = EMPTY_TURN_ENDS;
    /**
     * @param sessions - the client sessions service (list + bindings).
     */
    constructor(sessions) {
        this.sessions = sessions;
        this.detach.push(sessions.list.subscribe(() => this.syncSession()));
        this.syncSession();
    }
    getSnapshot() {
        return this.state;
    }
    subscribe(listener) {
        this.listeners.add(listener);
        return () => { this.listeners.delete(listener); };
    }
    /** Detach the list and session subscriptions and cancel the transient timer. */
    dispose() {
        for (const detach of this.detach.splice(0))
            detach();
        if (this.transientTimer !== undefined) {
            clearTimeout(this.transientTimer);
            this.transientTimer = undefined;
        }
        this.currentSession = undefined;
        this.lastSnapshot = undefined;
    }
    syncSession() {
        const current = this.sessions.list.getSnapshot().current;
        if (current === this.currentSession)
            return;
        for (const detach of this.detach.splice(1))
            detach();
        this.currentSession = current;
        this.lastSeenSessionId = undefined;
        this.lastTurnEnds = EMPTY_TURN_ENDS;
        if (current === undefined) {
            this.emit(steady('idle', 'mood.idle'));
            return;
        }
        const session = this.sessions.binding(current)?.session;
        if (session === undefined)
            return; // not scoped yet; the next list notification retries
        this.detach.push(session.subscribe(() => this.fold(session.getSnapshot())));
        this.fold(session.getSnapshot());
    }
    fold(snapshot) {
        this.lastSnapshot = snapshot;
        const next = deriveMascotState(snapshot, this.lastSeenSessionId, this.lastTurnEnds);
        this.lastSeenSessionId = snapshot.sessionId;
        this.lastTurnEnds = snapshot.turnEnds;
        this.emit(next);
    }
    emit(next) {
        if (sameFrame(this.state, next))
            return;
        this.state = next;
        if (this.transientTimer !== undefined) {
            clearTimeout(this.transientTimer);
            this.transientTimer = undefined;
        }
        if (next.until !== undefined) {
            // Transient moods fold back to the steady mood after their window.
            this.transientTimer = setTimeout(() => {
                this.transientTimer = undefined;
                if (this.lastSnapshot !== undefined)
                    this.fold(this.lastSnapshot);
            }, MASCOT_TRANSIENT_MS);
        }
        for (const listener of [...this.listeners])
            listener();
    }
}
