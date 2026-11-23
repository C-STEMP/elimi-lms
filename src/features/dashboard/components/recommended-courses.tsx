"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowRight, FiBookOpen } from "react-icons/fi";
import { useCourses } from "@/features/courses/hooks";
import { useCreateEnrollment, useMyEnrollments } from "@/features/enrollments/hooks";
import { useResolveAssets } from "@/features/storage/hooks";
import { useToast } from "@/shared/components/ui/toast";
import { CourseCard } from "@/features/dashboard/components/course-card";

export const RecommendedCourses: React.FC = () => {
  const { data: courses, isLoading } = useCourses({ limit: 8 });
  const { data: myEnrollments } = useMyEnrollments();
  const { mutate: enroll, isPending, variables: pendingCourseId } = useCreateEnrollment();
  const { toast } = useToast();
  const router = useRouter();

  const thumbnailAssetIds = useMemo(
    () =>
      (courses?.data ?? [])
        .map((c) => c.thumbnailAssetId)
        .filter((id): id is string => Boolean(id)),
    [courses],
  );
  const { data: resolvedAssets } = useResolveAssets(thumbnailAssetIds);
  const thumbnailByAssetId = useMemo(() => {
    const map = new Map<string, string>();
    resolvedAssets?.assets.forEach((asset) => map.set(asset.assetId, asset.url));
    return map;
  }, [resolvedAssets]);

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
    <section id="recommended-courses" className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold text-neutral-primary">
            Explore Courses
          </h2>
          <p className="text-xs text-neutral-secondary mt-0.5">
            Discover courses to start learning and earn verified certificates.
          </p>
        </div>
        <Link
          href="/courses"
          className="text-xs font-bold text-primary-solid hover:underline inline-flex items-center gap-1 shrink-0"
        >
          <span>Browse All</span>
          <FiArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border border-border-gray/60 rounded-2xl overflow-hidden flex flex-col animate-pulse"
            >
              <div className="h-36 bg-gray-200/80" />
              <div className="p-4 flex flex-col gap-2.5">
                <div className="h-4 w-4/5 rounded bg-gray-200" />
                <div className="h-3 w-full rounded bg-gray-100" />
                <div className="h-3 w-2/3 rounded bg-gray-100" />
                <div className="h-8 w-full rounded-xl bg-gray-200 mt-2" />
              </div>
            </div>
          ))}
        </div>
      ) : !courses?.data.length ? (
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
          {courses.data.map((course) => {
            const enrollment = myEnrollments?.data.find(
              (e) =>
                e.courseId === course.id &&
                (e.status === "active" || e.status === "completed"),
            );
            const thumbnailUrl = course.thumbnailAssetId
              ? thumbnailByAssetId.get(course.thumbnailAssetId)
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
  );
};
