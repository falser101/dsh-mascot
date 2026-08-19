/**
 * Detect the DeepSeek Harness conversation composer so the companion can
 * shrink out of the way while the user types.
 */

/** True when `target` is the resident chat composer (or inside its seat). */
export function isComposerTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  if (target.closest('[data-composer-seat]') !== null) return true
  if (target.tagName !== 'TEXTAREA') return false
  if (target.closest('[role="dialog"]') !== null) return false
  return true
}
