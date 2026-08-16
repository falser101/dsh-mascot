/**
 * MascotSource fold unit tests: pure `deriveMascotState` over fixture
 * snapshots plus the live source over the TestSessions double (list
 * selection, session snapshot updates, session switching, disposal).
 */
import { describe, expect, it, vi } from 'vitest'
import { Context } from '@deepseek-ai/cordis'
import { SlotRegistry } from '@deepseek-ai/dsh-client-runtime/client'
import { conversationSnapshot, TestSessions } from '@deepseek-ai/dsh-client-test-runtime'
import type { Stabilizer } from '@deepseek-ai/dsh-client-test-runtime'
import type { ConversationSnapshot } from '@deepseek-ai/dsh-client-runtime/client'
import { deriveBusyContext, deriveMascotState, MascotSource, MASCOT_TRANSIENT_MS } from '../src/client/mascot-source'
import type { SessionListState } from '@deepseek-ai/dsh-client-runtime/client'

const stabilize: Stabilizer = async (fn) => { await fn() }

const SESSION_ID = 's1' as const

function snapshot(overrides: Partial<ConversationSnapshot> = {}): ConversationSnapshot {
  return { ...conversationSnapshot(SESSION_ID), ...overrides }
}

describe('deriveMascotState', () => {
  const EMPTY_TURNS: ReadonlyMap<number, number> = new Map()

  it('idles on a quiet session', () => {
    expect(deriveMascotState(snapshot(), SESSION_ID, EMPTY_TURNS).mood).toBe('idle')
  })

  it('greets on the first fold of a session', () => {
    const state = deriveMascotState(snapshot(), undefined, EMPTY_TURNS)
    expect(state.mood).toBe('greeting')
    expect(state.until).toBeGreaterThan(Date.now())
  })

  it('queues when a message waits while the agent is quiet', () => {
    const state = deriveMascotState(
      snapshot({ queue: [{ text: 'hi' } as never], running: false }),
      SESSION_ID,
      EMPTY_TURNS,
    )
    expect(state).toMatchObject({ mood: 'queued', textKey: 'mood.queued' })
  })

  it('does not queue while the agent is already running', () => {
    const state = deriveMascotState(
      snapshot({ queue: [{ text: 'hi' } as never], running: true }),
      SESSION_ID,
      EMPTY_TURNS,
    )
    expect(state.mood).not.toBe('queued')
  })

  it('confirms with the approval copy for approval waits', () => {
    const pending = [{ kind: 'approval' } as never]
    const state = deriveMascotState(snapshot({ pending }), SESSION_ID, EMPTY_TURNS)
    expect(state).toMatchObject({ mood: 'confirming', textKey: 'mood.confirming.approval' })
  })

  it('confirms with the question copy for question waits', () => {
    const pending = [{ kind: 'question' } as never]
    const state = deriveMascotState(snapshot({ pending }), SESSION_ID, EMPTY_TURNS)
    expect(state).toMatchObject({ mood: 'confirming', textKey: 'mood.confirming.question' })
  })

  it('works with the running tool name', () => {
    const runningCalls = [{ name: 'bash' } as never]
    const state = deriveMascotState(snapshot({ running: true, runningCalls }), SESSION_ID, EMPTY_TURNS)
    expect(state).toMatchObject({ mood: 'working', textKey: 'mood.working', params: { tool: 'bash' } })
  })

  it('streams while partial text exists', () => {
    const partial = { blocks: [{ kind: 'text', text: '写' }] } as never
    const state = deriveMascotState(snapshot({ running: true, partial }), SESSION_ID, EMPTY_TURNS)
    expect(state).toMatchObject({ mood: 'streaming', textKey: 'mood.streaming' })
  })

  it('thinks while running without partial text', () => {
    const partial = { blocks: [] } as never
    const state = deriveMascotState(snapshot({ running: true, partial }), SESSION_ID, EMPTY_TURNS)
    expect(state).toMatchObject({ mood: 'thinking' })
  })

  it('reports errors above every working state', () => {
    const state = deriveMascotState(
      snapshot({ lastAgentError: 'boom', running: true, runningCalls: [{ name: 'bash' } as never] }),
      SESSION_ID,
      EMPTY_TURNS,
    )
    expect(state).toMatchObject({ mood: 'error', textKey: 'mood.error' })
  })

  it('celebrates a turn end exactly once', () => {
    const turns = new Map([[0, 1]])
    const first = deriveMascotState(snapshot({ turnEnds: turns }), SESSION_ID, EMPTY_TURNS)
    expect(first.mood).toBe('done')
    expect(first.until).toBeGreaterThan(Date.now())
    // The same map again folds straight to idle: the transition is spent.
    expect(deriveMascotState(snapshot({ turnEnds: turns }), SESSION_ID, turns).mood).toBe('idle')
  })

  it('skips the greeting into a running session', () => {
    const state = deriveMascotState(snapshot({ running: true }), undefined, EMPTY_TURNS)
    expect(state.mood).toBe('thinking')
  })
})

