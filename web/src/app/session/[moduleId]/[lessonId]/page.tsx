import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { getLesson, modules } from "@/content/modules";
import { LessonPlayer } from "@/components/session/LessonPlayer";
import { requireOnboardedUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { trackFirstLessonStarted } from "@/lib/analytics";

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
  const user = await requireOnboardedUser();
  const { moduleId, lessonId } = await params;
  const found = getLesson(moduleId, lessonId);
  if (!found) notFound();

  // "First lesson ever" is exactly "no Progress row exists yet for this
  // user" — checked here (page load / true session start), not in
  // /api/progress, since that only fires once the user advances past the
  // first card, which is later than the product moment this event names.
  const priorProgressCount = await prisma.progress.count({ where: { userId: user.id } });
  if (priorProgressCount === 0) {
    trackFirstLessonStarted({
      userId: user.id,
      userAgent: (await headers()).get("user-agent"),
      userRole: user.role,
      lessonId,
      moduleId,
    });
  }

  return <LessonPlayer module={found.module} lesson={found.lesson} />;
}
