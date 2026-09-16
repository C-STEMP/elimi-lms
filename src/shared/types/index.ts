/**
 * Envelope shapes are fixed across every LMS endpoint (see API doc §19):
 * lists put the array directly on `data`, never `data.items`.
 */
export type ApiSuccess<T> = {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
};

export type PaginationMeta = {
  pagination: {
    nextCursor: string | null;
    hasMore: boolean;
    limit: number;
  };
};

export type ApiList<T> = {
  success: true;
  data: T[];
  meta?: PaginationMeta;
};

export type ApiErrorEnvelope = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Array<{ field?: string; issue?: string }>;
  };
  requestId?: string;
};

/** Normalized shape the http-client interceptor rejects with. */
export type ApiError = {
  status: number | null;
  code: string;
  message: string;
  details?: Array<{ field?: string; issue?: string }>;
  requestId?: string;
};

export type PaginationParams = {
  cursor?: string;
  limit?: number;
};

export type Money = {
  amountMinorUnits: string;
  currency: string;
};

export type LmsPersonaType = "learner" | "instructor" | "staff";

export type OnboardingStatus = "draft" | "completed";

export type EnrollmentStatus =
  | "pending"
  | "active"
  | "completed"
  | "expired"
  | "withdrawn";

export type StaffRole = "admin" | "content_manager" | "support";

export type InviteKind = "instructor" | "staff";

export type InviteStatus = "pending" | "accepted" | "revoked" | "expired";

export type ItemType =
  | "native_lesson"
  | "video"
  | "quiz"
  | "assignment"
  | "scorm_package";

export type ItemProgressStatus =
  | "not_started"
  | "in_progress"
  | "completed"
  | "failed"
  | "locked";

export type QuizChoice = {
  id: string;
  text: string;
  /** Present on authoring reads/writes; omitted on the learner-facing assessment paper. */
  correct?: boolean;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  choices: QuizChoice[];
};

export type ItemProgress = {
  itemId: string;
  status: ItemProgressStatus;
  scorePercent?: number | null;
  locked?: boolean;
};

export type ProgressSnapshot = {
  enrollmentId: string;
  percentComplete: number;
  enrollmentStatus: EnrollmentStatus;
  certificateIssued?: boolean;
  items: ItemProgress[];
};

export type Invite = {
  id: string;
  kind: InviteKind;
  email: string;
  staffRole?: StaffRole;
  status: InviteStatus;
  createdAt: string;
  acceptedAt?: string | null;
};
