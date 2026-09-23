"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { LuUpload } from "react-icons/lu";
import { FiCheckCircle, FiTrash2, FiFileText } from "react-icons/fi";
import { FaFilePdf, FaFileArchive, FaFileExcel, FaFileImage } from "react-icons/fa";

export interface FileUploadProps {
  label?: React.ReactNode;
  error?: string;
  helperText?: React.ReactNode;
  accept?: string;
  maxSizeMB?: number;
  value?: File | string | null;
  fileName?: string;
  fileSize?: string;
  onChange?: (file: File | null, previewUrl?: string) => void;
  onUploadComplete?: (file: File) => void;
  disabled?: boolean;
  required?: boolean;
  placeholderTitle?: string;
  placeholderSubtitle?: string;
  previewType?: "default" | "thumbnail" | "compact";
  simulateProgress?: boolean;
  className?: string;
  containerClassName?: string;
}

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

const getFileIcon = (filename: string) => {
  const ext = filename.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "pdf":
      return <FaFilePdf className="w-5 h-5 text-red-500" />;
    case "zip":
    case "rar":
    case "7z":
    case "tar":
    case "gz":
      return <FaFileArchive className="w-5 h-5 text-amber-500" />;
    case "csv":
    case "xls":
    case "xlsx":
      return <FaFileExcel className="w-5 h-5 text-emerald-500" />;
    case "png":
    case "jpg":
    case "jpeg":
    case "webp":
    case "svg":
      return <FaFileImage className="w-5 h-5 text-blue-500" />;
    default:
      return <FiFileText className="w-5 h-5 text-neutral-primary" />;
  }
};

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  error,
  helperText,
  accept,
  maxSizeMB = 25,
  value,
  fileName,
  fileSize,
  onChange,
  onUploadComplete,
  disabled = false,
  required = false,
  placeholderTitle = "Click to Upload",
  placeholderSubtitle,
  previewType = "default",
  simulateProgress = true,
  className = "",
  containerClassName = "",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(
    value instanceof File ? value : null
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    typeof value === "string" ? value : null
  );
  const [activeFileName, setActiveFileName] = useState<string>(
    fileName || (value instanceof File ? value.name : "")
  );
  const [activeFileSize, setActiveFileSize] = useState<string>(
    fileSize || (value instanceof File ? formatBytes(value.size) : "")
  );
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (value instanceof File) {
      setSelectedFile(value);
      setActiveFileName(value.name);
      setActiveFileSize(formatBytes(value.size));
      if (value.type.startsWith("image/")) {
        setPreviewUrl(URL.createObjectURL(value));
      }
    } else if (typeof value === "string") {
      setPreviewUrl(value);
      if (fileName) setActiveFileName(fileName);
    } else if (!value) {
      setSelectedFile(null);
      setPreviewUrl(null);
      setActiveFileName("");
      setActiveFileSize("");
    }
  }, [value, fileName, fileSize]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setLocalError(`File size must not exceed ${maxSizeMB}MB.`);
      return;
    }
    setLocalError(null);

    const name = file.name;
    const sizeStr = formatBytes(file.size);
    setActiveFileName(name);
    setActiveFileSize(sizeStr);

    let createdPreview: string | undefined;
    if (file.type.startsWith("image/")) {
      createdPreview = URL.createObjectURL(file);
      setPreviewUrl(createdPreview);
    } else {
      setPreviewUrl(null);
    }

    if (simulateProgress) {
      setIsUploading(true);
      setUploadProgress(15);

      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            setTimeout(() => {
              setUploadProgress(100);
              setTimeout(() => {
                setIsUploading(false);
                setSelectedFile(file);
                onChange?.(file, createdPreview);
                onUploadComplete?.(file);
              }, 200);
            }, 150);
            return 90;
          }
          return prev + 25;
        });
      }, 100);
    } else {
      setSelectedFile(file);
      onChange?.(file, createdPreview);
      onUploadComplete?.(file);
    }

    // Reset input so same file can be re-selected if removed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setPreviewUrl(null);
    setActiveFileName("");
    setActiveFileSize("");
    setIsUploading(false);
    setUploadProgress(0);
    setLocalError(null);
    onChange?.(null, undefined);
  };

  const hasFile = Boolean(selectedFile || previewUrl || activeFileName);
  const displayError = error || localError;

  return (
    <div className={`w-full flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label className="block text-xs font-semibold text-neutral-primary select-none">
          {label}
          {required && <span className="text-primary-solid ml-0.5">*</span>}
        </label>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        disabled={disabled || isUploading}
        className="hidden"
      />

      {/* 1. UPLOAD TRIGGER ZONE (When no file is selected and not uploading) */}
      {!hasFile && !isUploading && (
        <div
          onClick={() => !disabled && fileInputRef.current?.click()}
          className={`w-full border-2 border-dashed border-primary-solid/25 bg-primary-solid/5 hover:bg-primary-solid/10 rounded-2xl flex flex-col items-center justify-center p-5 transition-all cursor-pointer select-none group ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          } ${className}`}
        >
          <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-primary-solid/15 flex items-center justify-center text-primary-solid mb-2 group-hover:scale-105 transition-transform">
            <LuUpload className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-neutral-primary group-hover:text-primary-solid transition-colors">
            {placeholderTitle}
          </span>
          <span className="text-[11px] text-neutral-secondary mt-0.5">
            {placeholderSubtitle || (accept ? `Accepted: ${accept}` : `Up to ${maxSizeMB}MB`)}
          </span>
        </div>
      )}

      {/* 2. UPLOADING PROGRESS BAR (Active upload state) */}
      {isUploading && (
        <div className="w-full border border-primary-solid/20 bg-primary-solid/5 rounded-xl p-3.5 flex flex-col gap-2.5 shadow-xs animate-fadeIn">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-4 h-4 border-2 border-primary-solid border-t-transparent rounded-full animate-spin shrink-0" />
              <span className="text-xs font-semibold text-neutral-primary truncate">
                Uploading {activeFileName || "File"}...
              </span>
            </div>
            <span className="text-xs font-bold text-primary-solid shrink-0 font-mono">
              {uploadProgress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-primary-solid h-full rounded-full transition-all duration-200 ease-out"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* 3. COMPLETED FILE CARD (File successfully selected / uploaded) */}
      {hasFile && !isUploading && (
        <div className="w-full border border-gray-200 bg-white rounded-xl p-3 flex items-center justify-between gap-3 shadow-xs hover:border-gray-300 transition-colors">
          <div className="flex items-center gap-3 min-w-0">
            {previewType === "thumbnail" && previewUrl ? (
              <div className="w-11 h-11 rounded-lg overflow-hidden relative shrink-0 border border-gray-100 bg-gray-50">
                <Image
                  src={previewUrl}
                  alt={activeFileName || "Preview"}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                {getFileIcon(activeFileName)}
              </div>
            )}

            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-neutral-primary truncate">
                {activeFileName || "Uploaded File"}
              </span>
              <span className="text-[11px] text-gray-500 flex items-center gap-1.5 mt-0.5">
                {activeFileSize && <span>{activeFileSize}</span>}
                {activeFileSize && <span>•</span>}
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <FiCheckCircle className="w-3.5 h-3.5" /> Completed
                </span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-[11px] font-semibold text-primary-solid hover:underline px-2 py-1 rounded-md hover:bg-primary-solid/5 transition-colors cursor-pointer"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={handleRemove}
              aria-label="Remove file"
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {displayError && (
        <span className="text-primary-solid text-xs font-semibold leading-[1.4] transition-all duration-200">
          {displayError}
        </span>
      )}

      {helperText && !displayError && (
        <span className="text-gray-400 text-[11px] leading-[1.4]">
          {helperText}
        </span>
      )}
    </div>
  );
};
