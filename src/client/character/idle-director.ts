/**
 * Idle action director: while the companion is idle, occasionally plays a
 * one-shot pose clip (stretch, yawn). Not a mood — session state stays on
 * the existing ladder. A skin with no clips is a no-op.
 */
import { useEffect, useRef, useState } from 'react'
import type { PopCadence } from '../mascot-store'

/** One-shot idle pose clip ids. */
export const IDLE_ACTIONS = ['stretch', 'yawn'] as const

/** One-shot idle pose clip id. */
export type IdleActionId = (typeof IDLE_ACTIONS)[number]

/** One playable clip: id plus in-order data-URI frames. */
export interface ActionClip {
  readonly id: IdleActionId
  readonly frames: readonly string[]
}

/** Default hold for an in-between pose. */
export const ACTION_FRAME_MS = 480

/** Extra hold on the peak pose so the stretch / yawn reads at 96px. */
export const ACTION_PEAK_EXTRA_MS = 520

/** Extra hold on the last pose so the cut back to idle is not abrupt. */
export const ACTION_LAST_EXTRA_MS = 280

/** Jittered gap between idle clips, per settings cadence. */
export const ACTION_INTERVALS: Record<PopCadence, { readonly minMs: number; readonly maxMs: number }> = {
  quiet: { minMs: 63_000, maxMs: 117_000 },
  standard: { minMs: 31_500, maxMs: 58_500 },
  lively: { minMs: 17_500, maxMs: 32_500 },
}

/**
 * Wait-clock milestones: [first yawn, then stretch]. Cadence only shifts
 * how soon the bigger pose arrives — the clock is session wait, not idle.
 */
export const WAIT_THRESHOLDS: Record<PopCadence, readonly [number, number]> = {
  quiet: [60_000, 180_000],
  standard: [30_000, 120_000],
  lively: [15_000, 45_000],
}

/** One wait-clock beat: when to play which clip. */
export interface WaitMilestone {
  readonly delayMs: number
  readonly action: IdleActionId
}

/**
 * Next wait-clock beat. Overdue milestones collapse to the latest one so a
 * remount mid-wait plays the bigger pose, not a yawn then a stretch back
 * to back. After stretch has fired, it repeats on the stretch interval.
 */
export function nextWaitMilestone(
  elapsedMs: number,
  fired: ReadonlySet<IdleActionId>,
  cadence: PopCadence,
): WaitMilestone | null {
  const [yawnAt, stretchAt] = WAIT_THRESHOLDS[cadence] ?? WAIT_THRESHOLDS.standard
  const marks: readonly { at: number; action: IdleActionId }[] = [
    { at: yawnAt, action: 'yawn' },
    { at: stretchAt, action: 'stretch' },
  ]
  const overdue = marks.filter(mark => elapsedMs >= mark.at && !fired.has(mark.action))
  if (overdue.length > 0) {
    return { delayMs: 0, action: overdue[overdue.length - 1]?.action ?? 'yawn' }
  }
  const upcoming = marks.find(mark => elapsedMs < mark.at)
  if (upcoming !== undefined) {
    return { delayMs: upcoming.at - elapsedMs, action: upcoming.action }
  }
  if (elapsedMs < stretchAt) return null
  const since = elapsedMs - stretchAt
  const remain = stretchAt - (since % stretchAt)
  return { delayMs: remain === 0 ? stretchAt : remain, action: 'stretch' }
}

/**
 * How long each frame stays visible. Two-frame clips (most breeds) get a
 * long settle + a long peak; longer clips keep a slow rise, a held peak,
 * and a held landing so the flipbook does not chatter.
 */
export function frameDurations(count: number): readonly number[] {
  if (count <= 0) return []
  if (count === 1) return [1_200]
  if (count === 2) return [700, 1_200]
  const peak = Math.min(2, count - 1)
  const last = count - 1
  return Array.from({ length: count }, (_, index) => {
    let ms = ACTION_FRAME_MS
    if (index === peak) ms += ACTION_PEAK_EXTRA_MS
    if (index === last && index !== peak) ms += ACTION_LAST_EXTRA_MS
    return ms
  })
}

