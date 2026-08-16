/**
 * The floating companion view, mounted into the frame-wide `shell.overlay`
 * slot. Reads the shared mascot store (position, collapsed, skin) and the
 * inject-bound mood source; owns only component-local interaction state
 * (drag session, poke line). All presentation derives from the mood frame;
 * nothing here reaches the session or the model.
 */
import { useEffect, useRef, useState } from 'react'
import type {
  InjectFace, PropsLocale, PropsRuntime, PropsStore,
} from '@deepseek-ai/dsh-client-ui-slots'
import type { ObservableSnapshot } from '@deepseek-ai/dsh-client-runtime/client'
import type { MascotState } from './mascot-source'
import { createMascotStore, MASCOT_SIZE } from './mascot-store'
import { skinOf } from './character/skins'
import type { MascotKey, NS } from './locales'
import css from './MascotView.module.css'

/** Injectable face: the mood source bound as the `useMascot` selector hook. */
export interface MascotViewInjected {
  hooks: {
    /** Live mood frame of the current session. */
    mascot: ObservableSnapshot<MascotState>
  }
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
 * Render the draggable companion with its speech bubble.
 * @param props - composed overlay-entry props.
 */
export function MascotView(props: MascotViewProps) {
  const { useStore, actions, useMascot, t } = props
  const state = useStore(value => value)
  const mascot = useMascot(value => value)
  const [dragging, setDragging] = useState(false)
  const [poke, setPoke] = useState<{ text: string; nonce: number } | null>(null)
  const dragRef = useRef<DragSession | null>(null)
  const pokeCounter = useRef(0)

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

  const skin = skinOf(state.skin)
  const Skin = skin.Component
  const bubbleText = state.collapsed
    ? t('collapse.hint')
    : poke?.text ?? t(mascot.textKey, mascot.params)
  const bubbleVisible = poke !== null || mascot.until !== undefined

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
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          pokeNow()
        }
      }}
    >
      <div
        className={`${css.bubble}${bubbleVisible ? ` ${css.bubbleVisible}` : ''}`}
        data-visible={bubbleVisible}
        role="status"
        aria-live="polite"
      >
        {bubbleText}
      </div>
      {state.collapsed ? (
        <div className={css.dot} aria-hidden="true" />
      ) : (
        <div className={css.character}>
          <Skin mood={mascot.mood} dragging={dragging} />
        </div>
      )}
    </div>
  )
}
