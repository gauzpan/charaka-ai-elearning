import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  verifyCodeHash,
  createSession,
  MAX_CODE_ATTEMPTS,
} from "@/lib/auth";
import { track, setProfile } from "@/lib/mixpanel";
import { trackAuthCodeVerified, trackUserSignedIn } from "@/lib/analytics";

// Consume a login code, set the session cookie, and tell the client where to
// go next. Attempts are capped per outstanding code (see LoginCode.attempts)
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
  const record = await prisma.loginCode.findFirst({
    where: { userId: user.id, consumedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });
  if (!record || record.attempts >= MAX_CODE_ATTEMPTS) return invalid();

  if (!verifyCodeHash(parsed.data.code, record.tokenHash)) {
    await prisma.loginCode.update({
      where: { id: record.id },
      data: { attempts: { increment: 1 } },
    });
    return invalid();
  }

  // Mixpanel "account_created" fires once, on this user's first-ever
  // successful verification — checked before marking this token consumed,
  // so this record doesn't count itself. Passwordless flow has no separate
  // signup form: account creation (upsert) already happened silently at
  // /api/auth/request; this is the first moment there's an identifiable,
  // signed-in user, so it's the accurate analog of "sign_up_completed".
  const priorSuccessfulLogins = await prisma.loginCode.count({
    where: { userId: user.id, consumedAt: { not: null } },
  });
  const isNewAccount = priorSuccessfulLogins === 0;

  await prisma.loginCode.update({
    where: { id: record.id },
    data: { consumedAt: new Date() },
  });

  // Set on every login, not just new accounts — otherwise anyone who signed
  // in before Mixpanel was wired up (or on any return visit) would never get
  // their email captured in their Mixpanel profile. people.set() is
  // idempotent, so re-sending the same value on every login is harmless.
  setProfile(user.id, { $email: user.email ?? "", platform: "web" });
  if (isNewAccount) {
    track(user.id, "account_created", { platform: "web", sign_up_method: "email_code" });
  }
  trackAuthCodeVerified({
    userId: user.id,
    userAgent: req.headers.get("user-agent"),
    userRole: user.role,
    isFirstLogin: isNewAccount,
  });
  trackUserSignedIn({
    userId: user.id,
    userAgent: req.headers.get("user-agent"),
    userRole: user.role,
    method: "email_code",
  });

  await createSession(user.id);

  return NextResponse.json({
    ok: true,
    redirect: user.onboardedAt ? "/today" : "/onboarding",
  });
}
