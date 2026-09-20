"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { LuUpload } from "react-icons/lu";

export interface CourseThumbnailUploadProps {
  previewUrl: string;
  onFileSelect: (file: File, previewUrl: string) => void;
}

export const CourseThumbnailUpload: React.FC<CourseThumbnailUploadProps> = ({
  previewUrl,
  onFileSelect,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onFileSelect(file, url);
    }
  };

  return (
    <div>
      <label className="block text-xs font-semibold text-neutral-primary mb-1.5">
        Upload Course Thumbnail
      </label>
      <div className="flex items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-20 h-20 shrink-0 border-2 border-dashed border-rose-300 bg-rose-50/30 rounded-xl flex flex-col items-center justify-center text-rose-500 hover:bg-rose-50/60 transition-colors cursor-pointer relative overflow-hidden"
        >
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Thumbnail preview"
              fill
              className="object-cover"
            />
          ) : (
            <>
              <LuUpload className="w-4 h-4 mb-1" />
              <span className="text-[11px] font-semibold">Upload</span>
            </>
          )}
        </button>
        <p className="text-[11px] text-neutral-secondary leading-normal">
          Upload your course Thumbnail here. 1200×800 at least 5mb. Supported format: .jpg, .jpeg, or .png
        </p>
      </div>
    </div>
  );
};
