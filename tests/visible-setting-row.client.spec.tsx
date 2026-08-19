// @vitest-environment jsdom
import { afterEach, describe, expect, it, beforeEach } from 'vitest'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { useSyncExternalStore } from 'react'
import { createMascotStore } from '../src/client/mascot-store'
import { zh, type MascotKey } from '../src/client/locales'
import { VisibleSettingRow, type VisibleSettingRowProps } from '../src/client/VisibleSettingRow'

afterEach(cleanup)

function bench() {
  const store = createMascotStore().create()
  const props: VisibleSettingRowProps = {
    useStore: (selector) => useSyncExternalStore(
      store.subscribe,
      () => selector(store.getSnapshot()),
    ),
    actions: store.actions,
    t: (key: MascotKey) => zh[key],
    useSessions: (() => undefined) as never,
    useWorkspaces: (() => undefined) as never,
  }
  return { store, props }
}

describe('VisibleSettingRow', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders on by default and hides the overlay when toggled', () => {
    const { props, store } = bench()
    const view = render(<VisibleSettingRow {...props} />)
    const toggle = view.getByRole('switch')
    expect(view.getByText('显示悬浮宠物')).not.toBeNull()
    expect(toggle.getAttribute('aria-checked')).toBe('true')
    fireEvent.click(toggle)
    expect(store.getSnapshot().hidden).toBe(true)
    expect(toggle.getAttribute('aria-checked')).toBe('false')
  })
})
