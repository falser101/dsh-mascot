/**
 * General-settings preference row: the "AI vignettes" switch (AI-generated
 * idle lines mixing into the rotation). Reads and writes the shared mascot
 * store, so the toggle applies to the rotator instantly and persists.
 */
import type { PropsLocale, PropsRuntime, PropsStore } from '@deepseek-ai/dsh-client-ui-slots'
import { createMascotStore } from './mascot-store'
import type { NS } from './locales'
import css from './BubbleSettingRow.module.css'

/** Full settings-row props: runtime kit + locale seat + shared store. */
export type AISettingRowProps =
  PropsRuntime<'settings.general.item'>
  & PropsLocale<typeof NS>
  & PropsStore<ReturnType<typeof createMascotStore>>

/**
 * Render the busy-bubble preference row with a switch.
 * @param props - composed settings-row props.
 */
export function AISettingRow(props: AISettingRowProps) {
  const { useStore, actions, t } = props
  const state = useStore(value => value)

  return (
    <div className={css.row}>
      <div className={css.rowText}>
        <div className={css.title}>{t('ai.title')}</div>
        <div className={css.desc}>{t('ai.description')}</div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={state.aiLines}
        className={`${css.switch}${state.aiLines ? ` ${css.switchOn}` : ''}`}
        onClick={() => { actions.setAiLines(!state.aiLines) }}
      >
        <span className={css.knob} aria-hidden="true" />
      </button>
    </div>
  )
}
