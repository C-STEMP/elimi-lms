"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as instructorsApi from "@/features/instructors/api";
import type { PaginationParams } from "@/shared/types";
import type { CreateInstructorInviteInput } from "@/features/instructors/types";

export const instructorInviteKeys = {
  all: ["instructorInvites"] as const,
  lists: () => [...instructorInviteKeys.all, "list"] as const,
  list: (params?: PaginationParams) =>
    [...instructorInviteKeys.lists(), params ?? {}] as const,
};

export function useInstructorInvites(params?: PaginationParams) {
  return useQuery({
    queryKey: instructorInviteKeys.list(params),
    queryFn: () => instructorsApi.getInstructorInvites(params),
  });
}

export function useCreateInstructorInvite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateInstructorInviteInput) =>
      instructorsApi.createInstructorInvite(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: instructorInviteKeys.lists() });
    },
  });
}
