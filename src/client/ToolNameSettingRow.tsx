/**
 * Companion-settings preference row: name the running tool in the bubble.
 */
import type { PropsLocale, PropsStore } from '@deepseek-ai/dsh-client-ui-slots'
import { createMascotStore } from './mascot-store'
import type { NS } from './locales'
import css from './BubbleSettingRow.module.css'

export type ToolNameSettingRowProps =
  PropsLocale<typeof NS>
  & PropsStore<ReturnType<typeof createMascotStore>>

export function ToolNameSettingRow(props: ToolNameSettingRowProps) {
  const { useStore, actions, t } = props
  const state = useStore(value => value)
  const on = state.showToolName === true

  return (
    <div className={css.row}>
      <div className={css.rowText}>
        <div className={css.title}>{t('toolName.title')}</div>
        <div className={css.desc}>{t('toolName.description')}</div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        className={`${css.switch}${on ? ` ${css.switchOn}` : ''}`}
        onClick={() => { actions.setShowToolName(!on) }}
      >
        <span className={css.knob} aria-hidden="true" />
      </button>
    </div>
  )
}
