import { refreshFeed } from "@/lib/feed";

// Weekly AI Feed refresh — invoked by the Vercel Cron job in vercel.json.
// Vercel automatically sends `Authorization: Bearer <CRON_SECRET>` on
// cron-triggered requests when that env var is set; verified here so the
// (mildly expensive — 3 outbound fetches) refresh isn't publicly triggerable.
// Mirrors lib/email.ts's pattern: open in local dev (no CRON_SECRET set),
// enforced once deployed.
export const runtime = "nodejs";

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  const result = await refreshFeed();
  return Response.json(result, { status: result.ok ? 200 : 502 });
}
