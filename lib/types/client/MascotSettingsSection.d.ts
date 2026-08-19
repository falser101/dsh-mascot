/**
 * Dedicated settings page for the floating companion. Preference rows
 * stack here so the feature has its own nav entry and does not mix with
 * language / theme / composer rows.
 */
import type { PropsLocale, PropsRuntime, PropsStore } from '@deepseek-ai/dsh-client-ui-slots';
import { createMascotStore } from './mascot-store';
import type { NS } from './locales';
/** Full section props: settings-page owner share + locale + shared store. */
export type MascotSettingsSectionProps = PropsRuntime<'settings.section'> & PropsLocale<typeof NS> & PropsStore<ReturnType<typeof createMascotStore>>;
/**
 * Render the companion settings page.
 * @param props - composed section props.
 */
export declare function MascotSettingsSection(props: MascotSettingsSectionProps): import("react").JSX.Element;
