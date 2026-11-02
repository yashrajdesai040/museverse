import { create } from 'zustand';
import { useAuthStore } from './useAuthStore';
import { useAppStore } from './useAppStore';

/* ═══════════════════════════════════════════════════════
   LOGIN STATE MACHINE
   Scenes flow: ARRIVAL → APPROACH → TICKET_PRINT →
   LOGIN_FORM → VERIFYING → SUCCESS/DENIED → FLYTHROUGH → GALLERY
   ═══════════════════════════════════════════════════════ */

export type LoginScene =
  | 'ARRIVAL'
  | 'APPROACH'
  | 'TICKET_PRINT'
  | 'LOGIN_FORM'
  | 'VERIFYING'
  | 'SUCCESS'
  | 'DENIED'
  | 'FLYTHROUGH'
  | 'GALLERY';

// ── Remember Me: Persist email in localStorage ──
const REMEMBER_KEY = 'museo_remember_email';

function loadRememberedEmail(): { email: string; rememberMe: boolean } {
  if (typeof window === 'undefined') return { email: '', rememberMe: false };
  try {
    const saved = localStorage.getItem(REMEMBER_KEY);
    if (saved) {
      return { email: saved, rememberMe: true };
    }
  } catch { /* ignore */ }
  return { email: '', rememberMe: false };
}

function persistRememberMe(email: string, rememberMe: boolean) {
  if (typeof window === 'undefined') return;
  try {
    if (rememberMe && email) {
      localStorage.setItem(REMEMBER_KEY, email);
    } else {
      localStorage.removeItem(REMEMBER_KEY);
    }
  } catch { /* ignore */ }
}

interface LoginState {
  scene: LoginScene;
  email: string;
  password: string;
  rememberMe: boolean;
  isAuthenticated: boolean;
  error: string | null;
  reducedMotion: boolean;
  soundEnabled: boolean;

  setScene: (scene: LoginScene) => void;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  setRememberMe: (v: boolean) => void;
  authenticateAsync: () => Promise<boolean>;
  authenticateGuestAsync: () => Promise<boolean>;
  autoFillDemo: () => void;
  reset: () => void;
  setReducedMotion: (v: boolean) => void;
  toggleSound: () => void;
  hydrateRememberMe: () => void;
}

export const useLoginStore = create<LoginState>((set, get) => ({
  scene: 'LOGIN_FORM',
  email: '',
  password: '',
  rememberMe: false,
  isAuthenticated: false,
  error: null,
  reducedMotion: false,
  soundEnabled: true,

  setScene: (scene) => set({ scene }),
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setRememberMe: (rememberMe) => set({ rememberMe }),

  autoFillDemo: () => {
    set({
      email: 'yashrajdesai044@gmail.com',
      password: 'museo2025',
      rememberMe: true,
      error: null,
    });
  },

  // Hydrate remembered email from localStorage on client mount
  hydrateRememberMe: () => {
    const { email, rememberMe } = loadRememberedEmail();
    if (rememberMe) {
      set({ email, rememberMe });
    }
  },

  authenticateAsync: async () => {
    const { email, password, rememberMe } = get();
    const result = await useAuthStore.getState().login(email, password, rememberMe);

    if (result.success) {
      // Persist or clear Remember Me in localStorage
      persistRememberMe(email, rememberMe);
    }

    set({
      isAuthenticated: result.success,
      error: result.success ? null : (result.error || 'INVALID EMAIL OR PASSWORD').toUpperCase(),
    });

    return result.success;
  },

  authenticateGuestAsync: async () => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isGuest: true }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('museo_admitted', 'true');
        }
        useAuthStore.getState().setUser(data.user);
        set({ isAuthenticated: true, error: null });
        return true;
      }
    } catch {
      // ignore
    }
    return false;
  },

  reset: () => set({ scene: 'LOGIN_FORM', error: null }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  toggleSound: () => {
    const next = !get().soundEnabled;
    set({ soundEnabled: next });
    useAppStore.getState().setAudioMuted(!next);
  },
}));
