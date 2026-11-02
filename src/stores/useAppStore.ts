import { create } from 'zustand';

export type PerformanceMode = 'high' | 'performance';

interface AppState {
  audioMuted: boolean;
  performanceMode: PerformanceMode;
  searchModalOpen: boolean;
  shortcutsModalOpen: boolean;
  activeEntityId: string | null;

  toggleAudio: () => void;
  setAudioMuted: (muted: boolean) => void;
  setPerformanceMode: (mode: PerformanceMode) => void;
  openSearchModal: () => void;
  closeSearchModal: () => void;
  toggleSearchModal: () => void;
  openShortcutsModal: () => void;
  closeShortcutsModal: () => void;
  toggleShortcutsModal: () => void;
  openEntityModal: (id: string) => void;
  closeEntityModal: () => void;
}

const getInitialAudioMuted = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('museo_sound_pref') === 'muted';
};

export const useAppStore = create<AppState>((set) => ({
  audioMuted: getInitialAudioMuted(),
  performanceMode: 'high',
  searchModalOpen: false,
  shortcutsModalOpen: false,
  activeEntityId: null,

  toggleAudio: () =>
    set((s) => {
      const next = !s.audioMuted;
      if (typeof window !== 'undefined') {
        localStorage.setItem('museo_sound_pref', next ? 'muted' : 'enabled');
      }
      return { audioMuted: next };
    }),
  setAudioMuted: (audioMuted) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('museo_sound_pref', audioMuted ? 'muted' : 'enabled');
    }
    set({ audioMuted });
  },
  setPerformanceMode: (performanceMode) => set({ performanceMode }),
  openSearchModal: () => set({ searchModalOpen: true }),
  closeSearchModal: () => set({ searchModalOpen: false }),
  toggleSearchModal: () => set((s) => ({ searchModalOpen: !s.searchModalOpen })),
  openShortcutsModal: () => set({ shortcutsModalOpen: true }),
  closeShortcutsModal: () => set({ shortcutsModalOpen: false }),
  toggleShortcutsModal: () => set((s) => ({ shortcutsModalOpen: !s.shortcutsModalOpen })),
  openEntityModal: (id) => set({ activeEntityId: id }),
  closeEntityModal: () => set({ activeEntityId: null }),
}));
