import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  verifyCodeHash,
  buildSessionValue,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  MAX_CODE_ATTEMPTS,
} from "@/lib/auth";

// Consume a login code, set the session cookie, and tell the client where to
// go next. Attempts are capped per outstanding code (see MagicLinkToken.attempts)
// so a 6-digit code can't be brute-forced within its 10-minute TTL.
export const runtime = "nodejs";

const Body = z.object({
  email: z.string().email().max(200),
  code: z.string().regex(/^\d{6}$/),
});

export async function POST(req: Request) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const parsed = Body.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_code" }, { status: 400 });
  }

  const email = parsed.data.email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });
  const invalid = () => NextResponse.json({ error: "invalid_code" }, { status: 400 });
  if (!user) return invalid();

  // Most recent outstanding code for this user — never look up by guessing
  // the hash directly, or there'd be nothing to rate-limit attempts against.
  const record = await prisma.magicLinkToken.findFirst({
    where: { userId: user.id, consumedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });
  if (!record || record.attempts >= MAX_CODE_ATTEMPTS) return invalid();

  if (!verifyCodeHash(parsed.data.code, record.tokenHash)) {
    await prisma.magicLinkToken.update({
      where: { id: record.id },
      data: { attempts: { increment: 1 } },
    });
    return invalid();
  }

  await prisma.magicLinkToken.update({
    where: { id: record.id },
    data: { consumedAt: new Date() },
  });

  const res = NextResponse.json({
    ok: true,
    redirect: user.onboardedAt ? "/today" : "/onboarding",
  });
  res.cookies.set(SESSION_COOKIE, buildSessionValue(user.id), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}
