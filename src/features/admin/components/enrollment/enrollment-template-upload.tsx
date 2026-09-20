"use client";

import React, { useRef } from "react";
import { LuUpload } from "react-icons/lu";

export interface EnrollmentTemplateUploadProps {
  fileName?: string;
  onFileSelect: (file: File) => void;
}

export const EnrollmentTemplateUpload: React.FC<EnrollmentTemplateUploadProps> = ({
  fileName,
  onFileSelect,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={handleFileChange}
        className="hidden"
      />
      <div
        onClick={() => fileInputRef.current?.click()}
        className="w-full py-5 border-2 border-dashed border-rose-300 bg-rose-50/20 rounded-2xl flex flex-col items-center justify-center hover:bg-rose-50/40 transition-colors cursor-pointer select-none"
      >
        <LuUpload className="w-5 h-5 text-rose-500 mb-1.5" />
        <span className="text-xs font-semibold text-rose-600 underline">
          {fileName || "Download Template"}
        </span>
        <span className="text-[11px] text-gray-400 mt-0.5">Click to Upload</span>
      </div>
    </div>
  );
};
