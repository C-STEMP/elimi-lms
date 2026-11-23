"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiBookOpen, FiClock } from "react-icons/fi";
import { Button } from "@/shared/components/ui/button";
import { InlineSpinner } from "@/shared/components/ui/loader";
import { useToast } from "@/shared/components/ui/toast";
import { DashboardNav } from "@/features/dashboard/components/dashboard-nav";
import { useCourse, useCourseOutline } from "@/features/courses/hooks";
import { CurriculumList } from "@/features/courses/components/curriculum-list";
import {
  CourseArtwork,
  getCourseVisualTheme,
  parseCourseDescriptionMeta,
} from "@/shared/components/ui/course-artwork";
import { useMyEnrollments, useCreateEnrollment } from "@/features/enrollments/hooks";
import { checkoutEnrollment } from "@/features/enrollments/api";
import { checkoutStorage } from "@/shared/lib/checkout-storage";
import { useResolveAssets } from "@/features/storage/hooks";
import { formatMoney, isFree } from "@/shared/lib/money";

export interface CourseDetailViewProps {
  courseId: string;
}

export const CourseDetailView: React.FC<CourseDetailViewProps> = ({ courseId }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const { data: course, isLoading: isLoadingCourse } = useCourse(courseId);
  const { data: outline, isLoading: isLoadingOutline } = useCourseOutline(courseId);
  const { data: enrollments, isLoading: isLoadingEnrollments } = useMyEnrollments();
  const { mutate: createEnrollment, isPending: isEnrolling } = useCreateEnrollment();

  const { data: resolvedAssets } = useResolveAssets(
    course?.thumbnailAssetId ? [course.thumbnailAssetId] : []
  );
  const thumbnailUrl = resolvedAssets?.assets[0]?.url;

  const existingEnrollment = enrollments?.data.find((e) => e.courseId === courseId);

  const proceedToCheckout = async (enrollmentId: string) => {
    setIsRedirecting(true);
    try {
      const result = await checkoutEnrollment(enrollmentId);
      checkoutStorage.setPending({ enrollmentId, courseId });
      window.location.href = result.checkoutUrl;
    } catch {
      setIsRedirecting(false);
      toast({
        type: "error",
        title: "Checkout Failed",
        description: "Unable to start checkout right now. Please try again.",
      });
    }
  };

  const handlePrimaryAction = () => {
    if (existingEnrollment) {
      if (existingEnrollment.status === "pending") {
        proceedToCheckout(existingEnrollment.id);
      } else {
        router.push(`/learn/${existingEnrollment.id}`);
      }
      return;
    }

    createEnrollment(courseId, {
      onSuccess: (enrollment) => {
        if (enrollment.status === "active") {
          toast({
            type: "success",
            title: "Enrolled",
            description: "You're enrolled — let's get started.",
          });
          router.push(`/learn/${enrollment.id}`);
          return;
        }
        proceedToCheckout(enrollment.id);
      },
      onError: (error) => {
        if (
          error.status === 401 ||
          error.message?.toLowerCase().includes("authentication is required")
        ) {
          const currentPath =
            typeof window !== "undefined"
              ? `${window.location.pathname}${window.location.search}`
              : `/courses/${courseId}`;
          router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
          return;
        }
        if (error.status === 403 && error.code === "lms.onboarding.incomplete") {
          toast({
            type: "error",
            title: "Finish Onboarding First",
            description: "Complete your learner profile before enrolling in a course.",
          });
          router.push("/onboarding");
          return;
        }
        toast({
          type: "error",
          title: "Enrollment Failed",
          description: error.message || "Unable to enroll right now.",
        });
      },
    });
  };

  if (isLoadingCourse) {
    return (
      <div className="w-full min-h-screen bg-input-bg/40 flex flex-col">
        <DashboardNav backHref="/courses" backTitle="Courses" rightAction={null} />
        <InlineSpinner className="flex-1" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="w-full min-h-screen bg-input-bg/40 flex flex-col">
        <DashboardNav backHref="/courses" backTitle="Courses" rightAction={null} />
        <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center px-4">
          <p className="text-neutral-primary font-semibold">Course not found</p>
          <Link href="/courses" className="text-primary-solid text-sm font-semibold hover:underline">
            Back to courses
          </Link>
        </div>
      </div>
    );
  }

  const free = isFree(course.price);
  const busy = isEnrolling || isRedirecting;
  const isPendingPayment = existingEnrollment?.status === "pending";
  const totalOutlineItems = (outline?.modules ?? []).reduce(
    (sum, mod) => sum + (mod.items?.length ?? 0),
    0,
  );
  const isCourseEmpty = !isLoadingOutline && totalOutlineItems === 0;
  const meta = parseCourseDescriptionMeta(course.description);
  const theme = getCourseVisualTheme(course.title, course.description);

  let primaryLabel = isCourseEmpty
    ? "Content Coming Soon"
    : free
      ? "Enroll Free"
      : `Buy Now — ${formatMoney(course.price)}`;
  if (existingEnrollment) {
    primaryLabel = isPendingPayment
      ? "Complete Payment"
      : existingEnrollment.status === "completed"
        ? "Review Course"
        : (existingEnrollment.percentComplete ?? 0) === 0
          ? "Start Course"
          : "Continue Learning";
  }

  return (
    <div className="w-full min-h-screen bg-[#f8f7f5] flex flex-col">
      <DashboardNav backHref="/courses" backTitle="Courses" rightAction={null} />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col gap-6"
      >
        <div className="bg-white border border-border-gray/55 rounded-2xl overflow-hidden shadow-xs">
          <CourseArtwork
            title={course.title}
            description={course.description}
            thumbnailUrl={thumbnailUrl}
            className="h-44 sm:h-56"
          />

          <div className="p-5 sm:p-8 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`w-fit text-[11px] font-bold px-2.5 py-1 rounded-full ${
                      free ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80" : "bg-primary-solid/10 text-primary-solid"
                    }`}
                  >
                    {free ? "Free" : "Paid"}
                  </span>
                  {meta.tradeLabel && (
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${theme.badgeBg} ${theme.badgeText}`}
                    >
                      {meta.tradeLabel}
                    </span>
                  )}
                  {meta.levelLabel && (
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-input-bg text-neutral-primary border border-border-gray/50">
                      {meta.levelLabel}
                    </span>
                  )}
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-primary tracking-tight">
                  {course.title}
                </h1>
                <p className="text-neutral-secondary text-sm leading-relaxed">
                  {course.description || "No description available yet."}
                </p>
              </div>

              <div className="sm:w-56 shrink-0 flex flex-col gap-2">
                <span className="text-2xl font-extrabold text-neutral-primary">
                  {free ? "Free" : formatMoney(course.price)}
                </span>
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  fullWidth
                  loading={busy || isLoadingEnrollments}
                  disabled={!existingEnrollment && isCourseEmpty}
                  onClick={handlePrimaryAction}
                >
                  {primaryLabel}
                </Button>
                {!existingEnrollment && isCourseEmpty && (
                  <p className="text-neutral-secondary text-xs text-center">
                    Lessons haven&apos;t been published for this course yet.
                  </p>
                )}
                {isPendingPayment && (
                  <p className="text-neutral-secondary text-xs text-center">
                    Payment pending — complete checkout to unlock this course.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-border-gray/60 rounded-2xl p-5 sm:p-8 flex flex-col gap-4">
          <h2 className="text-lg font-extrabold text-neutral-primary flex items-center gap-2">
            <FiClock className="w-4 h-4" />
            Curriculum
          </h2>

          {isLoadingOutline ? (
            <InlineSpinner />
          ) : totalOutlineItems === 0 ? (
            <p className="text-neutral-secondary text-sm">
              No lessons have been published for this course yet.
            </p>
          ) : (
            <CurriculumList modules={outline!.modules} mode="preview" />
          )}
        </div>
      </motion.div>
    </div>
  );
};
