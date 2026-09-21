import { Suspense } from "react";
import { SignInForm } from "@/features/auth";
import { Loader } from "@/shared/components/ui/loader";

export default function LoginPage() {
  return (
    <Suspense fallback={<Loader fullscreen={false} size="small" className="min-h-50" />}>
      <SignInForm />
    </Suspense>
  );
}
