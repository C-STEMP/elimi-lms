"use client";

import React, { useRef } from "react";
import { LuUpload, LuFileText, LuX } from "react-icons/lu";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileChange(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs p-6 space-y-4">
      <h2 className="text-base font-bold text-neutral-primary">{title}</h2>

      <textarea
        value={textValue}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder="Type here"
        rows={4}
        className="w-full p-4 bg-input-bg rounded-xl border border-gray-100 text-xs text-neutral-primary placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-primary resize-y"
      />

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            onFileChange(e.target.files[0]);
          }
        }}
      />

      {file ? (
        <div className="flex items-center justify-between p-3.5 bg-rose-50/60 rounded-xl border border-rose-200 text-xs">
          <div className="flex items-center gap-2 text-primary font-medium truncate">
            <LuFileText className="w-4 h-4 shrink-0" />
            <span className="truncate">{file.name}</span>
          </div>
          <button
            type="button"
            onClick={() => onFileChange(null)}
            className="p-1 text-gray-400 hover:text-rose-500 cursor-pointer transition-colors"
          >
            <LuX className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
          className="border-2 border-dashed border-rose-200 bg-rose-50/30 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-rose-50/60 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-rose-100/60 flex items-center justify-center text-primary mb-2">
            <LuUpload className="w-4 h-4" />
          </div>
          <p className="text-xs font-semibold text-primary">{uploadLabel}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">PDF</p>
        </div>
      )}
    </div>
  );
};
