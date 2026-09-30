"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as meApi from "@/features/me/api";
import type { LmsMe, LmsMeProfile, LmsMeProfilePatch } from "@/features/me/types";

import { tokenStorage } from "@/shared/lib/token-storage";
export { isUserStaffOrAdmin } from "@/features/me/utils/is-staff-or-admin";
import { isUserStaffOrAdmin } from "@/features/me/utils/is-staff-or-admin";

export const meKeys = {
  all: ["me"] as const,
  me: () => [...meKeys.all, "detail"] as const,
  profile: () => [...meKeys.all, "profile"] as const,
};

export function useMe() {
  return useQuery({
    queryKey: meKeys.me(),
    queryFn: () => meApi.getMe(),
  });
}

export function useMeProfile() {
  return useQuery({
    queryKey: meKeys.profile(),
    queryFn: () => meApi.getMeProfile(),
  });
}

export function usePatchMeProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: LmsMeProfilePatch) => meApi.patchMeProfile(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(meKeys.profile(), data);
      queryClient.invalidateQueries({ queryKey: meKeys.me() });
    },
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
