"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowRight, FiBookOpen, FiLayers } from "react-icons/fi";
import { useCourses } from "@/features/courses/hooks";
import { useCapTrades } from "@/features/courses/hooks/use-course-hierarchy";
import { useCreateEnrollment, useMyEnrollments } from "@/features/enrollments/hooks";
import { useResolveAssets } from "@/features/storage/hooks";
import { useToast } from "@/shared/components/ui/toast";
import { CourseArtwork } from "@/shared/components/ui/course-artwork";
import { CourseCard } from "@/features/dashboard/components/course-card";

export const RecommendedCourses: React.FC = () => {
  const { data: capTrades = [], isLoading: isLoadingTrades } = useCapTrades();
  const { data: courses, isLoading: isLoadingCourses } = useCourses({ limit: 100 });
  const { data: myEnrollments } = useMyEnrollments();
  const { mutate: enroll, isPending, variables: pendingCourseId } = useCreateEnrollment();
  const { toast } = useToast();
  const router = useRouter();

  const allCourses = courses?.data ?? [];

  const assetIdsToResolve = useMemo(() => {
    const ids = new Set<string>();
    capTrades.forEach((t) => {
      if (t.imageAssetId) ids.add(t.imageAssetId);
    });
    allCourses.slice(0, 8).forEach((c) => {
      if (c.thumbnailAssetId) ids.add(c.thumbnailAssetId);
    });
    return Array.from(ids);
  }, [capTrades, allCourses]);

  const { data: resolvedAssets } = useResolveAssets(assetIdsToResolve);
  const assetUrlById = useMemo(() => {
    const map = new Map<string, string>();
    resolvedAssets?.assets.forEach((asset) => map.set(asset.assetId, asset.url));
    return map;
  }, [resolvedAssets]);

  // Count published courses & distinct levels per trade
  const tradeStatsMap = useMemo(() => {
    const map = new Map<string, { courseCount: number; levelIds: Set<string> }>();
    allCourses.forEach((c) => {
      const tId = c.capLinkage?.tradeId;
      if (!tId) return;
      const entry = map.get(tId) ?? { courseCount: 0, levelIds: new Set<string>() };
      entry.courseCount += 1;
      if (c.capLinkage?.qualificationLevelId) {
        entry.levelIds.add(c.capLinkage.qualificationLevelId);
      }
      map.set(tId, entry);
    });
    return map;
  }, [allCourses]);

  const featuredTrades = useMemo(() => {
    return [...capTrades]
      .sort((a, b) => {
        const aCount = tradeStatsMap.get(a.id)?.courseCount ?? 0;
        const bCount = tradeStatsMap.get(b.id)?.courseCount ?? 0;
        if (aCount !== bCount) return bCount - aCount;
        return a.name.localeCompare(b.name);
      })
      .slice(0, 6);
  }, [capTrades, tradeStatsMap]);

  // Featured un-enrolled courses (or first 4 if all enrolled)
  const featuredCourses = useMemo(() => {
    const enrolledIds = new Set(
      (myEnrollments?.data ?? [])
        .filter((e) => e.status === "active" || e.status === "completed")
        .map((e) => e.courseId),
    );
    const unenrolled = allCourses.filter((c) => !enrolledIds.has(c.id));
    return (unenrolled.length > 0 ? unenrolled : allCourses).slice(0, 4);
  }, [allCourses, myEnrollments]);

  const handleEnrollFree = (courseId: string) => {
    enroll(courseId, {
      onSuccess: (enrollment) => {
        toast({
          type: "success",
          title: "Enrolled",
          description: "You're enrolled in this course.",
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
              : "/dashboard";
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

  return (
    <div className="flex flex-col gap-8">
      {/* Primary Discovery: Explore by Trade */}
      {(isLoadingTrades || featuredTrades.length > 0) && (
        <section id="explore-trades" className="flex flex-col gap-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-neutral-primary tracking-tight">
                Explore by Trade
              </h2>
              <p className="text-xs sm:text-sm text-neutral-secondary mt-0.5">
                Pick a trade to view its qualification levels and ordered learning units.
              </p>
            </div>
            <Link
              href="/courses"
              className="text-xs font-bold text-primary-solid hover:underline inline-flex items-center gap-1 shrink-0"
            >
              <span>All Trades</span>
              <FiArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isLoadingTrades ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white border border-border-gray/60 rounded-2xl overflow-hidden animate-pulse"
                >
                  <div className="h-28 bg-gray-200/80" />
                  <div className="p-4 flex flex-col gap-2">
                    <div className="h-4 w-2/3 rounded bg-gray-200" />
                    <div className="h-3 w-full rounded bg-gray-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredTrades.map((trade) => {
                const stats = tradeStatsMap.get(trade.id);
                const levelCount = trade.levelCount ?? stats?.levelIds.size ?? 0;
                const courseCount = stats?.courseCount ?? 0;
                const tradeImg =
                  trade.image ||
                  (trade.imageAssetId ? assetUrlById.get(trade.imageAssetId) : undefined);

                return (
                  <Link
                    key={trade.id}
                    href={`/courses?tradeId=${trade.id}`}
                    className="group bg-white border border-border-gray/55 hover:border-primary-solid/40 rounded-2xl overflow-hidden flex flex-col shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all"
                  >
                    <CourseArtwork
                      title={trade.name}
                      description={trade.description}
                      thumbnailUrl={tradeImg}
                      className="h-28"
                    >
                      {trade.sector?.name && (
                        <span className="absolute top-2.5 left-2.5 z-10 px-2.5 py-0.5 rounded-full bg-white/95 text-neutral-primary text-[10px] font-bold shadow-xs">
                          {trade.sector.name}
                        </span>
                      )}
                    </CourseArtwork>

                    <div className="p-4 flex flex-col gap-2.5 flex-1">
                      <div className="flex flex-col gap-1 flex-1">
                        <h3 className="text-sm sm:text-base font-extrabold text-text-dark group-hover:text-primary-solid transition-colors">
                          {trade.name}
                        </h3>
                        {trade.description && (
                          <p className="text-xs text-neutral-secondary line-clamp-2 leading-relaxed">
                            {trade.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2.5 border-t border-border-gray/35 gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-solid/8 text-primary-solid text-[11px] font-bold">
                            <FiLayers className="w-3 h-3" />
                            <span>
                              {levelCount} {levelCount === 1 ? "Level" : "Levels"}
                            </span>
                          </span>
                          {courseCount > 0 && (
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/80 text-[11px] font-bold">
                              {courseCount} {courseCount === 1 ? "Unit" : "Units"}
                            </span>
                          )}
                        </div>
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-primary-solid shrink-0">
                          <span>Explore</span>
                          <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* Secondary Discovery: Quick-Start Featured Units */}
      <section id="recommended-courses" className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-neutral-primary tracking-tight">
              Featured Units
            </h2>
            <p className="text-xs sm:text-sm text-neutral-secondary mt-0.5">
              Jump straight into popular competency units or browse the full trade catalog.
            </p>
          </div>
          <Link
            href="/courses"
            className="text-xs font-bold text-primary-solid hover:underline inline-flex items-center gap-1 shrink-0"
          >
            <span>Browse Catalog</span>
            <FiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoadingCourses ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white border border-border-gray/60 rounded-2xl overflow-hidden flex flex-col animate-pulse"
              >
                <div className="h-32 bg-gray-200/80" />
                <div className="p-4 flex flex-col gap-2.5">
                  <div className="h-4 w-4/5 rounded bg-gray-200" />
                  <div className="h-3 w-full rounded bg-gray-100" />
                  <div className="h-3 w-2/3 rounded bg-gray-100" />
                  <div className="h-8 w-full rounded-xl bg-gray-200 mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : featuredCourses.length === 0 ? (
          <div className="bg-white border border-border-gray/60 rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-input-bg flex items-center justify-center text-neutral-secondary">
              <FiBookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-neutral-primary">
              No courses available yet
            </h3>
            <p className="text-xs text-neutral-secondary max-w-xs">
              New courses will appear here as soon as they are published.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredCourses.map((course) => {
              const enrollment = myEnrollments?.data.find(
                (e) =>
                  e.courseId === course.id &&
                  (e.status === "active" || e.status === "completed"),
              );
              const thumbnailUrl = course.thumbnailAssetId
                ? assetUrlById.get(course.thumbnailAssetId)
                : undefined;
              return (
                <CourseCard
                  key={course.id}
                  course={course}
                  thumbnailUrl={thumbnailUrl}
                  enrollmentId={enrollment?.id}
                  enrollmentStatus={enrollment?.status}
                  percentComplete={enrollment?.percentComplete}
                  onEnrollFree={handleEnrollFree}
                  isEnrolling={isPending && pendingCourseId === course.id}
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
