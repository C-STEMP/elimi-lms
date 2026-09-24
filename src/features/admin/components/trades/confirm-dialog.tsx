"use client";

import React from "react";
import Image from "next/image";
import { Modal } from "antd";
import { ASSETS_URL } from "@/assets";

export interface ConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title = "Are you sure?",
  description = "Confirm you want to perform this action.",
  confirmLabel = "Yes, Continue",
  cancelLabel = "No",
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      open={isOpen}
      onCancel={onCancel}
      closable={false}
      footer={null}
      centered
      width={400}
      styles={{
        mask: {
          backdropFilter: "blur(2px)",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
        },
        body: { padding: "2rem" },
      }}
    >
      <div className="flex flex-col items-center text-center">
        <div className="w-20 h-20 mb-3 relative flex items-center justify-center">
          <Image
            src={ASSETS_URL.warningSignIcon}
            alt="Warning"
            width={80}
            height={80}
            className="w-20 h-20 object-contain"
            priority
          />
        </div>

        <h3 className="text-lg font-bold text-neutral-primary mb-1">
          {title}
        </h3>

        <p className="text-xs text-neutral-secondary mb-6 max-w-xs">
          {description}
        </p>

        <div className="w-full space-y-2.5">
          <button
            type="button"
            onClick={onConfirm}
            className="w-full py-2.5 px-4 rounded-xl bg-secondary hover:bg-secondary-hover text-white font-semibold text-xs transition-colors cursor-pointer shadow-2xs"
          >
            {confirmLabel}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="w-full py-2.5 px-4 rounded-xl border border-secondary text-secondary hover:bg-amber-50 font-semibold text-xs transition-colors cursor-pointer"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};
