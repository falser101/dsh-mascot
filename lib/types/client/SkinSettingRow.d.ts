import type { PropsLocale, PropsStore } from '@deepseek-ai/dsh-client-ui-slots';
import { createMascotStore } from './mascot-store';
import type { NS } from './locales';
/** Full settings-row props: runtime kit + locale seat + shared store. */
export type SkinSettingRowProps = PropsLocale<typeof NS> & PropsStore<ReturnType<typeof createMascotStore>>;
/**
 * Render the skin preference row with a menu selector.
 * @param props - composed settings-row props.
 */
export declare function SkinSettingRow(props: SkinSettingRowProps): import("react").JSX.Element;
