import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getUserIdOrNull } from "@/lib/auth";
import { allLessons } from "@/content/modules";
import { track } from "@/lib/mixpanel";

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

  const { lessonId, cardIndex = 0, completed = false } = parsed.data;
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

  await prisma.progress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    update: { cardIndex: nextCardIndex, completedAt },
    create: { userId, moduleId, lessonId, cardIndex: nextCardIndex, completedAt },
  });

  if (justCompleted) {
    track(userId, "lesson_completed", { module_id: moduleId, lesson_id: lessonId, platform: "web" });
  }

  return Response.json({ ok: true });
}
