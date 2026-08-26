"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FeedCard, type FeedCardItem } from "@/components/today/FeedCard";

// Today's AI Feed panel: a premium editorial carousel, not a generic RSS
// list — one dominant featured card (the most recent item) followed by
// partially visible supporting cards, communicating horizontal continuation
// through partial visibility + scroll-snap rather than a scrollbar.

export function AiFeedRail() {
  const [items, setItems] = useState<FeedCardItem[] | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/feed?limit=5")
      .then((r) => r.json())
      .then((d: { items?: FeedCardItem[] }) => {
        if (alive) setItems(d.items ?? []);
      })
      .catch(() => {
        if (alive) setItems([]);
      });
    return () => {
      alive = false;
    };
  }, []);

  // Nothing cached yet (pre-first-cron-run) — omit the section rather than
  // show an empty-state card for an optional supporting module.
  if (items && items.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-meta">AI Feed</span>
        <Link href="/resources/feed" className="text-[13px] font-medium text-action hover:text-action-hover">
          See all
        </Link>
      </div>

      <div className="-mx-5 flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-5 pb-1">
        {items
          ? items.map((item, i) => <FeedCard key={item.id} item={item} featured={i === 0} />)
          : [true, false, false].map((featured, i) => (
              <div
                key={i}
                className={
                  featured
                    ? "h-[296px] w-[85vw] max-w-[360px] shrink-0 animate-pulse rounded-[20px] bg-subtle"
                    : "h-[296px] w-[68vw] max-w-[280px] shrink-0 animate-pulse rounded-[16px] border bg-subtle"
                }
              />
            ))}
      </div>
    </div>
  );
}
