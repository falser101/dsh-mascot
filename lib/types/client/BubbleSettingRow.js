import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createMascotStore } from './mascot-store';
import css from './BubbleSettingRow.module.css';
/**
 * Render the busy-bubble preference row with a switch.
 * @param props - composed settings-row props.
 */
export function BubbleSettingRow(props) {
    const { useStore, actions, t } = props;
    const state = useStore(value => value);
    return (_jsxs("div", { className: css.row, children: [_jsxs("div", { className: css.rowText, children: [_jsx("div", { className: css.title, children: t('bubble.title') }), _jsx("div", { className: css.desc, children: t('bubble.description') })] }), _jsx("button", { type: "button", role: "switch", "aria-checked": state.bubbleAlways, className: `${css.switch}${state.bubbleAlways ? ` ${css.switchOn}` : ''}`, onClick: () => { actions.setBubbleAlways(!state.bubbleAlways); }, children: _jsx("span", { className: css.knob, "aria-hidden": "true" }) })] }));
}
