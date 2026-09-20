import type { EnrollLearnerFormData } from "../types/learners";

export const INITIAL_ENROLL_FORM: EnrollLearnerFormData = {
  enrollmentType: "sponsored",
  organization: "",
  courseId: "",
};

export const ENROLLMENT_TYPE_OPTIONS = [
  { value: "sponsored", label: "Sponsored" },
  { value: "unsponsored", label: "Unsponsored" },
];

export const ORGANIZATION_OPTIONS = [
  { value: "cstemp", label: "C-STEMP Academy" },
  { value: "dangote", label: "Dangote Industries" },
  { value: "julius_berger", label: "Julius Berger Nigeria" },
  { value: "bua", label: "BUA Foundation" },
];

export const LEARNER_COURSE_OPTIONS = [
  { value: "painting", label: "Introduction To Painting" },
  { value: "carpentry", label: "Carpentry & Joinery" },
  { value: "plumbing", label: "Plumbing & Pipefitting" },
  { value: "masonry", label: "Masonry & Bricklaying" },
];
