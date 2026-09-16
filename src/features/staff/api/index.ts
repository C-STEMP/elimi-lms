import { lmsClient } from "@/shared/api/clients";
import { unwrapItem, unwrapList } from "@/shared/api/response";
import type { Invite, PaginationParams } from "@/shared/types";
import type {
  Entitlement,
  EntitlementGrantInput,
  Enrollment,
} from "@/features/enrollments/types";
import type {
  AdminEnrollmentsQuery,
  CreateStaffInviteInput,
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
