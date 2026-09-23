"use client";

import React from "react";
import { Input } from "@/shared/components/ui/input";
import { Select } from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";
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
    onChange((prev) => ({
      ...prev,
      thumbnailFile: file,
      thumbnailPreview: preview,
    }));
  };

  return (
    <div className="space-y-3.5 pt-1">
      <Input
        label="Course Title"
        placeholder="Type Here"
        value={data.title}
        onChange={(e) =>
          onChange((prev) => ({ ...prev, title: e.target.value }))
        }
      />

      <Input
        textarea
        rows={3}
        label="Description"
        placeholder="Type Here"
        value={data.description}
        onChange={(e) =>
          onChange((prev) => ({ ...prev, description: e.target.value }))
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Select
          label="Course Type"
          placeholder="Select"
          options={COURSE_TYPE_OPTIONS}
          value={data.courseType}
          onChange={(e) =>
            onChange((prev) => ({ ...prev, courseType: e.target.value }))
          }
        />

        <div className="flex flex-col gap-1.5">
          <label className="block text-xs font-semibold text-neutral-primary select-none">
            Course Price
          </label>
          <div className="flex items-center gap-2">
            <div className="w-28 shrink-0">
              <Select
                placeholder="Currency"
                options={CURRENCY_OPTIONS}
                value={data.currency}
                onChange={(e) =>
                  onChange((prev) => ({ ...prev, currency: e.target.value }))
                }
              />
            </div>
            <div className="flex-1">
              <Input
                placeholder="Price"
                value={data.price}
                onChange={(e) =>
                  onChange((prev) => ({ ...prev, price: e.target.value }))
                }
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Select
          label="Course Sector/Industry"
          placeholder="Select"
          options={SECTOR_OPTIONS}
          value={data.sector}
          onChange={(e) =>
            onChange((prev) => ({ ...prev, sector: e.target.value }))
          }
        />

        <Select
          label="Trade"
          placeholder="Select"
          options={TRADE_OPTIONS}
          value={data.trade}
          onChange={(e) =>
            onChange((prev) => ({ ...prev, trade: e.target.value }))
          }
        />
      </div>

      <CourseThumbnailUpload
        previewUrl={data.thumbnailPreview}
        onFileSelect={handleThumbnailSelect}
      />

      <div className="pt-2">
        <Button
          type="button"
          variant="secondary"
          size="md"
          fullWidth
          onClick={onNext}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
