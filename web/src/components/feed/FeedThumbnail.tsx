"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { FeedFallbackArt } from "@/components/feed/FeedFallbackArt";
import type { FeedCategory } from "@/lib/feedSources";

// Most feed items won't have a real thumbnail (only one of the three RSS
// sources reliably carries one) — this renders it when present and falls
// back to the shared category-toned art (see FeedFallbackArt) used across
// the AI Feed, including when a real thumbnailUrl 404s/hotlink-blocks after
// the fact. `id` seeds which of the fallback's line-pattern variants this
// item gets — stable per item, not re-randomized on every render.
// `sizeClassName` overrides the default row-thumbnail size (h-20 w-20) —
// e.g. Today's rail wants a wide banner instead.
export function FeedThumbnail({
  src,
  category,
  id,
  sizeClassName,
}: {
  src: string | null;
  category: FeedCategory;
  id: string;
  sizeClassName?: string;
}) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;

  return (
    <div
      className={cn(
        "relative grid shrink-0 place-items-center overflow-hidden rounded-md bg-subtle",
        sizeClassName ?? "h-20 w-20",
      )}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element -- external, unregistered domains; no next/image remotePatterns config exists yet
        <img
          src={src ?? undefined}
          alt=""
          loading="lazy"
          onError={() => setFailed(true)}
          className="relative h-full w-full object-cover"
        />
      ) : (
        <FeedFallbackArt category={category} seed={id} glyphClassName="h-6 w-6 opacity-40" />
      )}
    </div>
  );
}
