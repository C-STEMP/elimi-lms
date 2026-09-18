import { Suspense } from "react";
import { PaymentCallbackView } from "@/features/payment";
import { Loader } from "@/shared/components/ui/loader";

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={<Loader fullscreen={false} size="small" className="min-h-100" />}>
      <PaymentCallbackView />
    </Suspense>
  );
}
