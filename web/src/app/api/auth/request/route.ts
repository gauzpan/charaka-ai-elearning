import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { generateToken, hashToken, TOKEN_TTL } from "@/lib/auth";

// Request a magic link. Dev delivery: the link is logged to the server console
// (and returned in the response in dev) — swap in a real email sender later.
export const runtime = "nodejs";

const Body = z.object({ email: z.string().email().max(200) });

export async function POST(req: Request) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }
  const parsed = Body.safeParse(raw);
  if (!parsed.success) {
    return Response.json({ error: "invalid_email" }, { status: 400 });
  }

  const email = parsed.data.email.trim().toLowerCase();
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, role: "PHYSICIAN" },
  });

  const token = generateToken();
  await prisma.magicLinkToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + TOKEN_TTL),
    },
  });

  const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;
  const link = `${origin}/api/auth/verify?token=${token}`;

  // Dev delivery — no email provider yet.
  console.log(`\n[auth] Magic link for ${email}:\n${link}\n`);

  const dev = process.env.NODE_ENV !== "production";
  return Response.json({ ok: true, ...(dev ? { devLink: link } : {}) });
}
