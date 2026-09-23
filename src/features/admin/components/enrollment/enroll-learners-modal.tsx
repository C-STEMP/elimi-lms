"use client";

import React from "react";
import { Modal } from "antd";
import { LuX, LuPlus } from "react-icons/lu";
import { Input } from "@/shared/components/ui/input";
import { Select } from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";
import { SponsoredOrgFields } from "./sponsored-org-fields";
import { EnrollmentTemplateUpload } from "./enrollment-template-upload";
import { ENROLLMENT_TYPE_OPTIONS } from "../../constants/learners-data";
import { ENROLLMENT_COURSE_OPTIONS } from "../../constants/enrollment-data";
import type { EnrollLearnersFormData } from "../../types/enrollment";

export interface EnrollLearnersModalProps {
  isOpen: boolean;
  data: EnrollLearnersFormData;
  onChange: React.Dispatch<React.SetStateAction<EnrollLearnersFormData>>;
  onAddCourse: () => void;
  onUpdateCourse: (index: number, val: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export const EnrollLearnersModal: React.FC<EnrollLearnersModalProps> = ({
  isOpen,
  data,
  onChange,
  onAddCourse,
  onUpdateCourse,
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
      width={520}
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
            Enroll Learners
          </h2>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Bulk ingestion and registration of learner cohort
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

      <div className="space-y-3.5 max-h-[72vh] overflow-y-auto pr-1">
        <Select
          label="Enrollment Type"
          placeholder="Select Type"
          value={data.enrollmentType}
          options={ENROLLMENT_TYPE_OPTIONS}
          onChange={(e) =>
            onChange((prev) => ({
              ...prev,
              enrollmentType: e.target.value as "sponsored" | "unsponsored",
            }))
          }
        />

        {isSponsored && (
          <SponsoredOrgFields
            organizationName={data.organizationName}
            organizationEmail={data.organizationEmail}
            onChangeName={(val) =>
              onChange((prev) => ({ ...prev, organizationName: val }))
            }
            onChangeEmail={(val) =>
              onChange((prev) => ({ ...prev, organizationEmail: val }))
            }
          />
        )}

        <Input
          label="Number Of Students"
          type="number"
          value={data.numberOfStudents}
          onChange={(e) =>
            onChange((prev) => ({
              ...prev,
              numberOfStudents: e.target.value,
            }))
          }
          placeholder="Type Here"
        />

        {data.courses.map((course, idx) => (
          <Select
            key={idx}
            label={idx === 0 ? "Select Course" : undefined}
            placeholder="Select Course"
            value={course}
            options={ENROLLMENT_COURSE_OPTIONS.map((c) => ({
              label: c.label,
              value: c.label,
            }))}
            onChange={(e) => onUpdateCourse(idx, e.target.value)}
          />
        ))}

        <div className="pt-1">
          <EnrollmentTemplateUpload
            fileName={data.templateFile?.name}
            onFileSelect={(file) =>
              onChange((prev) => ({ ...prev, templateFile: file }))
            }
          />
        </div>

        <button
          type="button"
          onClick={onAddCourse}
          className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors cursor-pointer select-none"
        >
          <LuPlus className="w-3.5 h-3.5" />
          <span>Add Course</span>
        </button>

        <div className="pt-2">
          <Button
            type="button"
            variant="secondary"
            size="md"
            fullWidth
            onClick={onSubmit}
          >
            Enroll Learners
          </Button>
        </div>
      </div>
    </Modal>
  );
};
