"use client";

import React from "react";
import { Modal } from "antd";
import { LuX } from "react-icons/lu";
import { CreateCourseStepOne } from "./create-course-step-one";
import { CreateCourseStepTwo } from "./create-course-step-two";
import type {
  CreateCourseStepOneData,
  CreateCourseStepTwoData,
} from "../../types/courses";

export interface CreateCourseModalProps {
  isOpen: boolean;
  step: 1 | 2;
  stepOneData: CreateCourseStepOneData;
  stepTwoData: CreateCourseStepTwoData;
  isSubmitting?: boolean;
  onStepChange: (step: 1 | 2) => void;
  onStepOneChange: React.Dispatch<React.SetStateAction<CreateCourseStepOneData>>;
  onStepTwoChange: React.Dispatch<React.SetStateAction<CreateCourseStepTwoData>>;
  onClose: () => void;
  onSubmit: () => void;
}

export const CreateCourseModal: React.FC<CreateCourseModalProps> = ({
  isOpen,
  step,
  stepOneData,
  stepTwoData,
  isSubmitting,
  onStepChange,
  onStepOneChange,
  onStepTwoChange,
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
      width={560}
      styles={{
        mask: {
          backdropFilter: "blur(2px)",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
        },
        body: { padding: "1.5rem" },
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-neutral-primary">
            {step === 1 ? "Create Course" : "Add SCORM Package"}
          </h2>
          <p className="text-[11px] text-gray-400 mt-0.5">
            {step === 1
              ? "Course Creation Wizard (Curriculum Outline & SCORM 1.2 Package Ingestion)"
              : "Lorem ipsum dolor Lorem ipsum dolor"}
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

      {/* Step progress bar */}
      <div className="w-full bg-gray-100 h-1 rounded-full mb-4 overflow-hidden">
        <div
          className="bg-primary-solid h-full transition-all duration-300"
          style={{ width: step === 1 ? "50%" : "100%" }}
        />
      </div>

      {step === 1 ? (
        <CreateCourseStepOne
          data={stepOneData}
          onChange={onStepOneChange}
          onNext={() => onStepChange(2)}
        />
      ) : (
        <CreateCourseStepTwo
          data={stepTwoData}
          isSubmitting={isSubmitting}
          onChange={onStepTwoChange}
          onSubmit={onSubmit}
        />
      )}
    </Modal>
  );
};
