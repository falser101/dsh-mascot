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
import { INTRO_MS, TRAY_HIDE_MS } from '../src/client/MascotView'
import { ACTION_INTERVALS } from '../src/client/character/idle-director'
import { zh, type MascotKey } from '../src/client/locales'
import { MascotView, type MascotViewProps } from '../src/client/MascotView'

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.restoreAllMocks()
})

// jsdom does not implement pointer capture; the widget treats capture as a
// best-effort call, so the bench supplies a no-op.
if (typeof Element.prototype.setPointerCapture !== 'function') {
  Element.prototype.setPointerCapture = () => {}
  Element.prototype.releasePointerCapture = () => {}
}

// jsdom 25 has no PointerEvent; MouseEvent carries clientX/clientY.
if (typeof PointerEvent === 'undefined') {
  class PointerEventShim extends MouseEvent {
    readonly pointerId: number
    constructor(type: string, init: MouseEventInit & { pointerId?: number } = {}) {
      super(type, init)
      this.pointerId = init.pointerId ?? 0
    }
  }
  Object.defineProperty(globalThis, 'PointerEvent', { value: PointerEventShim })
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
  store.actions.setIntroSeen(true)
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
    openSettings: () => {},
    setAiLines: () => {},
    useSessions: (() => undefined) as never,
    useWorkspaces: (() => undefined) as never,
  }
  return { store, props, setMood: (next: MascotState) => { frame = next } }
}

function bubbleOf(view: ReturnType<typeof render>) {
  return view.container.querySelector('[role="status"]') as HTMLElement
}

/** Dispatch a bubbling PointerEvent so clientX/clientY survive jsdom. */
function pointer(target: EventTarget, type: string, init: PointerEventInit): void {
  target.dispatchEvent(new PointerEvent(type, { bubbles: true, cancelable: true, ...init }))
}

