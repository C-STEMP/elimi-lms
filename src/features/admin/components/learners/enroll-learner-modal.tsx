"use client";

import React from "react";
import { Modal } from "antd";
import { LuX } from "react-icons/lu";
import { Select } from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";
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
          <p className="text-[11px] text-gray-400 mt-0.5">
            Assign learner to specific curriculum and cohort
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
          label="Enrollment Type"
          placeholder="Select"
          options={ENROLLMENT_TYPE_OPTIONS}
          value={data.enrollmentType}
          onChange={(e) =>
            onChange((prev) => ({
              ...prev,
              enrollmentType: e.target.value as "sponsored" | "unsponsored",
            }))
          }
        />

        {isSponsored && (
          <Select
            label="Select Organization"
            placeholder="Select"
            options={ORGANIZATION_OPTIONS}
            value={data.organization}
            onChange={(e) =>
              onChange((prev) => ({ ...prev, organization: e.target.value }))
            }
          />
        )}

        <Select
          label="Select Course"
          placeholder="Select"
          options={LEARNER_COURSE_OPTIONS}
          value={data.courseId}
          onChange={(e) =>
            onChange((prev) => ({ ...prev, courseId: e.target.value }))
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
            Enroll Learner
          </Button>
        </div>
      </div>
    </Modal>
  );
};
