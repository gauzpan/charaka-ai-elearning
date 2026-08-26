import { prisma } from "@/lib/prisma";
import { FEED_SIZE } from "@/lib/feed";

// Read-only list of cached AI Feed items (Today's rail widget, Resources ->
// AI Feed). Unauthenticated on purpose — feed content isn't personalized,
// same items for every signed-in user. Writes only happen via the Vercel
// Cron job at /api/feed/refresh (CRON_SECRET-protected) — this route never
// triggers a fetch, just reads whatever's already cached.
export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const requested = Number(searchParams.get("limit"));
  const limit = Number.isFinite(requested) && requested > 0 ? Math.min(requested, FEED_SIZE) : FEED_SIZE;

  const items = await prisma.feedItem.findMany({
    orderBy: { publishedAt: "desc" },
    take: limit,
    select: {
      id: true,
      url: true,
      title: true,
      description: true,
      thumbnailUrl: true,
      sourceName: true,
      category: true,
      publishedAt: true,
    },
  });

  return Response.json({ items });
}
