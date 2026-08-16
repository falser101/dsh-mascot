/**
 * The floating companion view, mounted into the frame-wide `shell.overlay`
 * slot. Reads the shared mascot store (position, collapsed, skin, busy
 * bubble preference) and the inject-bound mood source; owns only
 * component-local interaction state (drag session, poke line, hover line).
 * All presentation derives from the mood frame; nothing here reaches the
 * session or the model. The busy badge and hover peer list surface parallel
 * executions from the fold's `busyCount`/`peers`.
 */
import { useEffect, useRef, useState } from 'react'
import type {
  InjectFace, PropsLocale, PropsRuntime, PropsStore,
} from '@deepseek-ai/dsh-client-ui-slots'
import type { ObservableSnapshot } from '@deepseek-ai/dsh-client-runtime/client'
import type { BusyPeer, MascotMood, MascotState } from './mascot-source'
import { createMascotStore, MASCOT_SIZE } from './mascot-store'
import { skinOf } from './character/skins'
import { AI_LINE_PREFIX } from './mascot-lines'
import type { MascotKey, NS } from './locales'
import css from './MascotView.module.css'

/** Injectable face: the mood source and the idle line bound as hooks. */
export interface MascotViewInjected {
  hooks: {
    /** Live mood frame of the current session. */
    mascot: ObservableSnapshot<MascotState>
    /** Current idle rotation line (built-in key or `ai:`-prefixed raw text). */
    lines: ObservableSnapshot<string>
  }
  /** Jump to the session owning the given peer id (no-op for job peers). */
  openPeer: (sessionId: string) => void
  /** Apply the AI-lines settings toggle to the rotator. */
  setAiLines: (enabled: boolean) => void
}

/** Full overlay-entry props: runtime kit + locale seat + store + inject face. */
export type MascotViewProps =
  PropsRuntime<'shell.overlay'>
  & PropsLocale<typeof NS>
  & PropsStore<ReturnType<typeof createMascotStore>>
  & InjectFace<MascotViewInjected>

/** How long a poke line stays visible, ms. */
const POKE_MS = 2000

/** Poke lines, cycled in order on each click. */
const POKE_KEYS: readonly MascotKey[] = ['poke.0', 'poke.1', 'poke.2', 'poke.3']

/** Idle hover lines, picked at random on each hover. */
const IDLE_HOVER_KEYS: readonly MascotKey[] = [
  'hover.idle.0', 'hover.idle.1', 'hover.idle.2', 'hover.idle.3', 'hover.idle.4',
]

/** Moods that keep the bubble visible without a hover (the agent is busy). */
const BUSY_MOODS: readonly MascotMood[] = [
  'queued', 'confirming', 'thinking', 'working', 'streaming', 'error', 'elsewhere',
]

/** Moods that show the animated busy marker in the bubble corner. */
const MARKED_MOODS: readonly MascotMood[] = ['thinking', 'working', 'streaming']

/** How long an idle pop-up stays visible, ms. */
const IDLE_POP_MS = 8000

/** How often the idle bubble pops up on its own, ms. */
const IDLE_POP_INTERVAL_MS = 40_000

/** Badge threshold: show the parallel-count badge from two executions on. */
const BADGE_MIN = 2

/** The reassuring hover line for one steady mood. */
function hoverKeyOf(mood: MascotMood, idleIndex: number): MascotKey {
  switch (mood) {
    case 'idle': return IDLE_HOVER_KEYS[idleIndex] ?? IDLE_HOVER_KEYS[0]
    case 'queued': return 'hover.queued'
    case 'confirming': return 'hover.confirming'
    case 'thinking': return 'hover.thinking'
    case 'working': return 'hover.working'
    case 'streaming': return 'hover.streaming'
    case 'error': return 'hover.error'
    case 'elsewhere': return 'mood.elsewhere'
    case 'done': return 'mood.done'
    case 'greeting': return 'mood.greeting'
  }
}

/** Small icon for one peer kind. */
function peerIcon(kind: BusyPeer['kind']): string {
  switch (kind) {
    case 'session': return '💬'
    case 'subagent': return '🧩'
    case 'job': return '⏳'
  }
}

interface DragSession {
  pointerId: number
  offsetX: number
  offsetY: number
  moved: boolean
}

function clamp(value: number, max: number): number {
  return Math.max(0, Math.min(max, value))
}

function clampToViewport(x: number, y: number): { x: number; y: number } {
  return {
    x: clamp(x, window.innerWidth - MASCOT_SIZE),
    y: clamp(y, window.innerHeight - MASCOT_SIZE),
  }
}

/**
 * Render the draggable companion with its speech bubble. The bubble is
 * always visible while the agent is busy (unless the settings toggle turns
 * that off), swaps to a reassuring line while hovered, and becomes a peer
 * list while hovered during parallel executions. A badge counts parallel
 * executions from two on.
 * @param props - composed overlay-entry props.
 */
