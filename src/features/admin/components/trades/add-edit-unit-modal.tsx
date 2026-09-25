"use client";

import React, { useState, useEffect, useRef } from "react";
import { Modal } from "antd";
import {
  FiX,
  FiUploadCloud,
  FiCheck,
  FiBookOpen,
  FiPlus,
  FiAlertCircle,
} from "react-icons/fi";
import type { UnitCourseItem } from "@/features/cap/types";
import { uploadScormPackage } from "@/features/storage";

export interface AddEditUnitModalProps {
  isOpen: boolean;
  unit: UnitCourseItem | null;
  tradeName?: string;
  tradeSlotNumber?: number | null;
  levelNumber: number | null;
  isSubmitting?: boolean;
  onClose: () => void;
  onSave: (payload: {
    referenceNumber: string;
    title: string;
    description?: string;
    price?: number;
    /** Orchestrator assetId of a SCORM zip that has already finished uploading. */
    packageAssetId?: string | null;
    isPublished?: boolean;
  }) => Promise<void> | void;
}

export const AddEditUnitModal: React.FC<AddEditUnitModalProps> = ({
  isOpen,
  unit,
  tradeName,
  tradeSlotNumber,
  levelNumber,
  isSubmitting = false,
  onClose,
  onSave,
}) => {
  const [referenceNumber, setReferenceNumber] = useState("001");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isFree, setIsFree] = useState(true);
  const [price, setPrice] = useState<number>(0);
  const [scormFile, setScormFile] = useState<File | null>(null);
  const [isPublished, setIsPublished] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [packageAssetId, setPackageAssetId] = useState<string | null>(null);
  // Bumped on every new upload / reset so a stale upload can't overwrite newer state.
  const uploadTokenRef = useRef(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetUpload = () => {
    uploadTokenRef.current += 1;
    setScormFile(null);
    setUploadProgress(0);
    setUploadStatus("idle");
    setUploadError(null);
    setPackageAssetId(null);
  };

  useEffect(() => {
    setSubmitError(null);
    resetUpload();
    if (unit) {
      setReferenceNumber(unit.referenceNumber || "001");
      setTitle(unit.title || "");
      setDescription("");
      setIsFree(true);
      setPrice(0);
      setIsPublished(unit.status === "published");
      setScormFile(null);
    } else {
      setReferenceNumber("001");
      setTitle("");
      setDescription("");
      setIsFree(true);
      setPrice(0);
      setIsPublished(true);
      setScormFile(null);
    }
  }, [unit, isOpen]);

  const startUpload = async (file: File) => {
    const token = ++uploadTokenRef.current;
    setScormFile(file);
    setPackageAssetId(null);
    setUploadError(null);
    setUploadProgress(0);
    setUploadStatus("uploading");
    try {
      const assetId = await uploadScormPackage(file, (pct) => {
        if (uploadTokenRef.current === token) setUploadProgress(pct);
      });
      if (uploadTokenRef.current !== token) return;
      setPackageAssetId(assetId);
      setUploadProgress(100);
      setUploadStatus("done");
    } catch (err) {
      if (uploadTokenRef.current !== token) return;
      setUploadStatus("error");
      setUploadError(
        (err as { message?: string })?.message || "Upload failed. Click above to try again."
      );
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Clear the input so re-selecting the same file (e.g. after a failure) fires onChange again.
    e.target.value = "";
    if (file) void startUpload(file);
  };

  const isUploading = uploadStatus === "uploading";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !referenceNumber.trim() || isUploading) return;
    if (scormFile && !packageAssetId) {
      setSubmitError("The SCORM package didn't upload. Select the file again to retry.");
      return;
    }
    setSubmitError(null);

    try {
      await onSave({
        referenceNumber: referenceNumber.trim(),
        title: title.trim(),
        description: description.trim(),
        price: isFree ? 0 : Number(price) || 0,
        packageAssetId,
        isPublished,
      });
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { data?: { message?: string; error?: { message?: string } } };
        message?: string;
      };
      const errorMsg =
        axiosErr?.response?.data?.message ||
        axiosErr?.response?.data?.error?.message ||
        axiosErr?.message ||
        "Failed to save course unit to LMS. Please check your inputs and try again.";
      setSubmitError(errorMsg);
    }
  };

  const displayName = tradeName || (tradeSlotNumber ? `Slot ${tradeSlotNumber}` : "Trade");

  return (
    <Modal
      open={isOpen}
      onCancel={() => {
        if (!isSubmitting) onClose();
      }}
      closable={false}
      footer={null}
      centered
      width="100%"
      style={{ maxWidth: 520, margin: "16px auto" }}
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
              <FiBookOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-extrabold text-neutral-primary tracking-tight truncate">
                {unit ? "Edit Course Unit" : "Add Course Unit Manually"}
              </h2>
              <p className="text-[11px] sm:text-xs text-neutral-secondary truncate">
                {displayName} • NSQ Level {levelNumber || 1} • Course Module
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close"
            className="text-neutral-secondary hover:text-neutral-primary p-2 -mr-1 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-40"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>

        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-red-700">
            <FiAlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{submitError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="col-span-1">
              <label className="block text-xs font-semibold text-neutral-primary mb-1.5">
                Unit Code
              </label>
              <input
                type="text"
                required
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                placeholder="001"
                className="w-full bg-input-bg border border-gray-200/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-mono text-neutral-primary focus:bg-white focus:border-secondary focus:outline-none transition-colors"
              />
            </div>

            <div className="col-span-1 sm:col-span-2">
              <label className="block text-xs font-semibold text-neutral-primary mb-1.5">
                Unit Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Safety Practices in Workplace"
                className="w-full bg-input-bg border border-gray-200/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-neutral-primary focus:bg-white focus:border-secondary focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-primary mb-1.5">
              Unit Description (Optional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline the learning outcomes and competency standards covered in this unit..."
              className="w-full bg-input-bg border border-gray-200/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-neutral-primary focus:bg-white focus:border-secondary focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Pricing Toggle */}
          <div className="bg-gray-50/80 rounded-xl p-3.5 border border-gray-100 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-neutral-primary">Unit Pricing</p>
                <p className="text-[11px] text-neutral-secondary">
                  Free access or standalone enrollment fee
                </p>
              </div>

              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-gray-200 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setIsFree(true)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isFree
                      ? "bg-primary-solid text-white"
                      : "text-neutral-secondary hover:text-neutral-primary"
                  }`}
                >
                  Free
                </button>
                <button
                  type="button"
                  onClick={() => setIsFree(false)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    !isFree
                      ? "bg-primary-solid text-white"
                      : "text-neutral-secondary hover:text-neutral-primary"
                  }`}
                >
                  Paid
                </button>
              </div>
            </div>

            {!isFree && (
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs font-bold text-neutral-primary">NGN</span>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={price || ""}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  placeholder="e.g. 5000"
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-neutral-primary focus:border-secondary focus:outline-none transition-colors"
                />
              </div>
            )}
          </div>

          {/* Optional SCORM Upload */}
          <div>
            <label className="block text-xs font-semibold text-neutral-primary mb-1.5">
              SCORM Package ZIP (Optional)
            </label>
            <input
              type="file"
              ref={fileInputRef}
              accept=".zip,application/zip"
              onChange={handleFileChange}
              className="hidden"
            />

            <div
              onClick={() => {
                if (!isUploading && !isSubmitting) fileInputRef.current?.click();
              }}
              className="border-2 border-dashed border-gray-200 hover:border-primary-solid/40 bg-white hover:bg-input-bg rounded-xl p-3.5 text-center cursor-pointer transition-colors flex items-center justify-center gap-2"
            >
              {scormFile ? (
                <>
                  <FiUploadCloud className="w-5 h-5 text-primary-solid" />
                  <span className="text-xs font-semibold text-neutral-primary truncate max-w-xs">
                    {scormFile.name} ({(scormFile.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </>
              ) : (
                <>
                  <FiUploadCloud className="w-4 h-4 text-neutral-secondary" />
                  <span className="text-xs text-neutral-secondary font-medium">
                    Click to select SCORM package (.zip)
                  </span>
                </>
              )}
            </div>

            {scormFile && uploadStatus !== "idle" && (
              <div className="mt-2 flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-[11px] text-neutral-secondary">
                  <span className="flex items-center gap-1">
                    {uploadStatus === "uploading" && "Uploading package..."}
                    {uploadStatus === "done" && (
                      <>
                        <FiCheck className="w-3 h-3 text-green-600" />
                        Package uploaded
                      </>
                    )}
                    {uploadStatus === "error" && (
                      <span className="text-red-600">{uploadError}</span>
                    )}
                  </span>
                  {uploadStatus !== "error" && (
                    <span className="font-semibold text-primary-solid">{uploadProgress}%</span>
                  )}
                </div>
                {uploadStatus !== "error" && (
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary-solid via-[#aa1d3f] to-secondary transition-all duration-300 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Publish Immediately */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="unit-publish-checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="rounded border-gray-300 text-primary-solid focus:ring-primary-solid h-4 w-4 cursor-pointer"
            />
            <label
              htmlFor="unit-publish-checkbox"
              className="text-xs font-medium text-neutral-primary select-none cursor-pointer"
            >
              Publish course unit immediately to catalogue
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100 mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="py-2.5 px-4 rounded-xl border border-gray-200 text-neutral-secondary text-xs font-semibold hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="py-2.5 px-5 rounded-xl bg-primary-solid hover:bg-primary-hover active:scale-[0.98] text-white text-xs font-semibold transition-all cursor-pointer shadow-2xs flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Saving Unit...</span>
              ) : unit ? (
                <>
                  <FiCheck className="w-3.5 h-3.5" />
                  <span>Save Unit</span>
                </>
              ) : (
                <>
                  <FiPlus className="w-3.5 h-3.5" />
                  <span>Create Unit</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
