import type { ReactNode } from "react";

/**
 * Empty state (design.md §5.3): explain + exactly one action.
 * "Never a dead end."
 */
export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center text-center gap-3 py-16 px-6">
      <h2 className="text-h2 text-primary">{title}</h2>
      <p className="max-w-xs text-[16px] leading-[25px] text-secondary">{body}</p>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}
