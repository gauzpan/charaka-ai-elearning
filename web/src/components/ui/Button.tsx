import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "ghost";

/**
 * Shared button styling so both <button> and <Link> can wear it
 * (avoids nesting an anchor inside a button). design.md §7:
 * emerald primary, 4px radius, scale(0.98) on press.
 */
export function buttonClasses(variant: Variant = "primary", className?: string) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-sm px-5 h-12 text-base font-medium select-none " +
    "transition-[transform,background-color,opacity] duration-150 active:scale-[0.98] " +
    "disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action";

  const variants: Record<Variant, string> = {
    primary: "bg-action text-on-action hover:bg-action-hover",
    ghost: "bg-transparent text-primary border border-strong hover:bg-subtle",
  };

  return cn(base, variants[variant], className);
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  loading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={buttonClasses(variant, className)}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading ? "…" : children}
    </button>
  );
}
