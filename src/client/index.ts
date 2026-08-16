/**
 * Mascot plugin, browser half: mounts the floating companion into the
 * frame-wide `shell.overlay` slot and its skin preference row into General
 * settings. One store handle is shared by both entries (drag position,
 * collapsed flag, active skin — persisted), and one {@link MascotSource}
 * folds the current session's conversation snapshot into the mood frame the
 * overlay entry renders through its inject `hooks` compartment.
 */
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
// Type-only: merge the locale service's ctx face.
import type {} from '@deepseek-ai/dsh-client-locale/client'
// Type-only: merge the 'shell.overlay' SlotMap row (declared by ui-layout).
import type {} from '@deepseek-ai/dsh-client-ui-layout/client'
// Type-only: merge the 'settings.general.item' SlotMap row (declared by ui-settings).
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import { en, NS, zh } from './locales'
import { createMascotStore } from './mascot-store'
import { MascotSource } from './mascot-source'
import { MascotView, type MascotViewInjected } from './MascotView'
import { SkinSettingRow } from './SkinSettingRow'

/** Required services: the sessions list/bindings, the slot registry, and locale registration. */
export const inject = ['sessions', 'slots', 'locale']

/**
 * Client plugin body: register dictionaries, the mood source lifecycle, the
 * overlay entry, and the settings row. Every registration and subscription
 * rides the fiber's effect scope, so unload (and HMR) removes all of them.
 * @param ctx - client root context.
 */
export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'mascot: dictionaries')

  const store = createMascotStore()
  const source = new MascotSource(ctx.sessions)
  ctx.effect(() => () => source.dispose(), 'mascot: mood source')

  ctx.slots.inject('shell.overlay', () => ctx.slots.register({
    name: 'shell.overlay',
    id: 'ui-mascot',
    order: 0,
    locale: NS,
    store,
    inject: (): MascotViewInjected => ({ hooks: { mascot: source } }),
  }, MascotView))

  ctx.slots.inject('settings.general.item', () => ctx.slots.register({
    name: 'settings.general.item',
    id: 'ui-mascot-skin',
    order: 60,
    locale: NS,
    store,
  }, SkinSettingRow))
}
