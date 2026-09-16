"use client";

import { useQuery } from "@tanstack/react-query";
import * as paymentApi from "@/features/payment/api";

export const paymentKeys = {
  all: ["payment"] as const,
  verify: (reference: string) => [...paymentKeys.all, "verify", reference] as const,
};

/** Polls while the payment is still pending — e.g. on a post-checkout redirect page. */
export function usePaymentVerification(reference: string) {
  return useQuery({
    queryKey: paymentKeys.verify(reference),
    queryFn: () => paymentApi.verifyPayment(reference),
    enabled: Boolean(reference),
    refetchInterval: (query) => (query.state.data?.status === "pending" ? 3000 : false),
  });
}
