import { cn } from "@/lib/cn";
import type { HTMLAttributes, ReactNode } from "react";

/**
 * Surface model (design.md §6.4): tonal layering instead of one flat card
 * repeated everywhere. Default ("surface") is byte-identical to the old,
 * only style — every existing call site is unaffected.
 *
 * - surface  — primary content plane. 1px border, flat at rest.
 * - subtle   — nested surface one tone down; no border needed, tone carries it.
 * - elevated — soft diffuse shadow + inner highlight, no border. For a card
 *              that should read as physically above the page (the day's hero).
 * - hero     — elevated + a faint atmospheric glow in one corner, existing
 *              accent color at very low opacity. Reserve for the one
 *              dominant focal card on a screen.
 */
type CardVariant = "surface" | "subtle" | "elevated" | "hero";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  hover?: boolean;
  children: ReactNode;
}

const variantClasses: Record<CardVariant, string> = {
  surface: "border bg-surface",
  subtle: "border-0 bg-subtle",
  elevated: "border-0 bg-surface shadow-[var(--shadow-elevated)]",
  hero: "relative overflow-hidden border-0 bg-surface shadow-[var(--shadow-elevated)]",
};

export function Card({
  variant = "surface",
  hover = false,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg p-5",
        variantClasses[variant],
        hover &&
          (variant === "elevated" || variant === "hero"
            ? "transition-shadow duration-150 hover:shadow-[var(--shadow-elevated-hover)]"
            : "transition-shadow duration-150 hover:shadow-[var(--shadow-hover)]"),
        className,
      )}
      {...props}
    >
      {variant === "hero" && (
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full opacity-[0.07]"
          style={{ background: "radial-gradient(closest-side, var(--action), transparent)" }}
        />
      )}
      {children}
    </div>
  );
}
