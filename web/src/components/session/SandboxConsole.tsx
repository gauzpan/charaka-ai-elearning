"use client";

import { useEffect, useMemo, useState } from "react";
import type { TryItCard } from "@/content/types";
import { Tag } from "@/components/ui/Tag";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button, buttonClasses } from "@/components/ui/Button";
import { Markdown } from "@/components/ui/Markdown";
import { evaluatePrompt } from "@/lib/rubric";
import { trackSandboxRubricEvaluated } from "@/lib/analyticsClient";
import { cn } from "@/lib/cn";

// The Try-it sandbox (build-plan Phase 6): edit a prompt, get real model output
// from the server-side /api/practice route, and instant deterministic rubric
// coaching. Synthetic data only, signposted. Save keeps the prompt (metric b).
type Status = "idle" | "running" | "done" | "error";

export function SandboxConsole({ card }: { card: TryItCard }) {
  const [prompt, setPrompt] = useState(card.starterPrompt);
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [saved, setSaved] = useState(false);

  const rubric = useMemo(() => evaluatePrompt(prompt), [prompt]);

  // Fires once per distinct score value, not on every keystroke — the
  // dependency is rubric.score specifically (not `rubric` or `prompt`), so
  // an edit that doesn't change the score doesn't re-fire.
  useEffect(() => {
    trackSandboxRubricEvaluated(card.taskId, rubric.score);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rubric.score]);

  async function run() {
    setStatus("running");
    setResult("");
    setNotice(null);
    setErrorMsg("");
    try {
      const res = await fetch("/api/practice", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ taskId: card.taskId, prompt }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.message ?? "Something went wrong. Try again.");
        setStatus("error");
        return;
      }
      setResult(data.output ?? "");
      setNotice(data.notice ?? null);
      setStatus("done");
    } catch {
      setErrorMsg("Network error — check your connection and retry.");
      setStatus("error");
    }
  }

  async function save() {
    setSaved(true); // optimistic; best-effort persistence
    try {
      await fetch("/api/save-prompt", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          taskId: card.taskId,
          promptText: prompt,
          rubricScore: rubric.score,
        }),
      });
    } catch {
      // keep the optimistic state; it's a lightweight signal
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Tag tone="info">Synthetic data</Tag>
        <span className="text-meta">No real patient data.</span>
      </div>

      <div className="rounded-md border bg-subtle p-4">
        <Eyebrow className="mb-1.5">Scenario</Eyebrow>
        <p className="text-[15px] leading-[23px] text-primary">{card.scenario}</p>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="sandbox-prompt" className="text-label">
          Your prompt
        </label>
        <textarea
          id="sandbox-prompt"
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value);
            setSaved(false);
          }}
          rows={6}
          className="w-full resize-y rounded-md border bg-surface p-3 font-mono text-[16px] leading-[25px] text-primary outline-none focus-visible:border-strong focus-visible:ring-2 focus-visible:ring-action"
        />
      </div>

      {/* Live, deterministic rubric — coaching on how they ask. */}
      <div
        className="flex flex-col gap-2 rounded-md border-0 bg-surface p-4"
        style={{ boxShadow: "var(--shadow-hover)" }}
      >
        <div className="flex items-center justify-between">
          <Eyebrow>Prompt check</Eyebrow>
          <span className="text-meta">{rubric.score}/4</span>
        </div>
        <ul className="flex flex-col gap-2.5">
          {rubric.dimensions.map((d) => (
            <li key={d.key} className="flex items-start gap-2.5">
              <span
                aria-hidden
                className={cn(
                  "mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-pill text-[10px]",
                  d.pass ? "bg-success-bg text-success" : "border border-strong text-muted",
                )}
              >
                {d.pass ? "✓" : ""}
              </span>
              <span className="flex flex-col">
                <span
                  className={cn(
                    "text-[15px] font-medium leading-[21px]",
                    d.pass ? "text-primary" : "text-secondary",
                  )}
                >
                  {d.label}
                </span>
                <span className="text-[13px] leading-[18px] text-secondary">{d.tip}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={run} loading={status === "running"} className="flex-1">
          {status === "done" || status === "error" ? "Run again" : "Run"}
        </Button>
        <button onClick={save} disabled={saved} className={buttonClasses("ghost", "px-4")}>
          {saved ? "Saved" : "Save prompt"}
        </button>
      </div>

      {status === "running" && (
        <div className="rounded-md border bg-subtle p-4">
          <div className="h-3 w-1/3 animate-pulse rounded bg-default" />
          <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-default" />
        </div>
      )}

      {status === "error" && (
        <div className="rounded-md border border-error-bg bg-error-bg/40 p-4">
          <p className="text-[15px] leading-[22px] text-error">{errorMsg}</p>
        </div>
      )}

      {status === "done" && result && (
        <div
          className="rounded-md border-0 bg-surface p-4"
          style={{ boxShadow: "var(--shadow-elevated)" }}
        >
          <Eyebrow className="mb-2">Model output</Eyebrow>
          <Markdown>{result}</Markdown>
        </div>
      )}

      {/* Inference notice (e.g. truncation at the length limit) — after the output. */}
      {status === "done" && notice && (
        <div className="flex items-start gap-2.5 rounded-md border border-info-bg bg-info-bg/40 p-3">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mt-0.5 shrink-0 text-info"
            aria-hidden
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          <p className="text-[15px] leading-[22px] text-info">{notice}</p>
        </div>
      )}
    </div>
  );
}
