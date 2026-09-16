"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as playerApi from "@/features/player/api";
import { enrollmentKeys } from "@/features/enrollments/hooks";
import { certificateKeys } from "@/features/certificates/hooks";
import type { ItemProgressWrite, ScormCmiCommit } from "@/features/player/types";

export const playerKeys = {
  all: ["player"] as const,
  progress: (enrollmentId: string) => [...playerKeys.all, "progress", enrollmentId] as const,
  scormSession: (sessionId: string) => [...playerKeys.all, "scorm", sessionId] as const,
};

export function useEnrollmentProgress(enrollmentId: string) {
  return useQuery({
    queryKey: playerKeys.progress(enrollmentId),
    queryFn: () => playerApi.getEnrollmentProgress(enrollmentId),
    enabled: Boolean(enrollmentId),
  });
}

export function useScormSession(sessionId: string) {
  return useQuery({
    queryKey: playerKeys.scormSession(sessionId),
    queryFn: () => playerApi.getScormSession(sessionId),
    enabled: Boolean(sessionId),
  });
}

export function useLaunchItem(enrollmentId: string) {
  return useMutation({
    mutationFn: (itemId: string) => playerApi.launchItem(enrollmentId, itemId),
  });
}

export function useRecordItemProgress(enrollmentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, input }: { itemId: string; input: ItemProgressWrite }) =>
      playerApi.recordItemProgress(enrollmentId, itemId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: playerKeys.progress(enrollmentId) });
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.detail(enrollmentId) });
      // May emit lms.course.completed, which issues a certificate.
      queryClient.invalidateQueries({ queryKey: certificateKeys.mineLists() });
    },
  });
}

export function useCommitScormCmi(enrollmentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sessionId, input }: { sessionId: string; input: ScormCmiCommit }) =>
      playerApi.commitScormCmi(sessionId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: playerKeys.progress(enrollmentId) });
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.detail(enrollmentId) });
      queryClient.invalidateQueries({ queryKey: certificateKeys.mineLists() });
    },
  });
}
