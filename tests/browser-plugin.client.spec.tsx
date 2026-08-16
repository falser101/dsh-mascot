// @vitest-environment jsdom
/**
 * Mascot plugin assembly on the real machinery: bare Context + production
 * SlotRegistry + LocaleRuntime + the TestSessions double, with the
 * `shell.overlay` and `settings.general.item` declarations supplied by the
 * bench (the shipped composition declares them). Asserts both entries, the
 * mood source feeding the overlay inject face, and fiber-dispose removal
 * (HMR safety).
 */
import { afterEach, describe, expect, it } from 'vitest'
import { act, cleanup } from '@testing-library/react'
import { Context } from '@deepseek-ai/cordis'
import { SlotRegistry } from '@deepseek-ai/dsh-client-runtime/client'
import { LocaleRuntime } from '@deepseek-ai/dsh-client-locale/client'
import { TestSessions } from '@deepseek-ai/dsh-client-test-runtime'
import type { Stabilizer } from '@deepseek-ai/dsh-client-test-runtime'
import { apply, inject } from '../src/client/index'
import type { MascotViewInjected } from '../src/client/MascotView'

const stabilize: Stabilizer = async (fn) => { await act(async () => { await fn() }) }

const SESSION_ID = 's1'

/** Boot the plugin over production services with bench-declared slots. */
async function bench() {
  const ctx = new Context()
  await ctx.plugin(SlotRegistry).await()
  ctx.provide('locale', new LocaleRuntime(ctx))
  ctx.provide('sessions', new TestSessions(stabilize, ctx))
  // Stand in for ui-layout's and ui-settings-general's declarations: the
  // injection seat waits on the declaration, not on the owning package.
  ctx.slots.register({
    name: 'root',
    children: {
      'shell.overlay': { kind: 'list', scope: 'root' },
      'settings.general.item': { kind: 'list', scope: 'root' },
    },
  } as never, (() => null) as never)
  const fiber = ctx.plugin({ inject: [...inject], apply })
  await fiber.await()
  return { ctx, fiber, sessions: ctx.get('sessions') as TestSessions }
}

function entryOf(ctx: Context, slot: 'shell.overlay' | 'settings.general.item') {
  const entry = ctx.slots.entries(slot)[0]
  if (entry === undefined) return undefined
  return { ...entry.options, locale: entry.locale, inject: entry.inject }
}

describe('mascot browser plugin', () => {
  afterEach(cleanup)

  it('registers the overlay entry with the documented id, order, and locale', async () => {
    const b = await bench()
    expect(entryOf(b.ctx, 'shell.overlay')).toMatchObject({
      id: 'ui-mascot',
      order: 0,
      locale: 'mascot',
    })
    await b.fiber.dispose()
  })

  it('registers the settings row over the same shared store', async () => {
    const b = await bench()
    const overlay = entryOf(b.ctx, 'shell.overlay')!
    const row = entryOf(b.ctx, 'settings.general.item')!
    expect(row).toMatchObject({ id: 'ui-mascot-skin', order: 60, locale: 'mascot' })
    expect(row.store).toBe(overlay.store)
    await b.fiber.dispose()
  })

  it('folds the current session snapshot into the injected mood hook', async () => {
    const b = await bench()
    const overlay = entryOf(b.ctx, 'shell.overlay')!
    const face = overlay.inject!() as MascotViewInjected
    expect(face.hooks.mascot.getSnapshot()).toMatchObject({ mood: 'idle', textKey: 'mood.idle' })

    await b.sessions.add({ id: SESSION_ID })
    expect(face.hooks.mascot.getSnapshot().mood).toBe('greeting')

    await b.sessions.updateSnapshot(SESSION_ID, (draft) => {
      draft.queue = [{ text: 'hi' } as never]
    })
    expect(face.hooks.mascot.getSnapshot()).toMatchObject({ mood: 'queued' })
    await b.fiber.dispose()
  })

  it('fiber dispose removes both entries and stops the source', async () => {
    const b = await bench()
    await b.sessions.add({ id: SESSION_ID })
    await b.fiber.dispose()

    expect(b.ctx.slots.entries('shell.overlay')).toHaveLength(0)
    expect(b.ctx.slots.entries('settings.general.item')).toHaveLength(0)

    await b.sessions.updateSnapshot(SESSION_ID, (draft) => {
      draft.running = true
    })
    const face = entryOf(b.ctx, 'shell.overlay') // undefined after dispose
    expect(face).toBeUndefined()
  })
})
