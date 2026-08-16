import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * The floating companion view, mounted into the frame-wide `shell.overlay`
 * slot. Reads the shared mascot store (position, collapsed, skin) and the
 * inject-bound mood source; owns only component-local interaction state
 * (drag session, poke line). All presentation derives from the mood frame;
 * nothing here reaches the session or the model.
 */
import { useEffect, useRef, useState } from 'react';
import { createMascotStore, MASCOT_SIZE } from './mascot-store';
import { skinOf } from './character/skins';
import css from './MascotView.module.css';
/** How long a poke line stays visible, ms. */
const POKE_MS = 2000;
/** Poke lines, cycled in order on each click. */
const POKE_KEYS = ['poke.0', 'poke.1', 'poke.2', 'poke.3'];
function clamp(value, max) {
    return Math.max(0, Math.min(max, value));
}
function clampToViewport(x, y) {
    return {
        x: clamp(x, window.innerWidth - MASCOT_SIZE),
        y: clamp(y, window.innerHeight - MASCOT_SIZE),
    };
}
/**
 * Render the draggable companion with its speech bubble.
 * @param props - composed overlay-entry props.
 */
export function MascotView(props) {
    const { useStore, actions, useMascot, t } = props;
    const state = useStore(value => value);
    const mascot = useMascot(value => value);
    const [dragging, setDragging] = useState(false);
    const [poke, setPoke] = useState(null);
    const dragRef = useRef(null);
    const pokeCounter = useRef(0);
    // Keep the widget inside the viewport when the window shrinks.
    useEffect(() => {
        const onResize = () => {
            const clamped = clampToViewport(state.x, state.y);
            if (clamped.x !== state.x || clamped.y !== state.y)
                actions.move(clamped.x, clamped.y);
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, [actions, state.x, state.y]);
    const pokeNow = () => {
        pokeCounter.current += 1;
        const index = (pokeCounter.current - 1) % POKE_KEYS.length;
        const nonce = pokeCounter.current;
        setPoke({ text: t(POKE_KEYS[index]), nonce });
        window.setTimeout(() => {
            setPoke(current => (current?.nonce === nonce ? null : current));
        }, POKE_MS);
    };
    const onPointerDown = (event) => {
        if (event.button !== 0)
            return;
        event.currentTarget.setPointerCapture(event.pointerId);
        dragRef.current = {
            pointerId: event.pointerId,
            offsetX: event.clientX - state.x,
            offsetY: event.clientY - state.y,
            moved: false,
        };
        setDragging(true);
    };
    const onPointerMove = (event) => {
        const drag = dragRef.current;
        if (drag === null || drag.pointerId !== event.pointerId)
            return;
        const clamped = clampToViewport(event.clientX - drag.offsetX, event.clientY - drag.offsetY);
        if (clamped.x !== state.x || clamped.y !== state.y) {
            drag.moved = true;
            actions.move(clamped.x, clamped.y);
        }
    };
    const onPointerUp = () => {
        const drag = dragRef.current;
        dragRef.current = null;
        setDragging(false);
        if (drag !== null && !drag.moved)
            pokeNow();
    };
    const onDoubleClick = () => {
        actions.setCollapsed(!state.collapsed);
    };
    const skin = skinOf(state.skin);
    const Skin = skin.Component;
    const bubbleText = state.collapsed
        ? t('collapse.hint')
        : poke?.text ?? t(mascot.textKey, mascot.params);
    const bubbleVisible = poke !== null || mascot.until !== undefined;
    const rootClass = [
        css.root,
        dragging ? css.dragging : undefined,
        state.collapsed ? css.collapsed : undefined,
    ].filter(Boolean).join(' ');
    return (_jsxs("div", { className: rootClass, style: { left: state.x, top: state.y }, role: "button", tabIndex: 0, "aria-label": t('widget.aria'), onPointerDown: onPointerDown, onPointerMove: onPointerMove, onPointerUp: onPointerUp, onDoubleClick: onDoubleClick, onKeyDown: (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                pokeNow();
            }
        }, children: [_jsx("div", { className: `${css.bubble}${bubbleVisible ? ` ${css.bubbleVisible}` : ''}`, "data-visible": bubbleVisible, role: "status", "aria-live": "polite", children: bubbleText }), state.collapsed ? (_jsx("div", { className: css.dot, "aria-hidden": "true" })) : (_jsx("div", { className: css.character, children: _jsx(Skin, { mood: mascot.mood, dragging: dragging }) }))] }));
}
