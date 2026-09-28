import type { ItemType } from "@/shared/types";

export type ItemLaunch = {
  itemId: string;
  type: ItemType;
  launchUrl?: string;
  sessionId?: string | null;
  playerUrl?: string;
  contentBaseUrl?: string;
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

export type ScormCmiSnapshot = ScormCmiCommit;

export type ScormSession = {
  sessionId: string;
  enrollmentId: string;
  itemId: string;
  packageAssetId?: string;
  scoHref?: string | null;
  launchUrl: string;
  playerUrl?: string;
  contentBaseUrl?: string;
  cmi?: ScormCmiSnapshot;
};

export type { ProgressSnapshot, ItemProgress } from "@/shared/types";
