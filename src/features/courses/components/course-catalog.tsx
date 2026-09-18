"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { InlineSpinner } from "@/shared/components/ui/loader";
import { DashboardNav } from "@/features/dashboard/components/dashboard-nav";
import { useCourses } from "@/features/courses/hooks";
import { useResolveAssets } from "@/features/storage/hooks";
import { isFree } from "@/shared/lib/money";
import { CatalogCourseCard } from "@/features/courses/components/catalog-course-card";
import type { CourseSummary } from "@/features/courses/types";

type PriceFilter = "all" | "free" | "paid";

const PRICE_FILTERS: { id: PriceFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "free", label: "Free" },
  { id: "paid", label: "Paid" },
];

export const CourseCatalog: React.FC = () => {
  const [q, setQ] = useState("");
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("all");
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [accumulated, setAccumulated] = useState<CourseSummary[]>([]);

  const { data, isLoading, isFetching } = useCourses({ q: q || undefined, limit: 12, cursor });

  useEffect(() => {
    if (!data) return;
    // Syncing accumulated pages from the query result, not re-derivable during render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAccumulated((prev) => (cursor ? [...prev, ...data.data] : data.data));
    // Only re-run when a new page of data arrives for the current cursor.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQ(e.target.value);
    setCursor(undefined);
    setAccumulated([]);
  };

  const thumbnailAssetIds = useMemo(
    () => accumulated.map((c) => c.thumbnailAssetId).filter((id): id is string => Boolean(id)),
    [accumulated]
  );
  const { data: resolvedAssets } = useResolveAssets(thumbnailAssetIds);
  const thumbnailByAssetId = useMemo(() => {
    const map = new Map<string, string>();
    resolvedAssets?.assets.forEach((asset) => map.set(asset.assetId, asset.url));
    return map;
  }, [resolvedAssets]);

  const filteredCourses = useMemo(() => {
    if (priceFilter === "all") return accumulated;
    return accumulated.filter((course) =>
      priceFilter === "free" ? isFree(course.price) : !isFree(course.price)
    );
  }, [accumulated, priceFilter]);

  const hasMore = Boolean(data?.meta?.pagination?.hasMore);

  return (
    <div className="w-full min-h-screen bg-input-bg/40 flex flex-col">
      <DashboardNav title="Browse Courses" rightAction={null} />
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="max-w-7xl xl:max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col gap-6"
      >
        <p className="text-neutral-secondary text-sm -mt-2">
          Find a course to build your skills and get certified.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <Input
            placeholder="Search courses..."
            value={q}
            onChange={handleSearchChange}
            prefix={<FiSearch className="w-4 h-4" />}
            containerClassName="sm:max-w-sm"
          />
          <div className="flex items-center gap-1 bg-white border border-border-gray/60 rounded-full p-1 self-start sm:self-auto">
            {PRICE_FILTERS.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setPriceFilter(filter.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                  priceFilter === filter.id
                    ? "bg-primary-solid text-white"
                    : "text-neutral-secondary hover:text-neutral-primary"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <InlineSpinner />
        ) : filteredCourses.length === 0 ? (
          <div className="bg-white border border-border-gray/60 rounded-2xl py-16 flex flex-col items-center gap-2 text-center">
            <p className="text-neutral-primary font-semibold">No courses found</p>
            <p className="text-neutral-secondary text-sm max-w-sm">
              Try a different search term or check back later for new courses.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredCourses.map((course) => (
                <CatalogCourseCard
                  key={course.id}
                  course={course}
                  thumbnailUrl={
                    course.thumbnailAssetId
                      ? thumbnailByAssetId.get(course.thumbnailAssetId)
                      : undefined
                  }
                />
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  loading={isFetching}
                  onClick={() => setCursor(data?.meta?.pagination?.nextCursor ?? undefined)}
                >
                  Load more
                </Button>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
};
