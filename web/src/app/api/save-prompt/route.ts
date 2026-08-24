import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getUserIdOrNull } from "@/lib/auth";

// Success metric (b): a prompt the user chose to keep from a Try-it card.
export const runtime = "nodejs";

const Body = z.object({
  taskId: z.string().min(1),
  promptText: z.string().min(1).max(4000),
  rubricScore: z.number().int().min(0).max(4).optional(),
});

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
  const saved = await prisma.savedPrompt.create({
    data: {
      userId,
      taskId: parsed.data.taskId,
      promptText: parsed.data.promptText,
      rubricScore: parsed.data.rubricScore ?? null,
    },
  });
  return Response.json({ id: saved.id }, { status: 201 });
}

export async function GET() {
  const userId = await getUserIdOrNull();
  if (!userId) return Response.json({ prompts: [] });
  const prompts = await prisma.savedPrompt.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: { id: true, taskId: true, promptText: true, rubricScore: true, createdAt: true },
  });
  return Response.json({ prompts });
}
