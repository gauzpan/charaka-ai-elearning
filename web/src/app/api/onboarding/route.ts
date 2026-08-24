import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getUserIdOrNull } from "@/lib/auth";

export const runtime = "nodejs";

const Body = z.object({
  focusTask: z.string().min(1).max(80),
  studyWindow: z.enum(["commute", "break", "evening"]),
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

  await prisma.user.update({
    where: { id: userId },
    data: {
      focusTask: parsed.data.focusTask,
      studyWindow: parsed.data.studyWindow,
      onboardedAt: new Date(),
    },
  });
  return Response.json({ ok: true });
}
