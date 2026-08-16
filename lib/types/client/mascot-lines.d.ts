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
import type { ObservableSnapshot } from '@deepseek-ai/dsh-client-runtime/client';
import type { MascotKey } from './locales';
/** Built-in idle pool keys, cycled in order. */
export declare const IDLE_LINE_KEYS: readonly MascotKey[];
/** One rotation tick, ms. */
export declare const MASCOT_LINE_INTERVAL_MS = 30000;
/** Insert an AI line on every Nth tick (when the AI pool has one). */
export declare const MASCOT_LINES_AI_EVERY = 5;
/** localStorage key for the persisted AI line pool. */
export declare const MASCOT_LINES_STORAGE_KEY = "dsh-mascot-lines";
/** Published value prefix for AI-generated lines. */
export declare const AI_LINE_PREFIX = "ai:";
/** A raw AI pool entry persisted under {@link MASCOT_LINES_STORAGE_KEY}. */
interface PersistedLines {
    readonly lines: readonly string[];
    readonly refreshedAt: number;
}
/** Rotation dependencies (injected for tests). */
export interface MascotLineSourceOptions {
    /** Current UI locale ('zh' | 'en'), read at fetch time. */
    readonly locale: () => string;
    /** Fetch one batch from the host route. */
    readonly fetchLines: (locale: string) => Promise<readonly string[]>;
    /** Read the persisted AI pool (defaults to the localStorage adapter). */
    readonly load?: () => PersistedLines | undefined;
    /** Persist a fresh AI pool (defaults to the localStorage adapter). */
    readonly save?: (pool: PersistedLines) => void;
    /** Tick interval (defaults to {@link MASCOT_LINE_INTERVAL_MS}). */
    readonly intervalMs?: number;
}
/**
 * The idle-line observable source. Start publishes the first built-in line
 * synchronously, then rotates on every tick; AI pool refills are requested
 * asynchronously and never block rotation.
 */
export declare class MascotLineSource implements ObservableSnapshot<string> {
    private readonly options;
    private current;
    private readonly listeners;
    private readonly intervalMs;
    private readonly aiQueue;
    private aiEnabled;
    private builtinIndex;
    private ticksSinceAi;
    private fetchInFlight;
    private timer;
    /**
     * @param options - rotation dependencies.
     */
    constructor(options: MascotLineSourceOptions);
    /** Publish the first line and start the rotation timer. */
    start(): void;
    getSnapshot(): string;
    subscribe(listener: () => void): () => void;
    /** Apply the user's AI-lines preference to the rotator. */
    setAiEnabled(enabled: boolean): void;
    /** Stop the rotation timer and any in-flight refill. */
    dispose(): void;
    private advance;
    private refillIfNeeded;
}
export {};
