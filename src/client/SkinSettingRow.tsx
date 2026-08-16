/**
 * General-settings preference row: the companion's active skin selector.
 * Reads and writes the shared mascot store, so the choice applies to the
 * overlay entry instantly and persists through the store's localStorage key.
 */
import { useState } from 'react'
import type { PropsLocale, PropsRuntime, PropsStore } from '@deepseek-ai/dsh-client-ui-slots'
import { IconChevronDownOutline14, Menu } from '@deepseek-ai/dsh-client-ui-primitives'
import { createMascotStore } from './mascot-store'
import { SKINS, skinOf, type SkinId } from './character/skins'
import type { NS } from './locales'
import css from './SkinSettingRow.module.css'

/** Full settings-row props: runtime kit + locale seat + shared store. */
export type SkinSettingRowProps =
  PropsRuntime<'settings.general.item'>
  & PropsLocale<typeof NS>
  & PropsStore<ReturnType<typeof createMascotStore>>

/**
 * Render the skin preference row with a menu selector.
 * @param props - composed settings-row props.
 */
export function SkinSettingRow(props: SkinSettingRowProps) {
  const { useStore, actions, t } = props
  const state = useStore(value => value)
  const [open, setOpen] = useState(false)
  const selectedLabel = t(skinOf(state.skin).labelKey)

  return (
    <div className={css.row}>
      <div className={css.rowText}>
        <div className={css.title}>{t('skin.title')}</div>
        <div className={css.desc}>{t('skin.description')}</div>
      </div>
      <Menu
        open={open}
        onClose={() => { setOpen(false) }}
        items={SKINS.map(skin => ({ id: skin.id, label: t(skin.labelKey) }))}
        selectedId={state.skin}
        onSelect={(id) => {
          setOpen(false)
          actions.setSkin(id as SkinId)
        }}
        align="end"
        portal
        anchor={(
          <button
            type="button"
            className={css.selector}
            aria-haspopup="menu"
            aria-expanded={open}
            onClick={() => { setOpen(value => !value) }}
          >
            {selectedLabel}
            <IconChevronDownOutline14 className={css.chevron} />
          </button>
        )}
      />
    </div>
  )
}
