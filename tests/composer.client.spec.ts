// @vitest-environment jsdom
/**
 * Composer-target detection: the resident seat, a loose textarea, not a dialog.
 */
import { describe, expect, it } from 'vitest'
import { isComposerTarget } from '../src/client/composer'

describe('isComposerTarget', () => {
  it('matches an element inside the conversation composer seat', () => {
    const seat = document.createElement('div')
    seat.setAttribute('data-composer-seat', '')
    const textarea = document.createElement('textarea')
    seat.appendChild(textarea)
    document.body.appendChild(seat)
    expect(isComposerTarget(textarea)).toBe(true)
    seat.remove()
  })

  it('matches a loose textarea and ignores dialog fields', () => {
    const textarea = document.createElement('textarea')
    document.body.appendChild(textarea)
    expect(isComposerTarget(textarea)).toBe(true)
    textarea.remove()

    const dialog = document.createElement('div')
    dialog.setAttribute('role', 'dialog')
    const inner = document.createElement('textarea')
    dialog.appendChild(inner)
    document.body.appendChild(dialog)
    expect(isComposerTarget(inner)).toBe(false)
    dialog.remove()
  })

  it('ignores the companion itself', () => {
    const pet = document.createElement('div')
    pet.setAttribute('role', 'group')
    document.body.appendChild(pet)
    expect(isComposerTarget(pet)).toBe(false)
    pet.remove()
  })
})
