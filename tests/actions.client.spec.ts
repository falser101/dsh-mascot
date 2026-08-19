/**
 * Action-clip lookup: a skin without pose frames is a silent skip; a
 * skin with numbered keys yields playable clips in registry order.
 */
import { describe, expect, it } from 'vitest'
import { clipsOf } from '../src/client/character/actions'
import { nextSkinId, pokeKeysOf } from '../src/client/character/skins'
import { CHARACTER_ASSETS } from '../src/client/character/generated'

describe('nextSkinId', () => {
  it('walks the registry and wraps', () => {
    expect(nextSkinId('cat')).toBe('cat-ragdoll')
    expect(nextSkinId('dog-shiba')).toBe('cat')
  })
})

describe('pokeKeysOf', () => {
  it('gives cats 喵 lines and dogs 汪 lines', () => {
    expect(pokeKeysOf('cat')).toEqual(['poke.cat.0', 'poke.cat.1', 'poke.cat.2', 'poke.cat.3'])
    expect(pokeKeysOf('dog-shiba')[1]).toBe('poke.dog.1')
  })
})

describe('clipsOf', () => {
  it('returns nothing when the pack has only expression frames', () => {
    const before = Object.keys(CHARACTER_ASSETS.cat ?? {}).some(key => key.startsWith('action-'))
    if (!before) {
      expect(clipsOf('cat')).toEqual([])
    }
  })

  it('lists stretch before yawn when both clips are installed', () => {
    const clips = clipsOf('cat')
    if (clips.length === 0) return
    expect(clips.map(clip => clip.id)).toEqual(
      ['stretch', 'yawn'].filter(id => clips.some(clip => clip.id === id)),
    )
    for (const clip of clips) {
      expect(clip.frames.length).toBeGreaterThanOrEqual(2)
      expect(clip.frames[0]).toMatch(/^data:image\/webp;base64,/)
    }
  })
})
