"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiArrowLeft, FiArrowRight, FiCheck } from "react-icons/fi";
import { Button } from "@/shared/components/ui/button";
import { useToast } from "@/shared/components/ui/toast";
import { useSubmitOnboarding } from "@/features/onboarding/hooks";
import type { LmsPersonaType } from "@/shared/types";

export interface OnboardingInterestsProps {
  persona: LmsPersonaType;
  onBack: () => void;
  onComplete: () => void;
}

// Static list — learners don't call CAP (trades/sectors are admin-only reference data).
const INTEREST_OPTIONS = [
  "Plumbing",
  "Cosmetology",
  "Masonry Works",
  "Painting and Decoration",
  "Air Conditioning & Refrigeration",
];

export const OnboardingInterests: React.FC<OnboardingInterestsProps> = ({
  persona,
  onBack,
  onComplete,
}) => {
  const { toast } = useToast();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const { mutate: submitOnboarding, isPending: isCompleting } = useSubmitOnboarding(persona);


  const toggleInterest = (interest: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(interest)) next.delete(interest);
      else next.add(interest);
      return next;
    });
  };

  const handleComplete = () => {
    submitOnboarding(undefined, {
      onSuccess: () => onComplete(),
      onError: (error) => {
        toast({
          type: "error",
          title: "Couldn't Complete Setup",
          description:
            error.message || "Some required information is still missing. Please review the form.",
        });
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-2xl mx-auto flex flex-col gap-6 select-text"
    >
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl xl:text-3xl font-extrabold tracking-tight text-neutral-primary">
          Select Areas Of Interest
        </h1>
        <p className="text-neutral-secondary text-xs sm:text-sm font-normal mt-1">
          Your area of interest will be used to recommend courses for you
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {INTEREST_OPTIONS.map((interest) => {
          const isSelected = selected.has(interest);
          return (
            <button
              key={interest}
              type="button"
              onClick={() => toggleInterest(interest)}
              className={`flex items-center justify-between gap-2 rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition-all cursor-pointer ${
                isSelected
                  ? "border-primary-solid bg-primary-solid/5 text-neutral-primary"
                  : "border-border-gray/70 bg-white text-text-dark hover:border-primary-solid/40"
              }`}
            >
              <span>{interest}</span>
              <span
                className={`shrink-0 w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                  isSelected
                    ? "bg-primary-solid border-primary-solid text-white"
                    : "border-border-gray bg-white"
                }`}
              >
                {isSelected && <FiCheck className="w-3.5 h-3.5" />}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onBack}
          disabled={isCompleting}
          className="flex items-center gap-2 text-neutral-secondary hover:text-neutral-primary font-medium text-sm transition-colors cursor-pointer select-none focus:outline-none disabled:opacity-50"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back
        </button>

        <Button
          type="button"
          onClick={handleComplete}
          variant="secondary"
          size="md"
          loading={isCompleting}
          className="px-6 h-11 text-white font-bold text-sm bg-secondary hover:bg-secondary-hover rounded-xl flex items-center gap-2 transition-all shadow-lg cursor-pointer"
        >
          <span>Complete</span>
          <FiArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};
