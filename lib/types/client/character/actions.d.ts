import { type ActionClip, type IdleActionId } from './idle-director.ts';
import type { SkinId } from './skins.ts';
/** In-order data-URIs for one clip on one skin (empty if the art is absent). */
export declare function actionFramesOf(character: SkinId, action: IdleActionId): string[];
/** Playable clips for one skin, in registry order. */
export declare function clipsOf(character: SkinId): ActionClip[];
