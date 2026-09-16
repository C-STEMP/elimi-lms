import { Suspense } from "react";
import { ResetPasswordForm } from "@/features/auth";
import { Loader } from "@/shared/components/ui/loader";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Loader fullscreen={false} size="small" className="min-h-50" />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
