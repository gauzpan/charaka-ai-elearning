"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { allTryItCards } from "@/content/modules";
import { cn } from "@/lib/cn";

// Practice: a place to actually try prompts (design.md §3.1). Two tabs — the
// sandbox entry ("Try a prompt") and the prompts you kept ("Saved", metric b).
interface SavedPrompt {
  id: string;
  taskId: string;
  promptText: string;
  rubricScore: number | null;
  createdAt: string;
}

type PracticeTab = "try" | "saved";

const label = (taskId: string) =>
  taskId.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());

export default function PracticePage() {
  const [tab, setTab] = useState<PracticeTab>("try");
  const [prompts, setPrompts] = useState<SavedPrompt[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const tasks = allTryItCards();

  useEffect(() => {
    let alive = true;
    fetch("/api/save-prompt")
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      })
      .then((d) => {
        if (alive) setPrompts(d.prompts ?? []);
      })
      .catch(() => {
        // Distinguish a genuine failure from "no saved prompts yet" so the
        // empty state stays honest (design.md §5.3 — error ≠ empty).
        if (alive) {
          setLoadError(true);
          setPrompts([]);
        }
      });
    return () => {
      alive = false;
    };
  }, [reloadKey]);

  const savedCount = prompts?.length ?? 0;

  return (
    <div className="flex flex-col gap-6 animate-card-in">
      <ScreenHeader
        eyebrow="Practice"
        title="Sandbox"
        subtitle="Run a prompt against a synthetic case, get instant coaching, keep what works."
      />

      {/* Tab switch */}
      <div className="flex gap-1 rounded-pill border bg-subtle p-1">
        <TabButton active={tab === "try"} onClick={() => setTab("try")}>
          Try a prompt
        </TabButton>
        <TabButton active={tab === "saved"} onClick={() => setTab("saved")}>
          Saved{savedCount > 0 ? ` · ${savedCount}` : ""}
        </TabButton>
      </div>

      {tab === "try" ? (
        <div className="flex flex-col gap-3">
          {tasks.map((t) => (
            <Link key={t.taskId} href={`/practice/${t.taskId}`} className="block">
              <Card variant="elevated" hover className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-pill bg-action/10 text-action">
                    <FlaskIcon />
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <h3 className="font-medium text-primary">{t.title}</h3>
                    <p className="text-[14px] leading-[20px] text-secondary">{label(t.taskId)}</p>
                  </div>
                </div>
                <Tag tone="info">Try it</Tag>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {prompts === null ? (
            <div className="h-20 animate-pulse rounded-lg border bg-subtle" />
          ) : loadError ? (
            <Card className="flex flex-col gap-3 bg-subtle">
              <p className="text-sm text-secondary">
                Couldn&rsquo;t load your saved prompts. Check your connection and try again.
              </p>
              <button
                type="button"
                onClick={() => {
                  setLoadError(false);
                  setPrompts(null);
                  setReloadKey((k) => k + 1);
                }}
                className="self-start font-mono text-[12px] text-action hover:text-action-hover"
              >
                Retry
              </button>
            </Card>
          ) : prompts.length === 0 ? (
            <Card className="bg-subtle">
              <p className="text-sm text-secondary">
                None yet — run a sandbox and save the prompt that worked. It lands here for reuse at
                work.
              </p>
            </Card>
          ) : (
            prompts.map((p) => <SavedPromptItem key={p.id} p={p} />)
          )}
        </div>
      )}
    </div>
  );
}

function TabButton({
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
        "flex-1 min-h-11 rounded-pill px-3 py-2 text-sm transition-[background-color,box-shadow,color] duration-150",
        active
          ? "bg-surface text-primary shadow-[var(--shadow-hover)]"
          : "text-secondary hover:text-primary",
      )}
    >
      {children}
    </button>
  );
}

function SavedPromptItem({ p }: { p: SavedPrompt }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  // Only offer expand when there's plausibly more than two lines to show.
  const expandable = p.promptText.length > 120 || p.promptText.includes("\n");

  async function copy() {
    try {
      await navigator.clipboard.writeText(p.promptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable (insecure context / denied) — no-op
    }
  }

  return (
    <Card className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <Tag tone="neutral">{label(p.taskId)}</Tag>
        <div className="flex items-center gap-3">
          {p.rubricScore !== null && (
            <span className="text-meta">{p.rubricScore}/4</span>
          )}
          <button
            type="button"
            onClick={copy}
            className={cn(
              "inline-flex items-center gap-1.5 font-mono text-[12px] transition-colors",
              copied ? "text-success" : "text-secondary hover:text-primary",
            )}
          >
            <CopyIcon />
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      <p
        className={cn(
          "font-mono text-[15px] leading-[24px] text-primary",
          expanded ? "whitespace-pre-wrap" : "line-clamp-2",
        )}
      >
        {p.promptText}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-meta">
          {new Date(p.createdAt).toLocaleDateString()}
        </span>
        {expandable && (
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="font-mono text-[12px] text-action hover:text-action-hover"
          >
            {expanded ? "Show less" : "Show more"}
          </button>
        )}
      </div>
    </Card>
  );
}

function FlaskIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9 2v6.5L4.5 18a2 2 0 0 0 1.8 3h11.4a2 2 0 0 0 1.8-3L15 8.5V2" />
      <path d="M8 2h8M7 15h10" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}
