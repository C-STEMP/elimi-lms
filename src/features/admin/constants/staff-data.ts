import type { AddStaffFormData } from "../types/staff";

export const INITIAL_ADD_STAFF_FORM: AddStaffFormData = {
  name: "",
  email: "",
  role: "",
};

export const STAFF_ROLE_OPTIONS = [
  { value: "Super admin", label: "Super admin" },
  { value: "Content Manager", label: "Content Manager" },
  { value: "Regular Admin", label: "Regular Admin" },
  { value: "Admin", label: "Admin" },
];
