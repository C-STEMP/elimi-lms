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

export type ScormLessonStatus = "incomplete" | "completed" | "passed" | "failed";

export type ScormCmiCommit = {
  lessonStatus: ScormLessonStatus;
  scoreRaw?: number | null;
  scoreMax?: number | null;
  sessionTime?: string;
  suspendData?: string;
  location?: string;
};

/** Last-committed CMI snapshot, same shape as a commit. */
export type ScormCmiSnapshot = ScormCmiCommit;

export type ScormSession = {
  sessionId: string;
  enrollmentId: string;
  itemId: string;
  packageAssetId?: string;
  scoHref?: string | null;
  launchUrl: string;
  /**
   * Present once the learner has made at least one `POST .../cmi` commit.
   * Omitted on a first-ever launch so the player initializes cold.
   */
  cmi?: ScormCmiSnapshot;
};

export type { ProgressSnapshot, ItemProgress } from "@/shared/types";
