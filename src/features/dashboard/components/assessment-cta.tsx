"use client";

import React from "react";
import { Button } from "@/shared/components/ui/button";

const scrollToCourses = () => {
  document.getElementById("recommended-courses")?.scrollIntoView({ behavior: "smooth" });
};

export const AssessmentCta: React.FC = () => {
  return (
    <div className="bg-secondary/10 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
      <div className="flex-1 flex flex-col gap-3 text-center sm:text-left">
        <h2 className="text-lg sm:text-xl font-extrabold text-neutral-primary">
          Ready to put what you have learned to test?
        </h2>
        <p className="text-neutral-secondary text-sm leading-relaxed max-w-md">
          Head over to our assessment platform to challenge your knowledge and earn a
          certificate.
        </p>
        <Button
          type="button"
          onClick={scrollToCourses}
          variant="secondary"
          size="md"
          className="self-center sm:self-start mt-1"
        >
          Start Assessment
        </Button>
      </div>
    </div>
  );
};
