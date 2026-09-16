"use client";

import { useQuery } from "@tanstack/react-query";
import * as meApi from "@/features/me/api";
import type { LmsMe } from "@/features/me/types";

export const meKeys = {
  all: ["me"] as const,
  me: () => [...meKeys.all, "detail"] as const,
};

export function useMe() {
  return useQuery({
    queryKey: meKeys.me(),
    queryFn: () => meApi.getMe(),
  });
}

/** Where a learner should land post-auth: resume onboarding, or go straight to the dashboard. */
export function getPostAuthRedirect(me: LmsMe | undefined): "/onboarding" | "/dashboard" {
  const learner = me?.personas.find((persona) => persona.persona === "learner");
  if (!learner || learner.onboardingStatus === "draft") {
    return "/onboarding";
  }
  return "/dashboard";
}
