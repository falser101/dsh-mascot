/**
 * AI-generated art skin: one full-body sprite per expression, all sharing
 * the same pose and framing. The visible frame swaps by mood (and blinks
 * on a timer); whole-figure motion (breathe, hop, sway, shake, celebrate)
 * is driven by `data-mood` on the skin root. Do not overlay a zoomed head
 * on a body that already has a face — that is what produced the double head.
 */
import { useEffect, useState } from 'react'
import type { MascotMood } from '../mascot-source'
import type { SkinId, SkinProps } from './skins.ts'
import { CHARACTER_ASSETS } from './generated.ts'
import css from './ImageSkin.module.css'

/** ImageSkin adds the character folder id on top of the widget skin props. */
export interface ImageSkinProps extends SkinProps {
  /** Which docs/<character>/ sprite set to show. */
  character: SkinId
}

/** Every source frame is a 1:1 full-body sprite with identical padding.
 *  Place the whole image in the viewBox so scale and position stay locked. */
const FRAME = { x: 4, y: 2, w: 112, h: 112 }

/** Faces that have a dedicated full-body sprite. */
const FACES = ['neutral', 'happy', 'sad', 'thinking', 'closed'] as const

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

/** One inlined data-URI for a face key of one character. */
function faceUri(character: SkinId, face: Face): string {
  return `data:image/webp;base64,${CHARACTER_ASSETS[character][`face-${face}`]}`
}

/**
 * The AI-generated character skin.
 * @param props - skin props from the widget plus the character folder id.
 */
export function ImageSkin({ mood, dragging, character }: ImageSkinProps) {
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
        {FACES.map(pre => (
          <image key={`pre-${pre}`} href={faceUri(character, pre)} x="0" y="0" width="0" height="0" />
        ))}
        <image
          className={css.face}
          href={faceUri(character, face)}
          x={FRAME.x}
          y={FRAME.y}
          width={FRAME.w}
          height={FRAME.h}
        />
      </g>
    </svg>
  )
}
