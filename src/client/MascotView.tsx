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
import { createMascotStore, MASCOT_SIZE, type PopCadence } from './mascot-store'
import { clampToBox, trayPlacement, visualBox } from './dock'
import { isComposerTarget } from './composer'
import { hasToolName, workingLineKey } from './bubble-copy'
import { nextSkinId, pokeKeysOf, skinOf } from './character/skins'
import { clipsOf } from './character/actions'
import { useIdleDirector, WAIT_THRESHOLDS } from './character/idle-director'
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
  /** Open the host settings panel on the companion page (best-effort). */
  openSettings: () => void
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

/** Keep the action tray up while the pointer travels from the pet onto it. */
export const TRAY_HIDE_MS = 240

/** First-run hint stays up this long if the user does not interact. */
export const INTRO_MS = 8000

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

/** Idle pop-up timing per cadence level (visible duration, interval). */
const IDLE_POP_CADENCES: Record<PopCadence, { readonly durationMs: number; readonly intervalMs: number }> = {
  quiet: { durationMs: 6000, intervalMs: 60_000 },
  standard: { durationMs: 8000, intervalMs: 40_000 },
  lively: { durationMs: 6000, intervalMs: 20_000 },
}

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
/** Session id to jump to from the pet menu (jobs cannot be opened). */
export function jumpPeerId(peers: readonly BusyPeer[]): string | undefined {
  const current = peers.find(peer => peer.current === true && peer.kind !== 'job')
  if (current !== undefined) return current.id
  return peers.find(peer => peer.kind !== 'job')?.id
}

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
  x: number
  y: number
}

function clampToViewport(x: number, y: number): { x: number; y: number } {
  return clampToBox(x, y, MASCOT_SIZE, window.innerWidth, window.innerHeight)
}

