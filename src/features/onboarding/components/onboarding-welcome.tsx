"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/shared/components/ui/button";

export interface OnboardingWelcomeProps {
  onGetStarted: () => void;
  isStarting?: boolean;
}

export const OnboardingWelcome: React.FC<OnboardingWelcomeProps> = ({ onGetStarted, isStarting }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-110 mx-auto flex flex-col justify-center select-text"
    >
      <div className="mb-6 text-left w-full">
        <h1 className="text-2xl xl:text-3xl font-extrabold tracking-tight text-neutral-primary">
          Welcome to Elimi
        </h1>
        <h2 className="text-neutral-primary font-semibold text-base mt-2 mb-4">
          Build skills. Get certified. Grow your career.
        </h2>

        <p className="text-neutral-primary text-[14px] xl:text-[14.5px] leading-relaxed font-normal">
          Before you can browse courses and enrol, we need a few details to
          set up your learner profile.
        </p>

        <p className="text-neutral-primary text-sm xl:text-base mt-4 mb-6">
          Estimated time: 2 minutes.
        </p>
      </div>

      <div className="w-full">
        <Button
          type="button"
          onClick={onGetStarted}
          variant="secondary"
          size="md"
          loading={isStarting}
          className="w-full h-12.5 text-white font-bold text-base bg-secondary hover:bg-secondary-hover focus:ring-secondary/30 transition-all shadow-lg cursor-pointer"
        >
          Get Started
        </Button>
      </div>
    </motion.div>
  );
};
