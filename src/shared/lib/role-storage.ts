import type { LmsPersonaType } from "@/shared/types";

const ROLE_KEY = "elimi_selected_role";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export const roleStorage = {
  getRole(): LmsPersonaType {
    if (!isBrowser()) return "learner";
    return (window.localStorage.getItem(ROLE_KEY) as LmsPersonaType | null) ?? "learner";
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
