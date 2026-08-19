/**
 * Mascot shared state: drag position, collapsed flag, and the active skin.
 * One handle is passed to both the overlay entry and the settings page,
 * so the two surfaces read and write the same root-scope instance;
 * `persist` keeps the whole value in localStorage across reloads.
 */
import { defineStore } from '@deepseek-ai/dsh-client-runtime/client'
import type { SkinId } from './character/skins'

/** Widget footprint in px (CSS size of the character box). */
export const MASCOT_SIZE = 96

/** Mini face while the composer is focused, or after a double-click collapse. */
export const MASCOT_MINI_SIZE = 44

/** Corner margin in px applied to the default position. */
const MASCOT_MARGIN = 24

/** Default drop position: bottom-right of the viewport at first boot. */
function defaultPosition(): { x: number; y: number } {
  if (typeof window === 'undefined') return { x: MASCOT_MARGIN, y: MASCOT_MARGIN }
  return {
    x: Math.max(MASCOT_MARGIN, window.innerWidth - MASCOT_SIZE - MASCOT_MARGIN),
    y: Math.max(MASCOT_MARGIN, window.innerHeight - MASCOT_SIZE - MASCOT_MARGIN),
  }
}

/** Carry placement and skin from v2. AI lines reset to off; the intro hint is new. */
function carryOverV2(): Partial<MascotUiState> {
  if (typeof localStorage === 'undefined') return {}
  try {
    const raw = localStorage.getItem('dsh-client-ui-mascot-v2')
    if (raw === null) return {}
    const prev = JSON.parse(raw) as Record<string, unknown>
    const next: Partial<MascotUiState> = {}
    if (typeof prev.x === 'number') next.x = prev.x
    if (typeof prev.y === 'number') next.y = prev.y
    if (typeof prev.collapsed === 'boolean') next.collapsed = prev.collapsed
    if (typeof prev.hidden === 'boolean') next.hidden = prev.hidden
    if (typeof prev.skin === 'string') next.skin = prev.skin as SkinId
    if (typeof prev.bubbleAlways === 'boolean') next.bubbleAlways = prev.bubbleAlways
    if (typeof prev.showToolName === 'boolean') next.showToolName = prev.showToolName
    if (prev.popCadence === 'quiet' || prev.popCadence === 'standard' || prev.popCadence === 'lively') {
      next.popCadence = prev.popCadence
    }
    return next
  } catch {
    return {}
  }
}

/** Idle pop-up cadence levels (interval/duration pairs live in the view). */
export type PopCadence = 'quiet' | 'standard' | 'lively'

/** Persisted UI state shared by the overlay entry and the settings rows. */
export interface MascotUiState {
  /** Top-left corner of the character box, in viewport px. */
  x: number
  /** Top-left corner of the character box, in viewport px. */
  y: number
  /** Whether the widget is collapsed to a mini face. */
  collapsed: boolean
  /** Whether the overlay is fully hidden (settings / context-menu). */
  hidden: boolean
  /** Active character skin id. */
  skin: SkinId
  /** Whether the status bubble stays visible while the agent is busy. */
  bubbleAlways: boolean
  /** Whether the busy bubble names the running tool. */
  showToolName: boolean
  /** Whether AI-generated idle lines may mix into the rotation. Off by default. */
  aiLines: boolean
  /** Idle pop-up cadence level. */
  popCadence: PopCadence
  /** First-run hint already shown ("拖我，悬停有按钮"). */
  introSeen: boolean
}

export interface MascotActions {
  /** Move the character box to a viewport position (already clamped). */
  move(draft: MascotUiState, x: number, y: number): void
  /** Set the collapsed mini-face state. */
  setCollapsed(draft: MascotUiState, collapsed: boolean): void
  /** Hide or show the overlay entirely. */
  setHidden(draft: MascotUiState, hidden: boolean): void
  /** Switch the active skin. */
  setSkin(draft: MascotUiState, skin: SkinId): void
  /** Toggle the always-visible busy bubble. */
  setBubbleAlways(draft: MascotUiState, bubbleAlways: boolean): void
  /** Toggle tool names in the busy bubble. */
  setShowToolName(draft: MascotUiState, showToolName: boolean): void
  /** Toggle AI-generated idle lines. */
  setAiLines(draft: MascotUiState, aiLines: boolean): void
  /** Set the idle pop-up cadence level. */
  setPopCadence(draft: MascotUiState, cadence: PopCadence): void
  /** Mark the first-run hint as shown. */
  setIntroSeen(draft: MascotUiState, introSeen: boolean): void
}

/** Store declaration: one persisted root-scope instance shared by all entries. */
export const createMascotStore = () => defineStore({
  init: (): MascotUiState => ({
    ...defaultPosition(),
    collapsed: false,
    hidden: false,
    skin: 'cat',
    bubbleAlways: true,
    showToolName: false,
    aiLines: false,
    popCadence: 'standard',
    introSeen: false,
    ...carryOverV2(),
  }),
  persist: 'dsh-client-ui-mascot-v3',
  actions: {
    move: (draft, x, y) => {
      draft.x = x
      draft.y = y
    },
    setCollapsed: (draft, collapsed) => {
      draft.collapsed = collapsed
    },
    setHidden: (draft, hidden) => {
      draft.hidden = hidden
    },
    setSkin: (draft, skin) => {
      draft.skin = skin
    },
    setBubbleAlways: (draft, bubbleAlways) => {
      draft.bubbleAlways = bubbleAlways
    },
    setShowToolName: (draft, showToolName) => {
      draft.showToolName = showToolName
    },
    setAiLines: (draft, aiLines) => {
      draft.aiLines = aiLines
    },
    setPopCadence: (draft, cadence) => {
      draft.popCadence = cadence
    },
    setIntroSeen: (draft, introSeen) => {
      draft.introSeen = introSeen
    },
  } satisfies MascotActions,
})
