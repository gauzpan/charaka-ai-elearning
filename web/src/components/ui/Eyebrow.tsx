import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

/**
 * Category label — "Today", "Foundation", "Objective". One definition so
 * every label in the app carries the same weight/tracking/contrast
 * (design.md §6.2 Labels): quiet, but never faint enough to read as disabled.
 */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("text-label", className)}>{children}</p>;
}
