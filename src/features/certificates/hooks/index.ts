"use client";

import { useQuery } from "@tanstack/react-query";
import * as certificatesApi from "@/features/certificates/api";
import type { PaginationParams } from "@/shared/types";

export const certificateKeys = {
  all: ["certificates"] as const,
  mineLists: () => [...certificateKeys.all, "mine"] as const,
  mine: (params?: PaginationParams) => [...certificateKeys.mineLists(), params ?? {}] as const,
  detail: (certificateId: string) => [...certificateKeys.all, "detail", certificateId] as const,
  forEnrollment: (enrollmentId: string) =>
    [...certificateKeys.all, "enrollment", enrollmentId] as const,
};

export function useMyCertificates(params?: PaginationParams) {
  return useQuery({
    queryKey: certificateKeys.mine(params),
    queryFn: () => certificatesApi.getMyCertificates(params),
  });
}

export function useCertificate(certificateId: string) {
  return useQuery({
    queryKey: certificateKeys.detail(certificateId),
    queryFn: () => certificatesApi.getCertificate(certificateId),
    enabled: Boolean(certificateId),
  });
}

export function useEnrollmentCertificate(enrollmentId: string) {
  return useQuery({
    queryKey: certificateKeys.forEnrollment(enrollmentId),
    queryFn: () => certificatesApi.getEnrollmentCertificate(enrollmentId),
    enabled: Boolean(enrollmentId),
  });
}
