import React from "react";
import { AdminEnrollmentView } from "@/features/admin";

export const metadata = {
  title: "Enrollment Management | Elimi LMS Admin",
  description: "View organization enrollments and enroll groups of learners",
};

export default function AdminEnrollmentPage() {
  return <AdminEnrollmentView />;
}
