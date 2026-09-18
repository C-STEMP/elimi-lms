"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FiAward } from "react-icons/fi";
import { Button } from "@/shared/components/ui/button";
import { InlineSpinner } from "@/shared/components/ui/loader";
import { DashboardNav } from "@/features/dashboard/components/dashboard-nav";
import { useEnrollment } from "@/features/enrollments/hooks";
import { useCourse, useCourseOutline, courseKeys } from "@/features/courses/hooks";
import { CurriculumList } from "@/features/courses/components/curriculum-list";
import { useEnrollmentProgress } from "@/features/player/hooks";
import { useEnrollmentCertificate } from "@/features/certificates/hooks";
import { useResolveAssets } from "@/features/storage/hooks";
import { useMe } from "@/features/me/hooks";
import { useOnboarding } from "@/features/onboarding/hooks";
import { ItemContentPane } from "@/features/player/components/item-content-pane";
import type { CourseOutlineItem } from "@/features/courses/types";

export interface CoursePlayerProps {
  enrollmentId: string;
}

const CertificateBanner: React.FC<{ enrollmentId: string }> = ({ enrollmentId }) => {
  const { data: certificate } = useEnrollmentCertificate(enrollmentId);
  const { data: resolvedAssets } = useResolveAssets(
    certificate?.assetId ? [certificate.assetId] : []
  );
  const certificateUrl = resolvedAssets?.assets[0]?.url;

  return (
    <div className="bg-green-50 border border-green-200 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center shrink-0">
        <FiAward className="w-6 h-6 text-green-700" />
      </div>
      <div className="flex-1 text-center sm:text-left">
        <h3 className="font-extrabold text-neutral-primary">Course completed!</h3>
        <p className="text-neutral-secondary text-sm">
          {certificateUrl ? "Your certificate is ready." : "Your certificate is being generated."}
        </p>
      </div>
      {certificateUrl ? (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => window.open(certificateUrl, "_blank", "noopener,noreferrer")}
        >
          View Certificate
        </Button>
      ) : (
        <Link href="/certificates" className="text-primary-solid text-sm font-semibold hover:underline">
          Check certificates
        </Link>
      )}
    </div>
  );
};

export const CoursePlayer: React.FC<CoursePlayerProps> = ({ enrollmentId }) => {
  const queryClient = useQueryClient();
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const pendingAdvanceRef = useRef(false);

  const {
    data: enrollment,
    isLoading: isLoadingEnrollment,
    isError: isEnrollmentError,
  } = useEnrollment(enrollmentId);
  const courseId = enrollment?.courseId ?? "";

  const { data: course } = useCourse(courseId);
  const { data: outline, isLoading: isLoadingOutline } = useCourseOutline(courseId);
  const { data: progress } = useEnrollmentProgress(enrollmentId);
  const { data: me } = useMe();
  const { data: onboarding } = useOnboarding("learner");

  const flatItems = useMemo(
    () => (outline?.modules ?? []).flatMap((m) => m.items),
    [outline]
  );

  const selectedItem: CourseOutlineItem | undefined = flatItems.find((i) => i.id === selectedItemId);

  useEffect(() => {
    if (!outline || flatItems.length === 0) return;

    if (pendingAdvanceRef.current && selectedItemId) {
      pendingAdvanceRef.current = false;
      const currentIndex = flatItems.findIndex((i) => i.id === selectedItemId);
      const next = flatItems[currentIndex + 1];
      if (next && !next.locked) {
        // Auto-advancing to the next unlocked item after a completion, not re-derivable during render.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedItemId(next.id);
        return;
      }
    }

    if (!selectedItemId || !flatItems.some((i) => i.id === selectedItemId)) {
      const firstAvailable =
        flatItems.find((i) => !i.locked && i.progressStatus !== "completed") ??
        flatItems.find((i) => !i.locked) ??
        flatItems[0];
      setSelectedItemId(firstAvailable?.id ?? null);
    }
    // Only re-derive selection when the outline itself changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outline]);

  const handleProgress = () => {
    pendingAdvanceRef.current = true;
    queryClient.invalidateQueries({ queryKey: courseKeys.outline(courseId) });
  };

  const learnerId = me?.lmsUserId ?? "";
  const personalDetails = onboarding?.data?.personalDetails;
  const learnerName = personalDetails
    ? [personalDetails.firstName, personalDetails.lastName].filter(Boolean).join(" ")
    : "Learner";

  const isCompleted = progress?.enrollmentStatus === "completed";

  if (isEnrollmentError) {
    return (
      <div className="w-full min-h-screen bg-input-bg/40 flex flex-col">
        <DashboardNav backHref="/courses" backTitle="Courses" rightAction={null} />
        <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center px-4">
          <p className="text-neutral-primary font-semibold">Enrollment not found</p>
          <Link href="/courses" className="text-primary-solid text-sm font-semibold hover:underline">
            Back to courses
          </Link>
        </div>
      </div>
    );
  }

  if (isLoadingEnrollment || isLoadingOutline || !enrollment) {
    return (
      <div className="w-full min-h-screen bg-input-bg/40 flex flex-col">
        <DashboardNav backHref="/courses" backTitle="Courses" rightAction={null} />
        <InlineSpinner className="flex-1" />
      </div>
    );
  }

  const percentComplete = progress?.percentComplete ?? enrollment.percentComplete ?? 0;

  return (
    <div className="w-full min-h-screen bg-input-bg/40 flex flex-col">
      <DashboardNav
        backHref={`/courses/${courseId}`}
        backTitle={course?.title ?? enrollment.courseTitle ?? "Course"}
        rightAction={null}
      />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="max-w-7xl xl:max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 flex flex-col gap-5"
      >
        <div className="flex flex-col gap-2">
          <div className="w-full h-2 bg-primary-solid/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-solid rounded-full transition-all duration-500"
              style={{ width: `${percentComplete}%` }}
            />
          </div>
          <span className="text-neutral-secondary text-xs font-semibold">
            {percentComplete}% complete
          </span>
        </div>

        {isCompleted && <CertificateBanner enrollmentId={enrollmentId} />}

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-5 items-start">
          <div className="bg-white border border-border-gray/60 rounded-2xl p-4 lg:sticky lg:top-6">
            {outline && outline.modules.length > 0 ? (
              <CurriculumList
                modules={outline.modules}
                mode="interactive"
                selectedItemId={selectedItemId ?? undefined}
                onSelectItem={(item) => setSelectedItemId(item.id)}
              />
            ) : (
              <p className="text-neutral-secondary text-sm">No modules yet.</p>
            )}
          </div>

          <div className="bg-white border border-border-gray/60 rounded-2xl p-4 sm:p-6 min-h-125">
            {selectedItem ? (
              <>
                <h2 className="text-lg font-extrabold text-neutral-primary mb-4">
                  {selectedItem.title}
                </h2>
                <ItemContentPane
                  enrollmentId={enrollmentId}
                  item={selectedItem}
                  learnerId={learnerId}
                  learnerName={learnerName}
                  onProgress={handleProgress}
                />
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-neutral-secondary text-sm">
                Select an item from the curriculum to begin.
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
