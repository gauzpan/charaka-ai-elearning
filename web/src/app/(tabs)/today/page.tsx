"use client";

import Link from "next/link";
import type { SVGProps } from "react";
import { Card } from "@/components/ui/Card";
import { buttonClasses } from "@/components/ui/Button";
import { StepBar } from "@/components/ui/StepBar";
import { Tag } from "@/components/ui/Tag";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useProgress } from "@/lib/useProgress";
import { getLesson, allTryItCards } from "@/content/modules";

// Today: the default landing — exactly one next action (design.md §4.1),
// composed as a scene: dominant focal card → supporting modules → progress
// context (design.md §6.3), not a stack of identical cards.
export default function TodayPage() {
  const { ready, nextLesson, cardIndexOf, skillPoints, level } = useProgress();
  const next = nextLesson();
  const practiceTask = allTryItCards()[0];

  // All lessons done — quiet, honest empty-ish state.
  if (ready && !next) {
    return (
      <div className="flex flex-col gap-6 animate-card-in">
        <ScreenHeader
          eyebrow="Today"
          title="You're all caught up"
          subtitle="You've finished every round in this track."
        />
        <Card variant="elevated" className="flex flex-col gap-4">
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
  const ringValue = level.next ? ((skillPoints - level.min) / (level.next - level.min)) * 100 : 100;

  return (
    <div className="flex flex-col gap-6 animate-card-in">
      <ScreenHeader
        eyebrow="Today"
        title={started ? "Pick up where you left off" : "Your next round"}
        subtitle="Two minutes now. Learn something you can use in your next note."
      />

      {/* Dominant focal card — the day's one recommended round. */}
      <Card variant="hero" className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-pill bg-action/10 text-action">
              <RoundIcon />
            </span>
            <Tag tone="info">{kind}</Tag>
          </div>
          {lesson && (
            <span className="text-meta">
              {idx + 1} of {lesson.cards.length} · ~{lesson.minutes} min
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <h2 className="text-h2 text-primary">{lesson?.title ?? "Loading…"}</h2>
          <p className="text-[16px] leading-[25px] text-secondary">
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

      {/* Supporting modules — asymmetric pair, not a repeat of the hero. The
          ring is the screen's one visual-progress signal; the header chip
          (SkillBadge) already states the number, so this card doesn't repeat
          it as a plain stat — it shows the shape of "how close." */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/progress" className="block">
          <Card variant="subtle" hover className="flex h-full items-center gap-3">
            <ProgressRing value={ready ? ringValue : 0} size={44} strokeWidth={4} label="Level progress">
              <span aria-hidden className="text-secondary">
                <SkillIcon />
              </span>
            </ProgressRing>
            <div className="flex flex-col gap-0.5">
              <span className="font-medium text-primary">{level.name}</span>
              <span className="text-[14px] leading-[20px] text-secondary">
                {level.next !== null && ready ? `${level.next - skillPoints} to next level` : "Top level"}
              </span>
            </div>
          </Card>
        </Link>

        {practiceTask ? (
          <Link href={`/practice/${practiceTask.taskId}`} className="block">
            <Card variant="subtle" hover className="flex h-full flex-col gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-pill bg-surface text-secondary">
                <FlaskIcon />
              </span>
              <span className="font-medium text-primary">Quick practice</span>
              <span className="text-[14px] leading-[20px] text-secondary">{practiceTask.title}</span>
            </Card>
          </Link>
        ) : (
          <Link href="/practice" className="block">
            <Card variant="subtle" hover className="flex h-full flex-col gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-pill bg-surface text-secondary">
                <FlaskIcon />
              </span>
              <span className="font-medium text-primary">Quick practice</span>
              <span className="text-[14px] leading-[20px] text-secondary">Open the sandbox</span>
            </Card>
          </Link>
        )}
      </div>

      <p className="text-center text-meta">
        You can use what you learn today in your next note.
      </p>
    </div>
  );
}

type Icon = (p: SVGProps<SVGSVGElement>) => React.ReactElement;

const iconProps: SVGProps<SVGSVGElement> = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const RoundIcon: Icon = (p) => (
  <svg {...iconProps} {...p} aria-hidden>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
  </svg>
);

const SkillIcon: Icon = (p) => (
  <svg {...iconProps} {...p} aria-hidden>
    <path d="M12 2l2.6 5.9 6.4.6-4.8 4.3 1.4 6.3L12 15.9 6.4 19.1l1.4-6.3-4.8-4.3 6.4-.6L12 2Z" />
  </svg>
);

const FlaskIcon: Icon = (p) => (
  <svg {...iconProps} {...p} aria-hidden>
    <path d="M9 2v6.5L4.5 18a2 2 0 0 0 1.8 3h11.4a2 2 0 0 0 1.8-3L15 8.5V2" />
    <path d="M8 2h8M7 15h10" />
  </svg>
);
