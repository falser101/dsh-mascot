import { describe, expect, it } from 'vitest'
import { hasToolName, workingLineKey, workingTextKey } from '../src/client/bubble-copy'

describe('working bubble copy', () => {
  it('uses companion lines by default', () => {
    expect(workingTextKey(false, false)).toBe('mood.working')
    expect(workingTextKey(true, false)).toBe('mood.working.many')
  })

  it('uses tool-name lines when asked', () => {
    expect(workingTextKey(false, true)).toBe('mood.working.tool')
    expect(workingTextKey(true, true)).toBe('mood.working.many.tool')
  })

  it('peeks the tool on hover without turning the setting on', () => {
    const state = { mood: 'working' as const, params: { tool: 'bash' } }
    expect(hasToolName(state)).toBe(true)
    expect(workingLineKey(state, false, true)).toBe('mood.working.tool')
    expect(workingLineKey(state, false, false)).toBe('mood.working')
  })
})
