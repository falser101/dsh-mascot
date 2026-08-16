/**
 * AI-generated art skin: the character's full-body image with expression
 * frames composited over the head area. The body drives whole-figure
 * animations (breathe, hop, sway, shake, celebrate) via the skin root's
 * `data-mood`; the expression frame switches per mood and blinks on a timer.
 * Geometry constants are layout tweaks (120×120 viewBox) — adjust when the
 * art is replaced.
 */
import { useEffect, useState } from 'react'
import type { MascotMood } from '../mascot-source'
import type { SkinProps } from './skins.ts'
import { CHARACTER_ASSETS } from './generated.ts'
import css from './ImageSkin.module.css'

/** Full-body art placement in the 120×120 viewBox (from docs/ analysis). */
const BODY = { x: 18, y: 9, w: 71, h: 100 }

/** Expression-frame overlay box. Must cover the FULL head of the body art
 *  (the body image includes its own face) so the expression frame is the
 *  only visible face; generous margins absorb pose differences. */
const HEAD = { x: 14, y: 3, w: 92, h: 64 }

/** Blink cadence: close every BLINK_MS for BLINK_CLOSED_MS. */
const BLINK_MS = 4000
const BLINK_CLOSED_MS = 200

/** Available expression frames (keys of CHARACTER_ASSETS). */
type Face = 'neutral' | 'happy' | 'sad' | 'thinking' | 'closed'

/** Expression per mood; transient moods reuse their settled counterpart. */
const FACE_BY_MOOD: Record<MascotMood, Face> = {
  idle: 'neutral',
  queued: 'neutral',
  confirming: 'thinking',
  thinking: 'thinking',
  working: 'neutral',
  streaming: 'neutral',
  done: 'happy',
  error: 'sad',
  greeting: 'happy',
  elsewhere: 'neutral',
}

/** One inlined data-URI for a face key. */
function faceUri(face: Face): string {
  return `data:image/webp;base64,${CHARACTER_ASSETS[`face-${face}`]}`
}

/**
 * The AI-generated character skin.
 * @param props - skin props from the widget.
 */
export function ImageSkin({ mood, dragging }: SkinProps) {
  const [blinking, setBlinking] = useState(false)
  useEffect(() => {
    const interval = setInterval(() => {
      setBlinking(true)
      setTimeout(() => { setBlinking(false) }, BLINK_CLOSED_MS)
    }, BLINK_MS)
    return () => { clearInterval(interval) }
  }, [])
  const face: Face = blinking && FACE_BY_MOOD[mood] === 'neutral' ? 'closed' : FACE_BY_MOOD[mood]
  return (
    <svg
      className={css.root}
      data-mood={mood}
      data-dragging={dragging}
      viewBox="0 0 120 120"
      role="img"
      aria-hidden="true"
    >
      <g className={css.body}>
        <image href={faceUri('neutral')} x="0" y="0" width="0" height="0" />
        <image href={`data:image/webp;base64,${CHARACTER_ASSETS.body}`} x={BODY.x} y={BODY.y} width={BODY.w} height={BODY.h} />
      </g>
      <image
        key={face}
        className={css.face}
        href={faceUri(face)}
        x={HEAD.x}
        y={HEAD.y}
        width={HEAD.w}
        height={HEAD.h}
      />
    </svg>
  )
}
