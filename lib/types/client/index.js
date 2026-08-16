import { en, NS, zh } from './locales';
import { createMascotStore } from './mascot-store';
import { MascotSource } from './mascot-source';
import { MascotView } from './MascotView';
import { SkinSettingRow } from './SkinSettingRow';
import { BubbleSettingRow } from './BubbleSettingRow';
/** Required services: the sessions list/bindings, the slot registry, and locale registration. */
export const inject = ['sessions', 'slots', 'locale'];
/**
 * Client plugin body: register dictionaries, the mood source lifecycle, the
 * overlay entry, and the two settings rows. Every registration and
 * subscription rides the fiber's effect scope, so unload (and HMR) removes
 * all of them.
 * @param ctx - client root context.
 */
export function apply(ctx) {
    ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'mascot: dictionaries');
    const store = createMascotStore();
    const source = new MascotSource(ctx.sessions);
    ctx.effect(() => () => source.dispose(), 'mascot: mood source');
    ctx.slots.inject('shell.overlay', () => ctx.slots.register({
        name: 'shell.overlay',
        id: 'ui-mascot',
        order: 0,
        locale: NS,
        store,
        inject: () => ({ hooks: { mascot: source } }),
    }, MascotView));
    ctx.slots.inject('settings.general.item', () => ctx.slots.register({
        name: 'settings.general.item',
        id: 'ui-mascot-skin',
        order: 60,
        locale: NS,
        store,
    }, SkinSettingRow));
    ctx.slots.inject('settings.general.item', () => ctx.slots.register({
        name: 'settings.general.item',
        id: 'ui-mascot-bubble',
        order: 70,
        locale: NS,
        store,
    }, BubbleSettingRow));
}
