export type StaffViewMode = "list" | "grid";

export type StaffRole =
  | "Super admin"
  | "Content Manager"
  | "Regular Admin"
  | "Admin";

export interface AdminStaffItem {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  date: string;
}

export interface AddStaffFormData {
  name: string;
  email: string;
  role: StaffRole | "";
}
