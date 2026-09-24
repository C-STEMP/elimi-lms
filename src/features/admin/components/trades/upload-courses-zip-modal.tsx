"use client";

import React, { useState, useRef, useEffect } from "react";
import { Modal } from "antd";
import {
  FiX,
  FiUploadCloud,
  FiFileText,
  FiCheckCircle,
  FiAlertCircle,
  FiRefreshCw,
} from "react-icons/fi";

export interface UploadCoursesZipModalProps {
  isOpen: boolean;
  tradeName?: string;
  tradeSlotNumber?: number | null;
  levelNumber: number | null;
  isSubmitting?: boolean;
  onClose: () => void;
  onUpload: (
    file: File,
    onProgress?: (percent: number) => void
  ) => Promise<void> | void;
}

export const UploadCoursesZipModal: React.FC<UploadCoursesZipModalProps> = ({
  isOpen,
  tradeName,
  tradeSlotNumber,
  levelNumber,
  onClose,
  onUpload,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadState, setUploadState] = useState<
    "idle" | "uploading" | "processing" | "success" | "error"
  >("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clear state on modal open/close
  useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null);
      setUploadState("idle");
      setUploadProgress(0);
      setErrorMessage(null);
    }
  }, [isOpen]);

  const handleStartAutoUpload = async (file: File) => {
    setSelectedFile(file);
    setUploadState("uploading");
    setUploadProgress(0);
    setErrorMessage(null);

    try {
      await onUpload(file, (percent) => {
        setUploadProgress(percent);
        if (percent >= 100) {
          setUploadState("processing");
        }
      });
      setUploadProgress(100);
      setUploadState("success");

      // Auto close after brief success celebration
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: unknown) {
      setUploadState("error");
      const errObj = err as { message?: string };
      setErrorMessage(
        errObj?.message || "Failed to upload and process SCORM package. Please try again."
      );
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (uploadState === "uploading" || uploadState === "processing") return;
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (uploadState === "uploading" || uploadState === "processing") return;

    const file = e.dataTransfer.files?.[0];
    if (file && (file.name.endsWith(".zip") || file.type === "application/zip")) {
      handleStartAutoUpload(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleStartAutoUpload(file);
    }
  };

  const handleCancelUpload = () => {
    setSelectedFile(null);
    setUploadState("idle");
    setUploadProgress(0);
    setErrorMessage(null);
  };

  const displayName = tradeName || (tradeSlotNumber ? `Slot ${tradeSlotNumber}` : "Trade");

  return (
    <Modal
      open={isOpen}
      onCancel={() => {
        if (uploadState !== "uploading" && uploadState !== "processing") {
          onClose();
        }
      }}
      closable={false}
      footer={null}
      centered
      width="100%"
      style={{ maxWidth: 480, margin: "16px auto" }}
      styles={{
        mask: {
          backdropFilter: "blur(4px)",
          backgroundColor: "rgba(36, 16, 20, 0.45)",
        },
        body: { padding: 0 },
      }}
    >
      <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#75152b]/10 text-primary-solid flex items-center justify-center shrink-0">
              <FiUploadCloud className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-extrabold text-neutral-primary tracking-tight truncate">
                Upload SCORM Course
              </h2>
              <p className="text-[11px] sm:text-xs text-neutral-secondary truncate">
                {displayName} • NSQ Level {levelNumber || 1} • ZIP Package
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={uploadState === "uploading" || uploadState === "processing"}
            aria-label="Close"
            className="text-neutral-secondary hover:text-neutral-primary p-2 -mr-1 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-30"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          accept=".zip,application/zip"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Drop/Browse Zone (shown when idle or after error/cancel) */}
        {uploadState === "idle" && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
              isDragOver
                ? "border-primary-solid bg-primary-solid/5 scale-[1.01]"
                : "border-gray-200 hover:border-primary-solid/40 bg-gray-50/40 hover:bg-gray-50"
            }`}
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-secondary/15 text-secondary-hover flex items-center justify-center shadow-2xs">
              <FiUploadCloud className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>

            <div>
              <p className="text-xs sm:text-sm font-bold text-neutral-primary">
                Tap or drag & drop SCORM package (.zip)
              </p>
              <p className="text-[11px] sm:text-xs text-neutral-secondary mt-1">
                Uploads automatically once selected
              </p>
            </div>

            <span className="text-[10px] sm:text-[11px] font-semibold text-neutral-secondary bg-white border border-gray-200/80 px-3 py-1 rounded-full shadow-2xs mt-1">
              Supports SCORM 1.2 & SCORM 2004
            </span>
          </div>
        )}

        {/* Uploading Card with embedded Progress Bar */}
        {selectedFile && uploadState !== "idle" && (
          <div className="bg-white border border-gray-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col gap-3.5">
            {/* Top row: File Icon, Name, Size & Status Badge */}
            <div className="flex items-center justify-between gap-3 min-w-0">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    uploadState === "success"
                      ? "bg-emerald-50 text-emerald-600"
                      : uploadState === "error"
                      ? "bg-red-50 text-red-600"
                      : "bg-[#75152b]/10 text-primary-solid"
                  }`}
                >
                  {uploadState === "success" ? (
                    <FiCheckCircle className="w-5 h-5 text-emerald-600" />
                  ) : uploadState === "error" ? (
                    <FiAlertCircle className="w-5 h-5 text-red-600" />
                  ) : (
                    <FiFileText className="w-5 h-5" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-bold text-neutral-primary truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-[11px] text-neutral-secondary mt-0.5">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>

              {/* Progress Percentage or Status Badge */}
              <div className="shrink-0">
                {uploadState === "uploading" && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#75152b]/10 text-primary-solid">
                    {uploadProgress}%
                  </span>
                )}
                {uploadState === "processing" && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                    <FiRefreshCw className="w-3 h-3 animate-spin" />
                    <span>Processing</span>
                  </span>
                )}
                {uploadState === "success" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <FiCheckCircle className="w-3.5 h-3.5" />
                    <span>Complete</span>
                  </span>
                )}
                {uploadState === "error" && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
                    Error
                  </span>
                )}
              </div>
            </div>

            {/* Embedded Progress Bar */}
            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ease-out ${
                  uploadState === "success"
                    ? "bg-emerald-500"
                    : uploadState === "error"
                    ? "bg-red-500"
                    : "bg-gradient-to-r from-primary-solid via-[#aa1d3f] to-secondary"
                }`}
                style={{ width: `${uploadProgress}%` }}
              />
            </div>

            {/* Bottom Row inside Card: Helper label & Action */}
            <div className="flex items-center justify-between gap-2 text-[11px] sm:text-xs">
              <div className="text-neutral-secondary truncate">
                {uploadState === "uploading" && (
                  <span>Uploading SCORM package to cloud storage...</span>
                )}
                {uploadState === "processing" && (
                  <span className="text-amber-700 font-medium">
                    Verifying manifest.xml and creating course unit...
                  </span>
                )}
                {uploadState === "success" && (
                  <span className="text-emerald-700 font-semibold">
                    Course unit created and linked successfully!
                  </span>
                )}
                {uploadState === "error" && (
                  <span className="text-red-600 font-medium">
                    {errorMessage || "Upload failed."}
                  </span>
                )}
              </div>

              {/* Card Actions */}
              <div>
                {(uploadState === "uploading" || uploadState === "processing") && (
                  <button
                    type="button"
                    onClick={handleCancelUpload}
                    className="text-neutral-secondary hover:text-neutral-primary font-semibold underline underline-offset-2 cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
                {uploadState === "error" && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleStartAutoUpload(selectedFile)}
                      className="text-primary-solid hover:text-primary-hover font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <FiRefreshCw className="w-3 h-3" />
                      <span>Retry</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelUpload}
                      className="text-neutral-secondary hover:text-neutral-primary cursor-pointer"
                    >
                      Change
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal Bottom Footer */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            disabled={uploadState === "uploading" || uploadState === "processing"}
            className="w-full sm:w-auto py-2.5 px-5 rounded-xl border border-gray-200 hover:bg-gray-50 text-neutral-primary font-semibold text-xs sm:text-sm transition-colors cursor-pointer disabled:opacity-40 text-center"
          >
            {uploadState === "success" ? "Done" : "Cancel"}
          </button>
        </div>
      </div>
    </Modal>
  );
};
