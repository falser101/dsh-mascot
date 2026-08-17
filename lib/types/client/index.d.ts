/**
 * Mascot plugin, browser half: mounts the floating companion into the
 * frame-wide `shell.overlay` slot and its preference page into a dedicated
 * settings section. One store handle is shared by every entry (drag
 * position, collapsed flag, active skin, bubble preference — persisted),
 * and one {@link MascotSource} folds the current session's conversation
 * snapshot into the mood frame the overlay entry renders through its
 * inject `hooks` compartment.
 */
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client';
/** Required services: the sessions list/bindings, the slot registry, and locale registration. */
export declare const inject: string[];
/**
 * Client plugin body: register dictionaries, the mood source lifecycle, the
 * overlay entry, and the dedicated settings section. Every registration
 * and subscription rides the fiber's effect scope, so unload (and HMR)
 * removes all of them.
 * @param ctx - client root context.
 */
export declare function apply(ctx: ClientContext): void;
