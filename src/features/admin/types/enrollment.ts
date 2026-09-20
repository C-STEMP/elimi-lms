export type EnrollmentViewMode = "list" | "grid";

import type { EnrollmentType } from "./learners";

export interface AdminEnrollmentItem {
  id: string;
  date: string;
  organizationName: string;
  email: string;
  numberOfStudents: number;
  slotsAvailable: number;
  course: string;
}

export interface EnrollLearnersFormData {
  enrollmentType: EnrollmentType;
  organizationName: string;
  organizationEmail: string;
  numberOfStudents: string;
  courses: string[];
  templateFile: File | null;
}

export interface ExportDataFormData {
  organization: string;
  documentType: string;
  email: string;
}
