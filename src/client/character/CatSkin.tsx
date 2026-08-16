/**
 * Cartoon orange-cat skin: a hand-drawn layered SVG. Parts are addressed by
 * class name and animated by mood via this module's CSS — ears twitch, the
 * tail wags, eyes blink/glance/squint, and mood-only extras (sweat drop,
 * tear, sparkle) fade in per state.
 */
import type { FC } from 'react'
import type { SkinProps } from './skins'
import css from './CatSkin.module.css'

/**
 * The cat's SVG body. The root carries `data-mood`/`data-dragging` for the
 * CSS selector ladder; all geometry lives in the 120×120 viewBox.
 * @param props - skin props from the widget.
 */
export const CatSkin: FC<SkinProps> = ({ mood, dragging }) => (
  <svg
    className={css.root}
    data-mood={mood}
    data-dragging={dragging}
    viewBox="0 0 120 120"
    role="img"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="mascot-cat-fur" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f9c784" />
        <stop offset="1" stopColor="#e89a5b" />
      </linearGradient>
      <linearGradient id="mascot-cat-ear" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f2a86e" />
        <stop offset="1" stopColor="#e0834a" />
      </linearGradient>
    </defs>

    {/* tail: curls out of the right hip */}
    <path
      className={css.tail}
      d="M 90 92 Q 111 94 106 70 Q 103 56 92 60"
      fill="none"
      stroke="url(#mascot-cat-fur)"
      strokeWidth="9"
      strokeLinecap="round"
    />

    {/* body */}
    <ellipse className={css.body} cx="60" cy="94" rx="33" ry="22" fill="url(#mascot-cat-fur)" />

    {/* ears (back layer) */}
    <path className={css.earL} d="M 35 43 L 26 14 Q 32 9 41 16 L 50 33 Q 45 42 35 43 Z" fill="url(#mascot-cat-ear)" />
    <path className={css.earR} d="M 85 43 L 94 14 Q 88 9 79 16 L 70 33 Q 75 42 85 43 Z" fill="url(#mascot-cat-ear)" />
    <path className={css.earInL} d="M 36 38 L 30 19 Q 34 16 39 21 L 44 32 Q 41 38 36 38 Z" fill="#f7c8a0" />
    <path className={css.earInR} d="M 84 38 L 90 19 Q 86 16 81 21 L 76 32 Q 79 38 84 38 Z" fill="#f7c8a0" />

    {/* head */}
    <circle className={css.head} cx="60" cy="56" r="31" fill="url(#mascot-cat-fur)" />

    {/* whiskers */}
    <g className={css.whiskers} stroke="#c98f63" strokeWidth="1.4" strokeLinecap="round">
      <path d="M 27 57 L 13 54" />
      <path d="M 27 63 L 13 63" />
      <path d="M 27 69 L 15 72" />
      <path d="M 93 57 L 107 54" />
      <path d="M 93 63 L 107 63" />
      <path d="M 93 69 L 105 72" />
    </g>

    {/* blush */}
    <ellipse className={css.blush} cx="41" cy="63" rx="5.5" ry="3.4" fill="#ffb3a7" opacity="0.55" />
    <ellipse className={css.blush} cx="79" cy="63" rx="5.5" ry="3.4" fill="#ffb3a7" opacity="0.55" />

    {/* eyes: white base + pupil + glint, grouped so blink scales the pair */}
    <g className={css.eyeL}>
      <ellipse cx="48" cy="54" rx="5.6" ry="6.6" fill="#ffffff" />
      <circle cx="48.6" cy="55.6" r="2.9" fill="#3b2f2a" />
      <circle cx="47.6" cy="54.2" r="1" fill="#ffffff" />
    </g>
    <g className={css.eyeR}>
      <ellipse cx="72" cy="54" rx="5.6" ry="6.6" fill="#ffffff" />
      <circle cx="71.4" cy="55.6" r="2.9" fill="#3b2f2a" />
      <circle cx="70.4" cy="54.2" r="1" fill="#ffffff" />
    </g>

    {/* nose + mouth */}
    <path className={css.nose} d="M 57 65 L 63 65 L 60 69 Z" fill="#e8836f" />
    <path
      className={css.mouth}
      d="M 52 71 Q 55.5 76 60 71.5 Q 64.5 76 68 71"
      fill="none"
      stroke="#6b4a3a"
      strokeWidth="1.8"
      strokeLinecap="round"
    />

    {/* mood extras, invisible until their mood activates them */}
    <path
      className={css.sweat}
      d="M 88 32 q 3.2 -6 6.4 0 q -3.2 4.6 -6.4 0 Z"
      fill="#7cc4f7"
    />
    <path
      className={css.tear}
      d="M 40 68 q 4.5 7.5 0 9.5 q -4.5 -2 0 -9.5 Z"
      fill="#9ad0f5"
    />
    <path
      className={css.sparkle}
      d="M 97 16 l 3.2 6.4 6.4 3.2 -6.4 3.2 -3.2 6.4 -3.2 -6.4 -6.4 -3.2 6.4 -3.2 Z"
      fill="#ffd166"
    />
  </svg>
)
