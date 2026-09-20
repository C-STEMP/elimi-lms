"use client";

import React from "react";
import { Modal } from "antd";
import { LuX } from "react-icons/lu";
import {
  ENROLLMENT_TYPE_OPTIONS,
  ORGANIZATION_OPTIONS,
  LEARNER_COURSE_OPTIONS,
} from "../../constants/learners-data";
import type { EnrollLearnerFormData } from "../../types/learners";

export interface EnrollLearnerModalProps {
  isOpen: boolean;
  data: EnrollLearnerFormData;
  onChange: React.Dispatch<React.SetStateAction<EnrollLearnerFormData>>;
  onClose: () => void;
  onSubmit: () => void;
}

export const EnrollLearnerModal: React.FC<EnrollLearnerModalProps> = ({
  isOpen,
  data,
  onChange,
  onClose,
  onSubmit,
}) => {
  const isSponsored = data.enrollmentType === "sponsored";

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      closable={false}
      footer={null}
      centered
      width={480}
      styles={{
        mask: {
          backdropFilter: "blur(2px)",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
        },
        body: { padding: "1.75rem" },
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-5">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-neutral-primary">
            Enroll Learner
          </h2>
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
            Enrollment Type
          </label>
          <select
            value={data.enrollmentType}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                enrollmentType: e.target.value as "sponsored" | "unsponsored",
              }))
            }
            className="w-full px-3.5 py-2.5 bg-input-bg rounded-xl border border-gray-100 text-xs text-neutral-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            {ENROLLMENT_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {isSponsored && (
          <div>
            <label className="block text-xs font-semibold text-neutral-primary mb-1.5">
              Select Organization
            </label>
            <select
              value={data.organization}
              onChange={(e) =>
                onChange((prev) => ({ ...prev, organization: e.target.value }))
              }
              className="w-full px-3.5 py-2.5 bg-input-bg rounded-xl border border-gray-100 text-xs text-neutral-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="">Select</option>
              {ORGANIZATION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-neutral-primary mb-1.5">
            Select Course
          </label>
          <select
            value={data.courseId}
            onChange={(e) =>
              onChange((prev) => ({ ...prev, courseId: e.target.value }))
            }
            className="w-full px-3.5 py-2.5 bg-input-bg rounded-xl border border-gray-100 text-xs text-neutral-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="">Select</option>
            {LEARNER_COURSE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.label}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={onSubmit}
          className="w-full py-3 mt-3 rounded-xl bg-secondary hover:bg-secondary-hover text-white font-semibold text-sm transition-colors cursor-pointer shadow-2xs"
        >
          Export
        </button>
      </div>
    </Modal>
  );
};
