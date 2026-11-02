import { useAuthStore } from '@/stores/useAuthStore';

/**
 * Universal fetch wrapper with global 401 Unauthorized interceptor.
 * Automatically catches expired sessions, resets user state, and redirects to /login with ?redirectTo.
 */
export async function apiFetch<T = any>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(input, init);

  if (response.status === 401) {
    // 401 Unauthorized handling — Session Expired / Token Invalidated
    useAuthStore.getState().setUser(null);

    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname + window.location.search;
      if (!currentPath.startsWith('/login')) {
        window.location.href = `/login?redirectTo=${encodeURIComponent(currentPath)}`;
      }
    }
    throw new Error('Session expired. Please log in again.');
  }

  return response.json();
}
