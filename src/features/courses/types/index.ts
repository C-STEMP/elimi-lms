import type {
  ItemProgressStatus,
  ItemType,
  Money,
  PaginationParams,
  QuizQuestion,
} from "@/shared/types";

export type CourseStatus = "draft" | "published" | "archived";

export type CoursesQuery = PaginationParams & {
  q?: string;
  sectorId?: string;
  tradeId?: string;
  unitId?: string;
};

export type AuthoringCoursesQuery = PaginationParams & {
  status?: CourseStatus;
};

export type GenericMessage = {
  message?: string;
};

/** Optional catalogue link for CAP gap-training recommendations. One LMS course maps to at most one CAP unit. */
export type CapLinkage = {
  sectorId?: string | null;
  tradeId?: string | null;
  qualificationLevelId?: string | null;
  unitId?: string | null;
  unitIds?: string[];
};

export type CompletionPolicy = {
  minPercent: number;
  requireAllRequiredItems: boolean;
  requirePassedAssessments: boolean;
};

export type CourseWrite = {
  title?: string;
  description?: string;
  thumbnailAssetId?: string | null;
  price?: Money;
  capLinkage?: CapLinkage;
  completionPolicy?: CompletionPolicy;
};

export type CourseSummary = {
  id: string;
  title: string;
  description?: string;
  thumbnailAssetId?: string | null;
  status: CourseStatus;
  price: Money;
  capLinkage?: CapLinkage;
};

export type CourseDetail = CourseSummary & {
  completionPolicy?: CompletionPolicy;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ModuleWrite = {
  title?: string;
  order?: number;
  optional?: boolean;
};

export type CourseModule = {
  id: string;
  courseId: string;
  title: string;
  order: number;
  optional?: boolean;
};

/**
 * The API doc types `ItemWrite.quiz` explicitly but leaves `CourseItem.quiz`
 * as a bare `object` — assumed to mirror this shape until confirmed.
 */
export type ItemQuiz = {
  passPercent?: number;
  maxAttempts?: number | null;
  questions?: QuizQuestion[];
};

export type ItemWrite = {
  type?: ItemType;
  title?: string;
  order?: number;
  required?: boolean;
  /** Native lesson/video payload (schema-versioned JSON). */
  body?: Record<string, unknown>;
  mediaAssetId?: string | null;
  /** Orchestrator storage assetId of the SCORM 1.2 zip. */
  packageAssetId?: string | null;
  quiz?: ItemQuiz;
};

export type CourseItem = {
  id: string;
  moduleId: string;
  type: ItemType;
  title: string;
  order: number;
  required: boolean;
  body?: Record<string, unknown>;
  mediaAssetId?: string | null;
  packageAssetId?: string | null;
  scoHref?: string | null;
  quiz?: ItemQuiz;
};

export type SequencingRule = {
  /** Module or item id whose prerequisites are listed in `requires`. */
  targetId: string;
  /** Module or item ids that must be completed before `targetId` unlocks. */
  requires: string[];
};

export type SequencingConfig = {
  prerequisites: SequencingRule[];
};

export type CourseOutlineItem = {
  id: string;
  type: ItemType;
  title: string;
  order: number;
  required: boolean;
  /** Present when the caller is enrolled. */
  progressStatus?: ItemProgressStatus;
  locked?: boolean;
};

export type CourseOutlineModule = {
  id: string;
  title: string;
  order: number;
  optional?: boolean;
  locked?: boolean;
  items: CourseOutlineItem[];
};

export type CourseOutline = {
  courseId: string;
  modules: CourseOutlineModule[];
  sequencing?: SequencingConfig;
};

export type CourseInstructorRole = "owner" | "co_instructor";

export type CourseInstructor = {
  lmsUserId: string;
  displayName?: string;
  role: CourseInstructorRole;
};

export type AddCourseInstructorInput = {
  lmsUserId: string;
  role: CourseInstructorRole;
};

export type CourseAuthoring = CourseDetail & {
  outline?: CourseOutline;
  sequencing?: SequencingConfig;
  instructors?: CourseInstructor[];
};
