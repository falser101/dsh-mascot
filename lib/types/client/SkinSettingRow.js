import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * General-settings preference row: the companion's active skin selector.
 * Reads and writes the shared mascot store, so the choice applies to the
 * overlay entry instantly and persists through the store's localStorage key.
 */
import { useState } from 'react';
import { IconChevronDownOutline14, Menu } from '@deepseek-ai/dsh-client-ui-primitives';
import { createMascotStore } from './mascot-store';
import { SKINS, skinOf } from './character/skins';
import css from './SkinSettingRow.module.css';
/**
 * Render the skin preference row with a menu selector.
 * @param props - composed settings-row props.
 */
export function SkinSettingRow(props) {
    const { useStore, actions, t } = props;
    const state = useStore(value => value);
    const [open, setOpen] = useState(false);
    const selectedLabel = t(skinOf(state.skin).labelKey);
    return (_jsxs("div", { className: css.row, children: [_jsxs("div", { className: css.rowText, children: [_jsx("div", { className: css.title, children: t('skin.title') }), _jsx("div", { className: css.desc, children: t('skin.description') })] }), _jsx(Menu, { open: open, onClose: () => { setOpen(false); }, items: SKINS.map(skin => ({ id: skin.id, label: t(skin.labelKey) })), selectedId: state.skin, onSelect: (id) => {
                    setOpen(false);
                    actions.setSkin(id);
                }, align: "end", portal: true, anchor: (_jsxs("button", { type: "button", className: css.selector, "aria-haspopup": "menu", "aria-expanded": open, onClick: () => { setOpen(value => !value); }, children: [selectedLabel, _jsx(IconChevronDownOutline14, { className: css.chevron })] })) })] }));
}
