/**
 * Companion-settings preference row: name the running tool in the bubble.
 */
import type { PropsLocale, PropsStore } from '@deepseek-ai/dsh-client-ui-slots';
import { createMascotStore } from './mascot-store';
import type { NS } from './locales';
export type ToolNameSettingRowProps = PropsLocale<typeof NS> & PropsStore<ReturnType<typeof createMascotStore>>;
export declare function ToolNameSettingRow(props: ToolNameSettingRowProps): import("react").JSX.Element;
