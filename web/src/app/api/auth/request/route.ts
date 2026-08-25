import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { generateToken, hashToken, TOKEN_TTL } from "@/lib/auth";
import { sendMagicLinkEmail, emailDeliveryEnabled } from "@/lib/email";

// Request a magic link, emailed via Resend. Without RESEND_API_KEY set (local
// dev, CI), the link is logged to the console and echoed in the response
// instead — never in production, and never once real delivery is configured.
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

  try {
    await sendMagicLinkEmail(email, link);
  } catch (err) {
    console.error("[auth] failed to send magic link", err);
    return Response.json({ error: "send_failed" }, { status: 502 });
  }

  const showDevLink = !emailDeliveryEnabled() && process.env.NODE_ENV !== "production";
  return Response.json({ ok: true, ...(showDevLink ? { devLink: link } : {}) });
}
