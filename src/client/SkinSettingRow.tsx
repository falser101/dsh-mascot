/**
 * Companion-settings breed picker: grouped thumbnail grid of the installed
 * cat and dog skins. Writes the shared mascot store so the overlay switches
 * instantly and the choice persists.
 */
import type { PropsLocale, PropsStore } from '@deepseek-ai/dsh-client-ui-slots'
import { createMascotStore } from './mascot-store'
import { SKINS, type SkinId } from './character/skins'
import { CHARACTER_ASSETS } from './character/generated'
import type { NS } from './locales'
import css from './SkinSettingRow.module.css'

/** Full settings-row props: locale seat + shared store. */
export type SkinSettingRowProps =
  PropsLocale<typeof NS>
  & PropsStore<ReturnType<typeof createMascotStore>>

const GROUPS = [
  { id: 'cat', labelKey: 'skin.group.cat' },
  { id: 'dog', labelKey: 'skin.group.dog' },
] as const

/** Neutral-face preview URI for one registered skin. */
function thumbUri(id: SkinId): string {
  return `data:image/webp;base64,${CHARACTER_ASSETS[id]['face-neutral']}`
}

/**
 * Render the breed picker.
 * @param props - composed settings-row props.
 */
export function SkinSettingRow(props: SkinSettingRowProps) {
  const { useStore, actions, t } = props
  const state = useStore(value => value)

  return (
    <div className={css.block}>
      <div className={css.rowText}>
        <div className={css.title}>{t('skin.title')}</div>
        <div className={css.desc}>{t('skin.description')}</div>
      </div>
      {GROUPS.map(group => (
        <div key={group.id} className={css.group}>
          <div className={css.groupLabel}>{t(group.labelKey)}</div>
          <div className={css.grid} role="listbox" aria-label={t(group.labelKey)}>
            {SKINS.filter(skin => skin.group === group.id).map(skin => {
              const selected = state.skin === skin.id
              return (
                <button
                  key={skin.id}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={selected ? `${css.card} ${css.cardOn}` : css.card}
                  onClick={() => { actions.setSkin(skin.id) }}
                >
                  <img className={css.thumb} src={thumbUri(skin.id)} alt="" />
                  <span className={css.cardLabel}>{t(skin.labelKey)}</span>
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
