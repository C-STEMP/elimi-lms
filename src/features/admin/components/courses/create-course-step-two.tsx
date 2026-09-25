"use client";

import React from "react";
import { Select } from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";
import { FileUpload } from "@/shared/components/ui/file-upload";
import { uploadScormPackage, MAX_SCORM_PACKAGE_MB } from "@/features/storage";
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
  const isUploading = data.uploadStatus === "uploading";
  const isUploadPending = Boolean(data.scormFile) && !data.packageAssetId;

  // Updates only apply while `file` is still the selected one, so a replaced/removed file's
  // late progress or result can't overwrite the current selection.
  const updateUpload = (file: File, patch: Partial<CreateCourseStepTwoData>) =>
    onChange((prev) => (prev.scormFile === file ? { ...prev, ...patch } : prev));

  const startUpload = async (file: File) => {
    try {
      const assetId = await uploadScormPackage(file, (pct) =>
        updateUpload(file, { uploadProgress: pct })
      );
      updateUpload(file, { uploadStatus: "done", uploadProgress: 100, packageAssetId: assetId });
    } catch (err) {
      updateUpload(file, {
        uploadStatus: "error",
        uploadError: (err as { message?: string })?.message || "Upload failed. Select the file again to retry.",
      });
    }
  };

  return (
    <div className="space-y-4 pt-1">
      <FileUpload
        label="Upload SCORM Package"
        accept=".zip"
        maxSizeMB={MAX_SCORM_PACKAGE_MB}
        value={data.scormFile}
        fileName={data.scormFileName}
        placeholderTitle="Upload SCORM File"
        placeholderSubtitle="Supported format: .zip archive"
        simulateProgress={false}
        disabled={isUploading || isSubmitting}
        onChange={(file) => {
          onChange((prev) => ({
            ...prev,
            scormFile: file,
            scormFileName: file?.name || "",
            uploadStatus: file ? "uploading" : "idle",
            uploadProgress: 0,
            uploadError: null,
            packageAssetId: null,
          }));
          if (file) void startUpload(file);
        }}
      />

      {data.scormFile && data.uploadStatus !== "idle" && (
        <div className="-mt-2 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px] text-neutral-secondary">
            <span>
              {data.uploadStatus === "uploading" && "Uploading package..."}
              {data.uploadStatus === "done" && "✓ Package uploaded"}
              {data.uploadStatus === "error" && (
                <span className="text-red-600">{data.uploadError}</span>
              )}
            </span>
            {data.uploadStatus !== "error" && (
              <span className="font-semibold text-primary-solid">{data.uploadProgress}%</span>
            )}
          </div>
          {data.uploadStatus !== "error" && (
            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary-solid via-[#aa1d3f] to-secondary transition-all duration-300 ease-out"
                style={{ width: `${data.uploadProgress}%` }}
              />
            </div>
          )}
        </div>
      )}

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
          disabled={isUploadPending}
          onClick={onSubmit}
        >
          {isSubmitting ? "Creating Course..." : "Add Course"}
        </Button>
      </div>
    </div>
  );
};
