"use client";

import React from "react";
import { useOnboarding } from "@/features/onboarding/hooks";

export const WelcomeBanner: React.FC = () => {
  const { data: onboarding, isLoading } = useOnboarding("learner");
  const firstName = onboarding?.data?.personalDetails?.firstName;

  return (
    <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-primary tracking-tight">
      {isLoading ? "Welcome Back" : `Welcome Back, ${firstName || "there"}`}
    </h1>
  );
};
