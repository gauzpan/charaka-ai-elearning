"use client";

import { useState } from "react";

// Most feed items won't have a real thumbnail (only one of the three RSS
// sources reliably carries one) — this renders it when present and falls
// back to the same RSS glyph used for "AI Feed" elsewhere in Resources,
// including when a real thumbnailUrl 404s/hotlink-blocks after the fact.
export function FeedThumbnail({ src }: { src: string | null }) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;

  return (
    <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-md bg-subtle">
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element -- external, unregistered domains; no next/image remotePatterns config exists yet
        <img
          src={src ?? undefined}
          alt=""
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <svg
          width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className="text-muted" aria-hidden
        >
          <path d="M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16" />
          <circle cx="5" cy="19" r="1" />
        </svg>
      )}
    </div>
  );
}
