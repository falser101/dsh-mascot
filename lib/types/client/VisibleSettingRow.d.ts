/**
 * Companion-settings preference row: show or hide the overlay entirely.
 */
import type { PropsLocale, PropsStore } from '@deepseek-ai/dsh-client-ui-slots';
import { createMascotStore } from './mascot-store';
import type { NS } from './locales';
export type VisibleSettingRowProps = PropsLocale<typeof NS> & PropsStore<ReturnType<typeof createMascotStore>>;
export declare function VisibleSettingRow(props: VisibleSettingRowProps): import("react").JSX.Element;
