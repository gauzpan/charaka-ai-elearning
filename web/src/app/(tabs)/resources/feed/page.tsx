import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";
import { buttonClasses } from "@/components/ui/Button";
import { ScreenHeader } from "@/components/ui/ScreenHeader";

// AI Feed — placeholder (design.md §5.3 empty state). No fabricated feed items:
// explain what it will be and offer one way forward.
export default function FeedPage() {
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

      <ScreenHeader eyebrow="AI Feed" title="Not live yet" />

      <EmptyState
        title="A feed worth your time"
        body="Soon: a curated stream of AI-in-healthcare updates — new tools, guideline shifts, and safety notes relevant to your role. No noise, nothing to scroll for its own sake."
        action={
          <Link href="/resources/toolkit" className={buttonClasses("ghost")}>
            Browse the AI Toolkit
          </Link>
        }
      />
    </div>
  );
}
