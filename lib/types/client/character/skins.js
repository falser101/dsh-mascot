import { CatSkin } from './CatSkin';
import { DogSkin } from './DogSkin';
/** The installed skins, in settings-row display order. */
export const SKINS = [
    { id: 'cat', labelKey: 'skin.cat', Component: CatSkin },
    { id: 'dog', labelKey: 'skin.dog', Component: DogSkin },
];
/** Resolve one skin definition by id (fallback: the first installed skin). */
export function skinOf(id) {
    return SKINS.find(skin => skin.id === id) ?? SKINS[0];
}
