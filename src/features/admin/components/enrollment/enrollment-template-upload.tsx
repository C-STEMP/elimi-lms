"use client";

import React from "react";
import { FileUpload } from "@/shared/components/ui/file-upload";

export interface EnrollmentTemplateUploadProps {
  fileName?: string;
  onFileSelect: (file: File) => void;
}

export const EnrollmentTemplateUpload: React.FC<EnrollmentTemplateUploadProps> = ({
  fileName,
  onFileSelect,
}) => {
  return (
    <FileUpload
      accept=".csv,.xlsx,.xls"
      maxSizeMB={20}
      fileName={fileName}
      placeholderTitle="Upload Enrollment Template"
      placeholderSubtitle="Click to upload filled template (.csv, .xlsx, .xls)"
      onChange={(file) => {
        if (file) {
          onFileSelect(file);
        }
      }}
    />
  );
};
