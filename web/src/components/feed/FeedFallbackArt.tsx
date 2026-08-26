import { cn } from "@/lib/cn";
import { CATEGORY_TONE, type FeedCategory } from "@/lib/feedSources";

// Shared "no thumbnail" art for the AI Feed (design.md: avoid a generic
// stock-photo rectangle, but a blank glyph-on-flat-tile reads as broken too).
// Most items never carry an RSS thumbnail, so this is the *common* case, not
// an edge case — it needs to look intentional. Every element stays on-token
// (existing semantic tone + emerald + neutrals, no new palette): a tonal wash
// keyed to the item's category (meaningful, not decorative — design.md §6.1),
// one of a few monochrome continuous-line patterns (design.md §6.5/6.7)
// picked deterministically from the item id so the same item always renders
// the same way, and the category glyph on top. Used by both FeedThumbnail
// (Resources -> AI Feed list rows) and FeedCard (Today's carousel) so the
// two surfaces read as one system (design.md P10).

const PATTERN_COUNT = 5;

/** Small deterministic string hash (djb2-ish) — stable across reloads/SSR,
 * no randomness, so the same feed item never "flickers" between variants. */
function pickVariant(seed: string, count: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % count;
}

export function FeedFallbackArt({
  category,
  seed,
  glyphClassName,
}: {
  category: FeedCategory;
  seed: string;
  glyphClassName?: string;
}) {
  const tone = CATEGORY_TONE[category] ?? "neutral";
  const variant = pickVariant(seed, PATTERN_COUNT);

  return (
    <div className="absolute inset-0" aria-hidden>
      <div className={cn("absolute inset-0", TONE_WASH[tone])} />
      <LinePattern variant={variant} className={cn("absolute inset-0 h-full w-full opacity-[0.14]", TONE_TEXT[tone])} />
      <div className="relative flex h-full w-full items-center justify-center">
        <CategoryGlyph category={category} className={cn(TONE_TEXT[tone], glyphClassName)} />
      </div>
    </div>
  );
}

export const TONE_TEXT: Record<string, string> = {
  info: "text-info",
  success: "text-success",
  warning: "text-warning",
  neutral: "text-secondary",
};

export const TONE_WASH: Record<string, string> = {
  info: "bg-[radial-gradient(130%_110%_at_25%_-10%,var(--info-bg)_0%,transparent_60%)] opacity-70",
  success: "bg-[radial-gradient(130%_110%_at_25%_-10%,var(--success-bg)_0%,transparent_60%)] opacity-70",
  warning: "bg-[radial-gradient(130%_110%_at_25%_-10%,var(--warning-bg)_0%,transparent_60%)] opacity-70",
  neutral: "bg-[radial-gradient(130%_110%_at_25%_-10%,var(--action)_0%,transparent_55%)] opacity-[0.09]",
};

function LinePattern({ variant, className }: { variant: number; className?: string }) {
  const props = {
    viewBox: "0 0 100 100",
    preserveAspectRatio: "none",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1,
    strokeLinecap: "round" as const,
    className,
  };
  switch (variant) {
    case 0: // parallel diagonals
      return (
        <svg {...props}>
          {[-20, 0, 20, 40, 60, 80, 100, 120].map((x) => (
            <line key={x} x1={x} y1="0" x2={x - 40} y2="100" />
          ))}
        </svg>
      );
    case 1: // concentric arcs from the bottom-right
      return (
        <svg {...props}>
          {[20, 40, 60, 80, 100, 120].map((r) => (
            <circle key={r} cx="100" cy="100" r={r} />
          ))}
        </svg>
      );
    case 2: // sparse dot grid
      return (
        <svg {...props} stroke="none" fill="currentColor">
          {[15, 40, 65, 90].flatMap((y) =>
            [10, 35, 60, 85].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.6" />),
          )}
        </svg>
      );
    case 3: // a single flowing pulse line, with two fainter echoes
      return (
        <svg {...props}>
          <path d="M-10 30 Q 10 30 20 42 T 45 45 Q 55 45 62 20 T 90 30 T 115 30" />
          <path d="M-10 55 Q 15 55 28 65 T 55 68 Q 65 68 72 48 T 100 55 T 125 55" opacity="0.5" />
          <path d="M-10 78 Q 12 78 24 86 T 50 88 Q 60 88 66 72 T 95 78 T 120 78" opacity="0.3" />
        </svg>
      );
    default: // thin stacked chevrons
      return (
        <svg {...props}>
          {[10, 30, 50, 70, 90, 110].map((y) => (
            <polyline key={y} points={`-10,${y} 30,${y - 15} 70,${y} 110,${y - 15}`} />
          ))}
        </svg>
      );
  }
}

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function CategoryGlyph({ category, className }: { category: FeedCategory; className?: string }) {
  switch (category) {
    case "Research & Evidence":
      return (
        <svg {...iconProps} className={className} aria-hidden>
          <path d="M4 20V10M12 20V4M20 20v-7" />
        </svg>
      );
    case "Policy & Regulation":
      return (
        <svg {...iconProps} className={className} aria-hidden>
          <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
    case "Diagnostics & Imaging":
      return (
        <svg {...iconProps} className={className} aria-hidden>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
        </svg>
      );
    case "Clinical Documentation":
      return (
        <svg {...iconProps} className={className} aria-hidden>
          <path d="M7 3h8l4 4v14H7V3Z" />
          <path d="M15 3v4h4M9 12h6M9 16h6" />
        </svg>
      );
    case "Patient Experience":
      return (
        <svg {...iconProps} className={className} aria-hidden>
          <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 4V6Z" />
        </svg>
      );
    case "Clinical Practice":
      return (
        <svg {...iconProps} className={className} aria-hidden>
          <path d="M3 12h4l2-5 4 10 2-5h6" />
        </svg>
      );
    case "Health IT & Operations":
      return (
        <svg {...iconProps} className={className} aria-hidden>
          <rect x="4" y="4" width="16" height="6" rx="1.5" />
          <rect x="4" y="14" width="16" height="6" rx="1.5" />
          <path d="M8 7h.01M8 17h.01" />
        </svg>
      );
    default:
      return (
        <svg {...iconProps} className={className} aria-hidden>
          <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
        </svg>
      );
  }
}
