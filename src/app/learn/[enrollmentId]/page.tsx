import { CoursePlayer } from "@/features/player";

export default async function LearnPage({
  params,
}: {
  params: Promise<{ enrollmentId: string }>;
}) {
  const { enrollmentId } = await params;
  return <CoursePlayer enrollmentId={enrollmentId} />;
}
