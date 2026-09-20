import type {
  PaymentRevenueStat,
  TopupWalletFormData,
  TransactionItem,
} from "../types/payments";

export const PAYMENT_REVENUE_STATS: PaymentRevenueStat[] = [
  { title: "Total Platform Revenue", amount: "₦19,495,000" },
  { title: "Pending Transactions", amount: "₦250,000" },
  { title: "Completed Transactions", amount: "₦250,000" },
];

export const INITIAL_TOPUP_FORM: TopupWalletFormData = {
  organization: "",
  amount: "",
  paymentReference: "",
};

export const PAYMENT_STATUS_OPTIONS = [
  { value: "All", label: "All Status" },
  { value: "Paid", label: "Paid" },
  { value: "Deposit", label: "Deposit" },
  { value: "Pending", label: "Pending" },
];

export const INITIAL_TRANSACTIONS: TransactionItem[] = [
  {
    id: "tx-1",
    candidateName: "Tunde Bakare",
    course: "Introduction To Painting",
    amountPaid: "₦45,000",
    status: "Paid",
    date: "2023-12-01",
    transactionId: "TXN_12345_ABCDE",
    paymentMethod: "Paystack",
    description: "RPL Assessment - Recognition of prior learning",
  },
  {
    id: "tx-2",
    candidateName: "Ifeoma Chukwu",
    course: "Introduction To Painting",
    amountPaid: "₦45,000",
    status: "Paid",
    date: "2023-12-01",
    transactionId: "TXN_12346_BCDEF",
    paymentMethod: "Paystack",
    description: "RPL Assessment - Recognition of prior learning",
  },
  {
    id: "tx-3",
    candidateName: "SIFA",
    course: "Introduction To Painting",
    amountPaid: "₦4,500,000",
    status: "Deposit",
    date: "2023-12-01",
    transactionId: "TXN_12347_CDEFG",
    paymentMethod: "Bank Transfer",
    description: "Organization Cohort Sponsorship Deposit",
  },
  {
    id: "tx-4",
    candidateName: "Kelechi Nwosu",
    course: "Introduction To Painting",
    amountPaid: "₦45,000",
    status: "Pending",
    date: "2023-12-01",
    transactionId: "TXN_12348_DEFGH",
    paymentMethod: "Paystack",
    description: "RPL Assessment - Recognition of prior learning",
  },
  {
    id: "tx-5",
    candidateName: "Yusuf Danladi",
    course: "Introduction To Painting",
    amountPaid: "₦45,000",
    status: "Paid",
    date: "2023-12-01",
    transactionId: "TXN_12349_EFGHI",
    paymentMethod: "Paystack",
    description: "RPL Assessment - Recognition of prior learning",
  },
];
