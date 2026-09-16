import type { Money } from "@/shared/types";

export type PaymentStatus = "pending" | "success" | "failed";

export type PaymentVerification = {
  status: PaymentStatus;
  amount: Money;
  paidAt?: string | null;
};
