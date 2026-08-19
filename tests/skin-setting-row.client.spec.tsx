// @vitest-environment jsdom
/**
 * Skin-setting-row specs: the breed picker renders grouped thumbnails and
 * writes the shared store when a card is clicked.
 */
import { afterEach, describe, expect, it, beforeEach } from 'vitest'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { useSyncExternalStore } from 'react'
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

describe('SkinSettingRow', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders grouped breed cards with the current skin selected', () => {
    const { props } = bench()
    const view = render(<SkinSettingRow {...props} />)
    expect(view.getByText('悬浮伙伴形象')).not.toBeNull()
    expect(view.getByText('猫咪')).not.toBeNull()
    expect(view.getByText('狗狗')).not.toBeNull()
    expect(view.getByRole('option', { name: '橘猫' }).getAttribute('aria-selected')).toBe('true')
  })

  it('switches the skin through a breed card', () => {
    const { props, store } = bench()
    const view = render(<SkinSettingRow {...props} />)
    fireEvent.click(view.getByRole('option', { name: '柴犬' }))
    expect(store.getSnapshot().skin).toBe('dog-shiba')
    expect(view.getByRole('option', { name: '柴犬' }).getAttribute('aria-selected')).toBe('true')
  })
})
