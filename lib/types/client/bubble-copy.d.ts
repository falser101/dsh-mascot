/**
 * Busy-bubble copy: companion lines by default, tool names only when the
 * user asked (or peeked by hovering a working companion).
 */
import type { MascotKey } from './locales';
import type { MascotMood, MascotState } from './mascot-source';
/** Resolve the working-mood locale key. */
export declare function workingTextKey(many: boolean, showTool: boolean): MascotKey;
/** True when the frame has a tool name to peek. */
export declare function hasToolName(state: Pick<MascotState, 'mood' | 'params'>): boolean;
/**
 * The line shown in the bubble for a working mood.
 * `peekTool` is hover-without-the-setting: name the tool once, then leave.
 */
export declare function workingLineKey(state: Pick<MascotState, 'mood' | 'params'>, showToolName: boolean, peekTool: boolean): MascotKey;
export declare function isBusyMood(mood: MascotMood): boolean;
