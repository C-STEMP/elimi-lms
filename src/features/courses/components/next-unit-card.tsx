"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowRight, FiAward, FiCheckCircle } from "react-icons/fi";
import { Button } from "@/shared/components/ui/button";
import { useToast } from "@/shared/components/ui/toast";
import { useCreateEnrollment } from "@/features/enrollments/hooks";
import { useNextUnitInLevel } from "@/features/courses/hooks/use-course-hierarchy";
import { isFree } from "@/shared/lib/money";
import type { CourseDetail, CourseSummary } from "@/features/courses/types";

interface NextUnitActionProps {
  course?: CourseSummary | CourseDetail | null;
  variant?: "inline" | "banner";
}

export const NextUnitAction: React.FC<NextUnitActionProps> = ({
  course,
  variant = "banner",
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const { mutate: enroll, isPending: isEnrolling } = useCreateEnrollment();

  const {
    hasLevelContext,
    tradeId,
    currentIndex,
    totalUnitsInLevel,
    nextCourse,
    nextStepNumber,
    nextEnrollment,
    isLastUnitInLevel,
  } = useNextUnitInLevel(course);

  if (!hasLevelContext || totalUnitsInLevel <= 1) {
    return null;
  }

  const handleGoToNextUnit = () => {
    if (!nextCourse) return;

    if (nextEnrollment) {
      router.push(`/learn/${nextEnrollment.id}`);
      return;
    }

    if (isFree(nextCourse.price)) {
      enroll(nextCourse.id, {
        onSuccess: (enrollment) => {
          toast({
            type: "success",
            title: "Starting Next Unit",
            description: `Enrolled in "${nextCourse.title}".`,
          });
          router.push(`/learn/${enrollment.id}`);
        },
        onError: (error) => {
          if (error.status === 403 && error.code === "lms.onboarding.incomplete") {
            router.push("/onboarding");
            return;
          }
          toast({
            type: "error",
            title: "Could not start next unit",
            description: error.message || "Please try opening the unit from the course list.",
          });
          router.push(`/courses/${nextCourse.id}`);
        },
      });
      return;
    }

    router.push(`/courses/${nextCourse.id}`);
  };

  if (variant === "inline") {
    if (nextCourse) {
      return (
        <Button
          type="button"
          variant="primary"
          size="sm"
          loading={isEnrolling}
          onClick={handleGoToNextUnit}
          rightIcon={<FiArrowRight className="w-3.5 h-3.5" />}
        >
          Next Unit{nextStepNumber ? ` (${nextStepNumber}/${totalUnitsInLevel})` : ""}
        </Button>
      );
    }

    if (isLastUnitInLevel && tradeId) {
      return (
        <Link href={`/courses?tradeId=${tradeId}`}>
          <Button
            type="button"
            variant="primary"
            size="sm"
            rightIcon={<FiArrowRight className="w-3.5 h-3.5" />}
          >
            Explore Next Level
          </Button>
        </Link>
      );
    }

    return null;
  }

  // Banner variant (for CertificateDetailView)
  if (nextCourse) {
    return (
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 pt-6">
        <div className="bg-primary-solid/5 border border-primary-solid/20 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-solid text-white flex items-center justify-center shrink-0">
              <FiCheckCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wide text-primary-solid">
                Unit {currentIndex + 1} of {totalUnitsInLevel} Complete
              </span>
              <h3 className="text-sm sm:text-base font-extrabold text-neutral-primary">
                Up Next: Unit {nextStepNumber} — {nextCourse.title}
              </h3>
              <p className="text-xs text-neutral-secondary mt-0.5">
                Continue to the next unit in this level to keep progressing toward full level completion.
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            loading={isEnrolling}
            onClick={handleGoToNextUnit}
            rightIcon={<FiArrowRight className="w-4 h-4" />}
            className="shrink-0"
          >
            Continue to Next Unit
          </Button>
        </div>
      </div>
    );
  }

  if (isLastUnitInLevel && tradeId) {
    return (
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 pt-6">
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <FiAward className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-neutral-primary">
                All {totalUnitsInLevel} Units in This Level Completed!
              </h3>
              <p className="text-xs text-neutral-secondary mt-0.5">
                You&apos;ve reached the final unit of this qualification level. Explore the next level in this trade.
              </p>
            </div>
          </div>

          <Link href={`/courses?tradeId=${tradeId}`} className="shrink-0">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              rightIcon={<FiArrowRight className="w-4 h-4" />}
            >
              View Trade Levels
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return null;
};
