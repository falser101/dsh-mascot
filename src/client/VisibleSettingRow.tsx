/**
 * Companion-settings preference row: show or hide the overlay entirely.
 */
import type { PropsLocale, PropsStore } from '@deepseek-ai/dsh-client-ui-slots'
import { createMascotStore } from './mascot-store'
import type { NS } from './locales'
import css from './BubbleSettingRow.module.css'

export type VisibleSettingRowProps =
  PropsLocale<typeof NS>
  & PropsStore<ReturnType<typeof createMascotStore>>

export function VisibleSettingRow(props: VisibleSettingRowProps) {
  const { useStore, actions, t } = props
  const state = useStore(value => value)
  const visible = state.hidden !== true

  return (
    <div className={css.row}>
      <div className={css.rowText}>
        <div className={css.title}>{t('visible.title')}</div>
        <div className={css.desc}>{t('visible.description')}</div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={visible}
        className={`${css.switch}${visible ? ` ${css.switchOn}` : ''}`}
        onClick={() => { actions.setHidden(visible) }}
      >
        <span className={css.knob} aria-hidden="true" />
      </button>
    </div>
  )
}
