import { Suspense } from "react";
import { CourseCatalog } from "@/features/courses";
import { InlineSpinner } from "@/shared/components/ui/loader";

export default function CoursesPage() {
  return (
    <Suspense fallback={<InlineSpinner className="min-h-screen" />}>
      <CourseCatalog />
    </Suspense>
  );
}
