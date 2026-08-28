import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getUserIdOrNull } from "@/lib/auth";
import { trackOnboardingCompleted } from "@/lib/analytics";

export const runtime = "nodejs";

const Body = z.object({
  focusTask: z.string().min(1).max(80),
  studyWindow: z.enum(["commute", "break", "evening"]),
  // Client is the source of truth for this — it's the one that knows
  // whether "Other" was picked, regardless of what text ended up in it.
  isCustomFocusTask: z.boolean().optional(),
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

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      focusTask: parsed.data.focusTask,
      studyWindow: parsed.data.studyWindow,
      onboardedAt: new Date(),
    },
  });

  trackOnboardingCompleted({
    userId,
    userAgent: req.headers.get("user-agent"),
    userRole: user.role,
    focusTaskSelected: parsed.data.focusTask,
    studyWindowTime: parsed.data.studyWindow,
    usedOtherOption: parsed.data.isCustomFocusTask ?? false,
  });

  return Response.json({ ok: true });
}
