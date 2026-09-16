"use client";

import { useQuery } from "@tanstack/react-query";
import * as addressApi from "@/features/address/api";
import type { LgasQuery, StatesQuery } from "@/features/address/types";

/** This reference data essentially never changes — cache it aggressively client-side too. */
const STATIC_STALE_TIME = 24 * 60 * 60 * 1000;

export const addressKeys = {
  all: ["address"] as const,
  countries: () => [...addressKeys.all, "countries"] as const,
  states: (country: string) => [...addressKeys.all, "states", country] as const,
  lgas: (country: string, state: string) =>
    [...addressKeys.all, "lgas", country, state] as const,
};

export function useCountries() {
  return useQuery({
    queryKey: addressKeys.countries(),
    queryFn: () => addressApi.getCountries(),
    staleTime: STATIC_STALE_TIME,
  });
}

export function useStates(params: StatesQuery) {
  return useQuery({
    queryKey: addressKeys.states(params.country),
    queryFn: () => addressApi.getStates(params),
    enabled: Boolean(params.country),
    staleTime: STATIC_STALE_TIME,
  });
}

export function useLgas(params: LgasQuery) {
  return useQuery({
    queryKey: addressKeys.lgas(params.country, params.state),
    queryFn: () => addressApi.getLgas(params),
    enabled: Boolean(params.country) && Boolean(params.state),
    staleTime: STATIC_STALE_TIME,
  });
}
