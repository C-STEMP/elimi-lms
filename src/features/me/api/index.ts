import { lmsClient } from "@/shared/api/clients";
import { unwrapItem } from "@/shared/api/response";
import type { LmsMe } from "@/features/me/types";

export function getMe() {
  return unwrapItem<LmsMe>(lmsClient.get("/me"));
}
