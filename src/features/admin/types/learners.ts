export type LearnersViewMode = "list" | "grid";

export type EnrollmentType = "sponsored" | "unsponsored";

export interface AdminLearnerItem {
  id: string;
  serialNo: string;
  name: string;
  email: string;
  course: string;
  completionRate: number;
  enrolledDate: string;
  status: "active" | "suspended";
}

export interface EnrollLearnerFormData {
  enrollmentType: EnrollmentType;
  organization: string;
  courseId: string;
}
