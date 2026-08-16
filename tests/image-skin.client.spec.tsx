// @vitest-environment jsdom
/**
 * ImageSkin specs: the AI-art skin composites the body and the mood-matched
 * expression frame, and blinks on a timer.
 */
import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, render } from '@testing-library/react'
import { ImageSkin } from '../src/client/character/ImageSkin'
import { CHARACTER_ASSETS } from '../src/client/character/generated'
import type { MascotMood } from '../src/client/mascot-source'

function faceUri(face: string): string {
  return `data:image/webp;base64,${CHARACTER_ASSETS[`face-${face}`]}`
}

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

function renderMood(mood: MascotMood) {
  return render(<ImageSkin mood={mood} dragging={false} />)
}

function faceOf(view: ReturnType<typeof render>) {
  const images = view.container.querySelectorAll('image')
  const face = images[images.length - 1]
  return face?.getAttribute('href') ?? ''
}

describe('ImageSkin', () => {
  it('renders the body art and a neutral face by default', () => {
    const view = renderMood('idle')
    const svg = view.container.querySelector('svg')
    expect(svg?.getAttribute('data-mood')).toBe('idle')
    expect(view.container.querySelectorAll('image').length).toBeGreaterThanOrEqual(2)
    expect(faceOf(view)).toBe(faceUri('neutral'))
  })

  it('switches the expression frame per mood', () => {
    const happy = renderMood('done')
    expect(faceOf(happy)).toBe(faceUri('happy'))
    happy.unmount()

    const sad = renderMood('error')
    expect(faceOf(sad)).toBe(faceUri('sad'))
    sad.unmount()

    const thinking = renderMood('thinking')
    expect(faceOf(thinking)).toBe(faceUri('thinking'))
  })

  it('blinks on a timer while the face is neutral', () => {
    vi.useFakeTimers()
    const view = renderMood('idle')
    expect(faceOf(view)).toBe(faceUri('neutral'))

    act(() => { vi.advanceTimersByTime(4000) })
    expect(faceOf(view)).toBe(faceUri('closed'))

    act(() => { vi.advanceTimersByTime(200) })
    expect(faceOf(view)).toBe(faceUri('neutral'))
  })

  it('does not blink over a non-neutral expression', () => {
    vi.useFakeTimers()
    const view = renderMood('done')
    act(() => { vi.advanceTimersByTime(4000) })
    expect(faceOf(view)).toBe(faceUri('happy'))
  })
})
