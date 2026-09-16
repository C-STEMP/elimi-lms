"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import * as banksApi from "@/features/banks/api";
import type { BanksQuery, ResolveBankAccountInput } from "@/features/banks/types";

const BANK_LIST_STALE_TIME = 24 * 60 * 60 * 1000;

export const bankKeys = {
  all: ["banks"] as const,
  list: (params?: BanksQuery) => [...bankKeys.all, "list", params ?? {}] as const,
};

/** Server caches this list for 24h; mirror that here to avoid redundant refetches. */
export function useBanks(params?: BanksQuery) {
  return useQuery({
    queryKey: bankKeys.list(params),
    queryFn: () => banksApi.getBanks(params),
    staleTime: BANK_LIST_STALE_TIME,
  });
}

export function useResolveBankAccount() {
  return useMutation({
    mutationFn: (input: ResolveBankAccountInput) => banksApi.resolveBankAccount(input),
  });
}
