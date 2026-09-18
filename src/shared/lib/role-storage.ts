import type { LmsPersonaType } from "@/shared/types";

const ROLE_KEY = "elimi_selected_role";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export const roleStorage = {
  getRole(): LmsPersonaType | null {
    if (!isBrowser()) return null;
    return window.localStorage.getItem(ROLE_KEY) as LmsPersonaType | null;
  },
  setRole(role: LmsPersonaType): void {
    if (!isBrowser()) return;
    window.localStorage.setItem(ROLE_KEY, role);
  },
  clearRole(): void {
    if (!isBrowser()) return;
    window.localStorage.removeItem(ROLE_KEY);
  },
};
