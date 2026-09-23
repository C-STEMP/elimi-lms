"use client";

import React from "react";
import { Modal } from "antd";
import { LuX } from "react-icons/lu";
import { Input } from "@/shared/components/ui/input";
import { Select } from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";
import { STAFF_ROLE_OPTIONS } from "../../constants/staff-data";
import type { AddStaffFormData } from "../../types/staff";

export interface AddStaffModalProps {
  isOpen: boolean;
  data: AddStaffFormData;
  onChange: React.Dispatch<React.SetStateAction<AddStaffFormData>>;
  onClose: () => void;
  onSubmit: () => void;
}

export const AddStaffModal: React.FC<AddStaffModalProps> = ({
  isOpen,
  data,
  onChange,
  onClose,
  onSubmit,
}) => {
  const isFormValid =
    data.name.trim().length > 0 &&
    data.email.trim().length > 0 &&
    data.role.length > 0;

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
            Add Staff
          </h2>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Invite and assign administrative privileges
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
        <Input
          label="Staff Name"
          type="text"
          value={data.name}
          onChange={(e) =>
            onChange((prev) => ({ ...prev, name: e.target.value }))
          }
          placeholder="Type Here"
        />

        <Input
          label="Enter Email Address"
          type="email"
          value={data.email}
          onChange={(e) =>
            onChange((prev) => ({ ...prev, email: e.target.value }))
          }
          placeholder="Type Here"
        />

        <Select
          label="Select Role"
          placeholder="Select"
          value={data.role}
          options={STAFF_ROLE_OPTIONS}
          onChange={(e) =>
            onChange((prev) => ({
              ...prev,
              role: e.target.value as AddStaffFormData["role"],
            }))
          }
        />

        <div className="pt-2">
          <Button
            type="button"
            variant="secondary"
            size="md"
            fullWidth
            disabled={!isFormValid}
            onClick={onSubmit}
          >
            Add Staff
          </Button>
        </div>
      </div>
    </Modal>
  );
};
