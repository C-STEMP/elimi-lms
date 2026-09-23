"use client";

import React from "react";
import { FileUpload } from "@/shared/components/ui/file-upload";

export interface CourseThumbnailUploadProps {
  previewUrl: string;
  onFileSelect: (file: File, previewUrl: string) => void;
}

export const CourseThumbnailUpload: React.FC<CourseThumbnailUploadProps> = ({
  previewUrl,
  onFileSelect,
}) => {
  return (
    <FileUpload
      label="Upload Course Thumbnail"
      accept="image/png,image/jpeg,image/jpg"
      maxSizeMB={5}
      value={previewUrl || null}
      previewType="thumbnail"
      placeholderTitle="Upload Course Thumbnail"
      placeholderSubtitle="1200×800 at least 5MB. Supported: .jpg, .jpeg, .png"
      onChange={(file, url) => {
        if (file && url) {
          onFileSelect(file, url);
        }
      }}
    />
  );
};
