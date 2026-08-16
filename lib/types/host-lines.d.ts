import type { GenerateOptions } from '@deepseek-ai/dsh-llm';
/** One batch of AI-generated lines is cached this long before regenerating. */
export declare const MASCOT_LINES_TTL_MS: number;
/** Lines generated per batch (the client rotates them at ~1/5 of its cadence). */
export declare const MASCOT_LINES_BATCH = 6;
/** Hard cap on one line's length; longer output is dropped as malformed. */
export declare const MASCOT_LINE_MAX_CHARS = 40;
/** Token budget for one batch request. */
export declare const MASCOT_LINES_MAX_TOKENS = 400;
/** Supported line locales (the UI's own locale vocabulary). */
export type MascotLineLocale = 'zh' | 'en';
/** The host default-model selection slice this plugin reads (structural; importing
 *  dsh-agent would pull its Context merges into the browser compile graph). */
export interface MascotModelSelection {
    /** Registered provider route. */
    provider: string;
    /** Provider-owned model id. */
    model: string;
    /** Adapter-owned reasoning effort, when selected. */
    reasoningEffort?: string;
}
/** One served batch result. */
export interface MascotLinesResult {
    readonly lines: readonly string[];
    /** Epoch ms when the batch was generated (cache TTL anchor). */
    readonly refreshedAt: number;
}
/** The generation directive handed to the model as its system prompt. */
export declare function mascotLinesPrompt(locale: MascotLineLocale): string;
/**
 * Assemble the one-shot generation request for the configured default model.
 * @param selection - the host's default model selection.
 * @param locale - the line locale.
 * @returns the streamable request.
 */
export declare function buildMascotLinesOptions(selection: MascotModelSelection, locale: MascotLineLocale): GenerateOptions;
/**
 * Parse and validate the model's raw output into a line batch. Accepts a
 * fenced JSON block; drops non-string, blank, and overlong entries and
 * deduplicates; returns undefined for anything that is not a usable array.
 * @param raw - the model's raw text output.
 * @returns the validated batch, or undefined when malformed.
 */
export declare function parseMascotLines(raw: string): readonly string[] | undefined;
/**
 * TTL-cached, concurrency-safe line batch service. A generation failure
 * (throw, empty batch) keeps the previous batch; with no cache at all it
 * serves an empty batch so the client falls back to built-in lines.
 */
export declare class MascotLinesService {
    private readonly generate;
    private cache;
    private inFlight;
    /**
     * @param generate - one batch generator (the LLM call).
     */
    constructor(generate: (locale: MascotLineLocale) => Promise<readonly string[]>);
    /**
     * Resolve the current batch for one locale: the fresh cache, a freshly
     * generated batch (shared across concurrent callers), or the stale cache
     * when generation fails — finally an empty batch.
     * @param locale - the line locale.
     * @returns the batch to serve.
     */
    lines(locale: MascotLineLocale): Promise<MascotLinesResult>;
    private generateFor;
}
