/**
 * Skin registry: the switchable character looks. Each skin is a self-contained
 * SVG component whose parts (body, head, ears, eyes, mouth, tail, plus
 * mood-only extras like sweat/tear/sparkle) are driven by CSS keyed on the
 * skin root's `data-mood` / `data-dragging` attributes. Swapping in custom
 * art later means adding a new skin here (or replacing a component) without
 * touching any other plugin code.
 */
import type { FC } from 'react'
import type { MascotMood } from '../mascot-source.ts'
import type { MascotKey } from '../locales.ts'
import { CatSkin } from './CatSkin'
import { DogSkin } from './DogSkin'

/** A skin id; extend the union when a new skin joins the registry. */
export type SkinId = 'cat' | 'dog'

/** Props every skin component receives from the widget. */
export interface SkinProps {
  /** The current mood; drives the per-part animations. */
  mood: MascotMood
  /** True while the user drags the widget; pauses the character's own motion. */
  dragging: boolean
}

/** One switchable character look. */
export interface SkinDefinition {
  readonly id: SkinId
  /** Locale key of the skin's display label (settings row + switcher). */
  readonly labelKey: MascotKey
  /** The skin's SVG component. */
  readonly Component: FC<SkinProps>
}

/** The installed skins, in settings-row display order. */
export const SKINS: readonly SkinDefinition[] = [
  { id: 'cat', labelKey: 'skin.cat', Component: CatSkin },
  { id: 'dog', labelKey: 'skin.dog', Component: DogSkin },
]

/** Resolve one skin definition by id (fallback: the first installed skin). */
export function skinOf(id: SkinId): SkinDefinition {
  return SKINS.find(skin => skin.id === id) ?? SKINS[0]
}
