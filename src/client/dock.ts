/**
 * Keep the companion inside the viewport while dragging or resizing.
 * Position is free; nothing snaps to an edge on release.
 * Tray placement follows the nearest edge so the toolbar stays on-screen.
 */
import { MASCOT_MINI_SIZE, MASCOT_SIZE } from './mascot-store'

/** Which side of the pet the action tray opens toward. */
export type TraySide = 'top' | 'bottom' | 'left' | 'right'

/** Horizontal alignment of a top/bottom tray pill. */
export type TrayAlign = 'start' | 'center' | 'end'

/** Where the hover toolbar sits relative to the character box. */
export interface TrayPlacement {
  readonly side: TraySide
  readonly align: TrayAlign
}

/** Visual box of a (possibly mini) companion, anchored to the nearer corner. */
export interface VisualBox {
  readonly x: number
  readonly y: number
  readonly size: number
}

/** Footprint of the pill toolbar, used to decide whether it fits. */
const TRAY_THICKNESS = 40
const TRAY_LENGTH = 132
const TRAY_GAP = 6
/** Closer than this to an edge counts as "sitting on" that edge. */
const EDGE = 16

/**
 * Keep the companion inside the viewport while dragging or resizing.
 * Position is free; nothing snaps to an edge on release.
 */
export function clampToBox(
  x: number,
  y: number,
  size: number,
  viewportWidth: number,
  viewportHeight: number,
): { x: number; y: number } {
  const maxX = Math.max(0, viewportWidth - size)
  const maxY = Math.max(0, viewportHeight - size)
  return {
    x: Math.max(0, Math.min(maxX, x)),
    y: Math.max(0, Math.min(maxY, y)),
  }
}

/**
 * Mini face keeps the nearer corner of the full 96px box so a bottom-right
 * pet tucks into the corner instead of sliding into the transcript.
 */
export function visualBox(
  x: number,
  y: number,
  mini: boolean,
  viewportWidth: number,
  viewportHeight: number,
): VisualBox {
  if (!mini) return { x, y, size: MASCOT_SIZE }
  const keepLeft = x + MASCOT_SIZE / 2 < viewportWidth / 2
  const keepTop = y + MASCOT_SIZE / 2 < viewportHeight / 2
  return {
    x: keepLeft ? x : x + MASCOT_SIZE - MASCOT_MINI_SIZE,
    y: keepTop ? y : y + MASCOT_SIZE - MASCOT_MINI_SIZE,
    size: MASCOT_MINI_SIZE,
  }
}

/**
 * Pick a tray side that stays inside the viewport: below by default, above
 * when the pet sits on the bottom, to the right when it sits on the left.
 */
export function trayPlacement(
  x: number,
  y: number,
  size: number,
  viewportWidth: number,
  viewportHeight: number,
): TrayPlacement {
  const below = viewportHeight - (y + size)
  const above = y
  const left = x
  const right = viewportWidth - (x + size)
  const needV = TRAY_THICKNESS + TRAY_GAP
  const needH = TRAY_LENGTH + TRAY_GAP

  let side: TraySide = 'bottom'
  if (below < needV && above >= needV) side = 'top'
  else if (left < EDGE && right >= needH && below >= needV) side = 'right'
  else if (right < EDGE && left >= needH && below >= needV) side = 'left'
  else if (below < needV) {
    if (above >= needV) side = 'top'
    else if (right >= needH) side = 'right'
    else side = 'left'
  }

  let align: TrayAlign = 'center'
  if (side === 'top' || side === 'bottom') {
    if (left < EDGE) align = 'start'
    else if (right < EDGE) align = 'end'
  }
  return { side, align }
}
