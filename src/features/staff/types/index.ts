import type {
  EnrollmentStatus,
  Money,
  PaginationParams,
  StaffRole,
} from "@/shared/types";

export type StaffMembershipStatus = "active" | "suspended";

export type StaffMembership = {
  lmsUserId: string;
  displayName?: string | null;
  email?: string | null;
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

// ==================== Learners ====================

export type LearnerRow = {
  lmsUserId: string;
  name: string;
  photoUrl: string | null;
  email: string | null;
  coursesTaken: number;
  completionRate: number;
  joinedAt: string;
  status: "active" | "suspended";
};

export type AdminLearnersQuery = PaginationParams & {
  q?: string;
  sort?: "createdAt" | "name" | "email" | "coursesTaken" | "completionRate";
  order?: "asc" | "desc";
  organizationId?: string;
  status?: "active" | "suspended";
};

export type LearnerPatchBody = {
  status: "active" | "suspended";
};

// ==================== Payments ====================

export type CheckoutPaymentStatus = "pending" | "completed" | "failed";
export type AdminPaymentKind = "course" | "level";

export type AdminPaymentNamedRef = {
  id: string;
  title: string;
};

export type AdminPaymentsSummary = {
  totalRevenue: Money;
  pendingCount: number;
  completedCount: number;
};

export type AdminPaymentListItem = {
  id: string;
  kind: AdminPaymentKind;
  learnerName: string;
  course: AdminPaymentNamedRef | null;
  levelOffering: AdminPaymentNamedRef | null;
  amount: Money;
  status: CheckoutPaymentStatus;
  paidAt: string | null;
  initiatedAt: string | null;
  receiptAvailable: boolean;
};

export type AdminPaymentReceipt = {
  id: string;
  kind: AdminPaymentKind;
  learnerName: string;
  course: AdminPaymentNamedRef | null;
  levelOffering: AdminPaymentNamedRef | null;
  amount: Money;
  currency: string;
  status: CheckoutPaymentStatus;
  paymentId: string;
  paidAt: string | null;
  initiatedAt: string | null;
};

export type AdminPaymentsQuery = PaginationParams & {
  q?: string;
  status?: CheckoutPaymentStatus;
  sort?: "paidAt" | "initiatedAt";
  order?: "asc" | "desc";
};

// ==================== Dashboard ====================

export type GenderKey = "female" | "male" | "other" | "unspecified";

export type GenderDistributionBucket = {
  gender: GenderKey;
  count: number;
};

export type AdminDashboardKpis = {
  totalLearners: number;
  totalCourses: number;
  certifiedLearners: number;
  activeEnrollments: number;
};

export type AdminDashboardMonthRevenue = {
  month: number;
  amount: Money;
};

export type AdminDashboardTopCourse = {
  id: string;
  title: string;
  unitId: string | null;
  enrollmentCount: number;
};

export type AdminDashboardTopLevel = {
  id: string;
  title: string;
  enrollmentCount: number;
};

export type AdminDashboard = {
  year: number;
  kpis: AdminDashboardKpis;
  revenueByMonth: AdminDashboardMonthRevenue[];
  topCourses: AdminDashboardTopCourse[];
  topLevels: AdminDashboardTopLevel[];
  genderDistribution: GenderDistributionBucket[];
};

export type AdminDashboardQuery = {
  year?: number;
};
