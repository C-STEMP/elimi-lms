"use client";

import React from "react";
import { motion } from "framer-motion";
import { DashboardNav } from "@/features/dashboard/components/dashboard-nav";
import { WelcomeBanner } from "@/features/dashboard/components/welcome-banner";
import { AssessmentCta } from "@/features/dashboard/components/assessment-cta";
import { StatsGrid } from "@/features/dashboard/components/stats-grid";
import { RecommendedCourses } from "@/features/dashboard/components/recommended-courses";

export const DashboardView: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-input-bg/40 flex flex-col">
      <DashboardNav />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="max-w-7xl xl:max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col gap-6"
      >
        <WelcomeBanner />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-4 items-stretch">
          <AssessmentCta />
          <StatsGrid />
        </div>

        <RecommendedCourses />
      </motion.div>
    </div>
  );
};
