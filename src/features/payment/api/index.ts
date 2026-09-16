import { orchestratorClient } from "@/shared/api/clients";
import { unwrapItem } from "@/shared/api/response";
import type { PaymentVerification } from "@/features/payment/types";

/**
 * Manual reconciliation fallback for a missed/delayed webhook. The webhook
 * itself (`/webhooks/paystack`) is server-to-server only and has no client API.
 */
export function verifyPayment(reference: string) {
  return unwrapItem<PaymentVerification>(
    orchestratorClient.get(`/payments/${reference}/verify`)
  );
}
