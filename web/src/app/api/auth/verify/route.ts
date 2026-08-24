import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  hashToken,
  buildSessionValue,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
} from "@/lib/auth";

// Consume a magic-link token, set the session cookie, and route the user on:
// to /onboarding if they haven't finished it, otherwise /today.
export const runtime = "nodejs";

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token");
  const bad = () => NextResponse.redirect(new URL("/signin?error=link", req.url));

  if (!token) return bad();

  const record = await prisma.magicLinkToken.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  });
  if (!record || record.consumedAt || record.expiresAt < new Date()) return bad();

  await prisma.magicLinkToken.update({
    where: { id: record.id },
    data: { consumedAt: new Date() },
  });

  const dest = record.user.onboardedAt ? "/today" : "/onboarding";
  const res = NextResponse.redirect(new URL(dest, req.url));
  res.cookies.set(SESSION_COOKIE, buildSessionValue(record.userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}
