// @vitest-environment jsdom
import { afterEach, describe, expect, it, beforeEach } from 'vitest'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { useSyncExternalStore } from 'react'
import { createMascotStore } from '../src/client/mascot-store'
import { zh, type MascotKey } from '../src/client/locales'
import { ToolNameSettingRow, type ToolNameSettingRowProps } from '../src/client/ToolNameSettingRow'

afterEach(cleanup)

function bench() {
  const store = createMascotStore().create()
  const props: ToolNameSettingRowProps = {
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

describe('ToolNameSettingRow', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders off by default and turns tool names on', () => {
    const { props, store } = bench()
    const view = render(<ToolNameSettingRow {...props} />)
    const toggle = view.getByRole('switch')
    expect(toggle.getAttribute('aria-checked')).toBe('false')
    fireEvent.click(toggle)
    expect(store.getSnapshot().showToolName).toBe(true)
    expect(toggle.getAttribute('aria-checked')).toBe('true')
  })
})
