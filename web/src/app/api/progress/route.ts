import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getUserIdOrNull } from "@/lib/auth";
import { allLessons } from "@/content/modules";
import { POINTS_PER_LESSON, levelFor } from "@/lib/levels";
import {
  trackLessonCompleted,
  trackFirstLessonCompleted,
  trackLevelUpgraded,
} from "@/lib/analytics";

// Account-backed progress (build-plan Phase 7). The client store (localStorage)
// syncs against this so progress and skill points follow the user across
// devices. moduleId is resolved server-side from content, not trusted from the client.
export const runtime = "nodejs";

function moduleIdFor(lessonId: string): string | null {
  return allLessons().find((l) => l.lessonId === lessonId)?.moduleId ?? null;
}

export async function GET() {
  const userId = await getUserIdOrNull();
  if (!userId) return Response.json({ lessons: {} });

  const rows = await prisma.progress.findMany({
    where: { userId },
    select: { lessonId: true, cardIndex: true, completedAt: true },
  });
  const lessons: Record<string, { cardIndex: number; completedAt: string | null }> = {};
  for (const r of rows) {
    lessons[r.lessonId] = {
      cardIndex: r.cardIndex,
      completedAt: r.completedAt ? r.completedAt.toISOString() : null,
    };
  }
  return Response.json({ lessons });
}

const Body = z.object({
  lessonId: z.string().min(1),
  cardIndex: z.number().int().min(0).max(50).optional(),
  completed: z.boolean().optional(),
  // Client-timed (LessonPlayer captures a mount timestamp) — used only for
  // the first_lesson_completed analytics event, never persisted to Progress.
  timeTakenSeconds: z.number().int().min(0).optional(),
});

export async function POST(req: Request) {
  const userId = await getUserIdOrNull();
  if (!userId) return Response.json({ error: "unauthenticated" }, { status: 401 });

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }
  const parsed = Body.safeParse(raw);
  if (!parsed.success) return Response.json({ error: "invalid_request" }, { status: 400 });

  const { lessonId, cardIndex = 0, completed = false, timeTakenSeconds } = parsed.data;
  const moduleId = moduleIdFor(lessonId);
  if (!moduleId) return Response.json({ error: "unknown_lesson" }, { status: 404 });

  const existing = await prisma.progress.findUnique({
    where: { userId_lessonId: { userId, lessonId } },
  });
  const nextCardIndex = Math.max(existing?.cardIndex ?? 0, cardIndex);
  const completedAt = existing?.completedAt ?? (completed ? new Date() : null);
  // Mixpanel Value Moment: fires exactly once per (user, lesson) — the
  // transition from not-yet-completed to completed, not on every progress
  // upsert (a lesson already completed can still receive card-index updates).
  const justCompleted = !existing?.completedAt && completedAt !== null;

  // Completed-lesson count BEFORE this write — used to derive points/level
  // before vs. after, and whether this is the user's first-ever completion.
  const completedCountBefore = await prisma.progress.count({
    where: { userId, completedAt: { not: null } },
  });

  await prisma.progress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    update: { cardIndex: nextCardIndex, completedAt },
    create: { userId, moduleId, lessonId, cardIndex: nextCardIndex, completedAt },
  });

  if (justCompleted) {
    const userAgent = req.headers.get("user-agent");
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
    const userRole = user?.role;

    const pointsBefore = completedCountBefore * POINTS_PER_LESSON;
    const pointsAfter = pointsBefore + POINTS_PER_LESSON;

    trackLessonCompleted({
      userId,
      userAgent,
      userRole,
      lessonId,
      moduleId,
      pointsEarned: POINTS_PER_LESSON,
    });

    if (completedCountBefore === 0) {
      trackFirstLessonCompleted({
        userId,
        userAgent,
        userRole,
        lessonId,
        timeTakenSeconds: timeTakenSeconds ?? 0,
      });
    }

    // DB is the source of truth for level rank (design.md §5.6 competence
    // framing) — computed here, not duplicated client-side, so a rank
    // transition only ever fires once regardless of how many devices/tabs
    // are syncing this same completion.
    const levelBefore = levelFor(pointsBefore);
    const levelAfter = levelFor(pointsAfter);
    if (levelAfter.name !== levelBefore.name) {
      trackLevelUpgraded({
        userId,
        userAgent,
        userRole,
        newLevel: levelAfter.name,
        totalPoints: pointsAfter,
      });
    }
  }

  return Response.json({ ok: true });
}
