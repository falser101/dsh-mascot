// @vitest-environment jsdom
/**
 * Idle director specs: clip picking, frame timing, and the hook's
 * schedule / cancel behaviour.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, renderHook } from '@testing-library/react'
import {
  ACTION_FRAME_MS,
  ACTION_INTERVALS,
  ACTION_LAST_EXTRA_MS,
  ACTION_PEAK_EXTRA_MS,
  frameDurations,
  nextDelayMs,
  nextWaitMilestone,
  pickAction,
  useIdleDirector,
  WAIT_THRESHOLDS,
  type ActionClip,
} from '../src/client/character/idle-director'

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.restoreAllMocks()
})

function stubMotion(reduce = false): void {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: reduce && query.includes('prefers-reduced-motion'),
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  })
}

const clips: readonly ActionClip[] = [
  { id: 'stretch', frames: ['data:stretch-1', 'data:stretch-2', 'data:stretch-3', 'data:stretch-4'] },
  { id: 'yawn', frames: ['data:yawn-1', 'data:yawn-2', 'data:yawn-3', 'data:yawn-4', 'data:yawn-5'] },
]

describe('idle director helpers', () => {
  it('holds the peak pose and the landing longer than the in-between frames', () => {
    expect(frameDurations(2)).toEqual([700, 1_200])
    expect(frameDurations(4)).toEqual([
      ACTION_FRAME_MS,
      ACTION_FRAME_MS,
      ACTION_FRAME_MS + ACTION_PEAK_EXTRA_MS,
      ACTION_FRAME_MS + ACTION_LAST_EXTRA_MS,
    ])
  })

  it('avoids an immediate repeat when both clips exist', () => {
    expect(pickAction(['stretch', 'yawn'], 'stretch', () => 0)).toBe('yawn')
    expect(pickAction(['stretch', 'yawn'], 'yawn', () => 0)).toBe('stretch')
  })

  it('returns the only available clip even if it just played', () => {
    expect(pickAction(['yawn'], 'yawn', () => 0)).toBe('yawn')
  })

  it('returns null when the skin has no clips', () => {
    expect(pickAction([], null)).toBeNull()
  })

  it('draws the wait from the cadence window', () => {
    expect(nextDelayMs('standard', () => 0)).toBe(ACTION_INTERVALS.standard.minMs)
    expect(nextDelayMs('standard', () => 1)).toBe(ACTION_INTERVALS.standard.maxMs)
    expect(nextDelayMs('quiet', () => 0)).toBe(ACTION_INTERVALS.quiet.minMs)
  })

  it('schedules yawn then stretch on the wait clock', () => {
    const [yawnAt, stretchAt] = WAIT_THRESHOLDS.standard
    expect(nextWaitMilestone(0, new Set(), 'standard')).toEqual({ delayMs: yawnAt, action: 'yawn' })
    expect(nextWaitMilestone(yawnAt, new Set(), 'standard')).toEqual({ delayMs: 0, action: 'yawn' })
    expect(nextWaitMilestone(yawnAt + 1, new Set(['yawn']), 'standard')).toEqual({
      delayMs: stretchAt - yawnAt - 1, action: 'stretch',
    })
  })

  it('collapses overdue milestones to the bigger pose', () => {
    expect(nextWaitMilestone(WAIT_THRESHOLDS.standard[1] + 10, new Set(), 'standard')).toEqual({
      delayMs: 0, action: 'stretch',
    })
  })
})

describe('useIdleDirector', () => {
  beforeEach(() => {
    stubMotion(false)
    vi.spyOn(Math, 'random').mockReturnValue(0)
  })

  it('plays a clip after the cadence wait and returns to idle', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useIdleDirector({
      enabled: true,
      cadence: 'standard',
      clips,
    }))
    expect(result.current.action).toBeNull()

    act(() => { vi.advanceTimersByTime(ACTION_INTERVALS.standard.minMs) })
    expect(result.current.action).toBe('stretch')
    expect(result.current.href).toBe('data:stretch-1')

    act(() => { vi.advanceTimersByTime(ACTION_FRAME_MS) })
    expect(result.current.href).toBe('data:stretch-2')

    act(() => { vi.advanceTimersByTime(ACTION_FRAME_MS) })
    expect(result.current.href).toBe('data:stretch-3')

    const rest = ACTION_FRAME_MS + ACTION_PEAK_EXTRA_MS + ACTION_FRAME_MS + ACTION_LAST_EXTRA_MS
    act(() => { vi.advanceTimersByTime(rest) })
    expect(result.current.action).toBeNull()
    expect(result.current.href).toBeNull()
  })

  it('cancels mid-clip when enabled drops', () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(
      ({ enabled }) => useIdleDirector({ enabled, cadence: 'standard', clips }),
      { initialProps: { enabled: true } },
    )
    act(() => { vi.advanceTimersByTime(ACTION_INTERVALS.standard.minMs) })
    expect(result.current.action).not.toBeNull()

    rerender({ enabled: false })
    expect(result.current.action).toBeNull()
    expect(result.current.href).toBeNull()
  })

  it('does not play when reduced motion is preferred', () => {
    stubMotion(true)
    vi.useFakeTimers()
    const { result } = renderHook(() => useIdleDirector({
      enabled: true,
      cadence: 'lively',
      clips,
    }))
    act(() => { vi.advanceTimersByTime(ACTION_INTERVALS.lively.maxMs + 1_000) })
    expect(result.current.action).toBeNull()
  })

  it('does not play when no clips are installed', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useIdleDirector({
      enabled: true,
      cadence: 'lively',
      clips: [],
    }))
    act(() => { vi.advanceTimersByTime(ACTION_INTERVALS.lively.maxMs + 1_000) })
    expect(result.current.action).toBeNull()
  })

  it('plays yawn at the first wait milestone', () => {
    vi.useFakeTimers()
    vi.setSystemTime(5_000)
    const { result } = renderHook(() => useIdleDirector({
      enabled: true,
      cadence: 'standard',
      clips,
      waitStartedAt: 5_000,
    }))
    expect(result.current.action).toBeNull()
    act(() => { vi.advanceTimersByTime(WAIT_THRESHOLDS.standard[0]) })
    expect(result.current.action).toBe('yawn')
    expect(result.current.href).toBe('data:yawn-1')
  })
})
