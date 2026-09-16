"use client";

import { useQuery } from "@tanstack/react-query";
import * as meApi from "@/features/me/api";

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
