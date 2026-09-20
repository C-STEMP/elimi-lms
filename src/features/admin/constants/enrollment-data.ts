import type {
  EnrollLearnersFormData,
  ExportDataFormData,
} from "../types/enrollment";

export const INITIAL_ENROLL_LEARNERS_FORM: EnrollLearnersFormData = {
  enrollmentType: "sponsored",
  organizationName: "",
  organizationEmail: "",
  numberOfStudents: "",
  courses: [""],
  templateFile: null,
};

export const INITIAL_EXPORT_DATA_FORM: ExportDataFormData = {
  organization: "",
  documentType: "pdf",
  email: "",
};

export const DOCUMENT_TYPE_OPTIONS = [
  { value: "pdf", label: "PDF Document (.pdf)" },
  { value: "excel", label: "Excel Spreadsheet (.xlsx)" },
  { value: "csv", label: "CSV Format (.csv)" },
];

export const ENROLLMENT_ORG_OPTIONS = [
  { value: "sifa", label: "SIFA" },
  { value: "eu", label: "European Union" },
  { value: "cstemp", label: "C-STEMP Academy" },
  { value: "dangote", label: "Dangote Foundation" },
];

export const ENROLLMENT_COURSE_OPTIONS = [
  { value: "plumbing_carpentry", label: "Plumbing, Carpentary" },
  { value: "painting_decoration", label: "Painting & Decoration" },
  { value: "electrical_installation", label: "Electrical Installation" },
  { value: "masonry_bricklaying", label: "Masonry & Bricklaying" },
];
