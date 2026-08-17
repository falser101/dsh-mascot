/**
 * General-settings preference row: the "always-visible busy bubble" switch.
 * Reads and writes the shared mascot store, so the toggle applies to the
 * overlay entry instantly and persists through the store's localStorage key.
 */
import type { PropsLocale, PropsStore } from '@deepseek-ai/dsh-client-ui-slots';
import { createMascotStore } from './mascot-store';
import type { NS } from './locales';
/** Full settings-row props: runtime kit + locale seat + shared store. */
export type BubbleSettingRowProps = PropsLocale<typeof NS> & PropsStore<ReturnType<typeof createMascotStore>>;
/**
 * Render the busy-bubble preference row with a switch.
 * @param props - composed settings-row props.
 */
export declare function BubbleSettingRow(props: BubbleSettingRowProps): import("react").JSX.Element;
