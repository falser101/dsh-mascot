import type { SkinId, SkinProps } from './skins.ts';
/** ImageSkin adds the character folder id on top of the widget skin props. */
export interface ImageSkinProps extends SkinProps {
    /** Which docs/<character>/ sprite set to show. */
    character: SkinId;
    /** Long wait: calm the looping hop / sway so the pose clip can read. */
    waitLong?: boolean;
}
/**
 * The AI-generated character skin.
 * @param props - skin props from the widget plus the character folder id.
 */
export declare function ImageSkin({ mood, dragging, character, actionHref, waitLong }: ImageSkinProps): import("react").JSX.Element;
