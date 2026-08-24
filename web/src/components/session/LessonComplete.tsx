"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Lesson, Module } from "@/content/types";
import { Tag } from "@/components/ui/Tag";
import { buttonClasses } from "@/components/ui/Button";
import { useProgress } from "@/lib/useProgress";
import { shareUrl, shareText, linkedInHref, xHref } from "@/lib/share";
import { cn } from "@/lib/cn";

// The reward beat after a lesson (design.md §5.1 "end on a reward"). Shows the
// lesson summary image (if any), the points/level earned, and share actions —
// a referral loop: a colleague-facing link back to the app.
export function LessonComplete({
  module,
  lesson,
  pointsAwarded,
}: {
  module: Module;
  lesson: Lesson;
  pointsAwarded: number;
}) {
  const router = useRouter();
  const { level } = useProgress();
  const text = shareText(lesson.title);
  const [applied, setApplied] = useState(false);

  async function markApplyIntent() {
    setApplied(true); // optimistic — this is the success metric (a)
    try {
      await fetch("/api/apply-intent", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ lessonId: lesson.id }),
      });
    } catch {
      // keep the optimistic state; the tap is a lightweight signal
    }
  }

  const canNativeShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  function openShare(href: string) {
    window.open(href, "_blank", "noopener,noreferrer");
  }

  async function nativeShare() {
    const url = shareUrl("app");
    try {
      // Prefer sharing the summary image itself where the platform allows it.
      if (
        lesson.image &&
        typeof navigator.canShare === "function"
      ) {
        try {
          const res = await fetch(lesson.image);
          const blob = await res.blob();
          const file = new File([blob], "charaka-lesson.png", { type: blob.type });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({ files: [file], text, url });
            return;
          }
        } catch {
          // fall through to text/url share
        }
      }
      await navigator.share({ title: "Charaka AI", text, url });
    } catch {
      // user dismissed the share sheet — nothing to do
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-[640px] flex-col bg-canvas">
      <header className="flex items-center justify-between gap-3 border-b bg-surface px-5 py-3">
        <span className="font-mono text-[12px] uppercase tracking-wide text-muted">
          {module.title}
        </span>
        <button
          onClick={() => router.push("/journey")}
          aria-label="Close session"
          className="grid h-9 w-9 place-items-center rounded-sm text-secondary hover:bg-subtle"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-5 pb-6 pt-6">
        <div className="flex flex-col gap-5 animate-card-in">
          <div className="flex flex-col gap-2">
            <div>
              <Tag tone="success">Lesson complete</Tag>
            </div>
            <h1 className="font-display text-2xl leading-tight text-primary">{lesson.title}</h1>
            <p className="text-secondary">
              {pointsAwarded > 0
                ? `+${pointsAwarded} skill points — you're now at ${level.name} level.`
                : `Reviewed. You're at ${level.name} level.`}
            </p>
          </div>

          <div className="flex flex-col gap-3 rounded-lg border bg-surface p-5">
            <div className="flex flex-col gap-0.5">
              <h2 className="text-lg text-primary">Will you use this at work?</h2>
              <p className="text-sm text-secondary">
                The point isn&rsquo;t completion — it&rsquo;s real use in your next shift.
              </p>
            </div>
            {applied ? (
              <div>
                <Tag tone="success">Noted — you&rsquo;ll use this at work</Tag>
              </div>
            ) : (
              <button
                onClick={markApplyIntent}
                className={buttonClasses("ghost", "w-full")}
              >
                I&rsquo;ll use this at work
              </button>
            )}
          </div>

          {lesson.image && (
            // Content image of unknown dimensions — <img> keeps its natural aspect.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={lesson.image}
              alt={`${lesson.title} — summary`}
              className="w-full rounded-lg border"
            />
          )}

          <div className="flex flex-col gap-3 rounded-lg border bg-surface p-5">
            <div className="flex flex-col gap-0.5">
              <h2 className="text-lg text-primary">Share what you learned</h2>
              <p className="text-sm text-secondary">
                Post your progress and inspire others.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => openShare(linkedInHref(shareUrl("linkedin")))}
                className={buttonClasses("ghost", "w-full justify-start gap-3")}
              >
                <LinkedInIcon />
                Share on LinkedIn
              </button>
              <button
                onClick={() => openShare(xHref(text, shareUrl("x")))}
                className={buttonClasses("ghost", "w-full justify-start gap-3")}
              >
                <XIcon />
                Share on X
              </button>
              {canNativeShare && (
                <button
                  onClick={nativeShare}
                  className={buttonClasses("ghost", "w-full justify-start gap-3")}
                >
                  <ShareIcon />
                  More…
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer
        className="border-t bg-surface px-5 py-4"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1rem)" }}
      >
        <button
          onClick={() => router.push("/journey")}
          className={cn(buttonClasses("primary"), "w-full")}
        >
          Back to Journey
        </button>
      </footer>
    </div>
  );
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4.98 3.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM3 9h4v12H3zM9 9h3.8v1.65h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21H20.6v-5.4c0-1.3-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.85V21H12.9V9z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.68l7.73-8.84L1.25 2.25H8.08l4.71 6.23 5.45-6.23zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7M16 6l-4-4-4 4M12 2v13" />
    </svg>
  );
}
