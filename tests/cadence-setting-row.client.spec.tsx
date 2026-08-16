// @vitest-environment jsdom
/**
 * Cadence-setting-row specs: the General-settings cadence selector renders
 * the current level and switches the shared store.
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react'
import { useSyncExternalStore } from 'react'
import { createMascotStore } from '../src/client/mascot-store'
import { zh, type MascotKey } from '../src/client/locales'
import { CadenceSettingRow, type CadenceSettingRowProps } from '../src/client/CadenceSettingRow'

afterEach(cleanup)

function translate(key: MascotKey): string {
  return zh[key]
}

function bench() {
  const store = createMascotStore().create()
  const props: CadenceSettingRowProps = {
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

describe('CadenceSettingRow', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders the preference row with the standard level by default', () => {
    const { props } = bench()
    const view = render(<CadenceSettingRow {...props} />)
    expect(view.getByText('闲置弹出频率')).not.toBeNull()
    expect(view.getByText('标准')).not.toBeNull()
  })

  it('switches the cadence through the menu and updates the label', async () => {
    const { props, store } = bench()
    const view = render(<CadenceSettingRow {...props} />)

    fireEvent.click(view.getByRole('button'))
    await waitFor(() => expect(view.getByText('热闹')).not.toBeNull())
    fireEvent.click(view.getByText('热闹'))

    expect(store.getSnapshot().popCadence).toBe('lively')
    expect(view.getByText('热闹')).not.toBeNull()
  })
})
