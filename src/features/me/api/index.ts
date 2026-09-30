import { lmsClient } from "@/shared/api/clients";
import { unwrapItem } from "@/shared/api/response";
import type { LmsMe, LmsMeProfile, LmsMeProfilePatch } from "@/features/me/types";

export function getMe() {
  return unwrapItem<LmsMe>(lmsClient.get("/me"));
}

export function getMeProfile() {
  return unwrapItem<LmsMeProfile>(lmsClient.get("/me/profile"));
}

export function patchMeProfile(payload: LmsMeProfilePatch) {
  return unwrapItem<LmsMeProfile>(lmsClient.patch("/me/profile", payload));
}
