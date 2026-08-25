"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Lesson, Module } from "@/content/types";
import { CardView } from "./CardView";
import { LessonComplete } from "./LessonComplete";
import { StepBar } from "@/components/ui/StepBar";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { buttonClasses } from "@/components/ui/Button";
import { useProgress, POINTS_PER_LESSON } from "@/lib/useProgress";
import { cn } from "@/lib/cn";

// Linear session runner (design.md §4.2, §5.1). Owns the full screen: no tab
// bar, one primary action, top progress + minutes-left, auto-save per card,
// back-safe (progress is persisted, so leaving loses nothing).
export function LessonPlayer({ module, lesson }: { module: Module; lesson: Lesson }) {
  const router = useRouter();
  const { ready, cardIndexOf, setCardIndex, completeLesson, isCompleted } = useProgress();
  const [current, setCurrent] = useState(0);
  // Points earned this session (null until the lesson is finished); drives the
  // completion screen. 0 on a replay of an already-completed lesson.
  const [awarded, setAwarded] = useState<number | null>(null);
  const total = lesson.cards.length;

  // Resume at the saved card once storage has hydrated. Adjusting state during
  // render (guarded, runs once) is React's pattern for reacting to a changed
  // input without an effect — the first render still matches the SSR card 0.
  const [resumed, setResumed] = useState(false);
  if (ready && !resumed) {
    setResumed(true);
    const saved = Math.min(cardIndexOf(lesson.id), total - 1);
    if (saved > 0) setCurrent(saved);
  }

  const isLast = current === total - 1;
  const minsLeft = Math.max(1, Math.round((lesson.minutes * (total - current)) / total));

  if (awarded !== null) {
    return <LessonComplete module={module} lesson={lesson} pointsAwarded={awarded} />;
  }

  function goNext() {
    if (isLast) {
      const firstCompletion = !isCompleted(lesson.id);
      completeLesson(lesson.id);
      // Show the completion + share screen instead of routing straight out.
      setAwarded(firstCompletion ? POINTS_PER_LESSON : 0);
      return;
    }
    const next = current + 1;
    setCurrent(next);
    setCardIndex(lesson.id, next);
  }

  function goBack() {
    if (current === 0) {
      router.push("/journey");
      return;
    }
    setCurrent(current - 1);
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-[640px] flex-col bg-canvas">
      {/* Session bar: close owns the screen exit; progress is always legible. */}
      <header
        className="flex flex-col gap-3 border-b bg-surface px-5 py-3"
        style={{ boxShadow: "var(--shadow-hover)" }}
      >
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => router.push("/journey")}
            aria-label="Close session"
            className="grid h-11 w-11 -ml-2.5 place-items-center rounded-sm text-secondary hover:bg-subtle"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
          <span className="truncate font-mono text-[12px] font-medium text-secondary">
            {lesson.title}
          </span>
          <span className="w-9" />
        </div>
        <StepBar total={total} current={current + 1} />
        <p className="text-meta">
          {current + 1} of {total} · ~{minsLeft} min left
        </p>
      </header>

      <main className="flex-1 overflow-y-auto px-5 pb-6 pt-6">
        <div key={current} className="animate-card-in">
          <div className="mb-5">
            <Eyebrow>{module.title}</Eyebrow>
          </div>
          <CardView card={lesson.cards[current]} />
        </div>
      </main>

      {/* Thumb-zone actions (design.md §5.4). One primary; back is secondary. */}
      <footer
        className="flex items-center gap-3 border-t bg-surface px-5 py-4"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1rem)" }}
      >
        <button onClick={goBack} className={buttonClasses("ghost", "px-4")} aria-label="Previous card">
          Back
        </button>
        <button onClick={goNext} className={cn(buttonClasses("primary"), "flex-1")}>
          {isLast ? "Finish round" : "Continue"}
        </button>
      </footer>
    </div>
  );
}
