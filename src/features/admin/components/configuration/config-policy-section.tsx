"use client";

import React from "react";
import { Input } from "@/shared/components/ui/input";
import { FileUpload } from "@/shared/components/ui/file-upload";

export interface ConfigPolicySectionProps {
  title: string;
  textValue: string;
  onTextChange: (val: string) => void;
  file: File | null;
  onFileChange: (file: File | null) => void;
  uploadLabel: string;
}

export const ConfigPolicySection: React.FC<ConfigPolicySectionProps> = ({
  title,
  textValue,
  onTextChange,
  file,
  onFileChange,
  uploadLabel,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs p-6 space-y-4">
      <h2 className="text-base font-bold text-neutral-primary">{title}</h2>

      <Input
        textarea
        rows={4}
        value={textValue}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder="Type here"
      />

      <FileUpload
        accept=".pdf"
        maxSizeMB={15}
        value={file}
        fileName={file?.name}
        placeholderTitle={uploadLabel}
        placeholderSubtitle="Supported format: PDF up to 15MB"
        onChange={(newFile) => onFileChange(newFile)}
      />
    </div>
  );
};
