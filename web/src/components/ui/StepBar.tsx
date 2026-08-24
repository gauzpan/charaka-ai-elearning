import { cn } from "@/lib/cn";

/**
 * Segmented progress bar for a session (design.md §4.4 / §7): filled /
 * current / upcoming steps, e.g. ●●●○○. Renders as accessible segments.
 */
export function StepBar({ total, current }: { total: number; current: number }) {
  return (
    <div
      className="flex gap-1.5"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={current}
      aria-label={`Step ${current} of ${total}`}
    >
      {Array.from({ length: total }).map((_, i) => {
        const filled = i < current;
        const isCurrent = i === current - 1;
        return (
          <span
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-pill transition-colors",
              filled ? "bg-action" : "bg-default",
              isCurrent && "bg-action-hover",
            )}
          />
        );
      })}
    </div>
  );
}
