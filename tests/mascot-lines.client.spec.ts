// @vitest-environment jsdom
/**
 * Client idle-line rotator specs: rotation cadence, the 5:1 built-in/AI mix,
 * fetch refill with silent degradation, localStorage persistence, the AI
 * toggle, and disposal.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  AI_LINE_PREFIX, IDLE_LINE_KEYS, MascotLineSource,
  MASCOT_LINE_INTERVAL_MS, MASCOT_LINES_AI_EVERY, MASCOT_LINES_STORAGE_KEY,
} from '../src/client/mascot-lines'

afterEach(() => {
  vi.useRealTimers()
})

describe('MascotLineSource', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  function bench(fetchLines: (locale: string) => Promise<readonly string[]>) {
    const calls: string[] = []
    const source = new MascotLineSource({
      locale: () => 'zh',
      fetchLines: (locale) => {
        calls.push(locale)
        return fetchLines(locale)
      },
    })
    return { source, calls }
  }

  it('publishes the first built-in line synchronously and rotates every tick', () => {
    vi.useFakeTimers()
    const { source } = bench(async () => [])
    source.start()
    expect(source.getSnapshot()).toBe('idle.line.0')

    vi.advanceTimersByTime(MASCOT_LINE_INTERVAL_MS)
    expect(source.getSnapshot()).toBe('idle.line.1')
    vi.advanceTimersByTime(MASCOT_LINE_INTERVAL_MS * 4)
    expect(source.getSnapshot()).toBe('idle.line.5')
    vi.advanceTimersByTime(MASCOT_LINE_INTERVAL_MS)
    expect(source.getSnapshot()).toBe('idle.line.0')
    source.dispose()
  })

  it('mixes in one AI line every fifth tick and consumes the pool', async () => {
    vi.useFakeTimers()
    const { source } = bench(async () => ['ai-1', 'ai-2'])
    source.start()
    await vi.advanceTimersByTimeAsync(0) // flush the refill promise, no tick

    // Ticks 1..4: built-ins.
    for (const expected of ['idle.line.1', 'idle.line.2', 'idle.line.3', 'idle.line.4']) {
      vi.advanceTimersByTime(MASCOT_LINE_INTERVAL_MS)
      expect(source.getSnapshot()).toBe(expected)
    }
    // Tick 5: the first AI line.
    vi.advanceTimersByTime(MASCOT_LINE_INTERVAL_MS)
    expect(source.getSnapshot()).toBe(`${AI_LINE_PREFIX}ai-1`)
    // Ticks 6..9: built-ins continue from where they left off.
    for (const expected of ['idle.line.5', 'idle.line.0', 'idle.line.1', 'idle.line.2']) {
      vi.advanceTimersByTime(MASCOT_LINE_INTERVAL_MS)
      expect(source.getSnapshot()).toBe(expected)
    }
    // Tick 10: the second AI line.
    vi.advanceTimersByTime(MASCOT_LINE_INTERVAL_MS)
    expect(source.getSnapshot()).toBe(`${AI_LINE_PREFIX}ai-2`)
    // Tick 11: pool empty, back to built-ins.
    vi.advanceTimersByTime(MASCOT_LINE_INTERVAL_MS)
    expect(source.getSnapshot()).toBe('idle.line.3')
    source.dispose()
  })

  it('stays on built-ins when the fetch fails or returns nothing', async () => {
    vi.useFakeTimers()
    const { source } = bench(async () => {
      throw new Error('network')
    })
    source.start()
    await vi.advanceTimersByTimeAsync(MASCOT_LINE_INTERVAL_MS * 5)
    expect(source.getSnapshot()).not.toContain(AI_LINE_PREFIX)
    expect(source.getSnapshot()).toBe('idle.line.5')
    source.dispose()
  })

  it('does not fetch or consume AI lines when the toggle is off', async () => {
    vi.useFakeTimers()
    const { source, calls } = bench(async () => ['ai-1'])
    source.setAiEnabled(false)
    source.start()
    await vi.advanceTimersByTimeAsync(MASCOT_LINE_INTERVAL_MS * 6)
    expect(calls).toHaveLength(0)
    expect(source.getSnapshot()).not.toContain(AI_LINE_PREFIX)
    source.dispose()
  })

  it('persists fetched batches and restores them across instances', async () => {
    vi.useFakeTimers()
    const { source } = bench(async () => ['persisted-1'])
    source.start()
    await vi.advanceTimersByTimeAsync(MASCOT_LINE_INTERVAL_MS)
    expect(localStorage.getItem(MASCOT_LINES_STORAGE_KEY)).toContain('persisted-1')

    const restored = new MascotLineSource({
      locale: () => 'zh',
      fetchLines: async () => [],
      load: () => {
        const raw = localStorage.getItem(MASCOT_LINES_STORAGE_KEY)
        return raw === null ? undefined : JSON.parse(raw) as { lines: string[]; refreshedAt: number }
      },
    })
    restored.start()
    // Four built-in ticks, then the restored AI line on the fifth.
    await vi.advanceTimersByTimeAsync(MASCOT_LINE_INTERVAL_MS * 4)
    expect(restored.getSnapshot()).toBe('idle.line.4')
    await vi.advanceTimersByTimeAsync(MASCOT_LINE_INTERVAL_MS)
    expect(restored.getSnapshot()).toBe(`${AI_LINE_PREFIX}persisted-1`)
    restored.dispose()
    source.dispose()
  })

  it('refills only when the AI queue empties, not while it still holds lines', async () => {
    vi.useFakeTimers()
    const { source, calls } = bench(async () => ['one', 'two'])
    source.start()
    await vi.advanceTimersByTimeAsync(0)
    expect(calls).toHaveLength(1)
    // Ticks 1..4 (built-ins) and tick 5 (consumes 'one'): pool not empty yet.
    await vi.advanceTimersByTimeAsync(MASCOT_LINE_INTERVAL_MS * 5)
    expect(calls).toHaveLength(1)
    // Ticks 6..10 (tick 10 consumes 'two'): pool empties, refill fires.
    await vi.advanceTimersByTimeAsync(MASCOT_LINE_INTERVAL_MS * 5)
    expect(calls).toHaveLength(2)
    source.dispose()
  })

  it('stops ticking after dispose', () => {
    vi.useFakeTimers()
    const { source } = bench(async () => [])
    source.start()
    source.dispose()
    vi.advanceTimersByTime(MASCOT_LINE_INTERVAL_MS * 3)
    expect(source.getSnapshot()).toBe('idle.line.0')
  })

  it('exposes the built-in pool size matching the AI cadence', () => {
    expect(IDLE_LINE_KEYS.length).toBeGreaterThan(0)
    expect(MASCOT_LINES_AI_EVERY).toBe(5)
  })
})
