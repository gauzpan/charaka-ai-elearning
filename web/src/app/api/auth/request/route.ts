import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { generateCode, hashToken, TOKEN_TTL } from "@/lib/auth";
import { sendLoginCodeEmail } from "@/lib/email";

// Request a sign-in code. No real email provider is wired up (see
// lib/email.ts) — the code is always logged server-side and echoed back
// here so the client can show it directly.
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

  const code = generateCode();
  await prisma.loginCode.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(code),
      expiresAt: new Date(Date.now() + TOKEN_TTL),
    },
  });

  await sendLoginCodeEmail(email, code);

  return Response.json({ ok: true, devCode: code });
}
