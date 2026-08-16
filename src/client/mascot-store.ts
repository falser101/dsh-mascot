/**
 * Mascot shared state: drag position, collapsed flag, and the active skin.
 * One handle is passed to both the overlay entry and the General-settings
 * row, so the two surfaces read and write the same root-scope instance;
 * `persist` keeps the whole value in localStorage across reloads.
 */
import { defineStore } from '@deepseek-ai/dsh-client-runtime/client'
import type { SkinId } from './character/skins'

/** Widget footprint in px (CSS size of the character box). */
export const MASCOT_SIZE = 96

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

/** Persisted UI state shared by the overlay entry and the settings row. */
export interface MascotUiState {
  /** Top-left corner of the character box, in viewport px. */
  x: number
  /** Top-left corner of the character box, in viewport px. */
  y: number
  /** Whether the widget is collapsed to a small dot. */
  collapsed: boolean
  /** Active character skin id. */
  skin: SkinId
}

export interface MascotActions {
  /** Move the character box to a viewport position (already clamped). */
  move(draft: MascotUiState, x: number, y: number): void
  /** Set the collapsed dot state. */
  setCollapsed(draft: MascotUiState, collapsed: boolean): void
  /** Switch the active skin. */
  setSkin(draft: MascotUiState, skin: SkinId): void
}

/** Store declaration: one persisted root-scope instance shared by both entries. */
export const createMascotStore = () => defineStore({
  init: (): MascotUiState => ({
    ...defaultPosition(),
    collapsed: false,
    skin: 'cat',
  }),
  persist: 'dsh-client-ui-mascot',
  actions: {
    move: (draft, x, y) => {
      draft.x = x
      draft.y = y
    },
    setCollapsed: (draft, collapsed) => {
      draft.collapsed = collapsed
    },
    setSkin: (draft, skin) => {
      draft.skin = skin
    },
  } satisfies MascotActions,
})
