"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as onboardingApi from "@/features/onboarding/api";
import { meKeys } from "@/features/me/hooks";
import type { LmsPersonaType } from "@/shared/types";
import type { OnboardingPayload } from "@/features/onboarding/types";

export const onboardingKeys = {
  all: ["onboarding"] as const,
  mine: () => [...onboardingKeys.all, "mine"] as const,
  detail: (persona: LmsPersonaType) => [...onboardingKeys.all, "detail", persona] as const,
};

export function useMyOnboardings() {
  return useQuery({
    queryKey: onboardingKeys.mine(),
    queryFn: () => onboardingApi.getMyOnboardings(),
  });
}

export function useOnboarding(persona: LmsPersonaType) {
  return useQuery({
    queryKey: onboardingKeys.detail(persona),
    queryFn: () => onboardingApi.getOnboarding(persona),
    enabled: Boolean(persona),
  });
}

export function useStartOnboarding() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (persona: LmsPersonaType) => onboardingApi.startOnboarding({ persona }),
    onSuccess: (_data, persona) => {
      queryClient.invalidateQueries({ queryKey: onboardingKeys.mine() });
      queryClient.invalidateQueries({ queryKey: onboardingKeys.detail(persona) });
    },
  });
}

export function useSaveOnboarding(persona: LmsPersonaType) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: OnboardingPayload) =>
      onboardingApi.saveOnboarding(persona, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: onboardingKeys.detail(persona) });
      queryClient.invalidateQueries({ queryKey: onboardingKeys.mine() });
    },
  });
}

export function useSubmitOnboarding(persona: LmsPersonaType) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => onboardingApi.submitOnboarding(persona),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: onboardingKeys.detail(persona) });
      queryClient.invalidateQueries({ queryKey: onboardingKeys.mine() });
      // Submitting onboarding unlocks this persona's app surface, changing /me.
      queryClient.invalidateQueries({ queryKey: meKeys.me() });
    },
  });
}
