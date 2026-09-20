"use client";

import React from "react";
import Image from "next/image";
import { Modal } from "antd";
import { ASSETS_URL } from "@/assets";

export interface SuspendLearnerSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SuspendLearnerSuccessModal: React.FC<SuspendLearnerSuccessModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      closable={false}
      footer={null}
      centered
      width={400}
      styles={{
        mask: {
          backdropFilter: "blur(2px)",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
        },
        body: { padding: "2rem 2rem 2rem" },
      }}
    >
      <div className="flex flex-col items-center text-center">
        <div className="w-20 h-20 mb-3 relative flex items-center justify-center">
          <Image
            src={ASSETS_URL.successCheckmarkImg}
            alt="Success"
            width={80}
            height={80}
            className="w-20 h-20 object-contain"
            priority
          />
        </div>

        <h3 className="text-lg font-bold text-neutral-primary mb-1">
          Congratulations
        </h3>

        <p className="text-xs text-neutral-secondary mb-6">
          You have successfully suspended a learner
        </p>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 px-4 rounded-xl bg-secondary hover:bg-secondary-hover text-white font-semibold text-xs transition-colors cursor-pointer shadow-2xs"
        >
          Continue
        </button>
      </div>
    </Modal>
  );
};
