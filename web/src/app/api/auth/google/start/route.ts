import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { buildGoogleAuthUrl } from "@/lib/google";
import { setCeremonyCookie } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const state = randomUUID();
  await setCeremonyCookie("charaka_google_state", { state }, 5 * 60);

  return NextResponse.redirect(buildGoogleAuthUrl({ state }));
}