/** Pick the next clip, avoiding an immediate repeat when both exist. */
export function pickAction(
  available: readonly IdleActionId[],
  last: IdleActionId | null,
  random: () => number = Math.random,
): IdleActionId | null {
  if (available.length === 0) return null
  if (available.length === 1) return available[0] ?? null
  const pool = last === null ? available : available.filter(id => id !== last)
  const choices = pool.length > 0 ? pool : available
  return choices[Math.floor(random() * choices.length)] ?? null
}

/** A jittered wait drawn from the cadence window. */
export function nextDelayMs(
  cadence: PopCadence,
  random: () => number = Math.random,
): number {
  const window = ACTION_INTERVALS[cadence] ?? ACTION_INTERVALS.standard
  const unit = Math.min(1, Math.max(0, random()))
  return Math.round(window.minMs + unit * (window.maxMs - window.minMs))
}

/** Inputs the widget feeds the director. */
export interface IdleDirectorOptions {
  /** True while uncollapsed and not dragging (idle ambient or a wait clock). */
  readonly enabled: boolean
  readonly cadence: PopCadence
  /** Clips that have enough frames for this skin. */
  readonly clips: readonly ActionClip[]
  /** Epoch ms when the current model-wait began; omit when not waiting. */
  readonly waitStartedAt?: number
}

/** Playing clip, or nothing. */
export interface IdleDirectorState {
  readonly action: IdleActionId | null
  readonly href: string | null
}

/**
 * Drive one-shot idle clips on a jittered cadence. Cancels immediately
 * when `enabled` drops. No-ops when there are no clips or the user
 * prefers reduced motion.
 */
function clipFor(action: IdleActionId, clips: readonly ActionClip[]): ActionClip | undefined {
  return clips.find(clip => clip.id === action) ?? clips[0]
}

export function useIdleDirector(options: IdleDirectorOptions): IdleDirectorState {
  const { enabled, cadence, clips, waitStartedAt } = options
  const [state, setState] = useState<IdleDirectorState>({ action: null, href: null })
  const lastRef = useRef<IdleActionId | null>(null)
  const clipsRef = useRef(clips)
  clipsRef.current = clips
  const clipKey = clips.map(clip => `${clip.id}:${clip.frames.length}`).join(',')

  useEffect(() => {
    if (!enabled || clipsRef.current.length === 0) {
      setState({ action: null, href: null })
      return
    }
    const reduced = typeof window !== 'undefined'
      && typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setState({ action: null, href: null })
      return
    }

    let cancelled = false
    let waitTimer: ReturnType<typeof setTimeout> | undefined
    let frameTimer: ReturnType<typeof setTimeout> | undefined
    const fired = new Set<IdleActionId>()

    const play = (clip: ActionClip, after: () => void) => {
      const durations = frameDurations(clip.frames.length)
      const step = (index: number) => {
        if (cancelled) return
        const href = clip.frames[index]
        if (href === undefined) {
          setState({ action: null, href: null })
          after()
          return
        }
        setState({ action: clip.id, href })
        frameTimer = setTimeout(() => { step(index + 1) }, durations[index] ?? ACTION_FRAME_MS)
      }
      step(0)
    }

    const scheduleIdle = () => {
      waitTimer = setTimeout(() => {
        if (cancelled) return
        const current = clipsRef.current
        const ids = current.map(clip => clip.id)
        const id = pickAction(ids, lastRef.current)
        const clip = current.find(entry => entry.id === id)
        if (clip === undefined) {
          scheduleIdle()
          return
        }
        lastRef.current = clip.id
        play(clip, scheduleIdle)
      }, nextDelayMs(cadence))
    }

    const scheduleWait = () => {
      if (waitStartedAt === undefined) return
      const elapsed = Date.now() - waitStartedAt
      const beat = nextWaitMilestone(elapsed, fired, cadence)
      if (beat === null) return
      waitTimer = setTimeout(() => {
        if (cancelled) return
        fired.add(beat.action)
        if (beat.action === 'stretch') fired.add('yawn')
        const clip = clipFor(beat.action, clipsRef.current)
        if (clip === undefined) {
          scheduleWait()
          return
        }
        lastRef.current = clip.id
        play(clip, scheduleWait)
      }, beat.delayMs)
    }

    if (waitStartedAt !== undefined) scheduleWait()
    else scheduleIdle()
    return () => {
      cancelled = true
      if (waitTimer !== undefined) clearTimeout(waitTimer)
      if (frameTimer !== undefined) clearTimeout(frameTimer)
    }
  }, [enabled, cadence, clipKey, waitStartedAt])

  return state
}
