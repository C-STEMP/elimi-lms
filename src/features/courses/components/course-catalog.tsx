"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiArrowRight,
  FiBookOpen,
  FiCheckCircle,
  FiChevronRight,
  FiGrid,
  FiLayers,
  FiPlayCircle,
  FiSearch,
} from "react-icons/fi";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { InlineSpinner } from "@/shared/components/ui/loader";
import { DashboardNav } from "@/features/dashboard/components/dashboard-nav";
import { useCourses } from "@/features/courses/hooks";
import {
  sortLevelCourses,
  useCapTradeDetail,
  useCapTrades,
  useCapTradeUnits,
} from "@/features/courses/hooks/use-course-hierarchy";
import { useCreateEnrollment, useMyEnrollments } from "@/features/enrollments/hooks";
import { useResolveAssets } from "@/features/storage/hooks";
import { formatMoney, isFree } from "@/shared/lib/money";
import { useToast } from "@/shared/components/ui/toast";
import { CatalogCourseCard } from "@/features/courses/components/catalog-course-card";
import type { CourseSummary } from "@/features/courses/types";

type PriceFilter = "all" | "free" | "paid";
type CatalogView = "trades" | "all";

const PRICE_FILTERS: { id: PriceFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "free", label: "Free" },
  { id: "paid", label: "Paid" },
];

