import { create } from 'zustand';

export interface UserProfile {
  id: string;
  name: string;
  username?: string;
  email: string;
  role: string;
  avatar: string;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  error: string | null;

  checkSession: () => Promise<boolean>;
  admitWithTicket: () => void;
  login: (email: string, pass: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (data: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  setUser: (user: UserProfile | null) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isInitializing: true,
  error: null,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  admitWithTicket: () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('museo_admitted', 'true');
    }
    set({
      user: {
        id: 'patron-4600',
        name: 'Distinguished Patron',
        username: 'deeptime_patron',
        email: 'patron@museo.archive',
        role: 'Verified Explorer',
        avatar: '🎟️',
      },
      isAuthenticated: true,
      isInitializing: false,
      error: null,
    });
  },

  checkSession: async () => {
    // Check demo admission in localStorage (design.md v2 locked decision)
    if (typeof window !== 'undefined') {
      const isAdmitted = localStorage.getItem('museo_admitted') === 'true';
      if (isAdmitted) {
        set({
          user: {
            id: 'patron-4600',
            name: 'Distinguished Patron',
            username: 'deeptime_patron',
            email: 'patron@museo.archive',
            role: 'Verified Explorer',
            avatar: '🎟️',
          },
          isAuthenticated: true,
          isInitializing: false,
          error: null,
        });
        return true;
      }
    }

    try {
      set({ isInitializing: true });
      const res = await fetch('/api/auth/me', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          set({ user: data.user, isAuthenticated: true, isInitializing: false, error: null });
          return true;
        }
      }
    } catch {
      // Fallback cleanly
    }

    set({ user: null, isAuthenticated: false, isInitializing: false });
    return false;
  },

  login: async (email: string, password: string, rememberMe?: boolean) => {
    try {
      set({ error: null });
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe: !!rememberMe }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('museo_admitted', 'true');
        }
        set({ user: data.user, isAuthenticated: true, error: null });
        return { success: true };
      } else {
        const err = data.error || 'Authentication failed';
        set({ error: err, isAuthenticated: false, user: null });
        return { success: false, error: err };
      }
    } catch {
      const err = 'Network error. Please try again.';
      set({ error: err, isAuthenticated: false, user: null });
      return { success: false, error: err };
    }
  },

  updateProfile: async (updatedData) => {
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      const data = await res.json();
      if (res.ok && data.success && data.user) {
        set({ user: data.user });
        return { success: true };
      }
      return { success: false, error: data.error || 'Failed to update profile' };
    } catch {
      return { success: false, error: 'Network error updating profile' };
    }
  },

  logout: async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('museo_admitted');
    }
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // Ignore network errors on logout
    }
    set({ user: null, isAuthenticated: false, error: null });
  },
}));
