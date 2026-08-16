/**
 * Cartoon cream-colored floppy-eared dog skin: a hand-drawn layered SVG with
 * the same part contract as the cat skin. The droopy ears sway, the tongue
 * pants while streaming, and the stub tail wags on greeting.
 */
import type { FC } from 'react'
import type { SkinProps } from './skins'
import css from './DogSkin.module.css'

/**
 * The dog's SVG body. The root carries `data-mood`/`data-dragging` for the
 * CSS selector ladder; all geometry lives in the 120×120 viewBox.
 * @param props - skin props from the widget.
 */
export const DogSkin: FC<SkinProps> = ({ mood, dragging }) => (
  <svg
    className={css.root}
    data-mood={mood}
    data-dragging={dragging}
    viewBox="0 0 120 120"
    role="img"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="mascot-dog-fur" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f6e3c4" />
        <stop offset="1" stopColor="#e4c193" />
      </linearGradient>
      <linearGradient id="mascot-dog-ear" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#e0b98c" />
        <stop offset="1" stopColor="#c69a68" />
      </linearGradient>
    </defs>

    {/* stub tail: curls out of the right hip */}
    <path
      className={css.tail}
      d="M 90 90 Q 106 88 102 72"
      fill="none"
      stroke="url(#mascot-dog-fur)"
      strokeWidth="9"
      strokeLinecap="round"
    />

    {/* body */}
    <ellipse className={css.body} cx="60" cy="94" rx="32" ry="22" fill="url(#mascot-dog-fur)" />

    {/* floppy ears (behind the head) */}
    <ellipse className={css.earL} cx="33" cy="54" rx="8.5" ry="19" transform="rotate(-16 33 54)" fill="url(#mascot-dog-ear)" />
    <ellipse className={css.earR} cx="87" cy="54" rx="8.5" ry="19" transform="rotate(16 87 54)" fill="url(#mascot-dog-ear)" />

    {/* head */}
    <ellipse className={css.head} cx="60" cy="58" rx="27" ry="25" fill="url(#mascot-dog-fur)" />

    {/* muzzle */}
    <ellipse className={css.muzzle} cx="60" cy="72" rx="13.5" ry="10" fill="#f8ecd4" />
    {/* nose */}
    <ellipse className={css.nose} cx="60" cy="68" rx="5.6" ry="4.4" fill="#4a3729" />
    {/* mouth */}
    <path
      className={css.mouth}
      d="M 52 77 Q 56 81.5 60 78 Q 64 81.5 68 77"
      fill="none"
      stroke="#6b4a3a"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
    {/* tongue (pants while streaming) */}
    <ellipse className={css.tongue} cx="60" cy="82" rx="4.2" ry="5.8" fill="#ff9e9e" />

    {/* blush */}
    <ellipse className={css.blush} cx="41" cy="62" rx="5.5" ry="3.4" fill="#ffb3a7" opacity="0.5" />
    <ellipse className={css.blush} cx="79" cy="62" rx="5.5" ry="3.4" fill="#ffb3a7" opacity="0.5" />

    {/* eyes: white base + pupil + glint, grouped so blink scales the pair */}
    <g className={css.eyeL}>
      <ellipse cx="48" cy="52" rx="5.6" ry="6.6" fill="#ffffff" />
      <circle cx="48.6" cy="53.6" r="2.9" fill="#3b2f2a" />
      <circle cx="47.6" cy="52.2" r="1" fill="#ffffff" />
    </g>
    <g className={css.eyeR}>
      <ellipse cx="72" cy="52" rx="5.6" ry="6.6" fill="#ffffff" />
      <circle cx="71.4" cy="53.6" r="2.9" fill="#3b2f2a" />
      <circle cx="70.4" cy="52.2" r="1" fill="#ffffff" />
    </g>

    {/* brow dots */}
    <circle className={css.browL} cx="48" cy="41" r="1.8" fill="#8a5a3a" />
    <circle className={css.browR} cx="72" cy="41" r="1.8" fill="#8a5a3a" />

    {/* mood extras, invisible until their mood activates them */}
    <path
      className={css.sweat}
      d="M 88 30 q 3.2 -6 6.4 0 q -3.2 4.6 -6.4 0 Z"
      fill="#7cc4f7"
    />
    <path
      className={css.tear}
      d="M 40 66 q 4.5 7.5 0 9.5 q -4.5 -2 0 -9.5 Z"
      fill="#9ad0f5"
    />
    <path
      className={css.sparkle}
      d="M 97 14 l 3.2 6.4 6.4 3.2 -6.4 3.2 -3.2 6.4 -3.2 -6.4 -6.4 -3.2 6.4 -3.2 Z"
      fill="#ffd166"
    />
  </svg>
)
