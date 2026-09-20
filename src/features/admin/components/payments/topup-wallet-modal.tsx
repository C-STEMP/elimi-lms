"use client";

import React from "react";
import { Modal } from "antd";
import { LuX } from "react-icons/lu";
import type { TopupWalletFormData } from "../../types/payments";

export interface TopupWalletModalProps {
  isOpen: boolean;
  data: TopupWalletFormData;
  onChange: React.Dispatch<React.SetStateAction<TopupWalletFormData>>;
  onClose: () => void;
  onSubmit: () => void;
}

export const TopupWalletModal: React.FC<TopupWalletModalProps> = ({
  isOpen,
  data,
  onChange,
  onClose,
  onSubmit,
}) => {
  const isValid =
    data.organization.trim().length > 0 &&
    data.amount.trim().length > 0;

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
          <h2 className="text-base sm:text-lg font-bold text-neutral-primary">
            Top-up Organization Wallet
          </h2>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Fund an organization wallet
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
        <div>
          <label className="block text-xs font-semibold text-neutral-primary mb-1.5">
            Select Funding Organization
          </label>
          <input
            type="text"
            value={data.organization}
            onChange={(e) =>
              onChange((prev) => ({ ...prev, organization: e.target.value }))
            }
            placeholder="Type Here"
            className="w-full px-3.5 py-2.5 bg-input-bg rounded-xl border border-gray-100 text-xs text-neutral-primary placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-primary mb-1.5">
            Topup Amount (NGN ₦)
          </label>
          <input
            type="text"
            value={data.amount}
            onChange={(e) =>
              onChange((prev) => ({ ...prev, amount: e.target.value }))
            }
            placeholder="Type Here"
            className="w-full px-3.5 py-2.5 bg-input-bg rounded-xl border border-gray-100 text-xs text-neutral-primary placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-primary mb-1.5">
            Payment Reference / Transfer ID
          </label>
          <input
            type="text"
            value={data.paymentReference}
            onChange={(e) =>
              onChange((prev) => ({ ...prev, paymentReference: e.target.value }))
            }
            placeholder="Type Here"
            className="w-full px-3.5 py-2.5 bg-input-bg rounded-xl border border-gray-100 text-xs text-neutral-primary placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <button
          type="button"
          disabled={!isValid}
          onClick={onSubmit}
          className="w-full py-3 mt-2 rounded-xl bg-secondary hover:bg-secondary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors cursor-pointer shadow-2xs"
        >
          Confirm Deposit
        </button>
      </div>
    </Modal>
  );
};
