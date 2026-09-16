"use client";

import React from "react";
import Image from "next/image";
import { Modal } from "antd";
import { Button } from "./button";
import { ASSETS_URL } from "@/assets";
import { ErrorCircleIcon } from "./svg-icons";

interface StatusModalProps {
  isOpen: boolean;
  onClose?: () => void;
  type?: "success" | "error";
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  customIcon?: React.ReactNode;
}

export const StatusModal: React.FC<StatusModalProps> = ({
  isOpen,
  onClose,
  type = "success",
  title,
  description,
  actionLabel,
  onAction,
  customIcon,
}) => {
  const renderIcon = () => {
    if (customIcon) {
      return (
        <div className="w-25 h-25 flex items-center justify-center relative shrink-0 mx-auto">
          {customIcon}
        </div>
      );
    }
    if (type === "success") {
      return (
        <Image
          src={ASSETS_URL.successCheckmarkImg}
          alt="Success Checkmark"
          width={100}
          height={100}
          className="w-25 h-25 object-contain shrink-0 mx-auto"
          style={{ width: 100, height: 100 }}
          priority
        />
      );
    }
    return (
      <div className="w-25 h-25 flex items-center justify-center bg-red-50 rounded-full border-4 border-red-100 shadow-lg shrink-0 mx-auto">
        <ErrorCircleIcon />
      </div>
    );
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      closable={!!onClose}
      mask={{ closable: !!onClose }}
      footer={null}
      centered
      width={420}
      styles={{
        mask: {
          backdropFilter: "blur(2px)",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
        },
        body: {
          padding: "2rem 2.5rem 2.5rem",
        },
      }}
    >
      <div className="mt-2 flex items-center justify-center w-25 h-25 mx-auto shrink-0 relative">
        {renderIcon()}
      </div>

      <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-primary mt-6 tracking-tight text-center">
        {title}
      </h2>

      <p className="text-neutral-secondary text-xs sm:text-[14px] leading-relaxed mt-2 font-normal text-center mx-auto max-w-75">
        {description}
      </p>

      {actionLabel && (onAction || onClose) && (
        <Button
          onClick={onAction || onClose}
          variant="amber"
          size="lg"
          fullWidth
          className="h-12.5! text-white! font-bold! text-base! bg-[#fbab2a]! hover:bg-[#e89b1f]! mt-8 transition-all! shadow-lg! cursor-pointer! rounded-xl!"
        >
          {actionLabel}
        </Button>
      )}
    </Modal>
  );
};