function moodLine(
  mascot: MascotState,
  idleLine: string,
  hovering: boolean,
  showPeerList: boolean,
  showToolName: boolean,
  idleHoverIndex: number,
  t: (key: MascotKey, params?: Record<string, unknown>) => string,
): string {
  if (mascot.mood === 'working') {
    if (hovering && !showPeerList) {
      if (showToolName || !hasToolName(mascot)) return t('hover.working')
      return t(workingLineKey(mascot, true, false), mascot.params)
    }
    return t(workingLineKey(mascot, showToolName, false), mascot.params)
  }
  if (hovering && !showPeerList) return t(hoverKeyOf(mascot.mood, idleHoverIndex), mascot.params)
  if (mascot.mood === 'idle') return idleLine
  return t(mascot.textKey, mascot.params)
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
  const { useStore, actions, useMascot, useLines, t, openPeer, openSettings, setAiLines } = props
  const state = useStore(value => value)
  const mascot = useMascot(value => value)
  const line = useLines(value => value)
  const [dragging, setDragging] = useState(false)
  const [poke, setPoke] = useState<{ text: string; nonce: number } | null>(null)
  const [hovering, setHovering] = useState(false)
  const [idleHoverIndex, setIdleHoverIndex] = useState(0)
  const [popVisible, setPopVisible] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [trayHeld, setTrayHeld] = useState(false)
  const [waitLong, setWaitLong] = useState(false)
  const [composerFocused, setComposerFocused] = useState(false)
  const dragRef = useRef<DragSession | null>(null)
  const pokeCounter = useRef(0)
  const pokeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const trayHideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const hidden = state.hidden === true
  const showToolName = state.showToolName === true

  useEffect(() => () => {
    if (pokeTimer.current !== undefined) clearTimeout(pokeTimer.current)
    if (trayHideTimer.current !== undefined) clearTimeout(trayHideTimer.current)
  }, [])

  useEffect(() => {
    const onFocusIn = (event: FocusEvent) => {
      setComposerFocused(isComposerTarget(event.target))
    }
    const onFocusOut = (event: FocusEvent) => {
      if (isComposerTarget(event.relatedTarget)) return
      setComposerFocused(false)
    }
    setComposerFocused(isComposerTarget(document.activeElement))
    document.addEventListener('focusin', onFocusIn)
    document.addEventListener('focusout', onFocusOut)
    return () => {
      document.removeEventListener('focusin', onFocusIn)
      document.removeEventListener('focusout', onFocusOut)
    }
  }, [])

  const holdTray = () => {
    if (trayHideTimer.current !== undefined) {
      clearTimeout(trayHideTimer.current)
      trayHideTimer.current = undefined
    }
    setTrayHeld(true)
  }

  const releaseTray = () => {
    if (trayHideTimer.current !== undefined) clearTimeout(trayHideTimer.current)
    trayHideTimer.current = setTimeout(() => {
      trayHideTimer.current = undefined
      setTrayHeld(false)
      setMenuOpen(false)
    }, TRAY_HIDE_MS)
  }

  useEffect(() => {
    if (!menuOpen) return
    const close = () => { setMenuOpen(false) }
    window.addEventListener('pointerdown', close)
    return () => { window.removeEventListener('pointerdown', close) }
  }, [menuOpen])

  // Keep the rotator's AI toggle in sync with the persisted preference.
  useEffect(() => {
    setAiLines(state.aiLines)
  }, [state.aiLines, setAiLines])

  useEffect(() => {
    if (state.introSeen === true) return
    const timer = setTimeout(() => { actions.setIntroSeen(true) }, INTRO_MS)
    return () => { clearTimeout(timer) }
  }, [state.introSeen, actions])

  // Idle pop-ups: while idle (and the bubble toggle is on) the bubble shows
  // itself briefly, hides, and pops up again on the configured cadence — the
  // "occasional AI vignette" behavior; busy moods stay permanently visible.
  const isIdle = mascot.mood === 'idle'
  const composing = composerFocused && (isIdle || mascot.mood === 'greeting') && !state.collapsed
  const cadence = IDLE_POP_CADENCES[state.popCadence] ?? IDLE_POP_CADENCES.standard
  useEffect(() => {
    if (!isIdle || !state.bubbleAlways || composing || state.introSeen !== true) {
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
      }, cadence.durationMs)
    }
    show()
    const interval = setInterval(show, cadence.intervalMs)
    return () => {
      clearInterval(interval)
      if (hideTimer !== undefined) clearTimeout(hideTimer)
      setPopVisible(false)
    }
  }, [isIdle, state.bubbleAlways, composing, state.introSeen, cadence.durationMs, cadence.intervalMs])

  useEffect(() => {
    if (mascot.waitStartedAt === undefined) {
      setWaitLong(false)
      return
    }
    const stretchAt = (WAIT_THRESHOLDS[state.popCadence] ?? WAIT_THRESHOLDS.standard)[1]
    const remain = stretchAt - (Date.now() - mascot.waitStartedAt)
    if (remain <= 0) {
      setWaitLong(true)
      return
    }
    const timer = setTimeout(() => { setWaitLong(true) }, remain)
    return () => { clearTimeout(timer) }
  }, [mascot.waitStartedAt, state.popCadence])

  // Keep the widget inside the viewport when the window shrinks.
  useEffect(() => {
    const onResize = () => {
      const clamped = clampToViewport(state.x, state.y)
      if (clamped.x !== state.x || clamped.y !== state.y) actions.move(clamped.x, clamped.y)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [actions, state.x, state.y])

  const dismissIntro = () => {
    if (state.introSeen !== true) actions.setIntroSeen(true)
  }

  const pokeNow = () => {
    dismissIntro()
    const keys = pokeKeysOf(state.skin)
    pokeCounter.current += 1
    const index = (pokeCounter.current - 1) % keys.length
    const nonce = pokeCounter.current
    setPoke({ text: t(keys[index]), nonce })
    if (pokeTimer.current !== undefined) clearTimeout(pokeTimer.current)
    pokeTimer.current = setTimeout(() => {
      pokeTimer.current = undefined
      setPoke(current => (current?.nonce === nonce ? null : current))
    }, POKE_MS)
  }

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== undefined && event.button !== 0) return
    try { event.currentTarget.setPointerCapture(event.pointerId) } catch { /* jsdom / lost pointer */ }
    const clientX = Number.isFinite(event.clientX) ? event.clientX : 0
    const clientY = Number.isFinite(event.clientY) ? event.clientY : 0
    dragRef.current = {
      pointerId: event.pointerId,
      offsetX: clientX - state.x,
      offsetY: clientY - state.y,
      moved: false,
      x: state.x,
      y: state.y,
    }
    setDragging(true)
  }

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (drag === null || drag.pointerId !== event.pointerId) return
    if (!Number.isFinite(event.clientX) || !Number.isFinite(event.clientY)) return
    const clamped = clampToViewport(event.clientX - drag.offsetX, event.clientY - drag.offsetY)
    if (clamped.x !== drag.x || clamped.y !== drag.y) {
      drag.moved = true
      drag.x = clamped.x
      drag.y = clamped.y
      dismissIntro()
      actions.move(clamped.x, clamped.y)
    }
  }

  const onPointerUp = () => {
    const drag = dragRef.current
    dragRef.current = null
    setDragging(false)
    if (drag === null) return
    if (!drag.moved) pokeNow()
  }

  const onDoubleClick = () => {
    actions.setCollapsed(!state.collapsed)
    setMenuOpen(false)
  }

  const onHoverEnter = () => {
    dismissIntro()
    setIdleHoverIndex(Math.floor(Math.random() * IDLE_HOVER_KEYS.length))
    setHovering(true)
  }

  const skin = skinOf(state.skin)
  const Skin = skin.Component
  const clips = clipsOf(state.skin)
  const waiting = mascot.waitStartedAt !== undefined
  const idleAction = useIdleDirector({
    enabled: !hidden && !dragging && !state.collapsed && !composing && (isIdle || waiting),
    cadence: state.popCadence,
    clips,
    waitStartedAt: mascot.waitStartedAt,
  })
  const busyMarked = MARKED_MOODS.includes(mascot.mood)
  const showPeerList = hovering && mascot.peers.length > 1
  const idleLine = line.startsWith(AI_LINE_PREFIX)
    ? line.slice(AI_LINE_PREFIX.length)
    : t(line as MascotKey)
  const actionLine = idleAction.action === 'stretch'
    ? t('action.stretch')
    : idleAction.action === 'yawn'
      ? t('action.yawn')
      : null
  const showIntro = state.introSeen !== true && !state.collapsed && !composing && isIdle
  const bubbleText = state.collapsed
    ? t('collapse.hint')
    : poke?.text
      ?? actionLine
      ?? (showIntro ? t('intro.hint') : moodLine(mascot, idleLine, hovering, showPeerList, showToolName, idleHoverIndex, t))
  const busy = BUSY_MOODS.includes(mascot.mood)
  const bubbleVisible = poke !== null
    || actionLine !== null
    || showIntro
    || mascot.until !== undefined
    || hovering
    || (state.bubbleAlways && (busy || popVisible))
  const showBadge = mascot.busyCount >= BADGE_MIN

  const box = visualBox(state.x, state.y, composing, window.innerWidth, window.innerHeight)
  const placement = trayPlacement(box.x, box.y, box.size, window.innerWidth, window.innerHeight)
  const rootClass = [
    css.root,
    dragging ? css.dragging : undefined,
    state.collapsed ? css.collapsed : undefined,
    composing ? css.mini : undefined,
  ].filter(Boolean).join(' ')
  const jumpId = jumpPeerId(mascot.peers)

  const pinTray = () => { setMenuOpen(true) }
  const closeTray = () => { setMenuOpen(false) }

  if (hidden) return null

  return (
    <div
      className={rootClass}
      style={{ left: box.x, top: box.y }}
      data-tray-side={placement.side}
      data-composing={composing ? 'true' : undefined}
      role="group"
      tabIndex={0}
      aria-label={t('widget.aria')}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onDoubleClick={onDoubleClick}
      onContextMenu={(event) => {
        event.preventDefault()
        pinTray()
      }}
      onMouseEnter={() => {
        onHoverEnter()
        holdTray()
      }}
      onMouseLeave={() => {
        setHovering(false)
        releaseTray()
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          setMenuOpen(false)
          return
        }
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
      <div className={css.character}>
        <Skin
          mood={mascot.mood}
          dragging={dragging}
          actionHref={state.collapsed ? null : idleAction.href}
          waitLong={waitLong}
        />
        {showBadge && !state.collapsed && (
          <div className={css.badge} role="status" aria-label={t('badge.label', { count: mascot.busyCount })}>
            {mascot.busyCount}
          </div>
        )}
      </div>
      {!state.collapsed && (
        <div
          className={`${css.tray}${trayHeld || menuOpen ? ` ${css.trayOpen}` : ''}`}
          data-side={placement.side}
          data-align={placement.align}
          role="toolbar"
          aria-label={t('menu.more')}
          onPointerDown={(event) => { event.stopPropagation() }}
          onMouseEnter={holdTray}
        >
          <TrayButton
            label={t('menu.nextSkin')}
            name="swap"
            onClick={() => {
              actions.setSkin(nextSkinId(state.skin))
              closeTray()
            }}
          />
          {jumpId !== undefined && (
            <TrayButton
              label={t('menu.jump')}
              name="jump"
              onClick={() => {
                openPeer(jumpId)
                closeTray()
              }}
            />
          )}
          <TrayButton
            label={t('menu.hide')}
            name="hide"
            onClick={() => {
              actions.setHidden(true)
              closeTray()
            }}
          />
          <TrayButton
            label={t('menu.settings')}
            name="settings"
            onClick={() => {
              openSettings()
              closeTray()
            }}
          />
        </div>
      )}
    </div>
  )
}

function TrayButton(props: {
  label: string
  name: TrayGlyphName
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className={css.trayBtn}
      aria-label={props.label}
      data-tip={props.label}
      onClick={(event) => {
        event.stopPropagation()
        props.onClick()
      }}
    >
      <TrayGlyph name={props.name} />
    </button>
  )
}

type TrayGlyphName = 'swap' | 'jump' | 'hide' | 'settings'

const TRAY_PATHS: Record<TrayGlyphName, string> = {
  swap: 'M4 5.5h8M12 5.5 9.5 3M12 5.5 9.5 8M12 10.5H4M4 10.5 6.5 8M4 10.5 6.5 13',
  jump: 'M6 3.5h6.5V10M12.5 3.5 6 10M3.5 8v4.5H10',
  hide: 'M3 8s2.2-4 5-4 5 4 5 4-2.2 4-5 4-5-4-5-4Z M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M4 12.5l8-9',
  settings: 'M3 5.5h10M3 10.5h10M6.5 5.5V3.5M9.5 10.5v2',
}

function TrayGlyph({ name }: { name: TrayGlyphName }) {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d={TRAY_PATHS[name]}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
