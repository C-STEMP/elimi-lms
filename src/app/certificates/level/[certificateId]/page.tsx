import { LevelCertificateDetailView } from "@/features/certificates";

export default async function LevelCertificateDetailPage({
  params,
}: {
  params: Promise<{ certificateId: string }>;
}) {
  const { certificateId } = await params;
  return <LevelCertificateDetailView certificateId={certificateId} />;
}
