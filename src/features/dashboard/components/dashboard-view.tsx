"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiAlertCircle, FiArrowRight } from "react-icons/fi";
import { DashboardNav } from "@/features/dashboard/components/dashboard-nav";
import { LearningPromoCard } from "@/features/dashboard/components/learning-promo-card";
import { StatsGrid } from "@/features/dashboard/components/stats-grid";
import { RecommendedCourses } from "@/features/dashboard/components/recommended-courses";
import { useOnboarding } from "@/features/onboarding/hooks";

export const DashboardView: React.FC = () => {
  const { data: onboarding } = useOnboarding("learner");
  const isProfileIncomplete = onboarding && onboarding.status !== "completed";

  return (
    <div className="w-full min-h-screen bg-input-bg/40 flex flex-col">
      <DashboardNav rightAction={null} />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="max-w-7xl xl:max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col gap-6"
      >
        {isProfileIncomplete && (
          <div className="bg-gradient-to-r from-[#75152b]/10 via-[#aa1d3f]/10 to-amber-500/10 border border-primary-solid/20 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-primary-solid text-white flex items-center justify-center shrink-0 shadow-2xs">
                <FiAlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-neutral-primary">
                  Complete your learner profile setup
                </h3>
                <p className="text-xs text-neutral-secondary mt-0.5">
                  Finish your onboarding to unlock course enrollments, track certified competencies, and generate certificates.
                </p>
              </div>
            </div>

            <Link
              href="/onboarding"
              className="bg-primary-solid hover:bg-primary-hover text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all shadow-2xs flex items-center justify-center gap-2 shrink-0 self-start sm:self-auto cursor-pointer"
            >
              <span>Finish Onboarding</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
          <div className="md:col-span-8">
            <LearningPromoCard />
          </div>
          <div className="md:col-span-4">
            <StatsGrid />
          </div>
        </div>

        <RecommendedCourses />
      </motion.div>
    </div>
  );
};
