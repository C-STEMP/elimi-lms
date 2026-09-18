"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useCourses } from "@/features/courses/hooks";
import { useCreateEnrollment } from "@/features/enrollments/hooks";
import { useToast } from "@/shared/components/ui/toast";
import { CourseCard } from "@/features/dashboard/components/course-card";

export const RecommendedCourses: React.FC = () => {
  const { data: courses, isLoading } = useCourses({ limit: 8 });
  const { mutate: enroll, isPending, variables: pendingCourseId } = useCreateEnrollment();
  const { toast } = useToast();
  const router = useRouter();

  const handleEnrollFree = (courseId: string) => {
    enroll(courseId, {
      onSuccess: (enrollment) => {
        toast({ type: "success", title: "Enrolled", description: "You're enrolled in this course." });
        router.push(`/learn/${enrollment.id}`);
      },
      onError: (error) => {
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
      <h2 className="text-lg font-extrabold text-neutral-primary">Recommended Courses</h2>

      {isLoading ? (
        <p className="text-neutral-secondary text-sm">Loading courses...</p>
      ) : !courses?.data.length ? (
        <p className="text-neutral-secondary text-sm">No courses available yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {courses.data.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onEnrollFree={handleEnrollFree}
              isEnrolling={isPending && pendingCourseId === course.id}
            />
          ))}
        </div>
      )}
    </section>
  );
};
