"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as assessmentsApi from "@/features/assessments/api";
import { enrollmentKeys } from "@/features/enrollments/hooks";
import { playerKeys } from "@/features/player/hooks";
import { certificateKeys } from "@/features/certificates/hooks";
import type { AssessmentSubmitInput } from "@/features/assessments/types";

export const assessmentKeys = {
  all: ["assessments"] as const,
  paper: (enrollmentId: string, itemId: string) =>
    [...assessmentKeys.all, "paper", enrollmentId, itemId] as const,
  attempt: (enrollmentId: string, itemId: string, attemptId: string) =>
    [...assessmentKeys.all, "attempt", enrollmentId, itemId, attemptId] as const,
};

export function useItemAssessment(enrollmentId: string, itemId: string) {
  return useQuery({
    queryKey: assessmentKeys.paper(enrollmentId, itemId),
    queryFn: () => assessmentsApi.getItemAssessment(enrollmentId, itemId),
    enabled: Boolean(enrollmentId) && Boolean(itemId),
  });
}

export function useAttempt(enrollmentId: string, itemId: string, attemptId: string) {
  return useQuery({
    queryKey: assessmentKeys.attempt(enrollmentId, itemId, attemptId),
    queryFn: () => assessmentsApi.getAttempt(enrollmentId, itemId, attemptId),
    enabled: Boolean(enrollmentId) && Boolean(itemId) && Boolean(attemptId),
  });
}

export function useStartAttempt(enrollmentId: string, itemId: string) {
  return useMutation({
    mutationFn: () => assessmentsApi.startAttempt(enrollmentId, itemId),
  });
}

export function useSubmitAttempt(enrollmentId: string, itemId: string, attemptId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: AssessmentSubmitInput) =>
      assessmentsApi.submitAttempt(enrollmentId, itemId, attemptId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: assessmentKeys.attempt(enrollmentId, itemId, attemptId),
      });
      queryClient.invalidateQueries({ queryKey: playerKeys.progress(enrollmentId) });
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.detail(enrollmentId) });
      // May emit lms.course.completed, which issues a certificate.
      queryClient.invalidateQueries({ queryKey: certificateKeys.mineLists() });
    },
  });
}
