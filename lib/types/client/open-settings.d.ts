/**
 * Best-effort open of the host settings panel on the companion section.
 * The shell keeps open-state private; this clicks the shipped trigger and
 * the nav cell whose label matches ours. Missing chrome is a silent no-op.
 */
export declare function tryOpenSettingsSection(label: string, doc?: Document): boolean;
