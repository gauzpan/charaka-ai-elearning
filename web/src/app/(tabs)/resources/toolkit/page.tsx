"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { cn } from "@/lib/cn";
import { TOOLS, TOOLKIT_CATEGORIES, type Tool } from "@/content/toolkit";

// AI Toolkit (design.md §3.1): a reference list of AI tools. Each tool is a
// ≤3-line card with one external CTA — NO prompts/tutorials/how-to here.
// Users bookmark tools (Saved), persisted per-user via /api/save-tool.

type Filter = "All" | "Saved" | (typeof TOOLKIT_CATEGORIES)[number];
const FILTERS: Filter[] = ["All", ...TOOLKIT_CATEGORIES];

export default function ToolkitPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  // null = still loading the user's saved set.
  const [saved, setSaved] = useState<Set<string> | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/save-tool")
      .then((r) => r.json())
      .then((d) => {
        if (alive) setSaved(new Set<string>(d.toolIds ?? []));
      })
      .catch(() => {
        if (alive) setSaved(new Set<string>());
      });
    return () => {
      alive = false;
    };
  }, []);

  async function toggle(toolId: string) {
    if (!saved) return;
    const isSaved = saved.has(toolId);
    // Optimistic update.
    setSaved((prev) => {
      const next = new Set(prev);
      if (isSaved) next.delete(toolId);
      else next.add(toolId);
      return next;
    });
    try {
      const res = await fetch("/api/save-tool", {
        method: isSaved ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolId }),
      });
      if (!res.ok) throw new Error("save failed");
    } catch {
      // Roll back on failure.
      setSaved((prev) => {
        const next = new Set(prev);
        if (isSaved) next.add(toolId);
        else next.delete(toolId);
        return next;
      });
    }
  }

  const savedCount = saved?.size ?? 0;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TOOLS.filter((t) => {
      if (filter === "Saved") {
        if (!saved?.has(t.id)) return false;
      } else if (filter !== "All") {
        if (t.category !== filter) return false;
      }
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        t.purpose.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
    });
  }, [query, filter, saved]);

  return (
    <div className="flex min-h-full flex-col gap-6 animate-card-in">
      <Link
        href="/resources"
        className="inline-flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-wide text-secondary hover:text-primary"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Resources
      </Link>

      <div className="flex flex-col gap-1">
        <p className="font-mono text-[12px] uppercase tracking-wide text-muted">AI Toolkit</p>
        <h1 className="font-display text-2xl leading-tight text-primary">AI Tools for Healthcare</h1>
        <p className="text-secondary">
          Explore AI tools used across research, documentation, learning, and specialty care.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <svg
          width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" aria-hidden
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tools"
          aria-label="Search tools"
          className="h-12 w-full rounded-md border bg-surface pl-11 pr-4 text-base text-primary placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action"
        />
      </div>

      {/* Filter chips */}
      <div className="-mx-5 overflow-x-auto px-5">
        <div className="flex w-max gap-2">
          {FILTERS.map((f) => (
            <FilterChip key={f} active={filter === f} onClick={() => setFilter(f)}>
              {f}
            </FilterChip>
          ))}
          <FilterChip active={filter === "Saved"} onClick={() => setFilter("Saved")}>
            {`Saved${savedCount > 0 ? ` · ${savedCount}` : ""}`}
          </FilterChip>
        </div>
      </div>

      {/* Tool list */}
      <div className="flex flex-1 flex-col gap-3">
        {visible.length === 0 ? (
          <Card className="bg-subtle">
            <p className="text-sm text-secondary">
              {filter === "Saved"
                ? "No saved tools yet. Tap the bookmark on any tool to keep it here."
                : "No tools match that search."}
            </p>
          </Card>
        ) : (
          visible.map((t) => (
            <ToolItem
              key={t.id}
              tool={t}
              saved={saved?.has(t.id) ?? false}
              canSave={saved !== null}
              onToggle={() => toggle(t.id)}
            />
          ))
        )}
      </div>

      {/* Persistent governance footer */}
      <p className="sticky bottom-0 -mx-5 border-t bg-surface/95 px-5 py-3 text-center text-[12px] leading-relaxed text-muted backdrop-blur">
        Always follow your organisation&rsquo;s privacy, procurement, and clinical-governance policies.
      </p>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "shrink-0 rounded-pill border px-3.5 py-1.5 font-mono text-[12px] uppercase tracking-wide transition-colors",
        active
          ? "border-action bg-action text-on-action"
          : "border-default bg-surface text-secondary hover:text-primary",
      )}
    >
      {children}
    </button>
  );
}

function ToolItem({
  tool,
  saved,
  canSave,
  onToggle,
}: {
  tool: Tool;
  saved: boolean;
  canSave: boolean;
  onToggle: () => void;
}) {
  return (
    <Card className="flex flex-col gap-3">
      {/* Line 1: lettermark + name + bookmark */}
      <div className="flex items-center gap-3">
        <span
          className="grid h-9 w-9 shrink-0 place-items-center rounded-md border bg-subtle font-mono text-[13px] font-semibold uppercase text-secondary"
          aria-hidden
        >
          {tool.mark}
        </span>
        <h3 className="flex-1 text-primary">{tool.name}</h3>
        <button
          type="button"
          onClick={onToggle}
          disabled={!canSave}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${tool.name} from saved tools` : `Save ${tool.name}`}
          className={cn(
            "shrink-0 rounded-sm p-1 transition-colors disabled:opacity-40",
            saved ? "text-action" : "text-muted hover:text-secondary",
          )}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M6 4a2 2 0 0 0-2 2v14l8-5 8 5V6a2 2 0 0 0-2-2H6Z" />
          </svg>
        </button>
      </div>

      {/* Line 2: purpose */}
      <p className="text-sm text-secondary">{tool.purpose}</p>

      {/* Line 3: category • badge */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[12px] uppercase tracking-wide text-muted">
          {tool.category}
        </span>
        <span className="text-muted" aria-hidden>&middot;</span>
        <Tag tone={tool.badgeTone}>{tool.badge}</Tag>
      </div>

      {/* Single external CTA */}
      <a
        href={tool.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 self-start font-mono text-[13px] text-action hover:text-action-hover"
      >
        Visit official website
        <span aria-hidden>↗</span>
      </a>
    </Card>
  );
}
