import React, { Suspense } from "react";
import { AdminTradesCoursesView } from "@/features/admin";

export const metadata = {
  title: "Trades & Courses Management | Elimi LMS Admin",
  description: "Configure catalogue trade slots, qualification levels and course units",
};

export default function AdminCoursesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      }
    >
      <AdminTradesCoursesView />
    </Suspense>
  );
}