export function MascotView(props: MascotViewProps) {
  const { useStore, actions, useMascot, useLines, t, openPeer, setAiLines } = props
  const state = useStore(value => value)
  const mascot = useMascot(value => value)
  const line = useLines(value => value)
  const [dragging, setDragging] = useState(false)
  const [poke, setPoke] = useState<{ text: string; nonce: number } | null>(null)
  const [hovering, setHovering] = useState(false)
  const [idleHoverIndex, setIdleHoverIndex] = useState(0)
  const [popVisible, setPopVisible] = useState(false)
  const dragRef = useRef<DragSession | null>(null)
  const pokeCounter = useRef(0)

  // Keep the rotator's AI toggle in sync with the persisted preference.
  useEffect(() => {
    setAiLines(state.aiLines)
  }, [state.aiLines, setAiLines])

  // Idle pop-ups: while idle (and the bubble toggle is on) the bubble shows
  // itself briefly, hides, and pops up again on a cadence — the "occasional
  // AI vignette" behavior; busy moods stay permanently visible instead.
  const isIdle = mascot.mood === 'idle'
  useEffect(() => {
    if (!isIdle || !state.bubbleAlways) {
      setPopVisible(false)
      return
    }
    let hideTimer: ReturnType<typeof setTimeout> | undefined
    let shown = false
    const show = () => {
      if (shown) return
      shown = true
      setPopVisible(true)
      hideTimer = setTimeout(() => {
        shown = false
        setPopVisible(false)
      }, IDLE_POP_MS)
    }
    show()
    const interval = setInterval(show, IDLE_POP_INTERVAL_MS)
    return () => {
      clearInterval(interval)
      if (hideTimer !== undefined) clearTimeout(hideTimer)
      setPopVisible(false)
    }
  }, [isIdle, state.bubbleAlways])

  // Keep the widget inside the viewport when the window shrinks.
  useEffect(() => {
    const onResize = () => {
      const clamped = clampToViewport(state.x, state.y)
      if (clamped.x !== state.x || clamped.y !== state.y) actions.move(clamped.x, clamped.y)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [actions, state.x, state.y])

  const pokeNow = () => {
    pokeCounter.current += 1
    const index = (pokeCounter.current - 1) % POKE_KEYS.length
    const nonce = pokeCounter.current
    setPoke({ text: t(POKE_KEYS[index]), nonce })
    window.setTimeout(() => {
      setPoke(current => (current?.nonce === nonce ? null : current))
    }, POKE_MS)
  }

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
      pointerId: event.pointerId,
      offsetX: event.clientX - state.x,
      offsetY: event.clientY - state.y,
      moved: false,
    }
    setDragging(true)
  }

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (drag === null || drag.pointerId !== event.pointerId) return
    const clamped = clampToViewport(event.clientX - drag.offsetX, event.clientY - drag.offsetY)
    if (clamped.x !== state.x || clamped.y !== state.y) {
      drag.moved = true
      actions.move(clamped.x, clamped.y)
    }
  }

  const onPointerUp = () => {
    const drag = dragRef.current
    dragRef.current = null
    setDragging(false)
    if (drag !== null && !drag.moved) pokeNow()
  }

  const onDoubleClick = () => {
    actions.setCollapsed(!state.collapsed)
  }

  const onHoverEnter = () => {
    setIdleHoverIndex(Math.floor(Math.random() * IDLE_HOVER_KEYS.length))
    setHovering(true)
  }

  const skin = skinOf(state.skin)
  const Skin = skin.Component
  const busyMarked = MARKED_MOODS.includes(mascot.mood)
  const showPeerList = hovering && mascot.peers.length > 1
  const idleLine = line.startsWith(AI_LINE_PREFIX)
    ? line.slice(AI_LINE_PREFIX.length)
    : t(line as MascotKey)
  const bubbleText = state.collapsed
    ? t('collapse.hint')
    : poke?.text
      ?? (hovering && !showPeerList
        ? t(hoverKeyOf(mascot.mood, idleHoverIndex))
        : mascot.mood === 'idle' ? idleLine : t(mascot.textKey, mascot.params))
  const busy = BUSY_MOODS.includes(mascot.mood)
  const bubbleVisible = poke !== null
    || mascot.until !== undefined
    || hovering
    || (state.bubbleAlways && (busy || popVisible))
  const showBadge = mascot.busyCount >= BADGE_MIN

  const rootClass = [
    css.root,
    dragging ? css.dragging : undefined,
    state.collapsed ? css.collapsed : undefined,
  ].filter(Boolean).join(' ')

  return (
    <div
      className={rootClass}
      style={{ left: state.x, top: state.y }}
      role="button"
      tabIndex={0}
      aria-label={t('widget.aria')}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onDoubleClick={onDoubleClick}
      onMouseEnter={onHoverEnter}
      onMouseLeave={() => { setHovering(false) }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          pokeNow()
        }
      }}
    >
      <div
        className={`${css.bubble}${bubbleVisible ? ` ${css.bubbleVisible}` : ''}${showPeerList ? ` ${css.bubbleList}` : ''}`}
        data-visible={bubbleVisible}
        role="status"
        aria-live="polite"
      >
        {showPeerList ? (
          <ul className={css.peerList}>
            {mascot.peers.map(peer => (
              <li
                key={peer.id}
                className={`${css.peerRow}${peer.kind !== 'job' ? ` ${css.peerRowJump}` : ''}`}
                onClick={peer.kind === 'job' ? undefined : () => { openPeer(peer.id) }}
                role={peer.kind === 'job' ? undefined : 'button'}
              >
                <span className={css.peerIcon} aria-hidden="true">{peerIcon(peer.kind)}</span>
                <span className={css.peerLabel}>{peer.label}</span>
                <span className={css.peerStatus}>
                  {peer.current ? '· ' : ''}{t(peer.statusKey, peer.statusParams)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <>
            <span key={bubbleText} className={css.bubbleText}>{bubbleText}</span>
            {busyMarked && <span className={css.busy} aria-hidden="true"><i /><i /><i /></span>}
          </>
        )}
      </div>
      {state.collapsed ? (
        <div className={css.dot} aria-hidden="true" />
      ) : (
        <div className={css.character}>
          <Skin mood={mascot.mood} dragging={dragging} />
          {showBadge && (
            <div className={css.badge} role="status" aria-label={t('badge.label', { count: mascot.busyCount })}>
              {mascot.busyCount}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
