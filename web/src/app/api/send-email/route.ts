import { NextResponse } from "next/server";
import { z } from "zod";
import { timingSafeEqual } from "node:crypto";
import { sendMail, mailerConfigured } from "@/lib/mailer";

// Generic transactional-email endpoint: POST { to, subject, message } and it
// relays the message via Gmail SMTP (nodemailer). This is a general-purpose
// mail-sending API — the auth login-code flow (lib/email.ts) calls
// sendMail() directly in-process rather than looping back through this HTTP
// endpoint, since it's already server-side code in the same app; this route
// exists for callers that only have HTTP (external services, other routes,
// manual testing).
//
// Only POST is exported, so GET/PUT/etc. against this path 405 automatically
// (Next.js route handlers only respond to the HTTP methods they export).
export const runtime = "nodejs";

const Body = z.object({
  to: z.string().email().max(200),
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(10_000),
});

/** Constant-time check of the caller-supplied secret against EMAIL_API_SECRET. */
function isAuthorized(req: Request): boolean {
  const expected = process.env.EMAIL_API_SECRET;
  if (!expected) return false; // fail closed: misconfigured server, not "open"

  const provided = req.headers.get("x-api-secret");
  if (!provided) return false;

  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(req: Request) {
  // --- security: shared-secret header required on every call -------------
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // --- parse + validate body ----------------------------------------------
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = Body.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_body", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  if (!mailerConfigured()) {
    return NextResponse.json({ error: "email_not_configured" }, { status: 500 });
  }

  // --- send ------------------------------------------------------------
  const { to, subject, message } = parsed.data;
  try {
    await sendMail({ to, subject, text: message });
  } catch (err) {
    console.error("[send-email] failed to send", err);
    return NextResponse.json({ error: "send_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
