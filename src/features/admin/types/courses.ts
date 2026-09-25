export type AdminCourseFilter = "all" | "free" | "paid" | "published" | "drafts";

export interface AdminCourseItem {
  id: string;
  title: string;
  description: string;
  price: string;
  isFree: boolean;
  status: "published" | "draft";
  thumbnailUrl: string;
}

export interface CreateCourseStepOneData {
  title: string;
  description: string;
  courseType: string;
  currency: string;
  price: string;
  sector: string;
  trade: string;
  thumbnailFile: File | null;
  thumbnailPreview: string;
}

export interface CreateCourseStepTwoData {
  scormFile: File | null;
  scormFileName: string;
  /** Upload starts as soon as a file is picked; Add Course waits for "done". */
  uploadStatus: "idle" | "uploading" | "done" | "error";
  uploadProgress: number;
  uploadError: string | null;
  /** Orchestrator assetId, set once the SCORM upload has finished. */
  packageAssetId: string | null;
  displayPackage: string;
  activityAttempts: string;
  minPercentage: string;
  minScore: string;
}

export interface FilterTabItem {
  id: AdminCourseFilter;
  label: string;
}
