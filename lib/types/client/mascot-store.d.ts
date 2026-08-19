import type { SkinId } from './character/skins';
/** Widget footprint in px (CSS size of the character box). */
export declare const MASCOT_SIZE = 96;
/** Idle pop-up cadence levels (interval/duration pairs live in the view). */
export type PopCadence = 'quiet' | 'standard' | 'lively';
/** Persisted UI state shared by the overlay entry and the settings rows. */
export interface MascotUiState {
    /** Top-left corner of the character box, in viewport px. */
    x: number;
    /** Top-left corner of the character box, in viewport px. */
    y: number;
    /** Whether the widget is collapsed to a mini face. */
    collapsed: boolean;
    /** Whether the overlay is fully hidden (settings / context-menu). */
    hidden: boolean;
    /** Active character skin id. */
    skin: SkinId;
    /** Whether the status bubble stays visible while the agent is busy. */
    bubbleAlways: boolean;
    /** Whether the busy bubble names the running tool. */
    showToolName: boolean;
    /** Whether AI-generated idle lines may mix into the rotation. */
    aiLines: boolean;
    /** Idle pop-up cadence level. */
    popCadence: PopCadence;
}
export interface MascotActions {
    /** Move the character box to a viewport position (already clamped). */
    move(draft: MascotUiState, x: number, y: number): void;
    /** Set the collapsed mini-face state. */
    setCollapsed(draft: MascotUiState, collapsed: boolean): void;
    /** Hide or show the overlay entirely. */
    setHidden(draft: MascotUiState, hidden: boolean): void;
    /** Switch the active skin. */
    setSkin(draft: MascotUiState, skin: SkinId): void;
    /** Toggle the always-visible busy bubble. */
    setBubbleAlways(draft: MascotUiState, bubbleAlways: boolean): void;
    /** Toggle tool names in the busy bubble. */
    setShowToolName(draft: MascotUiState, showToolName: boolean): void;
    /** Toggle AI-generated idle lines. */
    setAiLines(draft: MascotUiState, aiLines: boolean): void;
    /** Set the idle pop-up cadence level. */
    setPopCadence(draft: MascotUiState, cadence: PopCadence): void;
}
/** Store declaration: one persisted root-scope instance shared by all entries. */
export declare const createMascotStore: () => import("@deepseek-ai/dsh-client-runtime/client").EngineStoreHandle<MascotUiState, {
    move: (draft: MascotUiState, x: number, y: number) => void;
    setCollapsed: (draft: MascotUiState, collapsed: boolean) => void;
    setHidden: (draft: MascotUiState, hidden: boolean) => void;
    setSkin: (draft: MascotUiState, skin: SkinId) => void;
    setBubbleAlways: (draft: MascotUiState, bubbleAlways: boolean) => void;
    setShowToolName: (draft: MascotUiState, showToolName: boolean) => void;
    setAiLines: (draft: MascotUiState, aiLines: boolean) => void;
    setPopCadence: (draft: MascotUiState, cadence: PopCadence) => void;
}>;
