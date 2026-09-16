"use client";

import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useToast } from "@/shared/components/ui/toast";
import { useStartOnboarding } from "@/features/onboarding/hooks";
import { OnboardingWelcome } from "./onboarding-welcome";
import { PersonalInfoForm } from "./personal-info-form";
import { OnboardingSuccess } from "./onboarding-success";

type Step = "welcome" | "form" | "success";

export const OnboardingFlow: React.FC = () => {
  const [step, setStep] = useState<Step>("welcome");
  const { toast } = useToast();
  const { mutate: startOnboarding, isPending: isStarting } = useStartOnboarding();

  const handleGetStarted = () => {
    startOnboarding("learner", {
      onSuccess: () => setStep("form"),
      onError: (error) => {
        toast({
          type: "error",
          title: "Couldn't Start Onboarding",
          description: error.message || "Unable to connect. Please try again.",
        });
      },
    });
  };

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <AnimatePresence mode="wait">
        {step === "welcome" && (
          <OnboardingWelcome key="welcome" onGetStarted={handleGetStarted} isStarting={isStarting} />
        )}
        {step === "form" && <PersonalInfoForm key="form" onSuccess={() => setStep("success")} />}
        {step === "success" && <OnboardingSuccess key="success" />}
      </AnimatePresence>
    </div>
  );
};
