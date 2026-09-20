"use client";

import React from "react";
import { Modal } from "antd";
import { LuX } from "react-icons/lu";
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
        mask: { backdropFilter: "blur(2px)", backgroundColor: "rgba(0, 0, 0, 0.4)" },
        body: { padding: "1.75rem" },
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-neutral-primary">Add Staff</h2>
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
            Staff Name
          </label>
          <input
            type="text"
            value={data.name}
            onChange={(e) =>
              onChange((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Type Here"
            className="w-full px-3.5 py-2.5 bg-input-bg rounded-xl border border-gray-100 text-xs text-neutral-primary placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-primary mb-1.5">
            Enter Email Address
          </label>
          <input
            type="email"
            value={data.email}
            onChange={(e) =>
              onChange((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder="Type Here"
            className="w-full px-3.5 py-2.5 bg-input-bg rounded-xl border border-gray-100 text-xs text-neutral-primary placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-primary mb-1.5">
            Select Role
          </label>
          <select
            value={data.role}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                role: e.target.value as AddStaffFormData["role"],
              }))
            }
            className="w-full px-3.5 py-2.5 bg-input-bg rounded-xl border border-gray-100 text-xs text-neutral-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="">Select</option>
            {STAFF_ROLE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          disabled={!isFormValid}
          onClick={onSubmit}
          className="w-full py-3 mt-2 rounded-xl bg-secondary hover:bg-secondary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors cursor-pointer shadow-2xs"
        >
          Add Staff
        </button>
      </div>
    </Modal>
  );
};
