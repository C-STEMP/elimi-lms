function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/**
 * Auth tokens live server-side only now (signed httpOnly session cookie —
 * see shared/lib/session.ts). This module is just a non-sensitive display
 * cache: the orchestrator has no GET /me, so the only place the client ever
 * learns the signed-in user's email/id is the response body of
 * login/register/verify, cached here so pages (e.g. Settings) can read it
 * without re-authenticating.
 */
export type StoredUser = {
  id: string;
  email: string;
};

const USER_KEY = "elimi_user";

export const tokenStorage = {
  setUser(user: StoredUser): void {
    if (!isBrowser()) return;
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  getUser(): StoredUser | null {
    if (!isBrowser()) return null;
    const raw = window.localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as StoredUser;
    } catch {
      return null;
    }
  },
  clearUser(): void {
    if (!isBrowser()) return;
    window.localStorage.removeItem(USER_KEY);
  },
};
