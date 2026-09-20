import React from "react";
import { AdminLearnersView } from "@/features/admin";

export const metadata = {
  title: "Learners Management | Elimi LMS Admin",
  description: "View and manage candidates, enrollment, and learners",
};

export default function AdminLearnersPage() {
  return <AdminLearnersView />;
}
