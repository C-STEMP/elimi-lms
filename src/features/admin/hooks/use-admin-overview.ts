"use client";

import { useMemo } from "react";
import { LuBookOpen, LuGraduationCap, LuUsers, LuWallet } from "react-icons/lu";
import { useAuthoringCourses } from "@/features/courses/hooks";
import { useAdminEnrollments, useStaffMembers } from "@/features/staff/hooks";
import type { AdminStatItem, RecentEnrollmentItem } from "../types/overview";

export function useAdminOverview() {
  const coursesQuery = useAuthoringCourses();
  const enrollmentsQuery = useAdminEnrollments();
  const staffQuery = useStaffMembers();

  const isLoading = coursesQuery.isLoading || enrollmentsQuery.isLoading || staffQuery.isLoading;

  const stats: AdminStatItem[] = useMemo(() => {
    const totalCourses = coursesQuery.data?.data?.length ?? 0;
    const totalEnrollments = enrollmentsQuery.data?.data?.length ?? 0;
    const totalStaff = staffQuery.data?.data?.length ?? 0;

    return [
      {
        id: "total_courses",
        title: "Total Courses",
        value: totalCourses.toLocaleString(),
        icon: LuBookOpen,
        iconColor: "#4F46E5",
      },
      {
        id: "total_learners",
        title: "Total Learners",
        value: totalEnrollments.toLocaleString(),
        icon: LuGraduationCap,
        iconColor: "#059669",
      },
      {
        id: "active_staff",
        title: "Staff Members",
        value: totalStaff.toLocaleString(),
        icon: LuUsers,
        iconColor: "#D97706",
      },
      {
        id: "platform_revenue",
        title: "Platform Revenue",
        value: "₦0",
        icon: LuWallet,
        iconColor: "#DC2626",
      },
    ];
  }, [coursesQuery.data, enrollmentsQuery.data, staffQuery.data]);

  const recentEnrollments: RecentEnrollmentItem[] = useMemo(() => {
    const list = enrollmentsQuery.data?.data ?? [];
    return list.slice(0, 5).map((e) => ({
      id: e.id,
      learnerName: e.learnerLmsUserId || "Learner",
      course: e.courseTitle || e.courseId,
      amountPaid: "Free",
      status: e.status === "completed" || e.status === "active" ? "Successful" : "Pending",
    }));
  }, [enrollmentsQuery.data]);

  return {
    stats,
    recentEnrollments,
    isLoading,
  };
}
