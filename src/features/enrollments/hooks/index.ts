"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as enrollmentsApi from "@/features/enrollments/api";
import type { EnrollmentsQuery } from "@/features/enrollments/types";

export const enrollmentKeys = {
  all: ["enrollments"] as const,
  mineLists: () => [...enrollmentKeys.all, "mine"] as const,
  mine: (params?: EnrollmentsQuery) => [...enrollmentKeys.mineLists(), params ?? {}] as const,
  details: () => [...enrollmentKeys.all, "detail"] as const,
  detail: (enrollmentId: string) => [...enrollmentKeys.details(), enrollmentId] as const,
};

export function useMyEnrollments(params?: EnrollmentsQuery) {
  return useQuery({
    queryKey: enrollmentKeys.mine(params),
    queryFn: () => enrollmentsApi.getMyEnrollments(params),
  });
}

export function useEnrollment(enrollmentId: string) {
  return useQuery({
    queryKey: enrollmentKeys.detail(enrollmentId),
    queryFn: () => enrollmentsApi.getEnrollment(enrollmentId),
    enabled: Boolean(enrollmentId),
  });
}

export function useCreateEnrollment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (courseId: string) => enrollmentsApi.createEnrollment(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.mineLists() });
    },
  });
}

export function useCheckoutEnrollment(enrollmentId: string) {
  // Activation arrives asynchronously via payment.completed, so there's
  // nothing to invalidate client-side here yet.
  return useMutation({
    mutationFn: () => enrollmentsApi.checkoutEnrollment(enrollmentId),
  });
}
