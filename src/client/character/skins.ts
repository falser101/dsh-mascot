/**
 * Skin registry: the switchable character looks. Each skin is the AI-art
 * ImageSkin bound to one character folder under docs/. Adding a new look
 * means dropping a folder of same-framed full-body sprites, running the
 * art-asset script, and registering the id here.
 */
import { createElement, type FC } from 'react'
import type { MascotMood } from '../mascot-source.ts'
import type { MascotKey } from '../locales.ts'
import { ImageSkin } from './ImageSkin'

/** A skin id; extend the union when a new character folder joins the registry. */
export type SkinId =
  | 'cat'
  | 'cat-ragdoll'
  | 'cat-maine'
  | 'cat-golden'
  | 'cat-silver'
  | 'dog'
  | 'dog-poodle'
  | 'dog-collie'
  | 'dog-corgi'
  | 'dog-shiba'

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
  /** Group used by the breed picker. */
  readonly group: 'cat' | 'dog'
  /** The skin's SVG component. */
  readonly Component: FC<SkinProps>
}

/** Bind ImageSkin to one character folder so the registry stays a plain list. */
function bindImageSkin(character: SkinId): FC<SkinProps> {
  const Bound = (props: SkinProps) => createElement(ImageSkin, { ...props, character })
  Bound.displayName = `ImageSkin(${character})`
  return Bound
}

/** The installed skins, in settings-row display order. */
export const SKINS: readonly SkinDefinition[] = [
  { id: 'cat', labelKey: 'skin.cat', group: 'cat', Component: bindImageSkin('cat') },
  { id: 'cat-ragdoll', labelKey: 'skin.cat-ragdoll', group: 'cat', Component: bindImageSkin('cat-ragdoll') },
  { id: 'cat-maine', labelKey: 'skin.cat-maine', group: 'cat', Component: bindImageSkin('cat-maine') },
  { id: 'cat-golden', labelKey: 'skin.cat-golden', group: 'cat', Component: bindImageSkin('cat-golden') },
  { id: 'cat-silver', labelKey: 'skin.cat-silver', group: 'cat', Component: bindImageSkin('cat-silver') },
  { id: 'dog', labelKey: 'skin.dog', group: 'dog', Component: bindImageSkin('dog') },
  { id: 'dog-poodle', labelKey: 'skin.dog-poodle', group: 'dog', Component: bindImageSkin('dog-poodle') },
  { id: 'dog-collie', labelKey: 'skin.dog-collie', group: 'dog', Component: bindImageSkin('dog-collie') },
  { id: 'dog-corgi', labelKey: 'skin.dog-corgi', group: 'dog', Component: bindImageSkin('dog-corgi') },
  { id: 'dog-shiba', labelKey: 'skin.dog-shiba', group: 'dog', Component: bindImageSkin('dog-shiba') },
]

/** Resolve one skin definition by id (fallback: the first installed skin). */
export function skinOf(id: SkinId): SkinDefinition {
  return SKINS.find(skin => skin.id === id) ?? SKINS[0]
}
