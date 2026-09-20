"use client";

import React from "react";
import { AdminHeader } from "../overview/admin-header";
import { PaymentsStatsGrid } from "./payments-stats-grid";
import { PaymentsSearchFilterBar } from "./payments-search-filter-bar";
import { PaymentsTable } from "./payments-table";
import { CoursesPagination } from "../courses/courses-pagination";
import { TransactionReceiptModal } from "./transaction-receipt-modal";
import { TopupWalletModal } from "./topup-wallet-modal";
import { DepositSuccessModal } from "./deposit-success-modal";
import { useAdminPayments } from "../../hooks/use-admin-payments";

export const AdminPaymentsView: React.FC = () => {
  const {
    transactions,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    viewMode,
    setViewMode,
    currentPage,
    setCurrentPage,
    totalPages,
    selectedReceipt,
    isReceiptOpen,
    openReceipt,
    closeReceipt,
    isTopupOpen,
    topupForm,
    setTopupForm,
    openTopup,
    closeTopup,
    handleConfirmDeposit,
    isDepositSuccessOpen,
    closeDepositSuccess,
  } = useAdminPayments();

  return (
    <div className="flex-1 flex flex-col gap-4 pb-6">
      <AdminHeader title="Payments" />

      <PaymentsStatsGrid onTopupWallet={openTopup} />

      <div>
        <h2 className="text-sm font-bold text-neutral-primary mb-2 select-none">
          Transaction History
        </h2>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden">
          <PaymentsSearchFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          <PaymentsTable
            transactions={transactions}
            onOpenReceipt={openReceipt}
          />
        </div>
      </div>

      <CoursesPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <TransactionReceiptModal
        isOpen={isReceiptOpen}
        item={selectedReceipt}
        onClose={closeReceipt}
      />

      <TopupWalletModal
        isOpen={isTopupOpen}
        data={topupForm}
        onChange={setTopupForm}
        onClose={closeTopup}
        onSubmit={handleConfirmDeposit}
      />

      <DepositSuccessModal
        isOpen={isDepositSuccessOpen}
        onClose={closeDepositSuccess}
      />
    </div>
  );
};
