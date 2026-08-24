import { notFound } from "next/navigation";
import { getLesson, modules } from "@/content/modules";
import { LessonPlayer } from "@/components/session/LessonPlayer";
import { requireOnboardedUser } from "@/lib/auth";

// Session player lives outside the (tabs) group so it owns the whole screen —
// no bottom tab bar during a session (design.md §4.2).

// Prerender every lesson route from typed content.
export function generateStaticParams() {
  return modules.flatMap((m) =>
    m.lessons.map((l) => ({ moduleId: m.id, lessonId: l.id })),
  );
}

export default async function SessionPage({
  params,
}: {
  params: Promise<{ moduleId: string; lessonId: string }>;
}) {
  await requireOnboardedUser();
  const { moduleId, lessonId } = await params;
  const found = getLesson(moduleId, lessonId);
  if (!found) notFound();

  return <LessonPlayer module={found.module} lesson={found.lesson} />;
}
