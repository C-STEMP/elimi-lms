"use client";

import React, { useRef } from "react";
import { LuUpload } from "react-icons/lu";
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange((prev) => ({ ...prev, scormFile: file, scormFileName: file.name }));
    }
  };

  return (
    <div className="space-y-4 pt-1">
      <div>
        <label className="block text-xs font-semibold text-neutral-primary mb-1.5">
          Upload SCORM Package
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept=".zip"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-6 border-2 border-dashed border-rose-300 bg-rose-50/20 rounded-2xl flex flex-col items-center justify-center hover:bg-rose-50/40 transition-colors cursor-pointer"
        >
          <LuUpload className="w-5 h-5 text-rose-500 mb-1.5" />
          <span className="text-xs font-semibold text-rose-600">
            {data.scormFileName || "Upload SCORM File"}
          </span>
          <span className="text-[11px] text-gray-400 mt-0.5">ZIP</span>
        </button>
      </div>

      <div className="pt-1">
        <h4 className="text-xs font-bold text-neutral-primary mb-2.5">
          Course Settings
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-medium text-neutral-secondary mb-1">
              Display Package
            </label>
            <select
              value={data.displayPackage}
              onChange={(e) => onChange((prev) => ({ ...prev, displayPackage: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-input-bg rounded-xl border border-gray-100 text-xs text-neutral-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="">Select</option>
              {DISPLAY_PACKAGE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-neutral-secondary mb-1">
              Activity Attempts
            </label>
            <select
              value={data.activityAttempts}
              onChange={(e) => onChange((prev) => ({ ...prev, activityAttempts: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-input-bg rounded-xl border border-gray-100 text-xs text-neutral-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              {ATTEMPT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="pt-1">
        <h4 className="text-xs font-bold text-neutral-primary mb-2.5">
          Course Completion Policy
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-medium text-neutral-secondary mb-1">
              Minimum Percentage
            </label>
            <select
              value={data.minPercentage}
              onChange={(e) => onChange((prev) => ({ ...prev, minPercentage: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-input-bg rounded-xl border border-gray-100 text-xs text-neutral-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="">Select</option>
              {MIN_PERCENTAGE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-neutral-secondary mb-1">
              Required Minimum Score
            </label>
            <select
              value={data.minScore}
              onChange={(e) => onChange((prev) => ({ ...prev, minScore: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-input-bg rounded-xl border border-gray-100 text-xs text-neutral-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="">Select</option>
              {MIN_SCORE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <button
        type="button"
        disabled={isSubmitting}
        onClick={onSubmit}
        className="w-full py-3 mt-4 rounded-xl bg-secondary hover:bg-secondary-hover disabled:opacity-50 text-white font-semibold text-sm transition-colors cursor-pointer shadow-2xs flex items-center justify-center gap-2"
      >
        {isSubmitting ? "Processing Course & SCORM..." : "Add Course"}
      </button>
    </div>
  );
};
