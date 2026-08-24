import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getUserIdOrNull } from "@/lib/auth";

// Success metric (a): the "I'll use this at work" tap on a completed lesson.
export const runtime = "nodejs";

const Body = z.object({ lessonId: z.string().min(1) });

export async function POST(req: Request) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }
  const parsed = Body.safeParse(raw);
  if (!parsed.success) {
    return Response.json({ error: "invalid_request" }, { status: 400 });
  }

  const userId = await getUserIdOrNull();
  if (!userId) return Response.json({ error: "unauthenticated" }, { status: 401 });
  // One intent per lesson per user — don't double-count repeat taps.
  const existing = await prisma.applyIntent.findFirst({
    where: { userId, lessonId: parsed.data.lessonId },
  });
  if (!existing) {
    await prisma.applyIntent.create({
      data: { userId, lessonId: parsed.data.lessonId },
    });
  }
  return Response.json({ ok: true }, { status: existing ? 200 : 201 });
}
