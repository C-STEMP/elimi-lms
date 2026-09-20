"use client";

import React from "react";
import { Modal } from "antd";
import { LuX, LuPlus } from "react-icons/lu";
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
        mask: { backdropFilter: "blur(2px)", backgroundColor: "rgba(0, 0, 0, 0.4)" },
        body: { padding: "1.75rem" },
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-neutral-primary">Enroll Learners</h2>
          <p className="text-[11px] text-gray-400 mt-0.5">Lorem ipsum dolor, dolor isjhe aiyuej sjskw</p>
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

      <div className="space-y-3 max-h-[72vh] overflow-y-auto pr-1">
        <div>
          <label className="block text-xs font-semibold text-neutral-primary mb-1">Enrollment Type</label>
          <select
            value={data.enrollmentType}
            onChange={(e) => onChange((prev) => ({ ...prev, enrollmentType: e.target.value as "sponsored" | "unsponsored" }))}
            className="w-full px-3 py-2 bg-input-bg rounded-xl border border-gray-100 text-xs text-neutral-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            {ENROLLMENT_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {isSponsored && (
          <SponsoredOrgFields
            organizationName={data.organizationName}
            organizationEmail={data.organizationEmail}
            onChangeName={(val) => onChange((prev) => ({ ...prev, organizationName: val }))}
            onChangeEmail={(val) => onChange((prev) => ({ ...prev, organizationEmail: val }))}
          />
        )}

        <div>
          <label className="block text-xs font-semibold text-neutral-primary mb-1">Number Of Students</label>
          <input
            type="number"
            value={data.numberOfStudents}
            onChange={(e) => onChange((prev) => ({ ...prev, numberOfStudents: e.target.value }))}
            placeholder="Type Here"
            className="w-full px-3 py-2 bg-input-bg rounded-xl border border-gray-100 text-xs text-neutral-primary placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {data.courses.map((course, idx) => (
          <div key={idx}>
            <label className="block text-xs font-semibold text-neutral-primary mb-1">Select Course</label>
            <select
              value={course}
              onChange={(e) => onUpdateCourse(idx, e.target.value)}
              className="w-full px-3 py-2 bg-input-bg rounded-xl border border-gray-100 text-xs text-neutral-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer mb-2"
            >
              <option value="">Select</option>
              {ENROLLMENT_COURSE_OPTIONS.map((c) => (
                <option key={c.value} value={c.label}>{c.label}</option>
              ))}
            </select>
          </div>
        ))}

        <EnrollmentTemplateUpload
          fileName={data.templateFile?.name}
          onFileSelect={(file) => onChange((prev) => ({ ...prev, templateFile: file }))}
        />

        <button
          type="button"
          onClick={onAddCourse}
          className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors cursor-pointer select-none"
        >
          <LuPlus className="w-3.5 h-3.5" />
          <span>Add Course</span>
        </button>

        <button
          type="button"
          onClick={onSubmit}
          className="w-full py-3 mt-2 rounded-xl bg-secondary hover:bg-secondary-hover text-white font-semibold text-sm transition-colors cursor-pointer shadow-2xs"
        >
          Enroll Learners
        </button>
      </div>
    </Modal>
  );
};
