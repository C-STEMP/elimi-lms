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
  displayPackage: string;
  activityAttempts: string;
  minPercentage: string;
  minScore: string;
}

export interface FilterTabItem {
  id: AdminCourseFilter;
  label: string;
}
