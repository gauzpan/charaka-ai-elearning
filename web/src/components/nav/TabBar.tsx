"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import type { SVGProps } from "react";

type Icon = (p: SVGProps<SVGSVGElement>) => React.ReactElement;

const iconProps: SVGProps<SVGSVGElement> = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const TodayIcon: Icon = (p) => (
  <svg {...iconProps} {...p}>
    <rect x="3" y="4" width="18" height="17" rx="2" />
    <path d="M3 9h18M8 2v4M16 2v4M9 14l2 2 4-4" />
  </svg>
);

const JourneyIcon: Icon = (p) => (
  <svg {...iconProps} {...p}>
    <path d="M6 20V9M6 9a3 3 0 1 0 0-6M18 4v11M18 15a3 3 0 1 0 0 6M6 9c0 4 12 2 12 6" />
  </svg>
);

const PracticeIcon: Icon = (p) => (
  <svg {...iconProps} {...p}>
    <path d="M9 3h6M10 3v5.5L5.5 17a2 2 0 0 0 1.8 3h9.4a2 2 0 0 0 1.8-3L14 8.5V3" />
    <path d="M8 14h8" />
  </svg>
);

const ProgressIcon: Icon = (p) => (
  <svg {...iconProps} {...p}>
    <path d="M4 20V10M10 20V4M16 20v-7M4 20h16" />
  </svg>
);

const ResourcesIcon: Icon = (p) => (
  <svg {...iconProps} {...p}>
    <path d="M4 5a2 2 0 0 1 2-2h4v16H6a2 2 0 0 0-2 2V5Z" />
    <path d="M20 5a2 2 0 0 0-2-2h-4v16h4a2 2 0 0 1 2 2V5Z" />
  </svg>
);

const tabs: { href: string; label: string; icon: Icon }[] = [
  { href: "/today", label: "Today", icon: TodayIcon },
  { href: "/journey", label: "Journey", icon: JourneyIcon },
  { href: "/practice", label: "Practice", icon: PracticeIcon },
  { href: "/resources", label: "Resources", icon: ResourcesIcon },
  { href: "/progress", label: "Progress", icon: ProgressIcon },
];

export function TabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="sticky bottom-0 z-10 px-3 pb-3 pt-1 relative"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)" }}
    >
      {/* Floating elevated pill (design.md §6.4 soft elevation) — a scrim
          behind it fades the content it overlaps so text never collides. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-24"
        style={{
          background: "linear-gradient(to top, var(--bg-canvas) 40%, transparent)",
        }}
      />
      <ul
        className="mx-auto flex max-w-[420px] items-center gap-1 rounded-pill border bg-surface/95 p-1.5 backdrop-blur"
        style={{ boxShadow: "var(--shadow-elevated)" }}
      >
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-pill py-2 text-[12px] font-medium transition-colors duration-150 active:scale-[0.97]",
                  active ? "bg-action/10 text-action" : "text-secondary hover:text-primary",
                )}
              >
                <Icon />
                <span className="font-mono text-[11px] uppercase tracking-[0.04em] leading-none">
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
