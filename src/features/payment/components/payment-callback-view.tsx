"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import { Button } from "@/shared/components/ui/button";
import { InlineSpinner } from "@/shared/components/ui/loader";
import { DashboardNav } from "@/features/dashboard/components/dashboard-nav";
import { usePaymentVerification } from "@/features/payment/hooks";
import { checkoutStorage } from "@/shared/lib/checkout-storage";
import { enrollmentKeys } from "@/features/enrollments/hooks";

export const PaymentCallbackView: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const reference = searchParams.get("reference") || searchParams.get("trxref") || "";
  const pending = checkoutStorage.getPending();

  const { data: verification, isLoading } = usePaymentVerification(reference);

  useEffect(() => {
    if (verification?.status === "success") {
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.all });
      checkoutStorage.clearPending();
    }
  }, [verification?.status, queryClient]);

  let content: React.ReactNode;

  if (!reference) {
    content = (
      <>
        <FiXCircle className="w-14 h-14 text-primary-solid" />
        <h1 className="text-xl font-extrabold text-neutral-primary">Missing payment reference</h1>
        <p className="text-neutral-secondary text-sm max-w-sm">
          We couldn&apos;t find a payment reference in the URL. If you completed a payment, check your
          enrolled courses.
        </p>
        <Link href="/courses">
          <Button type="button" variant="secondary" size="md">
            Back to Courses
          </Button>
        </Link>
      </>
    );
  } else if (isLoading || verification?.status === "pending") {
    content = (
      <>
        <InlineSpinner />
        <h1 className="text-xl font-extrabold text-neutral-primary">Confirming your payment...</h1>
        <p className="text-neutral-secondary text-sm max-w-sm">
          This usually takes a few seconds. Please don&apos;t close this page.
        </p>
      </>
    );
  } else if (verification?.status === "success") {
    content = (
      <>
        <FiCheckCircle className="w-14 h-14 text-green-600" />
        <h1 className="text-xl font-extrabold text-neutral-primary">Payment successful</h1>
        <p className="text-neutral-secondary text-sm max-w-sm">
          You&apos;re enrolled — time to start learning.
        </p>
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={() =>
            router.push(pending?.enrollmentId ? `/learn/${pending.enrollmentId}` : "/dashboard")
          }
        >
          Start Course
        </Button>
      </>
    );
  } else {
    content = (
      <>
        <FiXCircle className="w-14 h-14 text-primary-solid" />
        <h1 className="text-xl font-extrabold text-neutral-primary">Payment failed</h1>
        <p className="text-neutral-secondary text-sm max-w-sm">
          Your payment could not be confirmed. You can try again from the course page.
        </p>
        <Link href={pending?.courseId ? `/courses/${pending.courseId}` : "/courses"}>
          <Button type="button" variant="secondary" size="md">
            Try Again
          </Button>
        </Link>
      </>
    );
  }

  return (
    <div className="w-full min-h-screen bg-input-bg/40 flex flex-col">
      <DashboardNav title="Payment" rightAction={null} />
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-4"
      >
        {content}
      </motion.div>
    </div>
  );
};
