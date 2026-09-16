import type {
  EnrollmentStatus,
  Money,
  PaginationParams,
  ProgressSnapshot,
} from "@/shared/types";

export type EnrollmentsQuery = PaginationParams & {
  status?: EnrollmentStatus;
};

export type EntitlementSource =
  | "self_pay"
  | "admin_grant"
  | "cap_recommendation"
  | "sponsor";

export type EntitlementStatus = "pending" | "active" | "revoked" | "expired";

export type Entitlement = {
  id: string;
  courseId: string;
  learnerLmsUserId: string;
  source: EntitlementSource;
  status: EntitlementStatus;
  sponsorUserId?: string | null;
  sponsorNote?: string | null;
  paymentId?: string | null;
  capApplicationId?: string | null;
  validFrom?: string | null;
  validUntil?: string | null;
};

/** Narrower than EntitlementSource: a grant can never claim `self_pay`. */
export type EntitlementGrantSource = "admin_grant" | "sponsor" | "cap_recommendation";

export type EntitlementGrantInput = {
  courseId: string;
  learnerLmsUserId: string;
  source: EntitlementGrantSource;
  sponsorUserId?: string;
  sponsorNote?: string;
  capApplicationId?: string;
  validUntil?: string;
};

export type Enrollment = {
  id: string;
  courseId: string;
  courseTitle?: string;
  learnerLmsUserId: string;
  status: EnrollmentStatus;
  percentComplete: number;
  entitlement?: Entitlement;
  createdAt?: string;
  completedAt?: string | null;
};

export type EnrollmentDetail = Enrollment & {
  progress?: ProgressSnapshot;
};

export type CheckoutResult = {
  paymentId: string;
  checkoutUrl: string;
  amount: Money;
};
