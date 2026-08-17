/**
 * Skin registry: the switchable character looks. Each skin is the AI-art
 * ImageSkin bound to one character folder (docs/cat, docs/dog).
 */
import type { FC } from 'react';
import type { MascotMood } from '../mascot-source.ts';
import type { MascotKey } from '../locales.ts';
/** A skin id; extend the union when a new character folder joins the registry. */
export type SkinId = 'cat' | 'cat-ragdoll' | 'cat-maine' | 'cat-golden' | 'cat-silver' | 'dog' | 'dog-poodle' | 'dog-collie' | 'dog-corgi' | 'dog-shiba';
/** Props every skin component receives from the widget. */
export interface SkinProps {
    /** The current mood; drives the per-part animations. */
    mood: MascotMood;
    /** True while the user drags the widget; pauses the character's own motion. */
    dragging: boolean;
}
/** One switchable character look. */
export interface SkinDefinition {
    readonly id: SkinId;
    /** Locale key of the skin's display label (settings row + switcher). */
    readonly labelKey: MascotKey;
    /** Group used by the breed picker. */
    readonly group: 'cat' | 'dog';
    /** The skin's SVG component. */
    readonly Component: FC<SkinProps>;
}
/** The installed skins, in settings-row display order. */
export declare const SKINS: readonly SkinDefinition[];
/** Resolve one skin definition by id (fallback: the first installed skin). */
export declare function skinOf(id: SkinId): SkinDefinition;
