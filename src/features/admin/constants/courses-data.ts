import type {
  FilterTabItem,
  CreateCourseStepOneData,
  CreateCourseStepTwoData,
} from "../types/courses";

export const COURSE_FILTER_TABS: readonly FilterTabItem[] = [
  { id: "all", label: "All" },
  { id: "free", label: "Free" },
  { id: "paid", label: "Paid" },
  { id: "published", label: "Published" },
  { id: "drafts", label: "Drafts" },
] as const;

export const DEFAULT_PAINT_THUMBNAIL =
  "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80";

export const INITIAL_STEP_ONE: CreateCourseStepOneData = {
  title: "",
  description: "",
  courseType: "",
  currency: "NGN",
  price: "",
  sector: "",
  trade: "",
  thumbnailFile: null,
  thumbnailPreview: "",
};

export const INITIAL_STEP_TWO: CreateCourseStepTwoData = {
  scormFile: null,
  scormFileName: "",
  uploadStatus: "idle",
  uploadProgress: 0,
  uploadError: null,
  packageAssetId: null,
  displayPackage: "",
  activityAttempts: "unlimited",
  minPercentage: "80%",
  minScore: "80",
};
