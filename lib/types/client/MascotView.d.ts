import type { InjectFace, PropsLocale, PropsRuntime, PropsStore } from '@deepseek-ai/dsh-client-ui-slots';
import type { ObservableSnapshot } from '@deepseek-ai/dsh-client-runtime/client';
import type { MascotState } from './mascot-source';
import { createMascotStore } from './mascot-store';
import type { NS } from './locales';
/** Injectable face: the mood source and the idle line bound as hooks. */
export interface MascotViewInjected {
    hooks: {
        /** Live mood frame of the current session. */
        mascot: ObservableSnapshot<MascotState>;
        /** Current idle rotation line (built-in key or `ai:`-prefixed raw text). */
        lines: ObservableSnapshot<string>;
    };
    /** Jump to the session owning the given peer id (no-op for job peers). */
    openPeer: (sessionId: string) => void;
    /** Apply the AI-lines settings toggle to the rotator. */
    setAiLines: (enabled: boolean) => void;
}
/** Full overlay-entry props: runtime kit + locale seat + store + inject face. */
export type MascotViewProps = PropsRuntime<'shell.overlay'> & PropsLocale<typeof NS> & PropsStore<ReturnType<typeof createMascotStore>> & InjectFace<MascotViewInjected>;
/**
 * Render the draggable companion with its speech bubble. The bubble is
 * always visible while the agent is busy (unless the settings toggle turns
 * that off), swaps to a reassuring line while hovered, and becomes a peer
 * list while hovered during parallel executions. A badge counts parallel
 * executions from two on.
 * @param props - composed overlay-entry props.
 */
export declare function MascotView(props: MascotViewProps): import("react").JSX.Element;
