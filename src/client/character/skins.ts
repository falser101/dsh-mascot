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
  /** Playing idle-clip frame (data URI); when set, replaces the expression. */
  actionHref?: string | null
  /** Long wait: calm looping motion. */
  waitLong?: boolean
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

/** Cycle to the next installed skin (wraps). */
export function nextSkinId(id: SkinId): SkinId {
  const index = SKINS.findIndex(skin => skin.id === id)
  const next = SKINS[(index + 1 + SKINS.length) % SKINS.length]
  return next?.id ?? SKINS[0].id
}

const CAT_POKE_KEYS: readonly MascotKey[] = ['poke.cat.0', 'poke.cat.1', 'poke.cat.2', 'poke.cat.3']
const DOG_POKE_KEYS: readonly MascotKey[] = ['poke.dog.0', 'poke.dog.1', 'poke.dog.2', 'poke.dog.3']

/** Click-line keys for one skin: cats meow, dogs woof. */
export function pokeKeysOf(id: SkinId): readonly MascotKey[] {
  return skinOf(id).group === 'dog' ? DOG_POKE_KEYS : CAT_POKE_KEYS
}
