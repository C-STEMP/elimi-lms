import type { EnrollmentStatus, PaginationParams, StaffRole } from "@/shared/types";

export type StaffMembershipStatus = "active" | "suspended";

export type StaffMembership = {
  lmsUserId: string;
  displayName?: string;
  email?: string;
  role: StaffRole;
  status: StaffMembershipStatus;
  createdAt: string;
};

export type UpdateStaffInput = {
  role?: StaffRole;
  status?: StaffMembershipStatus;
};

export type CreateStaffInviteInput = {
  email: string;
  role: StaffRole;
};

export type AdminEnrollmentsQuery = PaginationParams & {
  courseId?: string;
  learnerLmsUserId?: string;
  status?: EnrollmentStatus;
};
