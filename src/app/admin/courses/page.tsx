import React from "react";
import { AdminCoursesView } from "@/features/admin";

export const metadata = {
  title: "Courses Management | Elimi LMS Admin",
  description: "Manage courses, pricing, SCORM packages and publishing",
};

export default function AdminCoursesPage() {
  return <AdminCoursesView />;
}
