import React from "react";
import { AdminConfigurationView } from "@/features/admin";

export const metadata = {
  title: "Platform Configuration | Elimi LMS Admin",
  description: "Configure platform contact information, policies, and terms",
};

export default function AdminConfigurationPage() {
  return <AdminConfigurationView />;
}
