import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { exchangeGoogleCode } from "@/lib/google";
import { consumeCeremonyCookie, createSession } from "@/lib/auth";
import { track, setProfile } from "@/lib/mixpanel";
import { trackUserSignedIn } from "@/lib/analytics";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const signinUrl = new URL("/signin", url);

  if (url.searchParams.get("error")) {
    signinUrl.searchParams.set("error", "google");
    return NextResponse.redirect(signinUrl);
  }

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const ceremony = await consumeCeremonyCookie<{ state: string }>("charaka_google_state");
  if (!code || !state || !ceremony || ceremony.state !== state) {
    signinUrl.searchParams.set("error", "google");
    return NextResponse.redirect(signinUrl);
  }

  let identity: { googleId: string; email: string | null };
  try {
    identity = await exchangeGoogleCode(code);
  } catch (err) {
    console.error("[auth] google code exchange failed", err);
    signinUrl.searchParams.set("error", "google");
    return NextResponse.redirect(signinUrl);
  }

  let user = await prisma.user.findUnique({ where: { googleId: identity.googleId } });
  let isNewAccount = false;

  if (!user) {
    try {
      user = await prisma.user.create({
        data: { googleId: identity.googleId, email: identity.email, role: "PHYSICIAN" },
      });
      isNewAccount = true;
    } catch (err) {
      // The verified Google email already belongs to an account (e.g. a
      // passkey user who later added this same address as a recovery
      // email) — link this Google identity to that existing account rather
      // than failing the sign-in.
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002" &&
        identity.email
      ) {
        user = await prisma.user.update({
          where: { email: identity.email },
          data: { googleId: identity.googleId },
        });
      } else {
        throw err;
      }
    }
  }

  await createSession(user.id);

  setProfile(user.id, { platform: "web", ...(user.email ? { $email: user.email } : {}) });
  if (isNewAccount) {
    track(user.id, "account_created", { platform: "web", sign_up_method: "google" });
  }
  trackUserSignedIn({
    userId: user.id,
    userAgent: req.headers.get("user-agent"),
    userRole: user.role,
    method: "google",
  });

  const dest = new URL(user.onboardedAt ? "/today" : "/onboarding", url);
  return NextResponse.redirect(dest);
}
