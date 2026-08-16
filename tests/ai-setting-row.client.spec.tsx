// @vitest-environment jsdom
/**
 * AI-setting-row specs: the General-settings switch row renders the current
 * preference and toggles the shared store.
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { useSyncExternalStore } from 'react'
import { createMascotStore } from '../src/client/mascot-store'
import { zh, type MascotKey } from '../src/client/locales'
import { AISettingRow, type AISettingRowProps } from '../src/client/AISettingRow'

afterEach(cleanup)

function translate(key: MascotKey): string {
  return zh[key]
}

function bench() {
  const store = createMascotStore().create()
  const props: AISettingRowProps = {
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

describe('AISettingRow', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders the preference row with the switch on by default', () => {
    const { props } = bench()
    const view = render(<AISettingRow {...props} />)
    expect(view.getByText('AI 小剧场')).not.toBeNull()
    expect(view.getByRole('switch').getAttribute('aria-checked')).toBe('true')
  })

  it('toggles the shared store and the switch state', () => {
    const { props, store } = bench()
    const view = render(<AISettingRow {...props} />)
    const toggle = view.getByRole('switch')

    fireEvent.click(toggle)
    expect(store.getSnapshot().aiLines).toBe(false)
    expect(toggle.getAttribute('aria-checked')).toBe('false')

    fireEvent.click(toggle)
    expect(store.getSnapshot().aiLines).toBe(true)
    expect(toggle.getAttribute('aria-checked')).toBe('true')
  })
})