describe('MascotSource over TestSessions', () => {
  async function bench() {
    const ctx = new Context()
    await ctx.plugin(SlotRegistry).await()
    const sessions = new TestSessions(stabilize, ctx)
    const source = new MascotSource(sessions)
    return { sessions, source }
  }

  it('starts idle without a current session', async () => {
    const { source } = await bench()
    expect(source.getSnapshot()).toMatchObject({ mood: 'idle', textKey: 'mood.idle' })
    source.dispose()
  })

  it('greets the first selected session, then folds live snapshot changes', async () => {
    const { sessions, source } = await bench()
    await sessions.add({ id: SESSION_ID })
    expect(source.getSnapshot().mood).toBe('greeting')

    await sessions.updateSnapshot(SESSION_ID, (draft) => {
      draft.queue = [{ text: 'hi' } as never]
    })
    expect(source.getSnapshot()).toMatchObject({ mood: 'queued', textKey: 'mood.queued' })

    await sessions.updateSnapshot(SESSION_ID, (draft) => {
      draft.queue = []
      draft.running = true
      draft.runningCalls = [{ name: 'grep' } as never]
    })
    expect(source.getSnapshot()).toMatchObject({ mood: 'working', params: { tool: 'grep' } })

    source.dispose()
  })

  it('greets a switched session and forgets the previous turn evidence', async () => {
    const { sessions, source } = await bench()
    await sessions.add({ id: SESSION_ID })
    await sessions.add({ id: 's2', snapshot: { turnEnds: new Map([[0, 7]]) }, current: false })
    expect(source.getSnapshot().mood).toBe('greeting')

    await sessions.setCurrent('s2')
    expect(source.getSnapshot().mood).toBe('greeting')
    // s2's history must not trigger a done celebration once it starts and
    // finishes a turn after the switch.
    await sessions.updateSnapshot('s2', (draft) => {
      draft.running = true
    })
    expect(source.getSnapshot().mood).toBe('thinking')
    await sessions.updateSnapshot('s2', (draft) => {
      draft.running = false
    })
    expect(source.getSnapshot().mood).toBe('idle')

    source.dispose()
  })

  it('celebrates a turn end and folds back to idle after the transient window', async () => {
    vi.useFakeTimers()
    try {
      const { sessions, source } = await bench()
      await sessions.add({ id: SESSION_ID })
      await sessions.updateSnapshot(SESSION_ID, (draft) => {
        draft.running = true
      })
      await sessions.updateSnapshot(SESSION_ID, (draft) => {
        draft.running = false
        draft.turnEnds = new Map([[0, 1]])
      })
      expect(source.getSnapshot().mood).toBe('done')

      vi.advanceTimersByTime(MASCOT_TRANSIENT_MS + 10)
      expect(source.getSnapshot().mood).toBe('idle')
      source.dispose()
    } finally {
      vi.useRealTimers()
    }
  })

  it('stops publishing after dispose', async () => {
    const { sessions, source } = await bench()
    await sessions.add({ id: SESSION_ID })
    source.dispose()
    await sessions.updateSnapshot(SESSION_ID, (draft) => {
      draft.running = true
    })
    expect(source.getSnapshot().mood).toBe('greeting')
  })

  it('reports the transient window duration as a positive constant', () => {
    expect(MASCOT_TRANSIENT_MS).toBeGreaterThan(0)
  })

  it('words the working line for parallel tool calls', () => {
    const state = deriveMascotState(
      snapshot({
        running: true,
        runningCalls: [{ name: 'bash' }, { name: 'grep' }] as never,
      }),
      SESSION_ID,
      new Map(),
    )
    expect(state).toMatchObject({
      mood: 'working',
      textKey: 'mood.working.many',
      params: { tool: 'bash', count: 2 },
    })
  })
})

