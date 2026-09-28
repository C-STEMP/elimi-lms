import React from "react";
import { LuWallet, LuPlus } from "react-icons/lu";
import { PAYMENT_REVENUE_STATS } from "../../constants/payments-data";

import type { PaymentRevenueStat } from "../../types/payments";

export interface PaymentsStatsGridProps {
  onTopupWallet: () => void;
  stats?: PaymentRevenueStat[];
  isLoading?: boolean;
}

export const PaymentsStatsGrid: React.FC<PaymentsStatsGridProps> = ({
  onTopupWallet,
  stats = PAYMENT_REVENUE_STATS,
  isLoading = false,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 select-none">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="bg-white rounded-2xl border border-gray-100 p-4 shadow-2xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-neutral-primary">
              {stat.title}
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-400">
              <LuWallet className="w-4 h-4" />
            </div>
          </div>
          {isLoading ? (
            <div className="h-7 w-28 bg-gray-100 animate-pulse rounded-md" />
          ) : (
            <p className="text-xl font-bold text-neutral-primary">{stat.amount}</p>
          )}
        </div>
      ))}

      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-2xs flex flex-col justify-between">
        <span className="text-xs font-semibold text-neutral-primary mb-2">
          Funding Wallet Action
        </span>
        <button
          type="button"
          onClick={onTopupWallet}
          className="w-full py-2.5 px-3 rounded-xl bg-secondary hover:bg-secondary-hover text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
        >
          <span>Top-up Organization Wallet</span>
          <LuPlus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
