"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button, buttonClasses } from "@/components/ui/Button";
import { StepBar } from "@/components/ui/StepBar";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { cn } from "@/lib/cn";
import { trackOnboardingStarted } from "@/lib/analyticsClient";

// 90-second onboarding (design.md §5.1): role is fixed (physician), so we ask
// what they want to get better at and when they learn — then hand them a real
// 2-minute win. First value precedes first friction.
const TASKS = [
  { id: "research", label: "Research & evidence synthesis" },
  { id: "communication", label: "Patient communication" },
  { id: "documentation", label: "Documentation & notes" },
  { id: "admin", label: "Admin & coordination" },
  { id: "other", label: "Other" },
];

const WINDOWS: { id: "commute" | "break" | "evening"; label: string }[] = [
  { id: "commute", label: "On my commute" },
  { id: "break", label: "Between patients" },
  { id: "evening", label: "Evenings" },
];

const FIRST_LESSON = "/session/foundation/prompting-and-safety";

export function OnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0 task, 1 window, 2 done
  const [task, setTask] = useState<string | null>(null);
  const [otherTask, setOtherTask] = useState("");
  const [win, setWin] = useState<"commute" | "break" | "evening" | null>(null);
  const [saving, setSaving] = useState(false);

  // This flow is only ever reached one way today: authed-but-not-onboarded
  // users are redirected here straight after their first sign-in (see
  // src/app/onboarding/page.tsx) — so "post_signup" is the only real
  // entry_point until there's more than one way to land on /onboarding.
  useEffect(() => {
    trackOnboardingStarted("post_signup");
  }, []);

  async function finish(nextWin: "commute" | "break" | "evening") {
    setSaving(true);
    const focusTask =
      task === "other"
        ? otherTask.trim()
        : (TASKS.find((t) => t.id === task)?.label ?? "Research & evidence synthesis");
    try {
      await fetch("/api/onboarding", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ focusTask, studyWindow: nextWin, isCustomFocusTask: task === "other" }),
      });
    } catch {
      // proceed anyway — onboarding is best-effort; they can still use the app
    }
    setSaving(false);
    setStep(2);
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-[480px] flex-col gap-6 bg-canvas px-5 py-8">
      <div className="flex flex-col gap-3">
        <Eyebrow>Set up · about a minute</Eyebrow>
        <StepBar total={3} current={step + 1} />
      </div>

      {step === 0 && (
        <div className="flex flex-col gap-4 animate-card-in">
          <h1 className="text-h1 text-primary">
            What do you want to get better at with AI?
          </h1>
          <div className="flex flex-col gap-2">
            {TASKS.map((t) => (
              <OptionRow
                key={t.id}
                label={t.label}
                selected={task === t.id}
                onClick={() => setTask(t.id)}
              />
            ))}
          </div>
          {task === "other" && (
            <input
              type="text"
              autoFocus
              value={otherTask}
              onChange={(e) => setOtherTask(e.target.value)}
              placeholder="What do you want to get better at?"
              maxLength={80}
              className="h-12 w-full rounded-sm border bg-surface px-4 text-base text-primary outline-none focus-visible:border-strong focus-visible:ring-2 focus-visible:ring-action"
            />
          )}
          <Button
            className="w-full"
            disabled={!task || (task === "other" && !otherTask.trim())}
            onClick={() => setStep(1)}
          >
            Continue
          </Button>
        </div>
      )}

      {step === 1 && (
        <div className="flex flex-col gap-4 animate-card-in">
          <h1 className="text-h1 text-primary">
            When do you learn best?
          </h1>
          <p className="text-[16px] leading-[25px] text-secondary">
            We&rsquo;ll time a gentle nudge for that window.
          </p>
          <div className="flex flex-col gap-2">
            {WINDOWS.map((w) => (
              <OptionRow
                key={w.id}
                label={w.label}
                selected={win === w.id}
                onClick={() => setWin(w.id)}
              />
            ))}
          </div>
          <Button
            className="w-full"
            loading={saving}
            disabled={!win}
            onClick={() => win && finish(win)}
          >
            Continue
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-4 animate-card-in">
          <h1 className="text-h1 text-primary">You&rsquo;re set.</h1>
          <p className="text-[16px] leading-[25px] text-secondary">
            Two minutes now — by the end you&rsquo;ll know where AI actually fits in clinical work.
          </p>
          <Card variant="hero" className="flex flex-col gap-3">
            <p className="text-[16px] font-medium leading-[24px] text-primary">
              Your first round: Prompting &amp; safe sharing
            </p>
            <Link href={FIRST_LESSON} className={buttonClasses("primary", "w-full")}>
              Start your first round
            </Link>
          </Card>
          <button
            onClick={() => router.push("/today")}
            className="font-sans text-[12px] font-medium text-secondary hover:text-primary"
          >
            Skip to Today
          </button>
        </div>
      )}
    </main>
  );
}

function OptionRow({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "flex items-center justify-between rounded-md border bg-surface px-4 py-3 text-left transition-[background-color,border-color,box-shadow] duration-150 active:scale-[0.99]",
        selected
          ? "border-action text-primary shadow-[var(--shadow-hover)]"
          : "hover:bg-subtle",
      )}
    >
      <span className="text-[16px] font-medium leading-[22px] text-primary">{label}</span>
      <span
        aria-hidden
        className={cn(
          "grid h-5 w-5 place-items-center rounded-pill border text-[11px]",
          selected ? "border-action bg-action text-on-action" : "border-strong text-muted",
        )}
      >
        {selected ? "✓" : ""}
      </span>
    </button>
  );
}
