import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { FEED_SIZE } from "@/lib/feed";
import { timeAgo } from "@/lib/timeAgo";
import { Card } from "@/components/ui/Card";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { buttonClasses } from "@/components/ui/Button";
import { FeedThumbnail } from "@/components/feed/FeedThumbnail";
import type { FeedCategory } from "@/lib/feedSources";

// AI Feed: the FeedItem cache the weekly Vercel Cron job (see vercel.json ->
// api/feed/refresh) keeps stocked with up to FEED_SIZE items. This page only
// reads — it never fetches or refreshes on its own, so a plain DB read.
export const dynamic = "force-dynamic";

export default async function FeedPage() {
  const items = await prisma.feedItem.findMany({
    orderBy: { publishedAt: "desc" },
    take: FEED_SIZE,
  });

  return (
    <div className="flex flex-col gap-5 animate-card-in">
      <Link
        href="/resources"
        className="inline-flex items-center gap-1.5 font-mono text-[12px] font-medium uppercase tracking-[0.06em] text-secondary hover:text-primary"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Resources
      </Link>

      <ScreenHeader
        eyebrow="AI Feed"
        title="This week in AI + healthcare"
        subtitle="Ten updates on AI, GenAI, and prompting in healthcare — refreshed every week, nothing to scroll for its own sake."
      />

      {items.length === 0 ? (
        <EmptyState
          title="Nothing cached yet"
          body="This feed refreshes automatically every Monday. Check back soon, or browse the AI Toolkit in the meantime."
          action={
            <Link href="/resources/toolkit" className={buttonClasses("ghost")}>
              Browse the AI Toolkit
            </Link>
          }
        />
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action rounded-lg"
            >
              <Card hover className="flex items-center gap-4">
                <FeedThumbnail src={item.thumbnailUrl} category={item.category as FeedCategory} id={item.id} />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <h3 className="line-clamp-2 font-medium text-[16px] leading-[21px] text-primary">
                    {item.title}
                  </h3>
                  <p className="line-clamp-2 text-[14px] leading-[19px] text-secondary">
                    {item.description}
                  </p>
                  <p className="text-meta">
                    {item.sourceName} &middot; {timeAgo(item.publishedAt)}
                  </p>
                </div>
                <svg
                  width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className="shrink-0 text-muted" aria-hidden
                >
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </Card>
            </a>
          ))}
        </div>
      )}

      <p className="text-center text-[12px] leading-relaxed text-secondary">
        Sourced from public RSS feeds of named publications; always open the full article before relying on it.
      </p>
    </div>
  );
}
