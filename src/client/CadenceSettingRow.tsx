/**
 * Companion-settings preference row: the idle pop-up cadence selector
 * (quiet / standard / lively). Reads and writes the shared mascot store,
 * so the choice applies to the overlay entry instantly and persists.
 */
import { useState } from 'react'
import type { PropsLocale, PropsStore } from '@deepseek-ai/dsh-client-ui-slots'
import { IconChevronDownOutline14, Menu } from '@deepseek-ai/dsh-client-ui-primitives'
import { createMascotStore, type PopCadence } from './mascot-store'
import type { MascotKey, NS } from './locales'
import css from './CadenceSettingRow.module.css'

/** Full settings-row props: locale seat + shared store. */
export type CadenceSettingRowProps =
  PropsLocale<typeof NS>
  & PropsStore<ReturnType<typeof createMascotStore>>

/** The three cadence levels, in settings display order. */
const CADENCE_OPTIONS: readonly {
  id: PopCadence
  label: MascotKey
}[] = [
  { id: 'quiet', label: 'cadence.quiet' },
  { id: 'standard', label: 'cadence.standard' },
  { id: 'lively', label: 'cadence.lively' },
]

/**
 * Render the skin preference row with a menu selector.
 * @param props - composed settings-row props.
 */
export function CadenceSettingRow(props: CadenceSettingRowProps) {
  const { useStore, actions, t } = props
  const state = useStore(value => value)
  const [open, setOpen] = useState(false)
  const selectedId: PopCadence = CADENCE_OPTIONS.some(option => option.id === state.popCadence)
    ? state.popCadence
    : 'standard'
  const selectedLabel = t(CADENCE_OPTIONS.find(option => option.id === selectedId)?.label ?? 'cadence.standard')

  return (
    <div className={css.row}>
      <div className={css.rowText}>
        <div className={css.title}>{t('cadence.title')}</div>
        <div className={css.desc}>{t('cadence.description')}</div>
      </div>
      <Menu
        open={open}
        onClose={() => { setOpen(false) }}
        items={CADENCE_OPTIONS.map(option => ({ id: option.id, label: t(option.label) }))}
        selectedId={selectedId}
        onSelect={(id) => {
          setOpen(false)
          actions.setPopCadence(id as PopCadence)
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
