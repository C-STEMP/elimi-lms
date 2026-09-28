"use client";

import { useEffect, useMemo, useState } from "react";
import {
  useAdminPaymentsList,
  useAdminPaymentsSummary,
} from "@/features/staff/hooks";
import { INITIAL_TOPUP_FORM } from "../constants/payments-data";
import { formatMoney } from "@/shared/lib/money";
import type { AdminPaymentListItem } from "@/features/staff/types";
import type {
  PaymentsViewMode,
  PaymentRevenueStat,
  PaymentStatus,
  TopupWalletFormData,
  TransactionItem,
} from "../types/payments";

export function useAdminPayments() {
  const paymentsQuery = useAdminPaymentsList();
  const summaryQuery = useAdminPaymentsSummary();

  const [localDeposits, setLocalDeposits] = useState<TransactionItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [viewMode, setViewMode] = useState<PaymentsViewMode>("list");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  // Receipt Modal
  const [selectedReceipt, setSelectedReceipt] = useState<TransactionItem | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  // Topup Wallet & Success Modals
  const [isTopupOpen, setIsTopupOpen] = useState(false);
  const [topupForm, setTopupForm] = useState<TopupWalletFormData>(INITIAL_TOPUP_FORM);
  const [isDepositSuccessOpen, setIsDepositSuccessOpen] = useState(false);

  // Safely extract raw payment items from any response envelope
  const rawPayments = useMemo<AdminPaymentListItem[]>(() => {
    const d = paymentsQuery.data as any;
    if (!d) return [];
    if (Array.isArray(d)) return d;
    if (Array.isArray(d.data)) return d.data;
    if (Array.isArray(d.items)) return d.items;
    return [];
  }, [paymentsQuery.data]);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      if (paymentsQuery.data) {
        console.log("[Admin Payments] Response:", paymentsQuery.data);
      }
      if (paymentsQuery.error) {
        console.warn("[Admin Payments] Error:", paymentsQuery.error);
      }
    }
  }, [paymentsQuery.data, paymentsQuery.error]);

  const summary = summaryQuery.data;

  // Map backend payments directly from GET /admin/payments
  const backendTransactions: TransactionItem[] = useMemo(() => {
    return rawPayments.map((p) => {
      const courseTitle =
        p.course?.title && p.course.title.trim()
          ? p.course.title.trim()
          : p.levelOffering?.title && p.levelOffering.title.trim()
          ? p.levelOffering.title.trim()
          : "Trade Course";

      let status: PaymentStatus = "Pending";
      const s = (p.status || "").toLowerCase();
      if (s === "completed" || s === "paid" || s === "success") {
        status = "Paid";
      } else if (s === "pending") {
        status = "Pending";
      } else if (s === "failed") {
        status = "Failed";
      }

      const dateStr = p.paidAt || p.initiatedAt;
      let txDate = "";
      if (dateStr) {
        try {
          txDate = new Date(dateStr).toISOString().slice(0, 10);
        } catch {
          txDate = String(dateStr).slice(0, 10);
        }
      } else {
        txDate = new Date().toISOString().slice(0, 10);
      }

      // Normal learner name directly from the endpoint
      const candidateName =
        p.learnerName && p.learnerName.trim()
          ? p.learnerName.trim()
          : "Learner";

      const amountMinor = Number(p.amount?.amountMinorUnits) || 0;
      const amountPaid = p.amount ? formatMoney(p.amount) : "₦0";

      const txId = p.id
        ? p.id.startsWith("txn_") || p.id.startsWith("TXN_")
          ? p.id
          : p.id.length >= 8
          ? `TXN_${p.id.slice(-8).toUpperCase()}`
          : `TXN_${p.id.toUpperCase()}`
        : "TXN_PAYMENT";

      return {
        id: p.id,
        candidateName,
        course: courseTitle,
        amountPaid,
        amountMinor,
        status,
        date: txDate,
        transactionId: txId,
        paymentMethod: "Paystack",
        description: p.course?.title
          ? `Course Enrollment - ${p.course.title}`
          : p.levelOffering?.title
          ? `Level Offering - ${p.levelOffering.title}`
          : "LMS Checkout",
      };
    });
  }, [rawPayments]);

  const allTransactions = useMemo(() => {
    return [...localDeposits, ...backendTransactions];
  }, [localDeposits, backendTransactions]);

  const stats: PaymentRevenueStat[] = useMemo(() => {
    let totalRevenueMinor = 0;
    let pendingMinor = 0;
    let completedMinor = 0;

    allTransactions.forEach((tx) => {
      const amountMinor = tx.amountMinor ?? 0;
      if (tx.status === "Paid" || tx.status === "Deposit") {
        totalRevenueMinor += amountMinor;
        completedMinor += amountMinor;
      } else if (tx.status === "Pending") {
        pendingMinor += amountMinor;
      }
    });

    if (summary?.totalRevenue?.amountMinorUnits) {
      const summaryRev = Number(summary.totalRevenue.amountMinorUnits) || 0;
      if (summaryRev > 0) {
        totalRevenueMinor = summaryRev;
      }
    }

    return [
      {
        title: "Total Platform Revenue",
        amount:
          totalRevenueMinor > 0
            ? `₦${(totalRevenueMinor / 100).toLocaleString()}`
            : "₦0",
      },
      {
        title: "Pending Transactions",
        amount:
          pendingMinor > 0
            ? `₦${(pendingMinor / 100).toLocaleString()}`
            : "₦0",
      },
      {
        title: "Completed Transactions",
        amount:
          completedMinor > 0
            ? `₦${(completedMinor / 100).toLocaleString()}`
            : "₦0",
      },
    ];
  }, [summary, allTransactions]);

  const filteredTransactions = useMemo(() => {
    return allTransactions.filter((tx) => {
      const matchesSearch =
        !searchQuery.trim() ||
        tx.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.transactionId.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || tx.status === (statusFilter as PaymentStatus);

      return matchesSearch && matchesStatus;
    });
  }, [allTransactions, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredTransactions.length / PAGE_SIZE) || 1;

  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredTransactions.slice(start, start + PAGE_SIZE);
  }, [filteredTransactions, currentPage]);

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
    const numAmount = Number(topupForm.amount.replace(/[^0-9.]/g, ""));
    if (!topupForm.organization.trim() || !numAmount) return;

    const newDeposit: TransactionItem = {
      id: `tx-topup-${Date.now()}`,
      candidateName: topupForm.organization,
      course: "Organization Wallet Top-up",
      amountPaid: `₦${numAmount.toLocaleString()}`,
      amountMinor: numAmount * 100,
      status: "Deposit",
      date: new Date().toISOString().slice(0, 10),
      transactionId: topupForm.paymentReference || `TXN_${Date.now()}`,
      paymentMethod: "Bank Transfer",
      description: "Organization Wallet Top-up Deposit",
    };

    setLocalDeposits((prev) => [newDeposit, ...prev]);
    setIsTopupOpen(false);
    setIsDepositSuccessOpen(true);
  };

  const closeDepositSuccess = () => setIsDepositSuccessOpen(false);

  const handleSetSearchQuery = (q: string) => {
    setSearchQuery(q);
    setCurrentPage(1);
  };

  const handleSetStatusFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  return {
    transactions: paginatedTransactions,
    allTransactionsCount: allTransactions.length,
    stats,
    isLoading: paymentsQuery.isLoading,
    isError: paymentsQuery.isError,
    searchQuery,
    setSearchQuery: handleSetSearchQuery,
    statusFilter,
    setStatusFilter: handleSetStatusFilter,
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
