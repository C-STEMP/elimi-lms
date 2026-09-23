"use client";

import React from "react";
import { Select } from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";
import { FileUpload } from "@/shared/components/ui/file-upload";
import {
  ATTEMPT_OPTIONS,
  DISPLAY_PACKAGE_OPTIONS,
  MIN_PERCENTAGE_OPTIONS,
  MIN_SCORE_OPTIONS,
} from "../../constants/courses-form-options";
import type { CreateCourseStepTwoData } from "../../types/courses";

export interface CreateCourseStepTwoProps {
  data: CreateCourseStepTwoData;
  isSubmitting?: boolean;
  onChange: React.Dispatch<React.SetStateAction<CreateCourseStepTwoData>>;
  onSubmit: () => void;
}

export const CreateCourseStepTwo: React.FC<CreateCourseStepTwoProps> = ({
  data,
  isSubmitting = false,
  onChange,
  onSubmit,
}) => {
  return (
    <div className="space-y-4 pt-1">
      <FileUpload
        label="Upload SCORM Package"
        accept=".zip"
        maxSizeMB={50}
        value={data.scormFile}
        fileName={data.scormFileName}
        placeholderTitle="Upload SCORM File"
        placeholderSubtitle="Supported format: .zip archive"
        onChange={(file) => {
          onChange((prev) => ({
            ...prev,
            scormFile: file,
            scormFileName: file?.name || "",
          }));
        }}
      />

      <div className="pt-1">
        <h4 className="text-xs font-bold text-neutral-primary mb-2.5">
          Course Settings
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Display Package"
            placeholder="Select"
            options={DISPLAY_PACKAGE_OPTIONS}
            value={data.displayPackage}
            onChange={(e) =>
              onChange((prev) => ({ ...prev, displayPackage: e.target.value }))
            }
          />

          <Select
            label="Activity Attempts"
            placeholder="Select"
            options={ATTEMPT_OPTIONS}
            value={data.activityAttempts}
            onChange={(e) =>
              onChange((prev) => ({ ...prev, activityAttempts: e.target.value }))
            }
          />
        </div>
      </div>

      <div className="pt-1">
        <h4 className="text-xs font-bold text-neutral-primary mb-2.5">
          Course Completion Policy
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Minimum Percentage"
            placeholder="Select"
            options={MIN_PERCENTAGE_OPTIONS}
            value={data.minPercentage}
            onChange={(e) =>
              onChange((prev) => ({ ...prev, minPercentage: e.target.value }))
            }
          />

          <Select
            label="Required Minimum Score"
            placeholder="Select"
            options={MIN_SCORE_OPTIONS}
            value={data.minScore}
            onChange={(e) =>
              onChange((prev) => ({ ...prev, minScore: e.target.value }))
            }
          />
        </div>
      </div>

      <div className="pt-3">
        <Button
          type="button"
          variant="secondary"
          size="lg"
          fullWidth
          loading={isSubmitting}
          onClick={onSubmit}
        >
          {isSubmitting ? "Processing Course & SCORM..." : "Add Course"}
        </Button>
      </div>
    </div>
  );
};