describe('deriveBusyContext', () => {
  function listState(overrides: Partial<SessionListState> = {}): SessionListState {
    return {
      ids: [], byId: {}, current: undefined, phase: 'ready',
      subagentsByParent: {}, jobsBySession: {}, currentAddress: undefined,
      ...overrides,
    }
  }

  it('counts the current session, other running sessions, and live jobs', () => {
    const list = listState({
      ids: ['s1', 's2'] as never,
      current: 's1' as never,
      byId: {
        s1: { id: 's1', displayTitle: '甲', running: false, blank: false, updatedAt: 1 },
        s2: { id: 's2', displayTitle: '乙', running: true, blank: false, updatedAt: 2 },
      } as never,
      jobsBySession: {
        s2: [{ id: 'bash-1', kind: 'bash', label: 'sleep 9', status: 'running' }],
      } as never,
    })
    const current = snapshot({ running: true, runningCalls: [{ name: 'bash' } as never] })
    const { busyCount, peers } = deriveBusyContext(list, current)
    expect(busyCount).toBe(3)
    expect(peers[0]).toMatchObject({ id: 's1', kind: 'session', current: true, label: '甲' })
    expect(peers[1]).toMatchObject({ id: 's2', kind: 'session', statusKey: 'peer.status.running' })
    expect(peers[2]).toMatchObject({ id: 'job:bash-1', kind: 'job', label: 'sleep 9' })
  })

  it('deduplicates jobs mirrored across sessions and skips settled ones', () => {
    const list = listState({
      byId: {},
      jobsBySession: {
        a: [{ id: 'bash-1', kind: 'bash', label: 'x', status: 'running' }],
        b: [{ id: 'bash-1', kind: 'bash', label: 'x', status: 'running' }],
        c: [{ id: 'bash-2', kind: 'bash', label: 'done', status: 'completed' }],
      } as never,
    })
    const { busyCount, peers } = deriveBusyContext(list, snapshot())
    expect(busyCount).toBe(1)
    expect(peers).toHaveLength(1)
    expect(peers[0]?.id).toBe('job:bash-1')
  })

  it('counts loaded subagent catalog children and stops at stopping jobs', () => {
    const list = listState({
      subagentsByParent: {
        p1: {
          state: 'ready',
          error: null,
          entries: [
            { kind: 'child', id: 'c1', activity: 'running', hasChildren: false, label: '侦察兵' },
            { kind: 'child', id: 'c2', activity: 'inactive', hasChildren: false },
          ],
        } as never,
      },
      jobsBySession: { p1: [{ id: 'w-1', kind: 'workflow', label: '批处理', status: 'stopping' }] } as never,
    })
    const { busyCount, peers } = deriveBusyContext(list, snapshot())
    expect(busyCount).toBe(2)
    expect(peers[0]).toMatchObject({ id: 'c1', kind: 'subagent', label: '侦察兵' })
    expect(peers[1]).toMatchObject({ id: 'job:w-1', statusKey: 'peer.status.stopping' })
  })
})

describe('MascotSource parallel context', () => {
  async function bench() {
    const ctx = new Context()
    await ctx.plugin(SlotRegistry).await()
    const sessions = new TestSessions(stabilize, ctx)
    const source = new MascotSource(sessions)
    return { sessions, source }
  }

  it('flips to elsewhere and counts peers when other sessions run', async () => {
    const { sessions, source } = await bench()
    await sessions.add({ id: 's1' })
    await sessions.add({ id: 's2', summary: { running: true } }, { current: false })
    expect(source.getSnapshot()).toMatchObject({
      mood: 'elsewhere',
      busyCount: 1,
    })
    expect(source.getSnapshot().peers[0]).toMatchObject({ id: 's2', kind: 'session' })
    source.dispose()
  })

  it('refolds when a job lands or settles without moving the selection', async () => {
    const { sessions, source } = await bench()
    await sessions.add({ id: 's1' })
    expect(source.getSnapshot().mood).toBe('greeting')
    await sessions.list.update(draft => {
      draft.jobsBySession = { s1: [{ id: 'bash-1', kind: 'bash', label: 'sleep', status: 'running' }] }
    })
    expect(source.getSnapshot().busyCount).toBe(1)
    await sessions.list.update(draft => {
      draft.jobsBySession = { s1: [{ id: 'bash-1', kind: 'bash', label: 'sleep', status: 'completed' }] }
    })
    expect(source.getSnapshot().busyCount).toBe(0)
    expect(source.getSnapshot().mood).toBe('idle')
    source.dispose()
  })
})
