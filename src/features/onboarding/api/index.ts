import { lmsClient } from "@/shared/api/clients";
import { unwrapItem } from "@/shared/api/response";
import type { LmsPersonaType } from "@/shared/types";
import type {
  OnboardingPayload,
  OnboardingRecord,
  OnboardingSummary,
  StartOnboardingInput,
} from "@/features/onboarding/types";

export function startOnboarding(input: StartOnboardingInput) {
  return unwrapItem<OnboardingSummary>(lmsClient.post("/onboarding/start", input));
}

export function getMyOnboardings() {
  return unwrapItem<OnboardingSummary[]>(lmsClient.get("/onboarding/mine"));
}

export function getOnboarding(persona: LmsPersonaType) {
  return unwrapItem<OnboardingRecord>(lmsClient.get(`/onboarding/${persona}`));
}

export function saveOnboarding(persona: LmsPersonaType, payload: OnboardingPayload) {
  return unwrapItem<OnboardingRecord>(
    lmsClient.patch(`/onboarding/${persona}/save`, payload)
  );
}

export function submitOnboarding(persona: LmsPersonaType) {
  return unwrapItem<OnboardingSummary>(lmsClient.post(`/onboarding/${persona}/submit`));
}
