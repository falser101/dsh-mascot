// @vitest-environment jsdom
/**
 * MascotView presentation specs: mood-driven bubble text, drag moves through
 * the store, click pokes, double-click collapses, and the collapsed dot.
 * Props are fed directly (store instance + stub framework hooks + locale
 * dictionary), asserting user-visible behavior only.
 */
import { afterEach, describe, expect, it, beforeEach, vi } from 'vitest'
import { act, cleanup, fireEvent, render } from '@testing-library/react'
import { useSyncExternalStore } from 'react'
import type { ObservableSnapshot } from '@deepseek-ai/dsh-client-runtime/client'
import type { MascotState } from '../src/client/mascot-source'
import { createMascotStore, MASCOT_SIZE } from '../src/client/mascot-store'
import { zh, type MascotKey } from '../src/client/locales'
import { MascotView, type MascotViewProps } from '../src/client/MascotView'

afterEach(cleanup)

// jsdom does not implement pointer capture; the widget treats capture as a
// best-effort call, so the bench supplies a no-op.
if (typeof Element.prototype.setPointerCapture !== 'function') {
  Element.prototype.setPointerCapture = () => {}
  Element.prototype.releasePointerCapture = () => {}
}

function translate(key: MascotKey, params?: Record<string, unknown>): string {
  let text: string = zh[key]
  if (params !== undefined) {
    for (const [name, value] of Object.entries(params)) {
      text = text.replace(`{${name}}`, String(value))
    }
  }
  return text
}

function bench(
  mood: Partial<MascotState> = {},
  openPeer: (sessionId: string) => void = () => {},
  line = 'idle.line.0',
) {
  const store = createMascotStore().create()
  let frame: MascotState = {
    mood: 'idle',
    textKey: 'mood.idle',
    busyCount: 0,
    peers: [],
    ...mood,
  }
  const source: ObservableSnapshot<MascotState> = {
    getSnapshot: () => frame,
    subscribe: () => () => {},
  }
  const props: MascotViewProps = {
    // A real subscription: store writes must re-render the widget.
    useStore: (selector) => useSyncExternalStore(
      store.subscribe,
      () => selector(store.getSnapshot()),
    ),
    actions: store.actions,
    useMascot: (selector) => selector(source.getSnapshot()),
    useLines: (selector) => selector(line),
    t: translate,
    openPeer,
    setAiLines: () => {},
    useSessions: (() => undefined) as never,
    useWorkspaces: (() => undefined) as never,
  }
  return { store, props, setMood: (next: MascotState) => { frame = next } }
}

function bubbleOf(view: ReturnType<typeof render>) {
  return view.container.querySelector('[role="status"]') as HTMLElement
}

