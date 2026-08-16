// @vitest-environment jsdom
/**
 * Skin-setting-row specs: the General-settings preference row renders the
 * current skin label, opens the menu, and switches the shared store.
 */
import { afterEach, describe, expect, it, beforeEach } from 'vitest'
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react'
import { createMascotStore } from '../src/client/mascot-store'
import { zh, type MascotKey } from '../src/client/locales'
import { SkinSettingRow, type SkinSettingRowProps } from '../src/client/SkinSettingRow'

afterEach(cleanup)

function translate(key: MascotKey): string {
  return zh[key]
}

function bench() {
  const store = createMascotStore().create()
  const props: SkinSettingRowProps = {
    useStore: (selector) => selector(store.getSnapshot()),
    actions: store.actions,
    t: translate,
    useSessions: (() => undefined) as never,
    useWorkspaces: (() => undefined) as never,
  }
  return { store, props }
}

describe('SkinSettingRow', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders the preference row with the current skin label', () => {
    const { props } = bench()
    const view = render(<SkinSettingRow {...props} />)
    expect(view.getByText('悬浮伙伴形象')).not.toBeNull()
    expect(view.getByText('选择悬浮在界面上的小伙伴')).not.toBeNull()
    expect(view.getByText('猫咪')).not.toBeNull()
  })

  it('switches the skin through the menu and updates the label', async () => {
    const { props, store } = bench()
    const view = render(<SkinSettingRow {...props} />)

    fireEvent.click(view.getByRole('button'))
    await waitFor(() => expect(view.getByText('狗狗')).not.toBeNull())
    fireEvent.click(view.getByText('狗狗'))

    expect(store.getSnapshot().skin).toBe('dog')
    expect(view.getByText('狗狗')).not.toBeNull()
  })
})
