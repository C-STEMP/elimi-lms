import { Suspense } from "react";
import { CoursePlayer } from "@/features/player";
import { InlineSpinner } from "@/shared/components/ui/loader";

export default async function LearnPage({
  params,
}: {
  params: Promise<{ enrollmentId: string }>;
}) {
  const { enrollmentId } = await params;
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen bg-input-bg/40 flex items-center justify-center">
          <InlineSpinner className="w-8 h-8 text-primary-solid" />
        </div>
      }
    >
      <CoursePlayer enrollmentId={enrollmentId} />
    </Suspense>
  );
}