export const CourseCatalog: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const selectedTradeId = searchParams.get("tradeId");
  const selectedLevelId = searchParams.get("levelId");

  const [q, setQ] = useState("");
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("all");
  const [viewMode, setViewMode] = useState<CatalogView>("trades");

  // Fetch CAP trades + published LMS courses
  const { data: capTrades = [], isLoading: isLoadingTrades } = useCapTrades();
  const { data: allCoursesRes, isLoading: isLoadingAllCourses } = useCourses({
    q: q || undefined,
    limit: 100,
  });
  const { data: myEnrollments } = useMyEnrollments();
  const {
    mutate: enrollFree,
    isPending: isEnrolling,
    variables: enrollingCourseId,
  } = useCreateEnrollment();

  // Drill-down detail queries when a trade is selected
  const { data: tradeDetail, isLoading: isLoadingTradeDetail } =
    useCapTradeDetail(selectedTradeId);
  const { data: tradeCoursesRes, isLoading: isLoadingTradeCourses } = useCourses(
    selectedTradeId ? { tradeId: selectedTradeId, limit: 100 } : undefined,
    Boolean(selectedTradeId),
  );
  const { data: capTradeUnits = [] } = useCapTradeUnits(selectedTradeId);

  const allCourses = allCoursesRes?.data ?? [];
  const enrollmentByCourseId = useMemo(() => {
    const map = new Map<
      string,
      { id: string; status: string; percentComplete: number }
    >();
    myEnrollments?.data.forEach((e) => {
      if (e.status === "active" || e.status === "completed") {
        map.set(e.courseId, {
          id: e.id,
          status: e.status,
          percentComplete: e.percentComplete ?? 0,
        });
      }
    });
    return map;
  }, [myEnrollments]);

  // Resolve thumbnails for trades and courses
  const assetIdsToResolve = useMemo(() => {
    const ids = new Set<string>();
    capTrades.forEach((t) => {
      if (t.imageAssetId) ids.add(t.imageAssetId);
    });
    allCourses.forEach((c) => {
      if (c.thumbnailAssetId) ids.add(c.thumbnailAssetId);
    });
    (tradeCoursesRes?.data ?? []).forEach((c) => {
      if (c.thumbnailAssetId) ids.add(c.thumbnailAssetId);
    });
    return Array.from(ids);
  }, [capTrades, allCourses, tradeCoursesRes]);

  const { data: resolvedAssets } = useResolveAssets(assetIdsToResolve);
  const assetUrlById = useMemo(() => {
    const map = new Map<string, string>();
    resolvedAssets?.assets.forEach((a) => map.set(a.assetId, a.url));
    return map;
  }, [resolvedAssets]);

  // Helper to navigate cleanly with URL params
  const navigateCatalog = (tradeId?: string | null, levelId?: string | null) => {
    const params = new URLSearchParams();
    if (tradeId) params.set("tradeId", tradeId);
    if (levelId) params.set("levelId", levelId);
    const qs = params.toString();
    router.push(qs ? `/courses?${qs}` : "/courses");
  };

  const handleEnrollFree = (courseId: string) => {
    enrollFree(courseId, {
      onSuccess: (enrollment) => {
        toast({
          type: "success",
          title: "Enrolled",
          description: "You're enrolled — let's get started!",
        });
        router.push(`/learn/${enrollment.id}`);
      },
      onError: (error) => {
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

  // Count published courses per trade & distinct levels per trade from LMS courses
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

  // Sort trades: those with published courses first, then alphabetical
  const sortedTrades = useMemo(() => {
    return [...capTrades].sort((a, b) => {
      const aCount = tradeStatsMap.get(a.id)?.courseCount ?? 0;
      const bCount = tradeStatsMap.get(b.id)?.courseCount ?? 0;
      if (aCount > 0 && bCount === 0) return -1;
      if (bCount > 0 && aCount === 0) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [capTrades, tradeStatsMap]);

  // Courses belonging to the selected trade
  const selectedTradeCourses = useMemo<CourseSummary[]>(() => {
    const raw = tradeCoursesRes?.data ?? [];
    if (!selectedTradeId) return [];
    const scoped = raw.filter(
      (c) => !c.capLinkage?.tradeId || c.capLinkage.tradeId === selectedTradeId,
    );
    if (priceFilter === "all") return scoped;
    return scoped.filter((c) =>
      priceFilter === "free" ? isFree(c.price) : !isFree(c.price),
    );
  }, [tradeCoursesRes, selectedTradeId, priceFilter]);

  // Levels for the selected trade (sorted by level number ascending)
  const qualificationLevels = useMemo(() => {
    const levels = tradeDetail?.activeNosDocument?.qualificationLevels ?? [];
    return [...levels].sort((a, b) => a.level - b.level);
  }, [tradeDetail]);

  const selectedLevel = useMemo(
    () => qualificationLevels.find((l) => l.id === selectedLevelId) ?? null,
    [qualificationLevels, selectedLevelId],
  );

  // Ordered units/courses for the selected level
  const orderedLevelCourses = useMemo(() => {
    if (!selectedLevelId) return [];
    const levelCourses = selectedTradeCourses.filter(
      (c) => c.capLinkage?.qualificationLevelId === selectedLevelId,
    );
    const levelCapUnits = capTradeUnits.filter(
      (u) => !u.qualificationLevelId || u.qualificationLevelId === selectedLevelId,
    );
    return sortLevelCourses(levelCourses, levelCapUnits);
  }, [selectedTradeCourses, selectedLevelId, capTradeUnits]);

  // Unassigned courses under the selected trade (if any lack qualificationLevelId)
  const unassignedTradeCourses = useMemo(() => {
    if (!selectedTradeId) return [];
    const validLevelIds = new Set(qualificationLevels.map((l) => l.id));
    return selectedTradeCourses.filter(
      (c) =>
        !c.capLinkage?.qualificationLevelId ||
        (validLevelIds.size > 0 && !validLevelIds.has(c.capLinkage.qualificationLevelId)),
    );
  }, [selectedTradeId, selectedTradeCourses, qualificationLevels]);

  // Flat search / All Courses filtered list
  const flatFilteredCourses = useMemo(() => {
    if (priceFilter === "all") return allCourses;
    return allCourses.filter((course) =>
      priceFilter === "free" ? isFree(course.price) : !isFree(course.price),
    );
  }, [allCourses, priceFilter]);

  const selectedTradeName =
    tradeDetail?.name ??
    capTrades.find((t) => t.id === selectedTradeId)?.name ??
    "Trade";

  // Fall back to flat view if searching, user explicitly chose "all", or CAP trades unavailable
  const showFlatCatalog =
    Boolean(q.trim()) ||
    viewMode === "all" ||
    (!isLoadingTrades && capTrades.length === 0 && !selectedTradeId);

  const levelCompletedCount = orderedLevelCourses.filter(
    (entry) => enrollmentByCourseId.get(entry.course.id)?.status === "completed",
  ).length;

  return (
    <div className="w-full min-h-screen bg-input-bg/40 flex flex-col">
      <DashboardNav title="Browse Courses" rightAction={null} />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="max-w-7xl xl:max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col gap-6"
      >
        {/* Top Controls: Search, View Mode, Price Filter */}
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <FiSearch className="w-4 h-4 text-neutral-secondary absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search any course or unit..."
              className="bg-white pl-10"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {capTrades.length > 0 && !q.trim() && (
              <div className="flex items-center gap-1 bg-white border border-border-gray/60 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => setViewMode("trades")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
                    viewMode === "trades"
                      ? "bg-primary-solid text-white"
                      : "text-neutral-secondary hover:text-neutral-primary"
                  }`}
                >
                  <FiLayers className="w-3.5 h-3.5" />
                  <span>By Trade</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setViewMode("all");
                    if (selectedTradeId) navigateCatalog(null, null);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
                    viewMode === "all"
                      ? "bg-primary-solid text-white"
                      : "text-neutral-secondary hover:text-neutral-primary"
                  }`}
                >
                  <FiGrid className="w-3.5 h-3.5" />
                  <span>All Courses</span>
                </button>
              </div>
            )}

            {(showFlatCatalog || selectedLevelId) && (
              <div className="flex items-center gap-1 bg-white border border-border-gray/60 rounded-xl p-1">
                {PRICE_FILTERS.map((filter) => (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => setPriceFilter(filter.id)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      priceFilter === filter.id
                        ? "bg-primary-solid text-white"
                        : "text-neutral-secondary hover:text-neutral-primary"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Breadcrumbs when inside Trade / Level hierarchy */}
        {!showFlatCatalog && selectedTradeId && (
          <nav
            aria-label="Course hierarchy breadcrumb"
            className="flex items-center flex-wrap gap-1.5 text-xs sm:text-sm font-semibold"
          >
            <button
              type="button"
              onClick={() => navigateCatalog(null, null)}
              className="text-neutral-secondary hover:text-primary-solid cursor-pointer transition-colors"
            >
              Trades
            </button>
            <FiChevronRight className="w-4 h-4 text-neutral-secondary/60" />
            {selectedLevelId ? (
              <>
                <button
                  type="button"
                  onClick={() => navigateCatalog(selectedTradeId, null)}
                  className="text-neutral-secondary hover:text-primary-solid cursor-pointer transition-colors"
                >
                  {selectedTradeName}
                </button>
                <FiChevronRight className="w-4 h-4 text-neutral-secondary/60" />
                <span className="text-primary-solid font-bold">
                  {selectedLevel ? `Level ${selectedLevel.level}` : "Units"}
                </span>
              </>
            ) : (
              <span className="text-primary-solid font-bold">{selectedTradeName}</span>
            )}
          </nav>
        )}

        {/* VIEW A: Flat / Search Results */}
        {showFlatCatalog ? (
          isLoadingAllCourses ? (
            <InlineSpinner className="py-16" />
          ) : flatFilteredCourses.length === 0 ? (
            <div className="bg-white border border-border-gray/60 rounded-2xl p-12 text-center">
              <p className="text-neutral-primary font-semibold">No courses found</p>
              <p className="text-neutral-secondary text-sm mt-1">
                {q ? `No matches for "${q}".` : "Try a different filter or check back soon."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {flatFilteredCourses.map((course) => (
                <CatalogCourseCard
                  key={course.id}
                  course={course}
                  thumbnailUrl={
                    course.thumbnailAssetId
                      ? assetUrlById.get(course.thumbnailAssetId)
                      : undefined
                  }
                />
              ))}
            </div>
          )
        ) : !selectedTradeId ? (
          /* VIEW B: STEP 1 — TRADES */
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-neutral-primary">
                Choose a Trade
              </h2>
              <p className="text-xs sm:text-sm text-neutral-secondary mt-0.5">
                Select a trade below to view its qualification levels and ordered unit courses.
              </p>
            </div>

            {isLoadingTrades ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white border border-border-gray/60 rounded-2xl overflow-hidden animate-pulse"
                  >
                    <div className="h-36 bg-gray-200/80" />
                    <div className="p-5 flex flex-col gap-2.5">
                      <div className="h-5 w-2/3 rounded bg-gray-200" />
                      <div className="h-3 w-full rounded bg-gray-100" />
                      <div className="h-7 w-1/2 rounded-full bg-gray-100 mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedTrades.map((trade) => {
                  const stats = tradeStatsMap.get(trade.id);
                  const levelCount =
                    trade.levelCount ?? stats?.levelIds.size ?? 0;
                  const courseCount = stats?.courseCount ?? 0;
                  const tradeImg =
                    trade.image ||
                    (trade.imageAssetId ? assetUrlById.get(trade.imageAssetId) : undefined);

                  return (
                    <button
                      key={trade.id}
                      type="button"
                      onClick={() => navigateCatalog(trade.id, null)}
                      className="text-left bg-white border border-border-gray/60 hover:border-primary-solid/40 rounded-2xl overflow-hidden flex flex-col shadow-2xs hover:shadow-md transition-all group cursor-pointer"
                    >
                      <div className="relative h-36 bg-linear-to-br from-primary/15 via-primary/10 to-secondary/20 flex items-center justify-center overflow-hidden">
                        {tradeImg ? (
                          <img
                            src={tradeImg}
                            alt={trade.name}
                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                          />
                        ) : (
                          <FiLayers className="w-10 h-10 text-primary-solid/35" />
                        )}
                        {trade.sector?.name && (
                          <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-white/95 text-neutral-primary text-[10px] font-bold shadow-xs">
                            {trade.sector.name}
                          </span>
                        )}
                      </div>

                      <div className="p-5 flex flex-col gap-3 flex-1">
                        <div className="flex flex-col gap-1 flex-1">
                          <h3 className="text-base font-extrabold text-text-dark group-hover:text-primary-solid transition-colors">
                            {trade.name}
                          </h3>
                          {trade.description && (
                            <p className="text-xs text-neutral-secondary line-clamp-2 leading-relaxed">
                              {trade.description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-border-gray/40 gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2.5 py-1 rounded-full bg-primary-solid/10 text-primary-solid text-[11px] font-bold">
                              {levelCount} {levelCount === 1 ? "Level" : "Levels"}
                            </span>
                            {courseCount > 0 && (
                              <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200/80 text-[11px] font-bold">
                                {courseCount} {courseCount === 1 ? "Course" : "Courses"}
                              </span>
                            )}
                          </div>
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-primary-solid shrink-0">
                            <span>Explore</span>
                            <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ) : !selectedLevelId ? (
          /* VIEW C: STEP 2 — LEVELS UNDER SELECTED TRADE */
          <div className="flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-neutral-primary">
                  {selectedTradeName} — Select a Level
                </h2>
                <p className="text-xs sm:text-sm text-neutral-secondary mt-0.5">
                  Choose a qualification level to see all units arranged in learning order.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigateCatalog(null, null)}
                className="self-start sm:self-auto inline-flex items-center gap-1.5 text-xs font-bold text-neutral-secondary hover:text-primary-solid cursor-pointer"
              >
                <FiArrowLeft className="w-3.5 h-3.5" />
                <span>All Trades</span>
              </button>
            </div>

            {isLoadingTradeDetail || isLoadingTradeCourses ? (
              <InlineSpinner className="py-16" />
            ) : qualificationLevels.length === 0 ? (
              <div className="flex flex-col gap-4">
                {selectedTradeCourses.length === 0 ? (
                  <div className="bg-white border border-border-gray/60 rounded-2xl p-10 text-center">
                    <p className="text-neutral-primary font-semibold">
                      No levels or courses published for {selectedTradeName} yet
                    </p>
                    <p className="text-neutral-secondary text-xs mt-1">
                      Check back soon or browse another trade.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {selectedTradeCourses.map((course) => (
                      <CatalogCourseCard
                        key={course.id}
                        course={course}
                        thumbnailUrl={
                          course.thumbnailAssetId
                            ? assetUrlById.get(course.thumbnailAssetId)
                            : undefined
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {qualificationLevels.map((lvl) => {
                    const levelCourses = selectedTradeCourses.filter(
                      (c) => c.capLinkage?.qualificationLevelId === lvl.id,
                    );
                    const totalCourses = levelCourses.length;
                    const completedInLevel = levelCourses.filter(
                      (c) => enrollmentByCourseId.get(c.id)?.status === "completed",
                    ).length;
                    const percent =
                      totalCourses > 0
                        ? Math.round((completedInLevel / totalCourses) * 100)
                        : 0;

                    return (
                      <button
                        key={lvl.id}
                        type="button"
                        onClick={() => navigateCatalog(selectedTradeId, lvl.id)}
                        className="text-left bg-white border border-border-gray/60 hover:border-primary-solid/40 rounded-2xl p-5 flex flex-col justify-between gap-4 shadow-2xs hover:shadow-md transition-all group cursor-pointer"
                      >
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="px-3 py-1 rounded-full bg-primary-solid text-white text-xs font-extrabold">
                              Level {lvl.level}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/80 text-[11px] font-bold">
                              {totalCourses} {totalCourses === 1 ? "Unit" : "Units"}
                            </span>
                          </div>

                          <h3 className="text-base font-extrabold text-text-dark group-hover:text-primary-solid transition-colors mt-1">
                            {selectedTradeName} — Level {lvl.level}
                          </h3>
                          {lvl.purpose && (
                            <p className="text-xs text-neutral-secondary line-clamp-3 leading-relaxed">
                              {lvl.purpose}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-col gap-2.5 pt-3 border-t border-border-gray/40">
                          {totalCourses > 0 && (
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-secondary">
                                <span>Level Progress</span>
                                <span className="text-text-dark">
                                  {completedInLevel}/{totalCourses} completed
                                </span>
                              </div>
                              <div className="h-1.5 w-full rounded-full bg-input-bg overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    percent === 100 ? "bg-emerald-500" : "bg-secondary"
                                  }`}
                                  style={{ width: `${percent}%` }}
                                />
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between text-xs font-bold text-primary-solid">
                            <span>
                              {totalCourses > 0 ? "View Units in Order" : "No units published yet"}
                            </span>
                            <FiArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {unassignedTradeCourses.length > 0 && (
                  <div className="flex flex-col gap-3 pt-2">
                    <h3 className="text-base font-extrabold text-neutral-primary">
                      Other {selectedTradeName} Courses
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {unassignedTradeCourses.map((course) => (
                        <CatalogCourseCard
                          key={course.id}
                          course={course}
                          thumbnailUrl={
                            course.thumbnailAssetId
                              ? assetUrlById.get(course.thumbnailAssetId)
                              : undefined
                          }
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          /* VIEW D: STEP 3 — ORDERED UNITS / COURSES UNDER SELECTED LEVEL */
          <div className="flex flex-col gap-5">
            <div className="bg-white border border-border-gray/60 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-primary-solid text-white text-[11px] font-bold">
                    {selectedTradeName}
                  </span>
                  {selectedLevel && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold">
                      Level {selectedLevel.level}
                    </span>
                  )}
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-neutral-primary mt-0.5">
                  {selectedLevel
                    ? `${selectedTradeName} — Level ${selectedLevel.level} Learning Path`
                    : `${selectedTradeName} Units`}
                </h2>
                <p className="text-xs text-neutral-secondary">
                  Complete each unit in order. Once you finish a unit, you&apos;ll be guided directly to the next one.
                </p>
              </div>

              <div className="flex flex-col items-start sm:items-end gap-1.5 shrink-0">
                <span className="text-xs font-bold text-text-dark">
                  {levelCompletedCount} of {orderedLevelCourses.length} units completed
                </span>
                <div className="w-44 h-2 rounded-full bg-input-bg overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      orderedLevelCourses.length > 0 &&
                      levelCompletedCount === orderedLevelCourses.length
                        ? "bg-emerald-500"
                        : "bg-secondary"
                    }`}
                    style={{
                      width: `${
                        orderedLevelCourses.length > 0
                          ? Math.round((levelCompletedCount / orderedLevelCourses.length) * 100)
                          : 0
                      }%`,
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => navigateCatalog(selectedTradeId, null)}
                  className="text-xs font-bold text-primary-solid hover:underline inline-flex items-center gap-1 cursor-pointer mt-0.5"
                >
                  <FiArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Levels</span>
                </button>
              </div>
            </div>

            {isLoadingTradeCourses || isLoadingTradeDetail ? (
              <InlineSpinner className="py-16" />
            ) : orderedLevelCourses.length === 0 ? (
              <div className="bg-white border border-border-gray/60 rounded-2xl p-10 text-center">
                <p className="text-neutral-primary font-semibold">
                  No published courses for this level yet
                </p>
                <p className="text-neutral-secondary text-xs mt-1">
                  Try another level or check back soon.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3.5">
                {orderedLevelCourses.map(({ course, unit, stepNumber }) => {
                  const enrollment = enrollmentByCourseId.get(course.id);
                  const isCompleted = enrollment?.status === "completed";
                  const isEnrolled = Boolean(enrollment);
                  const free = isFree(course.price);
                  const thumbnailUrl = course.thumbnailAssetId
                    ? assetUrlById.get(course.thumbnailAssetId)
                    : undefined;

                  return (
                    <div
                      key={course.id}
                      className={`bg-white border rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center gap-4 shadow-2xs hover:shadow-md transition-all ${
                        isCompleted
                          ? "border-emerald-200 bg-emerald-50/20"
                          : isEnrolled
                            ? "border-secondary/60"
                            : "border-border-gray/60 hover:border-primary-solid/35"
                      }`}
                    >
                      {/* Step number & Thumbnail */}
                      <div className="flex items-center gap-3.5 shrink-0">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-sm shrink-0 ${
                            isCompleted
                              ? "bg-emerald-600 text-white"
                              : isEnrolled
                                ? "bg-secondary text-white"
                                : "bg-primary-solid/10 text-primary-solid"
                          }`}
                        >
                          {isCompleted ? <FiCheckCircle className="w-5 h-5" /> : stepNumber}
                        </div>

                        <div className="w-24 h-16 rounded-xl overflow-hidden bg-linear-to-br from-primary/15 to-secondary/20 flex items-center justify-center shrink-0">
                          {thumbnailUrl ? (
                            <img
                              src={thumbnailUrl}
                              alt={course.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FiBookOpen className="w-6 h-6 text-primary-solid/40" />
                          )}
                        </div>
                      </div>

                      {/* Course Info */}
                      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] font-extrabold uppercase tracking-wide text-primary-solid bg-primary-solid/10 px-2 py-0.5 rounded-md">
                            Unit {stepNumber}
                            {unit?.referenceNumber ? ` • ${unit.referenceNumber}` : ""}
                          </span>
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                              free
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-input-bg text-text-dark"
                            }`}
                          >
                            {free ? "Free" : formatMoney(course.price)}
                          </span>
                          {isCompleted && (
                            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                              Completed
                            </span>
                          )}
                        </div>

                        <h3 className="text-sm sm:text-base font-bold text-text-dark leading-snug">
                          {course.title}
                        </h3>
                        {course.description && (
                          <p className="text-xs text-neutral-secondary line-clamp-2">
                            {course.description}
                          </p>
                        )}

                        {isEnrolled && (
                          <div className="flex items-center gap-2.5 mt-1 max-w-xs">
                            <div className="h-1.5 flex-1 rounded-full bg-input-bg overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  isCompleted ? "bg-emerald-500" : "bg-secondary"
                                }`}
                                style={{
                                  width: `${Math.min(100, Math.round(enrollment?.percentComplete ?? 0))}%`,
                                }}
                              />
                            </div>
                            <span className="text-[11px] font-bold text-neutral-secondary">
                              {Math.min(100, Math.round(enrollment?.percentComplete ?? 0))}%
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Action CTA */}
                      <div className="flex items-center gap-2 shrink-0 md:ml-2">
                        {isEnrolled && enrollment ? (
                          <Link href={`/learn/${enrollment.id}`} className="w-full md:w-auto">
                            <Button
                              type="button"
                              variant={isCompleted ? "outline" : "secondary"}
                              size="sm"
                              fullWidth
                              leftIcon={<FiPlayCircle className="w-4 h-4" />}
                            >
                              {isCompleted ? "Review Unit" : "Continue Unit"}
                            </Button>
                          </Link>
                        ) : free ? (
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            loading={isEnrolling && enrollingCourseId === course.id}
                            onClick={() => handleEnrollFree(course.id)}
                            rightIcon={<FiArrowRight className="w-3.5 h-3.5" />}
                            className="w-full md:w-auto"
                          >
                            Start Unit Free
                          </Button>
                        ) : (
                          <Link href={`/courses/${course.id}`} className="w-full md:w-auto">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              fullWidth
                              rightIcon={<FiArrowRight className="w-3.5 h-3.5" />}
                            >
                              View &amp; Enroll
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};
