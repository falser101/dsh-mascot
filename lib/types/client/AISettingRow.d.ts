/**
 * General-settings preference row: the "AI vignettes" switch (AI-generated
 * idle lines mixing into the rotation). Reads and writes the shared mascot
 * store, so the toggle applies to the rotator instantly and persists.
 */
import type { PropsLocale, PropsRuntime, PropsStore } from '@deepseek-ai/dsh-client-ui-slots';
import { createMascotStore } from './mascot-store';
import type { NS } from './locales';
/** Full settings-row props: runtime kit + locale seat + shared store. */
export type AISettingRowProps = PropsRuntime<'settings.general.item'> & PropsLocale<typeof NS> & PropsStore<ReturnType<typeof createMascotStore>>;
/**
 * Render the busy-bubble preference row with a switch.
 * @param props - composed settings-row props.
 */
export declare function AISettingRow(props: AISettingRowProps): import("react").JSX.Element;
