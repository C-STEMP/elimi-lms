"use client";

import React from "react";
import { Modal } from "antd";
import { LuX } from "react-icons/lu";
import {
  ENROLLMENT_ORG_OPTIONS,
  DOCUMENT_TYPE_OPTIONS,
} from "../../constants/enrollment-data";
import type { ExportDataFormData } from "../../types/enrollment";

export interface ExportDataModalProps {
  isOpen: boolean;
  data: ExportDataFormData;
  onChange: React.Dispatch<React.SetStateAction<ExportDataFormData>>;
  onClose: () => void;
  onSubmit: () => void;
}

export const ExportDataModal: React.FC<ExportDataModalProps> = ({
  isOpen,
  data,
  onChange,
  onClose,
  onSubmit,
}) => {
  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      closable={false}
      footer={null}
      centered
      width={460}
      styles={{
        mask: { backdropFilter: "blur(2px)", backgroundColor: "rgba(0, 0, 0, 0.4)" },
        body: { padding: "1.75rem" },
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-neutral-primary">Export Data</h2>
          <p className="text-[11px] text-gray-400 mt-0.5">Lorem ipsum dolor</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-100 flex items-center justify-center text-rose-500 transition-colors cursor-pointer shrink-0"
        >
          <LuX className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-primary mb-1.5">
            Select Organization
          </label>
          <select
            value={data.organization}
            onChange={(e) => onChange((prev) => ({ ...prev, organization: e.target.value }))}
            className="w-full px-3.5 py-2.5 bg-input-bg rounded-xl border border-gray-100 text-xs text-neutral-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="">Select</option>
            {ENROLLMENT_ORG_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-primary mb-1.5">
            Select Document Type
          </label>
          <select
            value={data.documentType}
            onChange={(e) => onChange((prev) => ({ ...prev, documentType: e.target.value }))}
            className="w-full px-3.5 py-2.5 bg-input-bg rounded-xl border border-gray-100 text-xs text-neutral-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="">Select</option>
            {DOCUMENT_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-primary mb-1.5">
            Enter Email Address
          </label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => onChange((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="Type Here"
            className="w-full px-3.5 py-2.5 bg-input-bg rounded-xl border border-gray-100 text-xs text-neutral-primary placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <button
          type="button"
          onClick={onSubmit}
          className="w-full py-3 mt-2 rounded-xl bg-secondary hover:bg-secondary-hover text-white font-semibold text-sm transition-colors cursor-pointer shadow-2xs"
        >
          Export
        </button>
      </div>
    </Modal>
  );
};
