import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

type Tone = "info" | "success" | "warning" | "error" | "neutral";

const tones: Record<Tone, string> = {
  info: "bg-info-bg text-info",
  success: "bg-success-bg text-success",
  warning: "bg-warning-bg text-warning",
  error: "bg-error-bg text-error",
  neutral: "bg-subtle text-secondary",
};

/**
 * Meta label / status chip (design.md §7): pastel-semantic, uppercase,
 * 12px mono, pill radius. Color carries meaning only.
 */
export function Tag({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill px-2.5 py-1 font-mono text-[12px] uppercase tracking-wide leading-none",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}
