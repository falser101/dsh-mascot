/**
 * Companion-settings breed picker: grouped thumbnail grid of the installed
 * cat and dog skins. Writes the shared mascot store so the overlay switches
 * instantly and the choice persists.
 */
import type { PropsLocale, PropsStore } from '@deepseek-ai/dsh-client-ui-slots';
import { createMascotStore } from './mascot-store';
import type { NS } from './locales';
/** Full settings-row props: locale seat + shared store. */
export type SkinSettingRowProps = PropsLocale<typeof NS> & PropsStore<ReturnType<typeof createMascotStore>>;
/**
 * Render the breed picker.
 * @param props - composed settings-row props.
 */
export declare function SkinSettingRow(props: SkinSettingRowProps): import("react").JSX.Element;
