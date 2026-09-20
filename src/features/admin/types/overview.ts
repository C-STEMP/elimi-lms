import type { ComponentType } from "react";

export interface AdminStatItem {
  readonly id: string;
  readonly title: string;
  readonly value: string;
  readonly icon: ComponentType<{ className?: string }>;
  readonly iconColor: string;
}

export interface MonthlyRevenueItem {
  readonly month: string;
  readonly revenue: number;
}

export interface TopCourseItem {
  readonly id: string;
  readonly title: string;
  readonly count: string;
}

export type EnrollmentStatus = "Successful" | "Pending" | "Failed";

export interface RecentEnrollmentItem {
  readonly id: string;
  readonly learnerName: string;
  readonly course: string;
  readonly amountPaid: string;
  readonly status: EnrollmentStatus;
}

export interface AgeDistributionSegment {
  readonly name: string;
  readonly count: number;
  readonly percentage: number;
  readonly color: string;
}

export interface AgeDistributionData {
  readonly centerMetric: string;
  readonly segments: readonly AgeDistributionSegment[];
}
