import type { PopCadence } from '../mascot-store';
/** One-shot idle pose clip ids. */
export declare const IDLE_ACTIONS: readonly ["stretch", "yawn"];
/** One-shot idle pose clip id. */
export type IdleActionId = (typeof IDLE_ACTIONS)[number];
/** One playable clip: id plus in-order data-URI frames. */
export interface ActionClip {
    readonly id: IdleActionId;
    readonly frames: readonly string[];
}
/** Default hold for an in-between pose. */
export declare const ACTION_FRAME_MS = 480;
/** Extra hold on the peak pose so the stretch / yawn reads at 96px. */
export declare const ACTION_PEAK_EXTRA_MS = 520;
/** Extra hold on the last pose so the cut back to idle is not abrupt. */
export declare const ACTION_LAST_EXTRA_MS = 280;
/** Jittered gap between idle clips, per settings cadence. */
export declare const ACTION_INTERVALS: Record<PopCadence, {
    readonly minMs: number;
    readonly maxMs: number;
}>;
/**
 * Wait-clock milestones: [first yawn, then stretch]. Cadence only shifts
 * how soon the bigger pose arrives — the clock is session wait, not idle.
 */
export declare const WAIT_THRESHOLDS: Record<PopCadence, readonly [number, number]>;
/** One wait-clock beat: when to play which clip. */
export interface WaitMilestone {
    readonly delayMs: number;
    readonly action: IdleActionId;
}
/**
 * Next wait-clock beat. Overdue milestones collapse to the latest one so a
 * remount mid-wait plays the bigger pose, not a yawn then a stretch back
 * to back. After stretch has fired, it repeats on the stretch interval.
 */
export declare function nextWaitMilestone(elapsedMs: number, fired: ReadonlySet<IdleActionId>, cadence: PopCadence): WaitMilestone | null;
/**
 * How long each frame stays visible. Two-frame clips (most breeds) get a
 * long settle + a long peak; longer clips keep a slow rise, a held peak,
 * and a held landing so the flipbook does not chatter.
 */
export declare function frameDurations(count: number): readonly number[];
/** Pick the next clip, avoiding an immediate repeat when both exist. */
export declare function pickAction(available: readonly IdleActionId[], last: IdleActionId | null, random?: () => number): IdleActionId | null;
/** A jittered wait drawn from the cadence window. */
export declare function nextDelayMs(cadence: PopCadence, random?: () => number): number;
/** Inputs the widget feeds the director. */
export interface IdleDirectorOptions {
    /** True while uncollapsed and not dragging (idle ambient or a wait clock). */
    readonly enabled: boolean;
    readonly cadence: PopCadence;
    /** Clips that have enough frames for this skin. */
    readonly clips: readonly ActionClip[];
    /** Epoch ms when the current model-wait began; omit when not waiting. */
    readonly waitStartedAt?: number;
}
/** Playing clip, or nothing. */
export interface IdleDirectorState {
    readonly action: IdleActionId | null;
    readonly href: string | null;
}
export declare function useIdleDirector(options: IdleDirectorOptions): IdleDirectorState;
