import type { PropsLocale, PropsStore } from '@deepseek-ai/dsh-client-ui-slots';
import { createMascotStore } from './mascot-store';
import type { NS } from './locales';
/** Full settings-row props: locale seat + shared store. */
export type CadenceSettingRowProps = PropsLocale<typeof NS> & PropsStore<ReturnType<typeof createMascotStore>>;
/**
 * Render the skin preference row with a menu selector.
 * @param props - composed settings-row props.
 */
export declare function CadenceSettingRow(props: CadenceSettingRowProps): import("react").JSX.Element;
