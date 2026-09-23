"use client";

import React from "react";
import { Modal } from "antd";
import { LuX } from "react-icons/lu";
import { Input } from "@/shared/components/ui/input";
import { Select } from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";
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
        mask: {
          backdropFilter: "blur(2px)",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
        },
        body: { padding: "1.75rem" },
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-neutral-primary">
            Export Data
          </h2>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Generate and export cohort records to external file
          </p>
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
        <Select
          label="Select Organization"
          placeholder="Select"
          options={ENROLLMENT_ORG_OPTIONS}
          value={data.organization}
          onChange={(e) =>
            onChange((prev) => ({ ...prev, organization: e.target.value }))
          }
        />

        <Select
          label="Select Document Type"
          placeholder="Select"
          options={DOCUMENT_TYPE_OPTIONS}
          value={data.documentType}
          onChange={(e) =>
            onChange((prev) => ({ ...prev, documentType: e.target.value }))
          }
        />

        <Input
          label="Enter Email Address"
          type="email"
          placeholder="Type Here"
          value={data.email}
          onChange={(e) =>
            onChange((prev) => ({ ...prev, email: e.target.value }))
          }
        />

        <div className="pt-2">
          <Button
            type="button"
            variant="secondary"
            size="md"
            fullWidth
            onClick={onSubmit}
          >
            Export
          </Button>
        </div>
      </div>
    </Modal>
  );
};
