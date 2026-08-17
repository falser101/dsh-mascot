/**
 * Companion-settings preference row: the "always-visible busy bubble" switch.
 * Reads and writes the shared mascot store, so the toggle applies to the
 * overlay entry instantly and persists through the store's localStorage key.
 */
import type { PropsLocale, PropsStore } from '@deepseek-ai/dsh-client-ui-slots'
import { createMascotStore } from './mascot-store'
import type { NS } from './locales'
import css from './BubbleSettingRow.module.css'

/** Full settings-row props: locale seat + shared store. */
export type BubbleSettingRowProps =
  PropsLocale<typeof NS>
  & PropsStore<ReturnType<typeof createMascotStore>>

/**
 * Render the busy-bubble preference row with a switch.
 * @param props - composed settings-row props.
 */
export function BubbleSettingRow(props: BubbleSettingRowProps) {
  const { useStore, actions, t } = props
  const state = useStore(value => value)

  return (
    <div className={css.row}>
      <div className={css.rowText}>
        <div className={css.title}>{t('bubble.title')}</div>
        <div className={css.desc}>{t('bubble.description')}</div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={state.bubbleAlways}
        className={`${css.switch}${state.bubbleAlways ? ` ${css.switchOn}` : ''}`}
        onClick={() => { actions.setBubbleAlways(!state.bubbleAlways) }}
      >
        <span className={css.knob} aria-hidden="true" />
      </button>
    </div>
  )
}
