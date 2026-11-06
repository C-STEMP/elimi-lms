import { CertificateDetailView } from "@/features/certificates";

export default async function CertificateDetailPage({
  params,
}: {
  params: Promise<{ certificateId: string }>;
}) {
  const { certificateId } = await params;
  return <CertificateDetailView certificateId={certificateId} />;
}
