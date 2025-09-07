import { create } from 'zustand';

export const useSettingsStore = create<{
  isDragging: boolean;
  updateDrag: (newState: boolean) => void;
  fullscreen: boolean;
  toggle: (newState?: boolean) => void;
}>((set) => ({
  isDragging: false,
  fullscreen: false,
  updateDrag: (newState: boolean) => set({ isDragging: newState }),
  toggle: (newState?: boolean) =>
    set((state) => {
      return {
        ...state,
        fullscreen: newState ?? !state.fullscreen,
      };
    }),
}));