describe('MascotView', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders the character with the idle mood and an always-visible bubble', () => {
    const { props } = bench()
    const view = render(<MascotView {...props} />)
    const svg = view.container.querySelector('svg')
    expect(svg).not.toBeNull()
    expect(svg?.getAttribute('data-mood')).toBe('idle')
    const bubble = bubbleOf(view)
    expect(bubble.textContent).toBe('我在呢，随时找我～')
    expect(bubble.dataset.visible).toBe('true')
  })

  it('shows the transient bubble with the running tool name', () => {
    const { props } = bench({
      mood: 'working',
      textKey: 'mood.working',
      params: { tool: 'bash' },
      until: Date.now() + 4000,
    })
    const view = render(<MascotView {...props} />)
    const bubble = bubbleOf(view)
    expect(bubble.textContent).toBe('正在调用「bash」')
    expect(bubble.dataset.visible).toBe('true')
  })

  it('moves through the store while dragging and clamps to the viewport', () => {
    const { props, store } = bench()
    store.actions.move(0, 0)
    const view = render(<MascotView {...props} />)
    const root = view.container.firstElementChild as HTMLElement

    fireEvent.pointerDown(root, { button: 0, pointerId: 7, clientX: 100, clientY: 100 })
    fireEvent.pointerMove(root, { pointerId: 7, clientX: 160, clientY: 130 })
    expect(store.getSnapshot().x).toBe(60)
    expect(store.getSnapshot().y).toBe(30)

    // Far outside the window: clamped into view.
    fireEvent.pointerMove(root, { pointerId: 7, clientX: 5000, clientY: 5000 })
    expect(store.getSnapshot().x).toBe(window.innerWidth - MASCOT_SIZE)
    expect(store.getSnapshot().y).toBe(window.innerHeight - MASCOT_SIZE)

    fireEvent.pointerUp(root, { pointerId: 7 })
  })

  it('pokes a playful line on a click without a drag', () => {
    vi.useFakeTimers()
    try {
      const { props } = bench()
      const view = render(<MascotView {...props} />)
      const root = view.container.firstElementChild as HTMLElement

      fireEvent.pointerDown(root, { button: 0, pointerId: 1, clientX: 50, clientY: 50 })
      fireEvent.pointerUp(root, { pointerId: 1 })

      const bubble = bubbleOf(view)
      expect(bubble.dataset.visible).toBe('true')
      expect(['别戳我啦～', '痒痒的！喵？']).toContain(bubble.textContent)

      act(() => { vi.advanceTimersByTime(2100) })
      // The always-visible bubble stays up; the poke line is gone.
      expect(bubbleOf(view).textContent).toBe('我在呢，随时找我～')
    } finally {
      vi.useRealTimers()
    }
  })

  it('collapses to a dot on double-click and shows the hint copy', () => {
    const { props } = bench()
    const view = render(<MascotView {...props} />)
    const root = view.container.firstElementChild as HTMLElement

    fireEvent.doubleClick(root)
    expect(view.container.querySelector('[aria-hidden="true"]')).not.toBeNull()
    expect(bubbleOf(view).textContent).toBe('双击我回来～')

    fireEvent.doubleClick(root)
    expect(view.container.querySelector('svg')).not.toBeNull()
  })

  it('keeps the bubble visible while the agent is busy, with the busy marker', () => {
    const { props } = bench({
      mood: 'thinking',
      textKey: 'mood.thinking',
      busyCount: 1,
      peers: [{ id: 's1', label: '会话一', kind: 'session', statusKey: 'mood.thinking' }],
    })
    const view = render(<MascotView {...props} />)
    const bubble = bubbleOf(view)
    expect(bubble.dataset.visible).toBe('true')
    expect(bubble.textContent).toContain('让我想想…')
    expect(view.container.querySelector('span[aria-hidden="true"] i')).not.toBeNull()
  })

  it('does not keep the bubble visible when the busy-bubble toggle is off', () => {
    const { props, store } = bench({
      mood: 'working',
      textKey: 'mood.working',
      busyCount: 1,
      peers: [{ id: 's1', label: '会话一', kind: 'session', statusKey: 'mood.working' }],
    })
    store.actions.setBubbleAlways(false)
    const view = render(<MascotView {...props} />)
    expect(bubbleOf(view).dataset.visible).toBe('false')
  })

  it('keeps the bubble visible while idle too, when the toggle is on', () => {
    const { props } = bench()
    const view = render(<MascotView {...props} />)
    expect(bubbleOf(view).dataset.visible).toBe('true')
    expect(bubbleOf(view).textContent).toBe('我在呢，随时找我～')
  })

  it('shows the rotated idle line, including raw AI lines, while idle', () => {
    const { props } = bench({}, () => {}, 'idle.line.3')
    const builtin = render(<MascotView {...props} />)
    expect(bubbleOf(builtin).textContent).toBe('我在旁边守着，有事喊我～')
    builtin.unmount()

    const { props: aiProps } = bench({}, () => {}, 'ai:今天的你也很棒！')
    const ai = render(<MascotView {...aiProps} />)
    expect(bubbleOf(ai).textContent).toBe('今天的你也很棒！')
  })

  it('hides the idle bubble when the toggle is off', () => {
    const { props, store } = bench()
    store.actions.setBubbleAlways(false)
    const view = render(<MascotView {...props} />)
    expect(bubbleOf(view).dataset.visible).toBe('false')
  })

  it('swaps to a reassuring line while hovered and back after leaving', () => {
    const { props } = bench({
      mood: 'thinking',
      textKey: 'mood.thinking',
      busyCount: 1,
      peers: [{ id: 's1', label: '会话一', kind: 'session', statusKey: 'mood.thinking' }],
    })
    const view = render(<MascotView {...props} />)
    const root = view.container.firstElementChild as HTMLElement

    fireEvent.mouseEnter(root)
    expect(bubbleOf(view).textContent).toBe('别着急，我在努力想～')

    fireEvent.mouseLeave(root)
    expect(bubbleOf(view).textContent).toBe('让我想想…')
  })

  it('shows a random idle theater line while hovered idle', () => {
    const { props } = bench()
    const view = render(<MascotView {...props} />)
    const root = view.container.firstElementChild as HTMLElement

    fireEvent.mouseEnter(root)
    const text = bubbleOf(view).textContent!
    expect(['我在呢，随时找我～', '偷偷看你干活中…', '要不要歇会儿？', '（伸了个懒腰）', '今天的你也很棒！']).toContain(text)
  })

  it('shows the parallel badge from two executions on and hides it below', () => {
    const { props } = bench({
      mood: 'elsewhere',
      textKey: 'mood.elsewhere',
      busyCount: 2,
      peers: [
        { id: 's1', label: '会话一', kind: 'session', statusKey: 'mood.thinking' },
        { id: 'job:b1', label: '跑个任务', kind: 'job', statusKey: 'peer.status.running' },
      ],
    })
    const view = render(<MascotView {...props} />)
    expect(view.container.querySelector('[class*="badge"]')).not.toBeNull()

    const { props: solo } = bench({
      mood: 'thinking',
      textKey: 'mood.thinking',
      busyCount: 1,
      peers: [{ id: 's1', label: '会话一', kind: 'session', statusKey: 'mood.thinking' }],
    })
    const soloView = render(<MascotView {...solo} />)
    expect(soloView.container.querySelector('[class*="badge"]')).toBeNull()
  })

  it('shows the peer list on hover during parallel executions and jumps on click', () => {
    const jumped: string[] = []
    const { props } = bench({
      mood: 'elsewhere',
      textKey: 'mood.elsewhere',
      busyCount: 2,
      peers: [
        { id: 's1', label: '会话一', kind: 'session', statusKey: 'mood.thinking' },
        { id: 'job:b1', label: '跑个任务', kind: 'job', statusKey: 'peer.status.running' },
      ],
    }, (id) => { jumped.push(id) })
    const view = render(<MascotView {...props} />)
    const root = view.container.firstElementChild as HTMLElement

    fireEvent.mouseEnter(root)
    expect(view.getByText('会话一')).not.toBeNull()
    expect(view.getByText('跑个任务')).not.toBeNull()

    fireEvent.click(view.getByText('会话一'))
    expect(jumped).toEqual(['s1'])
  })

  it('respects a persisted collapsed state at first render', () => {
    const { props, store } = bench()
    store.actions.setCollapsed(true)
    const view = render(<MascotView {...props} />)
    expect(view.container.querySelector('[aria-hidden="true"]')).not.toBeNull()
  })
})
