/**
 * Cartoon orange-cat skin: a hand-drawn layered SVG. Parts are addressed by
 * class name and animated by mood via this module's CSS — ears twitch, the
 * tail wags, eyes blink/glance/squint, and mood-only extras (sweat drop,
 * tear, sparkle) fade in per state.
 */
import type { FC } from 'react';
import type { SkinProps } from './skins';
/**
 * The cat's SVG body. The root carries `data-mood`/`data-dragging` for the
 * CSS selector ladder; all geometry lives in the 120×120 viewBox.
 * @param props - skin props from the widget.
 */
export declare const CatSkin: FC<SkinProps>;
