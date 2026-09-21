"use client";

import { useQuery } from "@tanstack/react-query";
import * as meApi from "@/features/me/api";
import type { LmsMe } from "@/features/me/types";

export { isUserStaffOrAdmin } from "@/features/me/utils/is-staff-or-admin";
import { isUserStaffOrAdmin } from "@/features/me/utils/is-staff-or-admin";

export const meKeys = {
  all: ["me"] as const,
  me: () => [...meKeys.all, "detail"] as const,
};

export function useMe() {
  return useQuery({
    queryKey: meKeys.me(),
    queryFn: () => meApi.getMe(),
    enabled: typeof window !== "undefined",
  });
}

/** Where a user should land post-auth: admin portal, onboarding, or learner dashboard. */
export function getPostAuthRedirect(
  me: LmsMe | undefined,
  redirectUrl?: string | null
): string {
  if (isUserStaffOrAdmin(me)) {
    if (redirectUrl && redirectUrl.startsWith("/")) {
      return redirectUrl;
    }
    return "/admin";
  }
  if (
    redirectUrl &&
    redirectUrl.startsWith("/") &&
    !redirectUrl.startsWith("/admin")
  ) {
    return redirectUrl;
  }
  const learner = me?.personas.find((persona) => persona.persona === "learner");
  if (!learner || learner.onboardingStatus === "draft") {
    return "/onboarding";
  }
  return "/dashboard";
}
