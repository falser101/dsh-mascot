/**
 * AI-generated art skin: one full-body sprite per expression, all sharing
 * the same pose and framing. The visible frame swaps by mood (and blinks
 * on a timer); a playing idle clip (`actionHref`) replaces the expression
 * and pauses blink / breathe. Whole-figure motion is driven by `data-mood`.
 * Do not overlay a zoomed head on a body that already has a face.
 */
import { useEffect, useRef, useState } from 'react'
import type { MascotMood } from '../mascot-source'
import type { SkinId, SkinProps } from './skins.ts'
import { CHARACTER_ASSETS } from './generated.ts'
import css from './ImageSkin.module.css'

/** ImageSkin adds the character folder id on top of the widget skin props. */
export interface ImageSkinProps extends SkinProps {
  /** Which docs/<character>/ sprite set to show. */
  character: SkinId
  /** Long wait: calm the looping hop / sway so the pose clip can read. */
  waitLong?: boolean
}

/** Every source frame is a 1:1 full-body sprite with identical padding.
 *  Place the whole image in the viewBox so scale and position stay locked. */
const FRAME = { x: 4, y: 2, w: 112, h: 112 }

/** Faces that have a dedicated full-body sprite. */
const FACES = ['neutral', 'happy', 'sad', 'thinking', 'closed', 'working', 'streaming'] as const

/** Blink cadence: close every BLINK_MS for BLINK_CLOSED_MS. */
const BLINK_MS = 4000
const BLINK_CLOSED_MS = 200

/** Crossfade between action poses (and back to idle). Shorter than a frame. */
const CROSSFADE_MS = 320

/** Available expression frames (keys of CHARACTER_ASSETS). */
type Face = (typeof FACES)[number]

/** Expression per mood; transient moods reuse their settled counterpart. */
const FACE_BY_MOOD: Record<MascotMood, Face> = {
  idle: 'neutral',
  queued: 'neutral',
  confirming: 'thinking',
  thinking: 'thinking',
  working: 'working',
  streaming: 'streaming',
  done: 'happy',
  error: 'sad',
  greeting: 'happy',
  elsewhere: 'neutral',
}

/** One inlined data-URI for a face key of one character. */
function faceUri(character: SkinId, face: Face): string {
  const pack = CHARACTER_ASSETS[character]
  const data = pack[`face-${face}`] ?? pack['face-neutral']
  return `data:image/webp;base64,${data}`
}

/**
 * The AI-generated character skin.
 * @param props - skin props from the widget plus the character folder id.
 */
export function ImageSkin({ mood, dragging, character, actionHref, waitLong }: ImageSkinProps) {
  const [blinking, setBlinking] = useState(false)
  const playing = typeof actionHref === 'string' && actionHref.length > 0
  useEffect(() => {
    if (playing) {
      setBlinking(false)
      return
    }
    let closeTimer: ReturnType<typeof setTimeout> | undefined
    const interval = setInterval(() => {
      setBlinking(true)
      closeTimer = setTimeout(() => { setBlinking(false) }, BLINK_CLOSED_MS)
    }, BLINK_MS)
    return () => {
      clearInterval(interval)
      if (closeTimer !== undefined) clearTimeout(closeTimer)
    }
  }, [playing])
  const face: Face = blinking && FACE_BY_MOOD[mood] === 'neutral' ? 'closed' : FACE_BY_MOOD[mood]
  const href = playing ? actionHref : faceUri(character, face)
  const [shown, setShown] = useState(href)
  const [outgoing, setOutgoing] = useState<string | null>(null)
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => {
    if (href === shown) return
    setOutgoing(shown)
    setShown(href)
    if (fadeTimer.current !== undefined) clearTimeout(fadeTimer.current)
    fadeTimer.current = setTimeout(() => { setOutgoing(null) }, CROSSFADE_MS)
    return () => {
      if (fadeTimer.current !== undefined) clearTimeout(fadeTimer.current)
    }
  }, [href, shown])
  return (
    <svg
      className={css.root}
      data-mood={mood}
      data-dragging={dragging}
      data-action={playing ? 'true' : undefined}
      data-wait={waitLong ? 'long' : undefined}
      viewBox="0 0 120 120"
      role="img"
      aria-hidden="true"
    >
      <g className={css.body}>
        {FACES.map(pre => (
          <image key={`pre-${pre}`} href={faceUri(character, pre)} x="0" y="0" width="0" height="0" />
        ))}
        <image
          className={playing || outgoing !== null ? css.still : css.face}
          href={shown}
          x={FRAME.x}
          y={FRAME.y}
          width={FRAME.w}
          height={FRAME.h}
        />
        {outgoing !== null && (
          <image
            className={css.fadeOut}
            href={outgoing}
            x={FRAME.x}
            y={FRAME.y}
            width={FRAME.w}
            height={FRAME.h}
          />
        )}
      </g>
    </svg>
  )
}
