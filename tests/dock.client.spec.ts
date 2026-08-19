import { describe, expect, it } from 'vitest'
import { clampToBox, trayPlacement, visualBox } from '../src/client/dock'
import { MASCOT_MINI_SIZE, MASCOT_SIZE } from '../src/client/mascot-store'

describe('clampToBox', () => {
  it('clamps into the viewport', () => {
    expect(clampToBox(-40, 900, 96, 800, 600)).toEqual({ x: 0, y: 504 })
  })

  it('leaves an in-view position unchanged', () => {
    expect(clampToBox(120, 80, 96, 800, 600)).toEqual({ x: 120, y: 80 })
  })
})

describe('visualBox', () => {
  it('keeps the full box when expanded', () => {
    expect(visualBox(700, 480, false, 800, 600)).toEqual({ x: 700, y: 480, size: MASCOT_SIZE })
  })

  it('tucks a bottom-right mini face into the nearer corner', () => {
    expect(visualBox(700, 480, true, 800, 600)).toEqual({
      x: 700 + MASCOT_SIZE - MASCOT_MINI_SIZE,
      y: 480 + MASCOT_SIZE - MASCOT_MINI_SIZE,
      size: MASCOT_MINI_SIZE,
    })
  })

  it('keeps the top-left corner when the pet sits on the left', () => {
    expect(visualBox(8, 20, true, 800, 600)).toEqual({ x: 8, y: 20, size: MASCOT_MINI_SIZE })
  })
})

describe('trayPlacement', () => {
  it('opens above the pet when it sits on the bottom edge', () => {
    expect(trayPlacement(680, 560, 96, 800, 600)).toEqual({ side: 'top', align: 'center' })
    expect(trayPlacement(704, 560, 96, 800, 600)).toEqual({ side: 'top', align: 'end' })
  })

  it('opens to the right when the pet sits on the left edge', () => {
    expect(trayPlacement(0, 120, 96, 800, 600)).toEqual({ side: 'right', align: 'center' })
  })

  it('stays below when there is room underfoot', () => {
    expect(trayPlacement(200, 80, 96, 800, 600)).toEqual({ side: 'bottom', align: 'center' })
  })

  it('grows right when above a bottom-left pet', () => {
    expect(trayPlacement(0, 560, 96, 800, 600)).toMatchObject({ side: 'top', align: 'start' })
  })
})
