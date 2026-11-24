"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getCapTradeDetail,
  getCapTrades,
  getCapTradeUnits,
} from "@/features/cap/api";
import type { Unit } from "@/features/cap/types";
import { useCourses } from "@/features/courses/hooks";
import { useMyEnrollments } from "@/features/enrollments/hooks";
import type { CourseDetail, CourseSummary } from "@/features/courses/types";

export const capHierarchyKeys = {
  all: ["cap-hierarchy"] as const,
  trades: () => [...capHierarchyKeys.all, "trades"] as const,
  tradeDetail: (tradeId: string) =>
    [...capHierarchyKeys.all, "trade", tradeId] as const,
  tradeUnits: (tradeId: string, level?: number) =>
    [...capHierarchyKeys.all, "units", tradeId, level ?? "all"] as const,
};

const TEN_MINUTES = 1000 * 60 * 10;

export function useCapTrades(enabled = true) {
  return useQuery({
    queryKey: capHierarchyKeys.trades(),
    queryFn: getCapTrades,
    enabled,
    staleTime: TEN_MINUTES,
  });
}

export function useCapTradeDetail(tradeId?: string | null) {
  return useQuery({
    queryKey: capHierarchyKeys.tradeDetail(tradeId ?? ""),
    queryFn: () => getCapTradeDetail(tradeId!),
    enabled: Boolean(tradeId),
    staleTime: TEN_MINUTES,
  });
}

export function useCapTradeUnits(tradeId?: string | null, level?: number) {
  return useQuery({
    queryKey: capHierarchyKeys.tradeUnits(tradeId ?? "", level),
    queryFn: () => getCapTradeUnits(tradeId!, level),
    enabled: Boolean(tradeId),
    staleTime: TEN_MINUTES,
  });
}

export interface OrderedLevelCourse {
  course: CourseSummary;
  unit?: Unit;
  stepNumber: number;
}

/**
 * Sorts courses within a qualification level into the exact sequence defined
 * by the CAP NOS document (`capUnits` array order), falling back to natural
 * title order for any course not matched to a CAP unit.
 */
export function sortLevelCourses(
  courses: CourseSummary[],
  capUnits: Unit[] = [],
): OrderedLevelCourse[] {
  const unitById = new Map<string, { unit: Unit; index: number }>();
  capUnits.forEach((unit, index) => {
    unitById.set(unit.id, { unit, index });
  });

  const sorted = [...courses].sort((a, b) => {
    const aUnitId = a.capLinkage?.unitId ?? a.capLinkage?.unitIds?.[0] ?? "";
    const bUnitId = b.capLinkage?.unitId ?? b.capLinkage?.unitIds?.[0] ?? "";
    const aMatch = aUnitId ? unitById.get(aUnitId) : undefined;
    const bMatch = bUnitId ? unitById.get(bUnitId) : undefined;

    if (aMatch && bMatch) return aMatch.index - bMatch.index;
    if (aMatch) return -1;
    if (bMatch) return 1;

    return a.title.localeCompare(b.title, undefined, {
      numeric: true,
      sensitivity: "base",
    });
  });

  return sorted.map((course, idx) => {
    const unitId = course.capLinkage?.unitId ?? course.capLinkage?.unitIds?.[0] ?? "";
    const unit = unitId ? unitById.get(unitId)?.unit : undefined;
    return {
      course,
      unit,
      stepNumber: idx + 1,
    };
  });
}

/**
 * Resolves the next unit/course in the same Trade + Qualification Level as `course`.
 */
export function useNextUnitInLevel(course?: CourseSummary | CourseDetail | null) {
  const tradeId = course?.capLinkage?.tradeId ?? null;
  const qualificationLevelId = course?.capLinkage?.qualificationLevelId ?? null;

  const hasLevelContext = Boolean(tradeId && qualificationLevelId);

  const { data: levelCoursesRes, isLoading: isLoadingCourses } = useCourses(
    hasLevelContext
      ? {
          tradeId: tradeId!,
          qualificationLevelId: qualificationLevelId!,
          limit: 100,
        }
      : undefined,
    hasLevelContext,
  );

  const { data: tradeDetail } = useCapTradeDetail(
    hasLevelContext ? tradeId : null,
  );
  const { data: capUnits = [] } = useCapTradeUnits(
    hasLevelContext ? tradeId : null,
  );
  const { data: myEnrollments } = useMyEnrollments();

  return useMemo(() => {
    const rawCourses = levelCoursesRes?.data ?? [];
    // Filter strictly to matching qualificationLevelId in case backend ignores the filter
    const scopedCourses = qualificationLevelId
      ? rawCourses.filter(
          (c) =>
            !c.capLinkage?.qualificationLevelId ||
            c.capLinkage.qualificationLevelId === qualificationLevelId,
        )
      : rawCourses;

    const nosLevelUnits = tradeDetail?.activeNosDocument?.qualificationLevels?.find(
      (l) => l.id === qualificationLevelId,
    )?.units;

    const scopedUnits =
      nosLevelUnits && nosLevelUnits.length > 0
        ? nosLevelUnits
        : qualificationLevelId
          ? capUnits.filter(
              (u) => !u.qualificationLevelId || u.qualificationLevelId === qualificationLevelId,
            )
          : capUnits;

    const orderedCourses = sortLevelCourses(scopedCourses, scopedUnits);
    const currentIndex = course
      ? orderedCourses.findIndex((entry) => entry.course.id === course.id)
      : -1;

    const nextEntry =
      currentIndex >= 0 && currentIndex + 1 < orderedCourses.length
        ? orderedCourses[currentIndex + 1]
        : null;

    const nextEnrollment = nextEntry
      ? myEnrollments?.data.find(
          (e) =>
            e.courseId === nextEntry.course.id &&
            (e.status === "active" || e.status === "completed"),
        ) ?? null
      : null;

    return {
      isLoading: isLoadingCourses,
      hasLevelContext,
      tradeId,
      qualificationLevelId,
      orderedCourses,
      currentIndex,
      totalUnitsInLevel: orderedCourses.length,
      nextCourse: nextEntry?.course ?? null,
      nextStepNumber: nextEntry?.stepNumber ?? null,
      nextEnrollment,
      isLastUnitInLevel:
        currentIndex >= 0 &&
        orderedCourses.length > 0 &&
        currentIndex === orderedCourses.length - 1,
    };
  }, [
    levelCoursesRes,
    qualificationLevelId,
    tradeDetail,
    capUnits,
    course,
    myEnrollments,
    isLoadingCourses,
    hasLevelContext,
    tradeId,
  ]);
}