describe('MascotView', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows the first-run hint once, then never again', () => {
    vi.useFakeTimers()
    try {
      const store = createMascotStore().create()
      const source: ObservableSnapshot<MascotState> = {
        getSnapshot: () => ({ mood: 'idle', textKey: 'mood.idle', busyCount: 0, peers: [] }),
        subscribe: () => () => {},
      }
      const props: MascotViewProps = {
        useStore: (selector) => useSyncExternalStore(
          store.subscribe,
          () => selector(store.getSnapshot()),
        ),
        actions: store.actions,
        useMascot: (selector) => selector(source.getSnapshot()),
        useLines: (selector) => selector('idle.line.0'),
        t: translate,
        openPeer: () => {},
        openSettings: () => {},
        setAiLines: () => {},
        useSessions: (() => undefined) as never,
        useWorkspaces: (() => undefined) as never,
      }
      const view = render(<MascotView {...props} />)
      expect(bubbleOf(view).textContent).toBe('拖我，悬停有按钮')
      expect(bubbleOf(view).dataset.visible).toBe('true')

      fireEvent.mouseEnter(view.container.firstElementChild as HTMLElement)
      expect(store.getSnapshot().introSeen).toBe(true)
      expect(bubbleOf(view).textContent).not.toBe('拖我，悬停有按钮')
    } finally {
      vi.useRealTimers()
    }
  })

  it('dismisses the first-run hint after a short wait', () => {
    vi.useFakeTimers()
    try {
      const { props, store } = (() => {
        const built = bench()
        built.store.actions.setIntroSeen(false)
        return built
      })()
      const view = render(<MascotView {...props} />)
      expect(bubbleOf(view).textContent).toBe('拖我，悬停有按钮')
      act(() => { vi.advanceTimersByTime(INTRO_MS) })
      expect(store.getSnapshot().introSeen).toBe(true)
      expect(bubbleOf(view).textContent).toBe('我在呢，随时找我～')
    } finally {
      vi.useRealTimers()
    }
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

  it('shows a companion line while a tool is running', () => {
    const { props } = bench({
      mood: 'working',
      textKey: 'mood.working',
      params: { tool: 'bash' },
      waitStartedAt: Date.now(),
    })
    const view = render(<MascotView {...props} />)
    const bubble = bubbleOf(view)
    expect(bubble.textContent).toBe('还在忙，别急～')
    expect(bubble.dataset.visible).toBe('true')
  })

  it('names the tool when the setting is on', () => {
    const { props, store } = bench({
      mood: 'working',
      textKey: 'mood.working',
      params: { tool: 'bash' },
      waitStartedAt: Date.now(),
    })
    store.actions.setShowToolName(true)
    const view = render(<MascotView {...props} />)
    expect(bubbleOf(view).textContent).toBe('正在调用「bash」')
  })

  it('peeks the tool name on hover when the setting is off', () => {
    const { props } = bench({
      mood: 'working',
      textKey: 'mood.working',
      params: { tool: 'bash' },
      waitStartedAt: Date.now(),
      busyCount: 1,
      peers: [{ id: 's1', label: '会话一', kind: 'session', statusKey: 'mood.working' }],
    })
    const view = render(<MascotView {...props} />)
    const root = view.container.firstElementChild as HTMLElement
    fireEvent.mouseEnter(root)
    expect(bubbleOf(view).textContent).toBe('正在调用「bash」')
  })

  it('moves through the store while dragging and clamps to the viewport', () => {
    const { props, store } = bench()
    store.actions.move(0, 0)
    const view = render(<MascotView {...props} />)
    const root = view.container.firstElementChild as HTMLElement

    pointer(root, 'pointerdown', { button: 0, pointerId: 7, clientX: 100, clientY: 100, buttons: 1 })
    pointer(root, 'pointermove', { pointerId: 7, clientX: 160, clientY: 130, buttons: 1 })
    expect(store.getSnapshot().x).toBe(60)
    expect(store.getSnapshot().y).toBe(30)

    // Far outside the window: clamped into view.
    pointer(root, 'pointermove', { pointerId: 7, clientX: 5000, clientY: 5000, buttons: 1 })
    expect(store.getSnapshot().x).toBe(window.innerWidth - MASCOT_SIZE)
    expect(store.getSnapshot().y).toBe(window.innerHeight - MASCOT_SIZE)

    pointer(root, 'pointerup', { pointerId: 7, button: 0 })
    expect(store.getSnapshot().x).toBe(window.innerWidth - MASCOT_SIZE)
    expect(store.getSnapshot().y).toBe(window.innerHeight - MASCOT_SIZE)
  })

  it('pokes a playful line on a click without a drag', () => {
    vi.useFakeTimers()
    try {
      const { props } = bench()
      const view = render(<MascotView {...props} />)
      const root = view.container.firstElementChild as HTMLElement

      fireEvent.pointerDown(root, { button: 0, pointerId: 1, clientX: 50, clientY: 50, buttons: 1 })
      fireEvent.pointerUp(root, { pointerId: 1, button: 0 })

      const bubble = bubbleOf(view)
      expect(bubble.dataset.visible).toBe('true')
      expect(['别戳我啦～', '痒痒的！喵？']).toContain(bubble.textContent)
      expect(bubble.textContent).not.toMatch(/汪/)

      act(() => { vi.advanceTimersByTime(2100) })
      // The always-visible bubble stays up; the poke line is gone.
      expect(bubbleOf(view).textContent).toBe('我在呢，随时找我～')
    } finally {
      vi.useRealTimers()
    }
  })

  it('collapses to a mini face on double-click and shows the hint copy', () => {
    const { props } = bench()
    const view = render(<MascotView {...props} />)
    const root = view.container.firstElementChild as HTMLElement

    fireEvent.doubleClick(root)
    expect(view.container.querySelector('svg')).not.toBeNull()
    expect(root.className).toMatch(/collapsed/)
    expect(bubbleOf(view).textContent).toBe('双击我回来～')

    fireEvent.doubleClick(root)
    expect(view.container.querySelector('svg')).not.toBeNull()
    expect(root.className).not.toMatch(/collapsed/)
  })

  it('hides the pet completely from the context menu', () => {
    const { props, store } = bench()
    const view = render(<MascotView {...props} />)
    const root = view.container.firstElementChild as HTMLElement
    fireEvent.contextMenu(root)
    fireEvent.click(view.getByRole('button', { name: '隐藏' }))
    expect(store.getSnapshot().hidden).toBe(true)
    expect(view.container.firstElementChild).toBeNull()
  })

  it('renders nothing when the master switch is off', () => {
    const { props, store } = bench()
    store.actions.setHidden(true)
    const view = render(<MascotView {...props} />)
    expect(view.container.firstElementChild).toBeNull()
    store.actions.setHidden(false)
    view.rerender(<MascotView {...props} />)
    expect(view.container.querySelector('svg')).not.toBeNull()
  })

  it('shows the action tray on hover and keeps it while the pointer moves onto it', () => {
    vi.useFakeTimers()
    try {
      const { props } = bench()
      const view = render(<MascotView {...props} />)
      const root = view.container.firstElementChild as HTMLElement
      const tray = view.getByRole('toolbar', { name: '伙伴操作' })
      expect(tray.className).not.toMatch(/trayOpen/)

      fireEvent.mouseEnter(root)
      expect(tray.className).toMatch(/trayOpen/)

      fireEvent.mouseLeave(root)
      fireEvent.mouseEnter(tray)
      act(() => { vi.advanceTimersByTime(TRAY_HIDE_MS + 20) })
      expect(tray.className).toMatch(/trayOpen/)

      fireEvent.mouseLeave(tray)
      act(() => { vi.advanceTimersByTime(TRAY_HIDE_MS + 20) })
      expect(tray.className).not.toMatch(/trayOpen/)
    } finally {
      vi.useRealTimers()
    }
  })

  it('cycles the skin and jumps from the pet menu', () => {
    const jumped: string[] = []
    const { props, store } = bench({
      mood: 'thinking',
      textKey: 'mood.thinking',
      busyCount: 1,
      peers: [{ id: 's9', label: '会话九', kind: 'session', statusKey: 'mood.thinking', current: true }],
    }, (id) => { jumped.push(id) })
    const view = render(<MascotView {...props} />)
    const root = view.container.firstElementChild as HTMLElement
    fireEvent.mouseEnter(root)
    fireEvent.click(view.getByRole('button', { name: '换一只' }))
    expect(store.getSnapshot().skin).toBe('cat-ragdoll')
    fireEvent.click(view.getByRole('button', { name: '去当前任务' }))
    expect(jumped).toEqual(['s9'])
  })

  it('labels tray buttons with hover tips', () => {
    const { props } = bench()
    const view = render(<MascotView {...props} />)
    const hide = view.getByRole('button', { name: '隐藏' })
    expect(hide.getAttribute('data-tip')).toBe('隐藏')
    expect(view.getByRole('button', { name: '设置' }).getAttribute('data-tip')).toBe('设置')
    expect(view.getByRole('button', { name: '换一只' }).getAttribute('data-tip')).toBe('换一只')
  })

  it('opens settings from the more button', () => {
    const opened: string[] = []
    const { props } = bench()
    props.openSettings = () => { opened.push('ok') }
    const view = render(<MascotView {...props} />)
    fireEvent.mouseEnter(view.container.firstElementChild as HTMLElement)
    fireEvent.click(view.getByRole('button', { name: '设置' }))
    expect(opened).toEqual(['ok'])
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

  it('pops the bubble up on its own while idle, hides it, and pops again', () => {
    vi.useFakeTimers()
    const random = vi.spyOn(Math, 'random').mockReturnValue(1)
    try {
      const { props } = bench()
      const view = render(<MascotView {...props} />)
      // The first pop-up shows immediately on entering idle.
      expect(bubbleOf(view).dataset.visible).toBe('true')
      expect(bubbleOf(view).textContent).toBe('我在呢，随时找我～')
      // It hides itself after the pop duration…
      act(() => { vi.advanceTimersByTime(8000) })
      expect(bubbleOf(view).dataset.visible).toBe('false')
      // …and pops up again on the cadence.
      act(() => { vi.advanceTimersByTime(32_000) })
      expect(bubbleOf(view).dataset.visible).toBe('true')
      act(() => { vi.advanceTimersByTime(8000) })
      expect(bubbleOf(view).dataset.visible).toBe('false')
    } finally {
      random.mockRestore()
      vi.useRealTimers()
    }
  })

  it('follows the configured cadence levels', () => {
    vi.useFakeTimers()
    const random = vi.spyOn(Math, 'random').mockReturnValue(1)
    try {
      const { props, store } = bench()
      const view = render(<MascotView {...props} />)
      // Standard: pops immediately, hides after 8s.
      act(() => { vi.advanceTimersByTime(8000) })
      expect(bubbleOf(view).dataset.visible).toBe('false')
      act(() => { vi.advanceTimersByTime(32_000) })
      expect(bubbleOf(view).dataset.visible).toBe('true')

      // Lively: shorter window and interval.
      act(() => { store.actions.setPopCadence('lively') })
      act(() => { vi.advanceTimersByTime(20_000) })
      expect(bubbleOf(view).dataset.visible).toBe('true')
      act(() => { vi.advanceTimersByTime(6000) })
      expect(bubbleOf(view).dataset.visible).toBe('false')

      // Quiet: long silence.
      act(() => { store.actions.setPopCadence('quiet') })
      act(() => { vi.advanceTimersByTime(59_000) })
      expect(bubbleOf(view).dataset.visible).toBe('false')
      act(() => { vi.advanceTimersByTime(1000) })
      expect(bubbleOf(view).dataset.visible).toBe('true')
    } finally {
      random.mockRestore()
      vi.useRealTimers()
    }
  })

  it('keeps the bubble visible continuously while idle when hovered', () => {
    const { props } = bench()
    const view = render(<MascotView {...props} />)
    const root = view.container.firstElementChild as HTMLElement
    fireEvent.mouseEnter(root)
    expect(bubbleOf(view).dataset.visible).toBe('true')
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

  it('plays a yawn then a stretch as the wait clock crosses milestones', () => {
    vi.useFakeTimers()
    vi.setSystemTime(1_000_000)
    try {
      const { props } = bench({
        mood: 'thinking',
        textKey: 'mood.thinking',
        waitStartedAt: 1_000_000,
      })
      const view = render(<MascotView {...props} />)
      expect(view.container.querySelector('svg')?.getAttribute('data-action')).not.toBe('true')

      act(() => { vi.advanceTimersByTime(30_000) })
      expect(bubbleOf(view).textContent).toBe('哈欠……')

      const yawnMs = 700 + 1_200
      act(() => { vi.advanceTimersByTime(yawnMs + 90_000) })
      expect(bubbleOf(view).textContent).toBe('伸个懒腰～')
    } finally {
      vi.useRealTimers()
    }
  })

  it('plays an idle clip and shows its line after the cadence wait', () => {
    vi.useFakeTimers()
    const random = vi.spyOn(Math, 'random').mockReturnValue(0)
    try {
      const { props } = bench()
      const view = render(<MascotView {...props} />)
      act(() => { vi.advanceTimersByTime(ACTION_INTERVALS.standard.minMs) })
      const svg = view.container.querySelector('svg')
      expect(svg?.getAttribute('data-action')).toBe('true')
      expect(bubbleOf(view).textContent).toBe('伸个懒腰～')
    } finally {
      random.mockRestore()
      vi.useRealTimers()
    }
  })

  it('uses dog poke lines that never say 喵', () => {
    vi.useFakeTimers()
    try {
      const { props, store } = bench()
      store.actions.setSkin('dog')
      const view = render(<MascotView {...props} />)
      const root = view.container.firstElementChild as HTMLElement
      fireEvent.pointerDown(root, { button: 0, pointerId: 1, clientX: 50, clientY: 50, buttons: 1 })
      fireEvent.pointerUp(root, { pointerId: 1, button: 0 })
      fireEvent.pointerDown(root, { button: 0, pointerId: 2, clientX: 50, clientY: 50, buttons: 1 })
      fireEvent.pointerUp(root, { pointerId: 2, button: 0 })
      const text = bubbleOf(view).textContent ?? ''
      expect(text).not.toMatch(/喵/)
      expect(['别戳我啦～', '痒痒的！汪？', '（摇了摇尾巴）', '再戳我可要生气啦！']).toContain(text)
    } finally {
      vi.useRealTimers()
    }
  })

  it('shrinks to a mini face while the composer is focused and expands after send', () => {
    const { props } = bench()
    const view = render(<MascotView {...props} />)
    const root = view.container.firstElementChild as HTMLElement
    expect(root.className).not.toMatch(/mini/)

    const seat = document.createElement('div')
    seat.setAttribute('data-composer-seat', '')
    const textarea = document.createElement('textarea')
    seat.appendChild(textarea)
    document.body.appendChild(seat)
    act(() => { textarea.focus() })
    expect(root.className).toMatch(/mini/)
    expect(root.getAttribute('data-composing')).toBe('true')

    act(() => { textarea.blur() })
    expect(root.className).not.toMatch(/mini/)
    seat.remove()
    view.unmount()

    const { props: busy } = bench({
      mood: 'working',
      textKey: 'mood.working',
      waitStartedAt: Date.now(),
    })
    const busyView = render(<MascotView {...busy} />)
    const busySeat = document.createElement('div')
    busySeat.setAttribute('data-composer-seat', '')
    const busyTextarea = document.createElement('textarea')
    busySeat.appendChild(busyTextarea)
    document.body.appendChild(busySeat)
    act(() => { busyTextarea.focus() })
    expect((busyView.container.firstElementChild as HTMLElement).className).not.toMatch(/mini/)
    busySeat.remove()
  })

  it('opens the action tray above the pet on the bottom edge and to the right on the left edge', () => {
    const { props, store } = bench()
    store.actions.move(window.innerWidth - MASCOT_SIZE, window.innerHeight - MASCOT_SIZE)
    const view = render(<MascotView {...props} />)
    expect(view.getByRole('toolbar', { name: '伙伴操作' }).getAttribute('data-side')).toBe('top')

    store.actions.move(0, 120)
    view.rerender(<MascotView {...props} />)
    expect(view.getByRole('toolbar', { name: '伙伴操作' }).getAttribute('data-side')).toBe('right')
  })

  it('respects a persisted collapsed state at first render', () => {
    const { props, store } = bench()
    store.actions.setCollapsed(true)
    const view = render(<MascotView {...props} />)
    expect(view.container.querySelector('[aria-hidden="true"]')).not.toBeNull()
  })
})
