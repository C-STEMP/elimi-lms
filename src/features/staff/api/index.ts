import { lmsClient } from "@/shared/api/clients";
import { unwrapItem, unwrapList } from "@/shared/api/response";
import type { Invite, PaginationParams } from "@/shared/types";
import type {
  Entitlement,
  EntitlementGrantInput,
  Enrollment,
} from "@/features/enrollments/types";
import type {
  AdminDashboard,
  AdminDashboardQuery,
  AdminEnrollmentsQuery,
  AdminLearnersQuery,
  AdminPaymentListItem,
  AdminPaymentReceipt,
  AdminPaymentsQuery,
  AdminPaymentsSummary,
  CreateStaffInviteInput,
  LearnerPatchBody,
  LearnerRow,
  StaffMembership,
  UpdateStaffInput,
} from "@/features/staff/types";

export function getStaffInvites(params?: PaginationParams) {
  return unwrapList<Invite>(lmsClient.get("/staff/invites", { params }));
}

export function createStaffInvite(input: CreateStaffInviteInput) {
  return unwrapItem<Invite>(lmsClient.post("/staff/invites", input));
}

export function getStaff(params?: PaginationParams) {
  return unwrapList<StaffMembership>(lmsClient.get("/staff", { params }));
}

export function updateStaff(lmsUserId: string, input: UpdateStaffInput) {
  return unwrapItem<StaffMembership>(lmsClient.patch(`/staff/${lmsUserId}`, input));
}

export function getAdminEnrollments(params?: AdminEnrollmentsQuery) {
  return unwrapList<Enrollment>(lmsClient.get("/admin/enrollments", { params }));
}

export function grantEntitlement(input: EntitlementGrantInput) {
  return unwrapItem<Entitlement>(lmsClient.post("/admin/entitlements", input));
}

// ==================== Learners ====================

export function getAdminLearners(params?: AdminLearnersQuery) {
  return unwrapList<LearnerRow>(lmsClient.get("/admin/learners", { params }));
}

export function patchAdminLearner(lmsUserId: string, input: LearnerPatchBody) {
  return unwrapItem<LearnerRow>(lmsClient.patch(`/admin/learners/${lmsUserId}`, input));
}

// ==================== Payments ====================

export function getAdminPayments(params?: AdminPaymentsQuery) {
  return unwrapList<AdminPaymentListItem>(lmsClient.get("/admin/payments", { params }));
}

export function getAdminPaymentsSummary() {
  return unwrapItem<AdminPaymentsSummary>(lmsClient.get("/admin/payments/summary"));
}

export function getAdminPaymentReceipt(id: string) {
  return unwrapItem<AdminPaymentReceipt>(lmsClient.get(`/admin/payments/${id}/receipt`));
}

// ==================== Dashboard ====================

export function getAdminDashboard(params?: AdminDashboardQuery) {
  return unwrapItem<AdminDashboard>(lmsClient.get("/admin/dashboard", { params }));
}
