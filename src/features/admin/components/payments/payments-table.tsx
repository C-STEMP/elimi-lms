import React from "react";
import { PaymentsTableHeader } from "./payments-table-header";
import { PaymentsTableRow } from "./payments-table-row";
import type { TransactionItem } from "../../types/payments";

export interface PaymentsTableProps {
  transactions: TransactionItem[];
  onOpenReceipt: (item: TransactionItem) => void;
  isLoading?: boolean;
}

export const PaymentsTable: React.FC<PaymentsTableProps> = ({
  transactions,
  onOpenReceipt,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="p-12 text-center text-neutral-secondary text-xs flex flex-col items-center justify-center gap-2">
        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span>Loading transactions...</span>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="p-12 text-center text-neutral-secondary text-xs">
        No transactions found matching your criteria.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full border-collapse">
        <PaymentsTableHeader />
        <tbody className="divide-y divide-gray-50">
          {transactions.map((item) => (
            <PaymentsTableRow
              key={item.id}
              item={item}
              onOpenReceipt={onOpenReceipt}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
