"use client";

import { useQuery } from "@tanstack/react-query";
import * as meApi from "@/features/me/api";
import type { LmsMe } from "@/features/me/types";

import { tokenStorage } from "@/shared/lib/token-storage";
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

/** Where a user should land post-auth: admin portal, or learner dashboard. */
export function getPostAuthRedirect(
  me: LmsMe | undefined,
  redirectUrl?: string | null,
  isStaffOrAdminOverride?: boolean
): string {
  const user = tokenStorage.getUser();
  const isAdminUser = Boolean(
    isStaffOrAdminOverride ??
      (isUserStaffOrAdmin(me) ||
        user?.isStaffOrAdmin ||
        user?.role === "admin" ||
        user?.role === "staff" ||
        user?.roles?.includes("admin") ||
        user?.email?.toLowerCase().includes("admin"))
  );

  if (isAdminUser) {
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

  const learnerPersona = me?.personas?.find((p) => p.persona === "learner");
  if (learnerPersona && learnerPersona.onboardingStatus !== "completed") {
    return "/onboarding";
  }

  return "/dashboard";
}
