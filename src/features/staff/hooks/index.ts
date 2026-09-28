"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as staffApi from "@/features/staff/api";
import type { PaginationParams } from "@/shared/types";
import type { EntitlementGrantInput } from "@/features/enrollments/types";
import type {
  AdminDashboardQuery,
  AdminEnrollmentsQuery,
  AdminLearnersQuery,
  AdminPaymentsQuery,
  CreateStaffInviteInput,
  LearnerPatchBody,
  UpdateStaffInput,
} from "@/features/staff/types";

export const staffKeys = {
  all: ["staff"] as const,
  invites: () => [...staffKeys.all, "invites"] as const,
  inviteList: (params?: PaginationParams) => [...staffKeys.invites(), params ?? {}] as const,
  members: () => [...staffKeys.all, "members"] as const,
  memberList: (params?: PaginationParams) => [...staffKeys.members(), params ?? {}] as const,
  adminEnrollments: () => [...staffKeys.all, "adminEnrollments"] as const,
  adminEnrollmentList: (params?: AdminEnrollmentsQuery) =>
    [...staffKeys.adminEnrollments(), params ?? {}] as const,
  adminLearners: () => [...staffKeys.all, "adminLearners"] as const,
  adminLearnerList: (params?: AdminLearnersQuery) =>
    [...staffKeys.adminLearners(), params ?? {}] as const,
  adminPayments: () => [...staffKeys.all, "adminPayments"] as const,
  adminPaymentList: (params?: AdminPaymentsQuery) =>
    [...staffKeys.adminPayments(), params ?? {}] as const,
  adminPaymentsSummary: () => [...staffKeys.all, "adminPaymentsSummary"] as const,
  adminPaymentReceipt: (id: string) => [...staffKeys.all, "adminPaymentReceipt", id] as const,
  adminDashboard: (params?: AdminDashboardQuery) =>
    [...staffKeys.all, "adminDashboard", params ?? {}] as const,
};

export function useStaffInvites(params?: PaginationParams) {
  return useQuery({
    queryKey: staffKeys.inviteList(params),
    queryFn: () => staffApi.getStaffInvites(params),
  });
}

export function useCreateStaffInvite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateStaffInviteInput) => staffApi.createStaffInvite(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.invites() });
    },
  });
}

export function useStaffMembers(params?: PaginationParams) {
  return useQuery({
    queryKey: staffKeys.memberList(params),
    queryFn: () => staffApi.getStaff(params),
  });
}

export function useUpdateStaffMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ lmsUserId, input }: { lmsUserId: string; input: UpdateStaffInput }) =>
      staffApi.updateStaff(lmsUserId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.members() });
    },
  });
}

export function useAdminEnrollments(params?: AdminEnrollmentsQuery) {
  return useQuery({
    queryKey: staffKeys.adminEnrollmentList(params),
    queryFn: () => staffApi.getAdminEnrollments(params),
  });
}

export function useGrantEntitlement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: EntitlementGrantInput) => staffApi.grantEntitlement(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.adminEnrollments() });
    },
  });
}

// ==================== Learners ====================

export function useAdminLearners(params?: AdminLearnersQuery) {
  return useQuery({
    queryKey: staffKeys.adminLearnerList(params),
    queryFn: () => staffApi.getAdminLearners(params),
  });
}

export function usePatchAdminLearner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ lmsUserId, input }: { lmsUserId: string; input: LearnerPatchBody }) =>
      staffApi.patchAdminLearner(lmsUserId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.adminLearners() });
    },
  });
}

// ==================== Payments ====================

export function useAdminPaymentsList(params?: AdminPaymentsQuery) {
  return useQuery({
    queryKey: staffKeys.adminPaymentList(params),
    queryFn: () => staffApi.getAdminPayments(params),
  });
}

export function useAdminPaymentsSummary() {
  return useQuery({
    queryKey: staffKeys.adminPaymentsSummary(),
    queryFn: () => staffApi.getAdminPaymentsSummary(),
  });
}

export function useAdminPaymentReceipt(id: string | null) {
  return useQuery({
    queryKey: staffKeys.adminPaymentReceipt(id ?? ""),
    queryFn: () => staffApi.getAdminPaymentReceipt(id!),
    enabled: Boolean(id),
  });
}

// ==================== Dashboard ====================

export function useAdminDashboard(params?: AdminDashboardQuery) {
  return useQuery({
    queryKey: staffKeys.adminDashboard(params),
    queryFn: () => staffApi.getAdminDashboard(params),
  });
}
