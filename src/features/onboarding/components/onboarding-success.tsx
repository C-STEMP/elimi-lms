"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
import { PartyPopperIllustration } from "@/shared/components/ui/svg-icons";

export const OnboardingSuccess: React.FC = () => {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-110 mx-auto flex flex-col items-center justify-center text-center select-text"
    >
      <div className="mb-5 flex justify-center">
        <div className="w-24 h-24 flex items-center justify-center">
          <PartyPopperIllustration className="w-full h-full object-contain" />
        </div>
      </div>

      <h1 className="text-2xl xl:text-3xl font-extrabold tracking-tight text-neutral-primary">
        You&apos;re all set
      </h1>

      <p className="text-neutral-secondary text-sm xl:text-base leading-relaxed mt-4 mb-8 font-normal max-w-sm">
        Your learner profile is ready. You can now browse courses and enrol.
      </p>

      <Button
        type="button"
        onClick={() => router.push("/")}
        variant="secondary"
        size="md"
        className="w-full h-12.5 text-white font-bold text-base bg-secondary hover:bg-secondary-hover transition-all shadow-lg cursor-pointer rounded-xl"
      >
        Go to Elimi
      </Button>
    </motion.div>
  );
};
