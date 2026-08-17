/**
 * Dedicated settings page for the floating companion. The four preference
 * rows used to live in General; they now stack here so the feature has its
 * own nav entry and does not mix with language / theme / composer rows.
 */
import type { PropsLocale, PropsRuntime, PropsStore } from '@deepseek-ai/dsh-client-ui-slots'
import { createMascotStore } from './mascot-store'
import type { NS } from './locales'
import { SkinSettingRow } from './SkinSettingRow'
import { BubbleSettingRow } from './BubbleSettingRow'
import { AISettingRow } from './AISettingRow'
import { CadenceSettingRow } from './CadenceSettingRow'
import css from './MascotSettingsSection.module.css'

/** Full section props: settings-page owner share + locale + shared store. */
export type MascotSettingsSectionProps =
  PropsRuntime<'settings.section'>
  & PropsLocale<typeof NS>
  & PropsStore<ReturnType<typeof createMascotStore>>

/**
 * Render the companion settings page.
 * @param props - composed section props.
 */
export function MascotSettingsSection(props: MascotSettingsSectionProps) {
  const { t } = props
  return (
    <div className={css.page}>
      <div className={css.heading}>
        <h2 className={css.title}>{t('nav')}</h2>
        <p className={css.lead}>{t('section.lead')}</p>
      </div>
      <div className={css.rows}>
        <SkinSettingRow {...props} />
        <BubbleSettingRow {...props} />
        <AISettingRow {...props} />
        <CadenceSettingRow {...props} />
      </div>
    </div>
  )
}
