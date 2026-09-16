import { Suspense } from "react";
import { VerifyEmailForm } from "@/features/auth";
import { Loader } from "@/shared/components/ui/loader";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<Loader fullscreen={false} size="small" className="min-h-50" />}>
      <VerifyEmailForm />
    </Suspense>
  );
}
