import { useQuery } from "@tanstack/react-query";
import { getCapPublicStats, getLmsPublicStats } from "@/features/landing/api";

const PUBLIC_STATS_STALE_TIME_MS = 30 * 60 * 1000;

export const publicStatsKeys = {
  all: ["public-stats"] as const,
  lms: () => [...publicStatsKeys.all, "lms"] as const,
  cap: () => [...publicStatsKeys.all, "cap"] as const,
};

export function useLmsPublicStats(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: publicStatsKeys.lms(),
    queryFn: getLmsPublicStats,
    enabled: options?.enabled ?? true,
    staleTime: PUBLIC_STATS_STALE_TIME_MS,
    retry: 1,
  });
}

export function useCapPublicStats(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: publicStatsKeys.cap(),
    queryFn: getCapPublicStats,
    enabled: options?.enabled ?? true,
    staleTime: PUBLIC_STATS_STALE_TIME_MS,
    retry: 1,
  });
}
