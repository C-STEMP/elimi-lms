"use client";

import { useMemo, useState } from "react";
import {
  INITIAL_TOPUP_FORM,
  INITIAL_TRANSACTIONS,
} from "../constants/payments-data";
import type {
  PaymentsViewMode,
  PaymentStatus,
  TopupWalletFormData,
  TransactionItem,
} from "../types/payments";

export function useAdminPayments() {
  const [transactions, setTransactions] = useState<TransactionItem[]>(INITIAL_TRANSACTIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [viewMode, setViewMode] = useState<PaymentsViewMode>("list");
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 39;

  // Receipt Modal
  const [selectedReceipt, setSelectedReceipt] = useState<TransactionItem | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  // Topup Wallet & Success Modals
  const [isTopupOpen, setIsTopupOpen] = useState(false);
  const [topupForm, setTopupForm] = useState<TopupWalletFormData>(INITIAL_TOPUP_FORM);
  const [isDepositSuccessOpen, setIsDepositSuccessOpen] = useState(false);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesSearch =
        !searchQuery.trim() ||
        tx.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.course.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || tx.status === (statusFilter as PaymentStatus);

      return matchesSearch && matchesStatus;
    });
  }, [transactions, searchQuery, statusFilter]);

  const openReceipt = (tx: TransactionItem) => {
    setSelectedReceipt(tx);
    setIsReceiptOpen(true);
  };

  const closeReceipt = () => {
    setIsReceiptOpen(false);
    setSelectedReceipt(null);
  };

  const openTopup = () => {
    setTopupForm(INITIAL_TOPUP_FORM);
    setIsTopupOpen(true);
  };

  const closeTopup = () => setIsTopupOpen(false);

  const handleConfirmDeposit = () => {
    if (!topupForm.organization.trim() || !topupForm.amount.trim()) return;

    const newDeposit: TransactionItem = {
      id: `tx-${Date.now()}`,
      candidateName: topupForm.organization,
      course: "Organization Wallet Top-up",
      amountPaid: `₦${Number(topupForm.amount).toLocaleString() || topupForm.amount}`,
      status: "Deposit",
      date: new Date().toISOString().slice(0, 10),
      transactionId: topupForm.paymentReference || `TXN_${Date.now()}`,
      paymentMethod: "Bank Transfer",
      description: "Organization Wallet Top-up Deposit",
    };

    setTransactions((prev) => [newDeposit, ...prev]);
    setIsTopupOpen(false);
    setIsDepositSuccessOpen(true);
  };

  const closeDepositSuccess = () => setIsDepositSuccessOpen(false);

  return {
    transactions: filteredTransactions,
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
  };
}
