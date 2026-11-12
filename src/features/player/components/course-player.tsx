"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { FiAward, FiX } from "react-icons/fi";
import { Button } from "@/shared/components/ui/button";
import { InlineSpinner } from "@/shared/components/ui/loader";
import { DashboardNav } from "@/features/dashboard/components/dashboard-nav";
import { useEnrollment } from "@/features/enrollments/hooks";
import { useCourse, useCourseOutline, courseKeys } from "@/features/courses/hooks";
import { CurriculumList } from "@/features/courses/components/curriculum-list";
import { useEnrollmentProgress, playerKeys } from "@/features/player/hooks";
import { useEnrollmentCertificate } from "@/features/certificates/hooks";
import { useMe } from "@/features/me/hooks";
import { useOnboarding } from "@/features/onboarding/hooks";
import { ItemContentPane } from "@/features/player/components/item-content-pane";
import type { CourseOutlineItem } from "@/features/courses/types";
import type { ItemProgressStatus } from "@/shared/types";

export interface CoursePlayerProps {
  enrollmentId: string;
}

const CertificateBanner: React.FC<{ enrollmentId: string }> = ({ enrollmentId }) => {
  const { data: certificate } = useEnrollmentCertificate(enrollmentId);

  return (
    <div className="bg-green-50 border border-green-200 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center shrink-0">
        <FiAward className="w-6 h-6 text-green-700" />
      </div>
      <div className="flex-1 text-center sm:text-left">
        <h3 className="font-extrabold text-neutral-primary">Course completed!</h3>
        <p className="text-neutral-secondary text-sm">
          {certificate ? "Your certificate is ready." : "Your certificate is being issued."}
        </p>
      </div>
      {certificate ? (
        <Link href={`/certificates/${certificate.id}`}>
          <Button type="button" variant="secondary" size="sm">
            View Certificate
          </Button>
        </Link>
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
  const searchParams = useSearchParams();
  const urlItemId = searchParams.get("item");

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  // Build a lookup map of item progress from the enrollment progress snapshot
  const progressMap = useMemo(() => {
    const map = new Map<string, { status: ItemProgressStatus; locked?: boolean }>();
    if (progress?.items) {
      for (const item of progress.items) {
        map.set(item.itemId, {
          status: item.status,
          locked: item.locked,
        });
      }
    }
    return map;
  }, [progress]);

  // Merge dynamic progress into the outline modules and items
  const modulesWithProgress = useMemo(() => {
    if (!outline?.modules) return [];
    return outline.modules.map((module) => {
      const items = module.items.map((item) => {
        const itemProg = progressMap.get(item.id);
        return {
          ...item,
          progressStatus: itemProg?.status ?? item.progressStatus,
          locked: itemProg?.locked !== undefined ? itemProg.locked : item.locked,
        };
      });
      return {
        ...module,
        items,
      };
    });
  }, [outline, progressMap]);

  const flatItems = useMemo(
    () => modulesWithProgress.flatMap((m) => m.items),
    [modulesWithProgress]
  );

  const effectiveSelectedId = useMemo(() => {
    if (selectedItemId && flatItems.some((i) => i.id === selectedItemId)) {
      return selectedItemId;
    }
    if (urlItemId && flatItems.some((i) => i.id === urlItemId)) {
      return urlItemId;
    }
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(`elimi_last_item_${enrollmentId}`);
        if (saved && flatItems.some((i) => i.id === saved && !i.locked)) {
          return saved;
        }
      } catch {
        // Ignore storage error
      }
    }
    if (flatItems.length > 0) {
      const firstAvailable =
        flatItems.find((i) => !i.locked && i.progressStatus !== "completed") ??
        flatItems.find((i) => !i.locked) ??
        flatItems[0];
      return firstAvailable?.id ?? null;
    }
    return null;
  }, [selectedItemId, urlItemId, flatItems, enrollmentId]);

  useEffect(() => {
    if (effectiveSelectedId && typeof window !== "undefined") {
      try {
        localStorage.setItem(`elimi_last_item_${enrollmentId}`, effectiveSelectedId);
      } catch {
        // Ignore quota error
      }
      const url = new URL(window.location.href);
      if (url.searchParams.get("item") !== effectiveSelectedId) {
        url.searchParams.set("item", effectiveSelectedId);
        window.history.replaceState(null, "", url.toString());
      }
    }
  }, [effectiveSelectedId, enrollmentId]);

  const selectedItem: CourseOutlineItem | undefined = flatItems.find((i) => i.id === effectiveSelectedId);

  const currentIndex = flatItems.findIndex((i) => i.id === effectiveSelectedId);
  const prevItem = currentIndex > 0 ? flatItems[currentIndex - 1] : undefined;
  const nextItem =
    currentIndex >= 0 && currentIndex < flatItems.length - 1
      ? flatItems[currentIndex + 1]
      : undefined;

  const selectItem = (id: string) => {
    setSelectedItemId(id);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (url.searchParams.get("item") !== id) {
        url.searchParams.set("item", id);
        window.history.replaceState(null, "", url.toString());
      }
    }
  };

  const handlePrevious = () => {
    if (prevItem) {
      selectItem(prevItem.id);
    }
  };

  const handleNext = () => {
    if (nextItem && !nextItem.locked) {
      selectItem(nextItem.id);
    }
  };

  const handleProgress = () => {
    queryClient.invalidateQueries({ queryKey: courseKeys.outline(courseId) });
    queryClient.invalidateQueries({ queryKey: playerKeys.progress(enrollmentId) });
  };

  const learnerId = me?.lmsUserId ?? "";
  const personalDetails = onboarding?.data?.personalDetails;
  const learnerName = personalDetails
    ? [personalDetails.firstName, personalDetails.lastName].filter(Boolean).join(" ")
    : "Learner";

  const isCompleted =
    progress?.enrollmentStatus === "completed" ||
    enrollment?.status === "completed";

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
        className="max-w-7xl xl:max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 flex flex-col gap-4"
      >
        {isCompleted && <CertificateBanner enrollmentId={enrollmentId} />}

        {/* Main Course Content Stage - takes whole container by default, outline drawer constrained inside */}
        <main className="bg-white border border-border-gray/70 rounded-2xl shadow-sm w-full flex-1 min-w-0 overflow-hidden flex flex-col relative">
          {selectedItem ? (
            <ItemContentPane
              enrollmentId={enrollmentId}
              item={selectedItem}
              learnerId={learnerId}
              learnerName={learnerName}
              onProgress={handleProgress}
              onPrevious={handlePrevious}
              onNext={handleNext}
              hasPrevious={Boolean(prevItem)}
              hasNext={Boolean(nextItem)}
              previousTitle={prevItem?.title}
              nextTitle={nextItem?.title}
              isNextLocked={Boolean(nextItem?.locked)}
              isSidebarOpen={isSidebarOpen}
              onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
            />
          ) : (
            <div className="h-96 flex items-center justify-center text-neutral-secondary text-sm">
              Select an item from the curriculum to begin.
            </div>
          )}

          {/* Slide-over Course Outline Overlay - Constrained strictly within the content space */}
          <AnimatePresence>
            {isSidebarOpen && (
              <>
                {/* Backdrop within content container only */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setIsSidebarOpen(false)}
                  className="absolute inset-0 z-30 bg-black/35 backdrop-blur-[2px] cursor-pointer"
                />

                {/* Slide-over Drawer strictly within the space of the content */}
                <motion.aside
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", damping: 26, stiffness: 260 }}
                  className="absolute top-0 left-0 bottom-0 z-40 w-80 sm:w-96 max-w-[85%] bg-white shadow-2xl flex flex-col border-r border-border-gray/70"
                >
                  <div className="flex items-center justify-between p-4 border-b border-border-gray/50 bg-gray-50/80">
                    <div>
                      <h3 className="font-extrabold text-sm sm:text-base text-neutral-primary">
                        Course Outline
                      </h3>
                      <p className="text-[11px] text-neutral-secondary font-medium mt-0.5">
                        {flatItems.filter((i) => i.progressStatus === "completed").length} of {flatItems.length} completed
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsSidebarOpen(false)}
                      title="Hide outline"
                      className="p-1.5 rounded-lg text-neutral-secondary hover:text-neutral-primary hover:bg-gray-200/60 transition-colors cursor-pointer"
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4">
                    {modulesWithProgress.length > 0 ? (
                      <CurriculumList
                        modules={modulesWithProgress}
                        mode="interactive"
                        selectedItemId={effectiveSelectedId ?? undefined}
                        onSelectItem={(item) => {
                          selectItem(item.id);
                        }}
                      />
                    ) : (
                      <p className="text-neutral-secondary text-sm">No modules yet.</p>
                    )}
                  </div>
                </motion.aside>
              </>
            )}
          </AnimatePresence>
        </main>
      </motion.div>
    </div>
  );
};
