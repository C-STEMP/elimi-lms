import { capClient, lmsClient } from "@/shared/api/clients";
import { unwrapItem } from "@/shared/api/response";
import type { CapPublicStats, LmsPublicStats } from "@/features/landing/types";

export function getLmsPublicStats(): Promise<LmsPublicStats> {
  return unwrapItem<LmsPublicStats>(lmsClient.get("/public/stats"));
}

export function getCapPublicStats(): Promise<CapPublicStats> {
  return unwrapItem<CapPublicStats>(capClient.get("/public/stats"));
}
