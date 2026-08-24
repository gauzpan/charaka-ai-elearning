import { cn } from "@/lib/cn";

/**
 * Brand lockup: the botanical emblem (app-logo.svg — the leaf mark alone, with
 * its baked background removed so it sits transparently on any surface) + a
 * modern wordmark.
 */
export function Brandmark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <span
        aria-hidden
        className="block h-8 w-8 shrink-0 bg-center bg-no-repeat"
        style={{
          backgroundImage: "url(/app-logo.png)",
          backgroundSize: "contain",
        }}
      />
      <span className="font-display text-lg font-semibold tracking-tight text-primary">
        Charaka&nbsp;AI
      </span>
    </span>
  );
}
