"use client";

import React from "react";
import { CourseThumbnailUpload } from "./course-thumbnail-upload";
import {
  COURSE_TYPE_OPTIONS,
  CURRENCY_OPTIONS,
  SECTOR_OPTIONS,
  TRADE_OPTIONS,
} from "../../constants/courses-form-options";
import type { CreateCourseStepOneData } from "../../types/courses";

export interface CreateCourseStepOneProps {
  data: CreateCourseStepOneData;
  onChange: React.Dispatch<React.SetStateAction<CreateCourseStepOneData>>;
  onNext: () => void;
}

export const CreateCourseStepOne: React.FC<CreateCourseStepOneProps> = ({
  data,
  onChange,
  onNext,
}) => {
  const handleThumbnailSelect = (file: File, preview: string) => {
    onChange((prev) => ({ ...prev, thumbnailFile: file, thumbnailPreview: preview }));
  };

  return (
    <div className="space-y-3.5 pt-1">
      <div>
        <label className="block text-xs font-semibold text-neutral-primary mb-1">Course Title</label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => onChange((prev) => ({ ...prev, title: e.target.value }))}
          placeholder="Type Here"
          className="w-full px-3 py-2 bg-input-bg rounded-xl border border-gray-100 text-xs text-neutral-primary placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-neutral-primary mb-1">Description</label>
        <textarea
          rows={2.5}
          value={data.description}
          onChange={(e) => onChange((prev) => ({ ...prev, description: e.target.value }))}
          placeholder="Type Here"
          className="w-full px-3 py-2 bg-input-bg rounded-xl border border-gray-100 text-xs text-neutral-primary placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-primary resize-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-neutral-primary mb-1">Course Type</label>
          <select
            value={data.courseType}
            onChange={(e) => onChange((prev) => ({ ...prev, courseType: e.target.value }))}
            className="w-full px-3 py-2 bg-input-bg rounded-xl border border-gray-100 text-xs text-neutral-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="">Select</option>
            {COURSE_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-primary mb-1">Course Price</label>
          <div className="flex rounded-xl border border-gray-100 bg-input-bg overflow-hidden">
            <select
              value={data.currency}
              onChange={(e) => onChange((prev) => ({ ...prev, currency: e.target.value }))}
              className="px-2.5 py-2 bg-gray-100 border-r border-gray-200 text-xs font-medium text-neutral-primary cursor-pointer focus:outline-none"
            >
              {CURRENCY_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            <input
              type="text"
              value={data.price}
              onChange={(e) => onChange((prev) => ({ ...prev, price: e.target.value }))}
              placeholder="Type Here"
              className="w-full px-3 py-2 bg-transparent text-xs text-neutral-primary placeholder:text-gray-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-neutral-primary mb-1">Course Sector/Industry</label>
          <select
            value={data.sector}
            onChange={(e) => onChange((prev) => ({ ...prev, sector: e.target.value }))}
            className="w-full px-3 py-2 bg-input-bg rounded-xl border border-gray-100 text-xs text-neutral-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="">Select</option>
            {SECTOR_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-primary mb-1">Trade</label>
          <select
            value={data.trade}
            onChange={(e) => onChange((prev) => ({ ...prev, trade: e.target.value }))}
            className="w-full px-3 py-2 bg-input-bg rounded-xl border border-gray-100 text-xs text-neutral-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="">Select</option>
            {TRADE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <CourseThumbnailUpload
        previewUrl={data.thumbnailPreview}
        onFileSelect={handleThumbnailSelect}
      />

      <button
        type="button"
        onClick={onNext}
        className="w-full py-2.5 mt-2 rounded-xl bg-secondary hover:bg-secondary-hover text-white font-semibold text-xs transition-colors cursor-pointer shadow-2xs"
      >
        Next
      </button>
    </div>
  );
};
