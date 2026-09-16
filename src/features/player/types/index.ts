import type { ItemType } from "@/shared/types";

export type ItemLaunch = {
  itemId: string;
  type: ItemType;
  /** Native content URL, or an LMS SCORM player URL for scorm_package items. */
  launchUrl?: string;
  /** Set for scorm_package launches. */
  sessionId?: string | null;
};

export type ItemProgressWrite = {
  status: "in_progress" | "completed";
  percent?: number;
};

export type ScormSession = {
  sessionId: string;
  enrollmentId: string;
  itemId: string;
  packageAssetId?: string;
  scoHref?: string | null;
  launchUrl: string;
};

export type ScormLessonStatus = "incomplete" | "completed" | "passed" | "failed";

export type ScormCmiCommit = {
  lessonStatus: ScormLessonStatus;
  scoreRaw?: number | null;
  scoreMax?: number | null;
  sessionTime?: string;
  suspendData?: string;
  location?: string;
};

export type { ProgressSnapshot, ItemProgress } from "@/shared/types";
