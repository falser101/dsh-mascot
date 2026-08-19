/**
 * Busy-bubble copy: companion lines by default, tool names only when the
 * user asked (or peeked by hovering a working companion).
 */
import type { MascotKey } from './locales'
import type { MascotMood, MascotState } from './mascot-source'

/** Resolve the working-mood locale key. */
export function workingTextKey(many: boolean, showTool: boolean): MascotKey {
  if (showTool) return many ? 'mood.working.many.tool' : 'mood.working.tool'
  return many ? 'mood.working.many' : 'mood.working'
}

/** True when the frame has a tool name to peek. */
export function hasToolName(state: Pick<MascotState, 'mood' | 'params'>): boolean {
  return state.mood === 'working' && typeof state.params?.tool === 'string'
}

/**
 * The line shown in the bubble for a working mood.
 * `peekTool` is hover-without-the-setting: name the tool once, then leave.
 */
export function workingLineKey(
  state: Pick<MascotState, 'mood' | 'params'>,
  showToolName: boolean,
  peekTool: boolean,
): MascotKey {
  const many = typeof state.params?.count === 'number'
  return workingTextKey(many, showToolName || peekTool)
}

export function isBusyMood(mood: MascotMood): boolean {
  return mood === 'queued'
    || mood === 'confirming'
    || mood === 'thinking'
    || mood === 'working'
    || mood === 'streaming'
    || mood === 'error'
    || mood === 'elsewhere'
}
