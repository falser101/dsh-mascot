/**
 * Package-owned invariant companion for `@falser101/mascot`.
 * @module @falser101/mascot/invariant
 */

/* jscpd:ignore-start */
import type { Context } from '@deepseek-ai/cordis'
import type { InvariantInstaller } from '@deepseek-ai/dsh-invariants'

const PACKAGE_NAME = '@falser101/mascot'

/** Cordis companion plugin name. */
export const name = 'mascot-invariant'
/** Service required before the companion can reserve package ownership. */
export const inject = ['invariants']

/**
 * No runtime invariant: the plugin is a pure presentation projection. It
 * emits no cordis events and owns no cross-plugin mutable state; every
 * subscription (sessions list, current session snapshot, transient timers)
 * and both slot registrations are released by the same effect disposer, and
 * the browser-plugin spec proves removal when the owning fiber is disposed.
 */
const install: InvariantInstaller = () => {}

/**
 * Register this package's invariant companion.
 * @param ctx - Cordis context carrying the invariant service.
 * @returns the installed registration's disposer after setup succeeds.
 */
export const apply = (ctx: Context): Promise<() => void> =>
  Promise.resolve(ctx.invariants.register(PACKAGE_NAME, install))
/* jscpd:ignore-end */
