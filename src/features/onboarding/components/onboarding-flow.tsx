"use client";

import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useToast } from "@/shared/components/ui/toast";
import { useStartOnboarding } from "@/features/onboarding/hooks";
import { roleStorage } from "@/shared/lib/role-storage";
import { OnboardingWelcome } from "./onboarding-welcome";
import { PersonalInfoForm } from "./personal-info-form";
import { OnboardingInterests } from "./onboarding-interests";
import { OnboardingSuccess } from "./onboarding-success";

type Step = "welcome" | "form" | "interests" | "success";

export const OnboardingFlow: React.FC = () => {
  const [step, setStep] = useState<Step>("welcome");
  // Chosen once on /select-role, before registration — read once so it stays
  // stable for the rest of this flow even after it's cleared on completion.
  const [persona] = useState(() => roleStorage.getRole() ?? "learner");
  const { toast } = useToast();
  const { mutate: startOnboarding, isPending: isStarting } = useStartOnboarding();

  const handleGetStarted = () => {
    startOnboarding(persona, {
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

  const handleComplete = () => {
    roleStorage.clearRole();
    setStep("success");
  };

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <AnimatePresence mode="wait">
        {step === "welcome" && (
          <OnboardingWelcome key="welcome" onGetStarted={handleGetStarted} isStarting={isStarting} />
        )}
        {step === "form" && (
          <PersonalInfoForm key="form" persona={persona} onSuccess={() => setStep("interests")} />
        )}
        {step === "interests" && (
          <OnboardingInterests
            key="interests"
            persona={persona}
            onBack={() => setStep("form")}
            onComplete={handleComplete}
          />
        )}
        {step === "success" && <OnboardingSuccess key="success" />}
      </AnimatePresence>
    </div>
  );
};
