/**
 * Mascot plugin, browser half: mounts the floating companion into the
 * frame-wide `shell.overlay` slot and its preference page into a dedicated
 * settings section. One store handle is shared by every entry (drag
 * position, collapsed flag, active skin, bubble preference — persisted),
 * and one {@link MascotSource} folds the current session's conversation
 * snapshot into the mood frame the overlay entry renders through its
 * inject `hooks` compartment.
 */
import type { ClientContext, SessionId } from '@deepseek-ai/dsh-client-runtime/client'
// Type-only: merge the locale service's ctx face.
import type {} from '@deepseek-ai/dsh-client-locale/client'
// Type-only: merge the 'shell.overlay' SlotMap row (declared by ui-layout).
import type {} from '@deepseek-ai/dsh-client-ui-layout/client'
// Type-only: merge the 'settings.section' SlotMap row (declared by ui-settings).
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import { en, NS, zh } from './locales'
import { createMascotStore } from './mascot-store'
import { MascotSource } from './mascot-source'
import { MascotLineSource } from './mascot-lines'
import { MascotView, type MascotViewInjected } from './MascotView'
import { tryOpenSettingsSection } from './open-settings'
import { MascotSettingsSection } from './MascotSettingsSection'
import { VisibleSettingRow } from './VisibleSettingRow'

/** Required services: the sessions list/bindings, the slot registry, and locale registration. */
export const inject = ['sessions', 'slots', 'locale']

/**
 * Client plugin body: register dictionaries, the mood source lifecycle, the
 * overlay entry, and the dedicated settings section. Every registration
 * and subscription rides the fiber's effect scope, so unload (and HMR)
 * removes all of them.
 * @param ctx - client root context.
 */
export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'mascot: dictionaries')

  const store = createMascotStore()
  const source = new MascotSource(ctx.sessions)
  ctx.effect(() => () => source.dispose(), 'mascot: mood source')

  // The idle-line rotator: fetches AI batches from the host route, degrades
  // silently to the built-in pool; the view syncs its AI toggle.
  const lines = new MascotLineSource({
    locale: () => (ctx.locale.getLocale().active === 'en' ? 'en' : 'zh'),
    fetchLines: async (locale) => {
      const response = await fetch(`/mascot/lines?locale=${encodeURIComponent(locale)}`)
      if (!response.ok) return []
      const body = await response.json() as { lines?: unknown }
      return Array.isArray(body.lines)
        ? body.lines.filter((entry): entry is string => typeof entry === 'string')
        : []
    },
  })
  lines.start()
  ctx.effect(() => () => lines.dispose(), 'mascot: line rotator')

  const t = ctx.locale.bind(NS)
  ctx.slots.inject('shell.overlay', () => ctx.slots.register({
    name: 'shell.overlay',
    id: 'ui-mascot',
    order: 0,
    locale: NS,
    store,
    inject: (): MascotViewInjected => ({
      hooks: { mascot: source, lines },
      openPeer: (sessionId) => { ctx.sessions.open(sessionId as SessionId) },
      openSettings: () => { tryOpenSettingsSection(t('nav')) },
      setAiLines: (enabled) => { lines.setAiEnabled(enabled) },
    }),
  }, MascotView))

  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: 'ui-mascot',
    order: 70,
    label: () => t('nav'),
    locale: NS,
    store,
  }, MascotSettingsSection))

  // Master show/hide also lives on General — that is the page people open
  // for a single switch, next to the old bubble row.
  ctx.slots.inject('settings.general.item', () => ctx.slots.register({
    name: 'settings.general.item',
    id: 'ui-mascot-visible',
    order: 55,
    locale: NS,
    store,
  }, VisibleSettingRow))
}
