"use client";

import React from "react";
import { AdminHeader } from "./admin-header";
import { AdminStatsGrid } from "./admin-stats-grid";
import { FinancialAnalyticsChart } from "./financial-analytics-chart";
import { TopPerformingCourses } from "./top-performing-courses";
import { RecentEnrollmentsTable } from "./recent-enrollments-table";
import { AgeDistributionChart } from "./age-distribution-chart";
import { AdminOverviewSkeleton } from "./admin-overview-skeleton";
import { useAdminOverview } from "../../hooks/use-admin-overview";

export const AdminOverviewView: React.FC = () => {
  const { stats, recentEnrollments, isLoading } = useAdminOverview();

  if (isLoading) {
    return <AdminOverviewSkeleton />;
  }

  return (
    <div className="flex-1 flex flex-col gap-4 pb-6">
      <AdminHeader title="Welcome Back, Admin" />

      <AdminStatsGrid stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <FinancialAnalyticsChart />
        </div>
        <div className="lg:col-span-1">
          <TopPerformingCourses />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <RecentEnrollmentsTable enrollments={recentEnrollments} />
        </div>
        <div className="lg:col-span-1">
          <AgeDistributionChart />
        </div>
      </div>
    </div>
  );
};
