/**
 * Look up idle pose clips from the inlined character pack. A clip needs
 * at least two frames to play; missing keys are a silent skip so a skin
 * without art still breathes.
 */
import { CHARACTER_ASSETS } from './generated.ts'
import { IDLE_ACTIONS, type ActionClip, type IdleActionId } from './idle-director.ts'
import type { SkinId } from './skins.ts'

/** Minimum frames before a clip is considered playable. */
const MIN_FRAMES = 2

/** In-order data-URIs for one clip on one skin (empty if the art is absent). */
export function actionFramesOf(character: SkinId, action: IdleActionId): string[] {
  const pack = CHARACTER_ASSETS[character]
  if (pack === undefined) return []
  const frames: string[] = []
  for (let index = 1; index <= 8; index += 1) {
    const data = pack[`action-${action}-${index}`]
    if (typeof data !== 'string' || data.length === 0) break
    frames.push(`data:image/webp;base64,${data}`)
  }
  return frames
}

/** Playable clips for one skin, in registry order. */
export function clipsOf(character: SkinId): ActionClip[] {
  const clips: ActionClip[] = []
  for (const id of IDLE_ACTIONS) {
    const frames = actionFramesOf(character, id)
    if (frames.length >= MIN_FRAMES) clips.push({ id, frames })
  }
  return clips
}
