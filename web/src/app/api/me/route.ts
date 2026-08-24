import { prisma } from "@/lib/prisma";
import { getUserIdOrNull } from "@/lib/auth";
import { initialsFromEmail } from "@/lib/initials";

// The signed-in user, for the client (avatar initials + per-user progress key).
export const runtime = "nodejs";

export async function GET() {
  const userId = await getUserIdOrNull();
  if (!userId) return Response.json({ user: null }, { status: 200 });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true },
  });
  if (!user) return Response.json({ user: null }, { status: 200 });

  return Response.json({
    id: user.id,
    email: user.email,
    initials: initialsFromEmail(user.email),
  });
}
