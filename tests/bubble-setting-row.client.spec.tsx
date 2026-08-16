// @vitest-environment jsdom
/**
 * Bubble-setting-row specs: the General-settings switch row renders the
 * current preference and toggles the shared store.
 */
import { afterEach, describe, expect, it, beforeEach } from 'vitest'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { useSyncExternalStore } from 'react'
import { createMascotStore } from '../src/client/mascot-store'
import { zh, type MascotKey } from '../src/client/locales'
import { BubbleSettingRow, type BubbleSettingRowProps } from '../src/client/BubbleSettingRow'

afterEach(cleanup)

function translate(key: MascotKey): string {
  return zh[key]
}

function bench() {
  const store = createMascotStore().create()
  const props: BubbleSettingRowProps = {
    useStore: (selector) => useSyncExternalStore(
      store.subscribe,
      () => selector(store.getSnapshot()),
    ),
    actions: store.actions,
    t: translate,
    useSessions: (() => undefined) as never,
    useWorkspaces: (() => undefined) as never,
  }
  return { store, props }
}

describe('BubbleSettingRow', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders the preference row with the switch on by default', () => {
    const { props } = bench()
    const view = render(<BubbleSettingRow {...props} />)
    expect(view.getByText('忙碌时显示气泡')).not.toBeNull()
    const toggle = view.getByRole('switch')
    expect(toggle.getAttribute('aria-checked')).toBe('true')
  })

  it('toggles the shared store and the switch state', () => {
    const { props, store } = bench()
    const view = render(<BubbleSettingRow {...props} />)
    const toggle = view.getByRole('switch')

    fireEvent.click(toggle)
    expect(store.getSnapshot().bubbleAlways).toBe(false)
    expect(toggle.getAttribute('aria-checked')).toBe('false')

    fireEvent.click(toggle)
    expect(store.getSnapshot().bubbleAlways).toBe(true)
    expect(toggle.getAttribute('aria-checked')).toBe('true')
  })

  it('reflects a persisted off state at first render', () => {
    const { props, store } = bench()
    store.actions.setBubbleAlways(false)
    const view = render(<BubbleSettingRow {...props} />)
    expect(view.getByRole('switch').getAttribute('aria-checked')).toBe('false')
  })
})
