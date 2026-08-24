"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { buttonClasses } from "@/components/ui/Button";
import { StepBar } from "@/components/ui/StepBar";
import { Tag } from "@/components/ui/Tag";
import { useProgress } from "@/lib/useProgress";
import { getLesson } from "@/content/modules";

// Today: the default landing — exactly one next action (design.md §4.1).
// Reflects real progress: the next unfinished lesson, resumed where you left off.
export default function TodayPage() {
  const { ready, nextLesson, cardIndexOf } = useProgress();
  const next = nextLesson();

  // All lessons done — quiet, honest empty-ish state.
  if (ready && !next) {
    return (
      <div className="flex flex-col gap-6 animate-card-in">
        <Header title="You're all caught up" subtitle="You've finished every round in this track." />
        <Card className="flex flex-col gap-4">
          <p className="text-secondary">
            New workflows are on the way. Revisit any round from your Journey to keep it sharp.
          </p>
          <Link href="/journey" className={buttonClasses("primary", "w-full")}>
            Go to Journey
          </Link>
        </Card>
      </div>
    );
  }

  const found = next ? getLesson(next.moduleId, next.lessonId) : undefined;
  const lesson = found?.lesson;
  const idx = lesson ? cardIndexOf(lesson.id) : 0;
  const started = idx > 0;
  const kind = found?.module.kind === "flagship" ? "Physician track" : "Foundation";

  return (
    <div className="flex flex-col gap-6 animate-card-in">
      <Header
        title={started ? "Pick up where you left off" : "Your next round"}
        subtitle="Two minutes now. Learn something you can use in your next note."
      />

      <Card className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Tag tone="info">{kind}</Tag>
          {lesson && (
            <span className="font-mono text-[12px] text-muted">
              {idx + 1} of {lesson.cards.length} · ~{lesson.minutes} min
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-xl text-primary">{lesson?.title ?? "Loading…"}</h2>
          <p className="text-secondary">
            {lesson ? lesson.cards[0].eyebrow === "Objective"
              ? (lesson.cards[0] as { payoff?: string }).payoff
              : "A short, practical round." : ""}
          </p>
        </div>
        {lesson && <StepBar total={lesson.cards.length} current={idx} />}
        {next && (
          <Link
            href={`/session/${next.moduleId}/${next.lessonId}`}
            className={buttonClasses("primary", "w-full")}
          >
            {started ? "Resume round" : "Start round"}
          </Link>
        )}
      </Card>

      <p className="text-center font-mono text-[12px] text-muted">
        You can use what you learn today in your next note.
      </p>
    </div>
  );
}

function Header({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="font-mono text-[12px] uppercase tracking-wide text-muted">Today</p>
      <h1 className="text-2xl text-primary">{title}</h1>
      <p className="text-secondary">{subtitle}</p>
    </div>
  );
}
