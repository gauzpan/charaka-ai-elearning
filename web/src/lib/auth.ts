import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHash, createHmac, randomInt, timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/prisma";

// Lightweight session (build-plan Phase 7). No third-party auth lib — sign-in
// is a one-time numeric code emailed to the user; the MagicLinkToken table +
// a signed HttpOnly cookie carry the session. AUTH_SECRET signs the cookie;
// codes are stored only as SHA-256 hashes, never in plaintext.

export const SESSION_COOKIE = "charaka_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
const TOKEN_TTL_MS = 10 * 60 * 1000; // login code valid 10 minutes
export const MAX_CODE_ATTEMPTS = 5;

function secret(): string {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET is not set");
  return s;
}

function sign(value: string): string {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

/** Random single-use 6-digit login code (the raw value goes in the email). */
export function generateCode(): string {
  return randomInt(0, 1_000_000).toString().padStart(6, "0");
}

/** Only the hash is stored, so a DB leak can't be replayed. */
export function hashToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

/** Constant-time comparison of a raw code against a stored hash. */
export function verifyCodeHash(raw: string, storedHash: string): boolean {
  const a = Buffer.from(hashToken(raw));
  const b = Buffer.from(storedHash);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** The signed cookie value for a user id — set on a response to log them in. */
export function buildSessionValue(userId: string): string {
  return `${userId}.${sign(userId)}`;
}

export async function createSession(userId: string): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, buildSessionValue(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/** Returns the signed-in user's id, or null. Verifies the cookie signature. */
export async function getSessionUserId(): Promise<string | null> {
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  const dot = raw.lastIndexOf(".");
  if (dot < 0) return null;
  const userId = raw.slice(0, dot);
  const sig = raw.slice(dot + 1);
  const expected = sign(userId);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  return userId;
}

export const TOKEN_TTL = TOKEN_TTL_MS;

// --- guards ---------------------------------------------------------------

/** For server components: redirect to /signin (or /onboarding) as needed. */
export async function requireUser() {
  const userId = await getSessionUserId();
  if (!userId) redirect("/signin");
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    await destroySession();
    redirect("/signin");
  }
  return user;
}

/** Server components that require a fully-onboarded user (the app proper). */
export async function requireOnboardedUser() {
  const user = await requireUser();
  if (!user.onboardedAt) redirect("/onboarding");
  return user;
}

/** For API routes: the user id or null (caller returns 401). No redirect. */
export async function getUserIdOrNull(): Promise<string | null> {
  const userId = await getSessionUserId();
  if (!userId) return null;
  const exists = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
  return exists ? userId : null;
}
