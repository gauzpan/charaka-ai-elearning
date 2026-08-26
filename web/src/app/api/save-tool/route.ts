import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getUserIdOrNull } from "@/lib/auth";
import { TOOLS } from "@/content/toolkit";
import { trackToolkitToolBookmarked } from "@/lib/analytics";

// Saved tools: a per-user bookmark of an AI Toolkit tool (Resources).
// Mirrors save-prompt/route.ts. Content is TS, so we validate toolId against
// the known toolkit slugs rather than trusting arbitrary input.
export const runtime = "nodejs";

const validToolIds = new Set(TOOLS.map((t) => t.id));

const Body = z.object({
  toolId: z.string().min(1).refine((id) => validToolIds.has(id), "unknown_tool"),
});

export async function GET() {
  const userId = await getUserIdOrNull();
  if (!userId) return Response.json({ toolIds: [] });
  const rows = await prisma.savedTool.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: { toolId: true },
  });
  return Response.json({ toolIds: rows.map((r) => r.toolId) });
}

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

  const { toolId } = parsed.data;
  const alreadySaved = await prisma.savedTool.findUnique({
    where: { userId_toolId: { userId, toolId } },
  });
  // Idempotent: unique (userId, toolId) means a repeat save is a no-op.
  await prisma.savedTool.upsert({
    where: { userId_toolId: { userId, toolId } },
    create: { userId, toolId },
    update: {},
  });

  if (!alreadySaved) {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
    const tool = TOOLS.find((t) => t.id === toolId);
    trackToolkitToolBookmarked({
      userId,
      userAgent: req.headers.get("user-agent"),
      userRole: user?.role,
      toolId,
      toolCategory: tool?.category ?? "unknown",
    });
  }

  return Response.json({ saved: true }, { status: 201 });
}

export async function DELETE(req: Request) {
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

  await prisma.savedTool.deleteMany({ where: { userId, toolId: parsed.data.toolId } });
  return Response.json({ saved: false });
}
