// @vitest-environment jsdom
/**
 * Companion settings page: heading plus the four preference rows.
 */
import { afterEach, describe, expect, it, beforeEach } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import { createMascotStore } from '../src/client/mascot-store'
import { zh, type MascotKey } from '../src/client/locales'
import { MascotSettingsSection, type MascotSettingsSectionProps } from '../src/client/MascotSettingsSection'

afterEach(cleanup)

function translate(key: MascotKey): string {
  return zh[key]
}

function bench() {
  const store = createMascotStore().create()
  const props: MascotSettingsSectionProps = {
    useStore: (selector) => selector(store.getSnapshot()),
    actions: store.actions,
    t: translate,
    close: () => {},
    useSessions: (() => undefined) as never,
    useWorkspaces: (() => undefined) as never,
  }
  return { store, props }
}

describe('MascotSettingsSection', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders a dedicated page with the preference rows', () => {
    const { props } = bench()
    const view = render(<MascotSettingsSection {...props} />)
    expect(view.getByRole('heading', { name: '悬浮伙伴' })).not.toBeNull()
    expect(view.getByText('调整悬浮伙伴的形象、气泡和闲置互动。')).not.toBeNull()
    expect(view.getByText('显示悬浮宠物')).not.toBeNull()
    expect(view.getByText('悬浮伙伴形象')).not.toBeNull()
    expect(view.getByText('显示状态气泡')).not.toBeNull()
    expect(view.getByText('气泡显示工具名')).not.toBeNull()
    expect(view.getByText('AI 小剧场')).not.toBeNull()
    expect(view.getByText('闲置弹出频率')).not.toBeNull()
  })
})
