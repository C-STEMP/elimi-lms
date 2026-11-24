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
  levelMineLists: () => [...certificateKeys.all, "level-mine"] as const,
  levelMine: (params?: PaginationParams) =>
    [...certificateKeys.levelMineLists(), params ?? {}] as const,
  levelDetail: (certificateId: string) =>
    [...certificateKeys.all, "level-detail", certificateId] as const,
  forLevelEnrollment: (levelEnrollmentId: string) =>
    [...certificateKeys.all, "level-enrollment", levelEnrollmentId] as const,
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
    retry: 5,
    retryDelay: 3000,
    refetchInterval: (query) => (query.state.data?.id ? false : 4000),
  });
}

export function useMyLevelCertificates(params?: PaginationParams) {
  return useQuery({
    queryKey: certificateKeys.levelMine(params),
    queryFn: () => certificatesApi.getMyLevelCertificates(params),
  });
}

export function useLevelCertificate(certificateId: string) {
  return useQuery({
    queryKey: certificateKeys.levelDetail(certificateId),
    queryFn: () => certificatesApi.getLevelCertificate(certificateId),
    enabled: Boolean(certificateId),
  });
}

export function useLevelEnrollmentCertificate(levelEnrollmentId: string) {
  return useQuery({
    queryKey: certificateKeys.forLevelEnrollment(levelEnrollmentId),
    queryFn: () => certificatesApi.getLevelEnrollmentCertificate(levelEnrollmentId),
    enabled: Boolean(levelEnrollmentId),
    retry: 5,
    retryDelay: 3000,
    refetchInterval: (query) => (query.state.data?.id ? false : 4000),
  });
}
