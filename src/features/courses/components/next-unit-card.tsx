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
          if (
            error.status === 401 ||
            error.message?.toLowerCase().includes("authentication is required")
          ) {
            const currentPath =
              typeof window !== "undefined"
                ? `${window.location.pathname}${window.location.search}`
                : `/courses/${nextCourse.id}`;
            router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
            return;
          }
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

  // Calm, aligned continuation bar (placed below the certificate, matching its width)
  if (nextCourse) {
    return (
      <div className="bg-white border border-gray-200/80 rounded-xl px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-xs font-medium text-neutral-secondary">
            Up next · Unit {nextStepNumber} of {totalUnitsInLevel}
          </span>
          <h3 className="text-sm sm:text-base font-semibold text-neutral-primary truncate">
            {nextCourse.title}
          </h3>
        </div>

        <Button
          type="button"
          variant="primary"
          size="sm"
          loading={isEnrolling}
          onClick={handleGoToNextUnit}
          rightIcon={<FiArrowRight className="w-4 h-4" />}
          className="shrink-0 self-start sm:self-auto"
        >
          Continue
        </Button>
      </div>
    );
  }

  if (isLastUnitInLevel && tradeId) {
    return (
      <div className="bg-white border border-gray-200/80 rounded-xl px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-xs font-medium text-emerald-700">
            Level complete · All {totalUnitsInLevel} units finished
          </span>
          <h3 className="text-sm sm:text-base font-semibold text-neutral-primary">
            Ready for the next qualification level?
          </h3>
        </div>

        <Link href={`/courses?tradeId=${tradeId}`} className="shrink-0 self-start sm:self-auto">
          <Button
            type="button"
            variant="primary"
            size="sm"
            rightIcon={<FiArrowRight className="w-4 h-4" />}
          >
            View Trade Levels
          </Button>
        </Link>
      </div>
    );
  }

  return null;
};
