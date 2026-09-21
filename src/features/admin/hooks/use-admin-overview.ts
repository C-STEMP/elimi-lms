"use client";

import { useMemo } from "react";
import { LuBookOpen, LuGraduationCap, LuUsers, LuWallet } from "react-icons/lu";
import { useAuthoringCourses } from "@/features/courses/hooks";
import { useAdminEnrollments, useStaffMembers } from "@/features/staff/hooks";
import type {
  AdminStatItem,
  RecentEnrollmentItem,
  MonthlyRevenueItem,
  TopCourseItem,
  AgeDistributionData,
} from "../types/overview";

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function getAmountMinor(item: unknown): number {
  if (!item || typeof item !== "object") return 0;
  const obj = item as Record<string, unknown>;
  if (
    typeof obj.amountMinorUnits === "string" ||
    typeof obj.amountMinorUnits === "number"
  ) {
    return Number(obj.amountMinorUnits);
  }
  const price = obj.price as Record<string, unknown> | undefined;
  if (
    price &&
    (typeof price.amountMinorUnits === "string" ||
      typeof price.amountMinorUnits === "number")
  ) {
    return Number(price.amountMinorUnits);
  }
  return 0;
}

export function useAdminOverview() {
  const coursesQuery = useAuthoringCourses();
  const enrollmentsQuery = useAdminEnrollments();
  const staffQuery = useStaffMembers();

  const isLoading =
    coursesQuery.isLoading ||
    enrollmentsQuery.isLoading ||
    staffQuery.isLoading;

  const rawCourses = coursesQuery.data?.data;
  const rawEnrollments = enrollmentsQuery.data?.data;
  const rawStaff = staffQuery.data?.data;

  const courses = useMemo(() => rawCourses ?? [], [rawCourses]);
  const enrollments = useMemo(() => rawEnrollments ?? [], [rawEnrollments]);
  const staff = useMemo(() => rawStaff ?? [], [rawStaff]);

  const totalCourses = courses.length;
  const totalEnrollments = enrollments.length;
  const totalStaff = staff.length;

  const hasActivity = totalCourses > 0 || totalEnrollments > 0;

  const { totalRevenueMinor, monthlyRevenueMap } = useMemo(() => {
    const map: Record<number, number> = {};
    for (let m = 1; m <= 12; m++) {
      map[m] = 0;
    }

    let revenueMinor = 0;
    enrollments.forEach((e) => {
      const createdAt = e.createdAt ? new Date(e.createdAt) : null;
      const amountMinor = getAmountMinor(e);
      if (amountMinor > 0) {
        revenueMinor += amountMinor;
        if (createdAt && !isNaN(createdAt.getTime())) {
          const month = createdAt.getMonth() + 1;
          map[month] = (map[month] || 0) + amountMinor / 100;
        }
      }
    });

    return { totalRevenueMinor: revenueMinor, monthlyRevenueMap: map };
  }, [enrollments]);

  const formattedRevenue =
    totalRevenueMinor > 0
      ? `₦${(totalRevenueMinor / 100).toLocaleString()}`
      : "₦0";

  const stats: AdminStatItem[] = useMemo(() => {
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
        value: formattedRevenue,
        icon: LuWallet,
        iconColor: "#DC2626",
      },
    ];
  }, [totalCourses, totalEnrollments, totalStaff, formattedRevenue]);

  const monthlyRevenue: MonthlyRevenueItem[] = useMemo(() => {
    return MONTH_NAMES.map((month, idx) => ({
      month,
      revenue: monthlyRevenueMap[idx + 1] || 0,
    }));
  }, [monthlyRevenueMap]);

  const topCourses: TopCourseItem[] = useMemo(() => {
    const map = new Map<string, { title: string; count: number }>();
    enrollments.forEach((e) => {
      const title = e.courseTitle || e.courseId;
      const existing = map.get(title) || { title, count: 0 };
      existing.count += 1;
      map.set(title, existing);
    });

    if (map.size === 0 && courses.length > 0) {
      return courses.slice(0, 5).map((c) => ({
        id: c.id,
        title: c.title,
        count: "0",
      }));
    }

    return Array.from(map.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5)
      .map(([id, item]) => ({
        id,
        title: item.title,
        count: item.count.toLocaleString(),
      }));
  }, [enrollments, courses]);

  const ageDistribution: AgeDistributionData = useMemo(() => {
    return {
      centerMetric: totalEnrollments > 0 ? String(totalEnrollments) : "0",
      segments:
        totalEnrollments > 0
          ? [
              {
                name: "Enrolled",
                count: totalEnrollments,
                percentage: 100,
                color: "#8280EA",
              },
            ]
          : [],
    };
  }, [totalEnrollments]);

  const recentEnrollments: RecentEnrollmentItem[] = useMemo(() => {
    return enrollments.slice(0, 5).map((e) => ({
      id: e.id,
      learnerName: e.learnerLmsUserId || "Learner",
      course: e.courseTitle || e.courseId,
      amountPaid: "Free",
      status:
        e.status === "completed" || e.status === "active"
          ? "Successful"
          : "Pending",
    }));
  }, [enrollments]);

  return {
    stats,
    recentEnrollments,
    monthlyRevenue,
    topCourses,
    ageDistribution,
    hasActivity,
    isLoading,
  };
}
