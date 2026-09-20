import React from "react";
import { AdminPaymentsView } from "@/features/admin";

export const metadata = {
  title: "Payments & Financials | Elimi LMS Admin",
  description: "View platform revenue, transaction history, and wallet management",
};

export default function AdminPaymentsPage() {
  return <AdminPaymentsView />;
}
