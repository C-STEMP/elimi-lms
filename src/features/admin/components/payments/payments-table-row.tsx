"use client";

import React from "react";
import type { PaymentStatus, TransactionItem } from "../../types/payments";

export interface PaymentsTableRowProps {
  item: TransactionItem;
  onOpenReceipt: (item: TransactionItem) => void;
}

const STATUS_STYLES: Record<PaymentStatus, string> = {
  Paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Deposit: "bg-rose-50 text-rose-700 border-rose-200",
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
};

export const PaymentsTableRow: React.FC<PaymentsTableRowProps> = ({
  item,
  onOpenReceipt,
}) => {
  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors text-xs text-neutral-primary">
      <td className="py-4 px-4 font-semibold text-neutral-primary">
        {item.candidateName}
      </td>

      <td className="py-4 px-4 text-neutral-secondary">
        {item.course}
      </td>

      <td className="py-4 px-4 font-bold text-neutral-primary">
        {item.amountPaid}
      </td>

      <td className="py-4 px-4 text-center">
        <span
          className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold border ${
            STATUS_STYLES[item.status] || "bg-gray-100 text-gray-700"
          }`}
        >
          {item.status}
        </span>
      </td>

      <td className="py-4 px-4 text-center">
        <button
          type="button"
          onClick={() => onOpenReceipt(item)}
          className="text-xs font-semibold text-neutral-primary hover:text-primary underline cursor-pointer transition-colors"
        >
          Receipt
        </button>
      </td>
    </tr>
  );
};
