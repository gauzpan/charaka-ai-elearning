import { cn } from "@/lib/cn";
import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  children: ReactNode;
}

/**
 * Base container (design.md §7): 1px border, 12px radius, flat at rest.
 * Optional hover-lift (max shadow 0 2px 8px rgba(0,0,0,0.04)).
 */
export function Card({ hover = false, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-surface p-5",
        hover &&
          "transition-shadow duration-150 hover:shadow-[var(--shadow-hover)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
