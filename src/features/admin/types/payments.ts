export type PaymentsViewMode = "list" | "grid";

export type PaymentStatus = "Paid" | "Deposit" | "Pending";

export interface TransactionItem {
  id: string;
  candidateName: string;
  course: string;
  amountPaid: string;
  status: PaymentStatus;
  date: string;
  transactionId: string;
  paymentMethod: string;
  description?: string;
  vat?: string;
}

export interface TopupWalletFormData {
  organization: string;
  amount: string;
  paymentReference: string;
}

export interface PaymentRevenueStat {
  title: string;
  amount: string;
}
