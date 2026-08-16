/**
 * Host-side line generation unit tests: prompt/request assembly, response
 * parsing and validation, and the TTL-cached concurrency-safe service.
 */
import { describe, expect, it, vi } from 'vitest'
import {
  buildMascotLinesOptions, mascotLinesPrompt, MascotLinesService,
  MASCOT_LINES_BATCH, MASCOT_LINES_TTL_MS, parseMascotLines,
} from '../src/host-lines'

describe('mascotLinesPrompt', () => {
  it('produces a zh and an en directive with the JSON-array contract', () => {
    const zh = mascotLinesPrompt('zh')
    const en = mascotLinesPrompt('en')
    expect(zh).toContain('JSON 数组')
    expect(zh).toContain('6 条')
    expect(en).toContain('JSON array')
    expect(en).toContain('6 lines')
  })
})

describe('buildMascotLinesOptions', () => {
  it('routes the call to the selected model with the prompt and a tight budget', () => {
    const options = buildMascotLinesOptions(
      { provider: 'deepseek-official', model: 'deepseek-v4-flash', reasoningEffort: 'high' },
      'zh',
    )
    expect(options.provider).toBe('deepseek-official')
    expect(options.model).toBe('deepseek-v4-flash')
    expect(options.system).toContain('JSON 数组')
    expect(options.messages).toHaveLength(1)
    expect(options.messages[0]?.role).toBe('user')
    expect(options.maxTokens).toBe(400)
    expect(options.temperature).toBe(1.2)
  })
})

describe('parseMascotLines', () => {
  it('parses a plain JSON array and trims entries', () => {
    expect(parseMascotLines('[" 你好 ","在吗  "]')).toEqual(['你好', '在吗'])
  })

  it('accepts a fenced json block', () => {
    expect(parseMascotLines('```json\n["a","b"]\n```')).toEqual(['a', 'b'])
  })

  it('rejects non-array, non-JSON, and empty input', () => {
    expect(parseMascotLines('{"a":1}')).toBeUndefined()
    expect(parseMascotLines('not json')).toBeUndefined()
    expect(parseMascotLines('')).toBeUndefined()
  })

  it('drops non-string, blank, and overlong entries and deduplicates', () => {
    const result = parseMascotLines(
      `["ok", 42, "", "  ", "${'x'.repeat(50)}", "dup", "dup"]`,
    )
    expect(result).toEqual(['ok', 'dup'])
  })

  it('caps the batch at the configured size', () => {
    const many = Array.from({ length: 20 }, (_, i) => `line ${i}`)
    expect(parseMascotLines(JSON.stringify(many))?.length).toBe(MASCOT_LINES_BATCH)
  })

  it('returns undefined for an all-invalid array', () => {
    expect(parseMascotLines('[42, null]')).toBeUndefined()
  })
})

describe('MascotLinesService', () => {
  it('serves the fresh cache and does not regenerate inside the TTL', async () => {
    let calls = 0
    const service = new MascotLinesService(async () => {
      calls += 1
      return ['a', 'b']
    })
    const first = await service.lines('zh')
    expect(first.lines).toEqual(['a', 'b'])
    expect(calls).toBe(1)
    const second = await service.lines('zh')
    expect(second).toBe(first)
    expect(calls).toBe(1)
  })

  it('shares one in-flight generation across concurrent callers', async () => {
    let calls = 0
    let release: (() => void) | undefined
    const gate = new Promise<void>((resolve) => { release = resolve })
    const service = new MascotLinesService(async () => {
      calls += 1
      await gate
      return ['only']
    })
    const first = service.lines('zh')
    const second = service.lines('zh')
    release?.()
    const [a, b] = await Promise.all([first, second])
    expect(calls).toBe(1)
    expect(a.lines).toEqual(['only'])
    expect(b.lines).toEqual(a.lines)
  })

  it('keeps the stale batch when regeneration fails and serves it', async () => {
    let fail = false
    const service = new MascotLinesService(async () => {
      if (fail) throw new Error('model down')
      return ['stale']
    })
    const fresh = await service.lines('zh')
    expect(fresh.lines).toEqual(['stale'])

    // Force the TTL to elapse.
    fail = true
    const stale = await service.lines('zh')
    expect(stale).toBe(fresh)
  })

  it('serves an empty batch with no cache when generation fails', async () => {
    const service = new MascotLinesService(async () => {
      throw new Error('model down')
    })
    const result = await service.lines('en')
    expect(result.lines).toEqual([])
  })

  it('regenerates after the TTL elapses', async () => {
    vi.useFakeTimers()
    try {
      let calls = 0
      const service = new MascotLinesService(async () => {
        calls += 1
        return [`batch ${calls}`]
      })
      await service.lines('zh')
      await service.lines('zh')
      expect(calls).toBe(1)
      // A TTL-busting wait makes the next call regenerate.
      vi.advanceTimersByTime(MASCOT_LINES_TTL_MS + 10)
      const next = await service.lines('zh')
      expect(next.lines).toEqual(['batch 2'])
    } finally {
      vi.useRealTimers()
    }
  })
})
