//#region lib/types/invariant.js
/**
* Package-owned invariant companion for `@falser101/mascot`.
* @module @falser101/mascot/invariant
*/
const PACKAGE_NAME = "@falser101/mascot";
/** Cordis companion plugin name. */
const name = "mascot-invariant";
/** Service required before the companion can reserve package ownership. */
const inject = ["invariants"];
/**
* No runtime invariant: the plugin is a pure presentation projection. It
* emits no cordis events and owns no cross-plugin mutable state; every
* subscription (sessions list, current session snapshot, transient timers)
* and both slot registrations are released by the same effect disposer, and
* the browser-plugin spec proves removal when the owning fiber is disposed.
*/
const install = () => {};
/**
* Register this package's invariant companion.
* @param ctx - Cordis context carrying the invariant service.
* @returns the installed registration's disposer after setup succeeds.
*/
const apply = (ctx) => Promise.resolve(ctx.invariants.register(PACKAGE_NAME, install));
//#endregion
export { apply, inject, name };
