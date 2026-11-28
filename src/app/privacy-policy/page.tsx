import type { Metadata } from "next";
import { PrivacyPolicyView } from "@/features/landing/components/privacy-policy-view";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for ELIMI LMS describing our policies and procedures on the collection, use, and disclosure of your information.",
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyView />;
}
