import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  // 303 so the browser follows with a GET.
  const res = NextResponse.redirect(new URL("/signin", req.url), { status: 303 });
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
