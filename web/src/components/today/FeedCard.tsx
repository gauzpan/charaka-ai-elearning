"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { Tag } from "@/components/ui/Tag";
import { timeAgo } from "@/lib/timeAgo";
import { CATEGORY_TONE, type FeedCategory } from "@/lib/feedSources";
import { FeedFallbackArt } from "@/components/feed/FeedFallbackArt";

// A premium editorial carousel card for Today's AI Feed panel — deliberately
// not the same component as the full Resources -> AI Feed list rows
// (FeedThumbnail-based), which stay a dense, scannable list on purpose. This
// is meant to read as "AI-curated clinical intelligence": one dominant
// featured card plus lower-weight supporting cards, editorial hierarchy over
// article count. Colors are drawn only from the existing design tokens
// (semantic tone backgrounds + the single emerald accent) — no new palette.

export interface FeedCardItem {
  id: string;
  url: string;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  sourceName: string;
  category: FeedCategory;
  publishedAt: string;
}

export function FeedCard({ item, featured }: { item: FeedCardItem; featured: boolean }) {
  const [imgFailed, setImgFailed] = useState(false);
  const tone = CATEGORY_TONE[item.category] ?? "neutral";
  const showImage = Boolean(item.thumbnailUrl) && !imgFailed;

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group flex shrink-0 snap-start flex-col overflow-hidden bg-surface transition-[transform,box-shadow] duration-200 ease-out",
        "active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action",
        featured
          ? "w-[85vw] max-w-[360px] rounded-[20px] border-0 shadow-[var(--shadow-elevated)] hover:shadow-[var(--shadow-elevated-hover)]"
          : "w-[68vw] max-w-[280px] rounded-[16px] border hover:shadow-[var(--shadow-hover)]",
      )}
    >
      {/* Editorial art area: real thumbnail when one exists, otherwise the
          shared tonal-wash + line-pattern + category glyph fallback (see
          FeedFallbackArt) — every card reads as intentional even without a
          photo, which is most of them (only one of three RSS sources
          reliably carries a real thumbnail). Height is fixed across both
          card sizes — only width/radius/shadow/title size carry the
          "featured" weight, so the row never staggers. */}
      <div className="relative flex h-36 shrink-0 items-center justify-center overflow-hidden bg-subtle">
        {showImage ? (
          // eslint-disable-next-line @next/next/no-img-element -- external, unregistered domains
          <img
            src={item.thumbnailUrl ?? undefined}
            alt=""
            loading="lazy"
            onError={() => setImgFailed(true)}
            className="relative h-full w-full object-cover"
          />
        ) : (
          <FeedFallbackArt
            category={item.category}
            seed={item.id}
            glyphClassName={featured ? "h-12 w-12 opacity-[0.28]" : "h-9 w-9 opacity-[0.22]"}
          />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <Tag tone={tone}>{item.category}</Tag>

        <h3
          className={cn(
            "line-clamp-2 flex-1",
            featured
              ? "font-display text-[18px] font-semibold leading-[23px] tracking-[-0.01em] text-primary"
              : "text-[15px] font-medium leading-[20px] text-secondary",
          )}
        >
          {item.title}
        </h3>

        <div className="mt-1 flex items-center justify-between gap-2">
          <span className="text-meta truncate">
            {item.sourceName} &middot; {timeAgo(new Date(item.publishedAt))}
          </span>
          <span
            className={cn(
              "grid h-9 w-9 shrink-0 place-items-center rounded-pill transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
              featured ? "bg-action/10 text-action" : "bg-subtle text-secondary",
            )}
            aria-hidden
          >
            <ArrowIcon className="h-4 w-4" />
          </span>
        </div>
      </div>
    </a>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M7 17 17 7M17 7H9M17 7v8" />
    </svg>
  );
}
