// @vitest-environment jsdom
/**
 * Mascot store unit tests: default corner position, the three actions, the
 * localStorage persistence round-trip, and the read-only snapshot contract.
 */
import { describe, expect, it, beforeEach } from 'vitest'
import { createMascotStore, MASCOT_SIZE } from '../src/client/mascot-store'

describe('createMascotStore', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('defaults to the bottom-right corner with the cat skin expanded', () => {
    const store = createMascotStore().create()
    expect(store.getSnapshot()).toEqual({
      x: window.innerWidth - MASCOT_SIZE - 24,
      y: window.innerHeight - MASCOT_SIZE - 24,
      collapsed: false,
      skin: 'cat',
      bubbleAlways: true,
      aiLines: true,
    })
  })

  it('moves, collapses, switches skin, and toggles the bubble through the baked actions', () => {
    const store = createMascotStore().create()
    store.actions.move(30, 40)
    store.actions.setCollapsed(true)
    store.actions.setSkin('dog')
    store.actions.setBubbleAlways(false)
    expect(store.getSnapshot()).toMatchObject({
      x: 30, y: 40, collapsed: true, skin: 'dog', bubbleAlways: false,
    })
  })

  it('notifies subscribers on every action', () => {
    const store = createMascotStore().create()
    const seen: unknown[] = []
    store.subscribe(() => { seen.push(store.getSnapshot().skin) })
    store.actions.setSkin('dog')
    expect(seen).toEqual(['dog'])
  })

  it('persists the whole value under the documented key and restores it on a fresh instance', () => {
    const first = createMascotStore().create()
    first.actions.move(111, 222)
    first.actions.setCollapsed(true)
    first.actions.setSkin('dog')
    first.actions.setBubbleAlways(false)

    const second = createMascotStore().create()
    expect(second.getSnapshot()).toMatchObject({
      x: 111, y: 222, collapsed: true, skin: 'dog', bubbleAlways: false,
    })
    expect(localStorage.getItem('dsh-client-ui-mascot')).not.toBeNull()
  })

  it('leaves the persisted value alone when storage is unavailable', () => {
    const original = globalThis.localStorage
    Object.defineProperty(globalThis, 'localStorage', { value: undefined, configurable: true })
    try {
      const store = createMascotStore().create()
      expect(store.getSnapshot().x).toBeGreaterThanOrEqual(0)
    } finally {
      Object.defineProperty(globalThis, 'localStorage', { value: original, configurable: true })
    }
  })
})
