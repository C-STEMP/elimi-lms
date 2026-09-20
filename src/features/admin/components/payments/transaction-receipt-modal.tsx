"use client";

import React from "react";
import { Modal } from "antd";
import { LuX } from "react-icons/lu";
import { AdminLogoMark } from "../admin-logo-mark";
import type { TransactionItem } from "../../types/payments";

export interface TransactionReceiptModalProps {
  isOpen: boolean;
  item: TransactionItem | null;
  onClose: () => void;
  onDownload?: () => void;
}

export const TransactionReceiptModal: React.FC<TransactionReceiptModalProps> = ({
  isOpen,
  item,
  onClose,
  onDownload,
}) => {
  if (!item) return null;

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
      <div className="relative">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close receipt"
          className="absolute right-0 top-0 w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-100 flex items-center justify-center text-rose-500 transition-colors cursor-pointer"
        >
          <LuX className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center mb-4">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
              <AdminLogoMark size={16} />
            </div>
            <span className="font-extrabold text-base text-neutral-primary tracking-tight">
              e-limi
            </span>
          </div>
          <h2 className="text-base font-bold text-primary">
            Transaction Reciept
          </h2>
        </div>

        <div className="bg-gray-50/80 rounded-2xl p-4 text-xs space-y-4 mb-5 border border-gray-100">
          <div className="grid grid-cols-2 gap-3 text-[11px]">
            <div>
              <p className="text-gray-400">Date</p>
              <p className="font-semibold text-neutral-primary">{item.date}</p>
            </div>
            <div>
              <p className="text-gray-400">Transaction ID</p>
              <p className="font-semibold text-neutral-primary">{item.transactionId}</p>
            </div>
            <div>
              <p className="text-gray-400">Payment Method</p>
              <p className="font-semibold text-neutral-primary">{item.paymentMethod}</p>
            </div>
            <div>
              <p className="text-gray-400">Status</p>
              <p className="font-semibold text-neutral-primary">
                {item.status === "Paid" ? "Completed" : item.status}
              </p>
            </div>
          </div>

          <div className="border-t border-b border-gray-200 py-3 flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-neutral-primary">RPL Assessment</p>
              <p className="text-[11px] text-gray-400">Recognition of prior learning</p>
            </div>
            <p className="font-bold text-neutral-primary">{item.amountPaid}</p>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Name</span>
              <span className="font-semibold text-neutral-primary">{item.candidateName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Vat</span>
              <span className="font-semibold text-neutral-primary">-</span>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-2 flex items-center justify-between">
            <span className="font-extrabold text-sm text-neutral-primary">TOTAL</span>
            <span className="font-extrabold text-base text-neutral-primary">
              {item.amountPaid}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onDownload || onClose}
          className="w-full py-3 rounded-xl bg-secondary hover:bg-secondary-hover text-white font-semibold text-sm transition-colors cursor-pointer shadow-2xs"
        >
          Download
        </button>
      </div>
    </Modal>
  );
};
