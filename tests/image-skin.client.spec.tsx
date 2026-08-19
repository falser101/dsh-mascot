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
  return `data:image/webp;base64,${CHARACTER_ASSETS.cat[`face-${face}`]}`
}

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

function renderMood(mood: MascotMood) {
  return render(<ImageSkin character="cat" mood={mood} dragging={false} />)
}

function faceOf(view: ReturnType<typeof render>) {
  const images = view.container.querySelectorAll('image')
  // Hidden preload images sit first; the current pose is the first full-size
  // frame (a fading previous pose, if any, is painted on top after it).
  const visible = [...images].find(node => node.getAttribute('width') !== '0')
  return visible?.getAttribute('href') ?? ''
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
    thinking.unmount()

    const working = renderMood('working')
    expect(faceOf(working)).toBe(faceUri('working'))
    working.unmount()

    const streaming = renderMood('streaming')
    expect(faceOf(streaming)).toBe(faceUri('streaming'))
    expect(CHARACTER_ASSETS.cat['face-working']).not.toBe(CHARACTER_ASSETS.cat['face-neutral'])
    expect(CHARACTER_ASSETS.cat['face-streaming']).not.toBe(CHARACTER_ASSETS.cat['face-working'])
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

  it('marks a long wait on the svg', () => {
    const view = render(<ImageSkin character="cat" mood="working" dragging={false} waitLong />)
    expect(view.container.querySelector('svg')?.getAttribute('data-wait')).toBe('long')
  })

  it('replaces the expression with a playing action frame', () => {
    const view = render(
      <ImageSkin character="cat" mood="idle" dragging={false} actionHref="data:action" />,
    )
    const svg = view.container.querySelector('svg')
    expect(svg?.getAttribute('data-action')).toBe('true')
    expect(faceOf(view)).toBe('data:action')
  })

  it('does not blink while an action clip is playing', () => {
    vi.useFakeTimers()
    const view = render(
      <ImageSkin character="cat" mood="idle" dragging={false} actionHref="data:action" />,
    )
    act(() => { vi.advanceTimersByTime(4000) })
    expect(faceOf(view)).toBe('data:action')
  })
})
