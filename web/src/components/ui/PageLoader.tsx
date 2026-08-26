import { AppBackground } from "@/components/bg/AppBackground";
import { todaysPhilosophyQuote } from "@/content/philosophyQuotes";

// Full-screen transition state — shown only while a real request/navigation
// is pending (post-code sign-in, or a route segment's server data still
// loading via Next's loading.tsx convention), never as a generic spinner
// sitting inside already-rendered content (design.md §5.3: skeletons for
// in-page content, this is the one exception — there's no page yet to
// skeleton). Reuses the Today page's daily philosophy quote so the pause
// still feels like this product, not a blank interstitial.
export function PageLoader() {
  const quote = todaysPhilosophyQuote();
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-canvas px-6" role="status" aria-live="polite">
      <AppBackground />
      <span className="sr-only">Loading</span>
      <div className="flex gap-1.5" aria-hidden>
        <span className="h-2 w-2 animate-pulse rounded-full bg-action [animation-delay:-0.3s]" />
        <span className="h-2 w-2 animate-pulse rounded-full bg-action [animation-delay:-0.15s]" />
        <span className="h-2 w-2 animate-pulse rounded-full bg-action" />
      </div>
      <p className="max-w-[300px] text-center text-meta" aria-hidden>
        &ldquo;{quote.text}&rdquo; &mdash; {quote.author}
      </p>
    </div>
  );
}
