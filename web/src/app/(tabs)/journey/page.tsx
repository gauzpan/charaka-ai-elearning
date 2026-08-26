"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { cn } from "@/lib/cn";
import { modules, lockedModules, getLesson } from "@/content/modules";
import { useProgress, type LessonStatus } from "@/lib/useProgress";
import { trackLockedModuleClicked } from "@/lib/analyticsClient";
import type { Module } from "@/content/types";

function StatusDot({ status }: { status: LessonStatus }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid h-6 w-6 shrink-0 place-items-center rounded-pill border text-[12px]",
        status === "completed" && "border-action bg-action text-on-action shadow-[var(--shadow-hover)]",
        status === "current" && "border-action text-action shadow-[var(--shadow-hover)]",
        status === "upcoming" && "border-strong text-muted",
        status === "locked" && "border-default text-muted",
      )}
    >
      {status === "completed" ? "✓" : status === "current" ? "▸" : "·"}
    </span>
  );
}

function LessonRow({
  moduleId,
  lessonId,
  title,
  minutes,
  status,
}: {
  moduleId: string;
  lessonId: string;
  title: string;
  minutes: number;
  status: LessonStatus;
}) {
  const locked = status === "locked";
  const inner = (
    <div className="flex items-center justify-between gap-3 py-3">
      <div className="flex items-center gap-3">
        <StatusDot status={status} />
        <span className={cn("text-primary", locked && "text-muted")}>{title}</span>
      </div>
      <span className="text-meta">
        {locked ? "Locked" : `${minutes} min`}
      </span>
    </div>
  );

  if (locked) return inner;
  return (
    <Link
      href={`/session/${moduleId}/${lessonId}`}
      className="-mx-2 block rounded-md px-2 transition-colors hover:bg-subtle"
    >
      {inner}
    </Link>
  );
}

function ModuleCard({ module, statusOf }: { module: Module; statusOf: (id: string) => LessonStatus }) {
  return (
    <Card variant="elevated" className="flex flex-col gap-2">
      <div className="flex flex-col gap-0.5">
        <h2 className="font-sans text-[18px] font-semibold leading-[24px] text-primary">{module.title}</h2>
        <p className="text-[14px] leading-[20px] text-secondary">{module.subtitle}</p>
      </div>
      <div className="divide-y">
        {module.lessons.map((l) => (
          <LessonRow
            key={l.id}
            moduleId={module.id}
            lessonId={l.id}
            title={l.title}
            minutes={l.minutes}
            status={statusOf(l.id)}
          />
        ))}
      </div>
    </Card>
  );
}

export default function JourneyPage() {
  return (
    <Suspense fallback={null}>
      <JourneyContent />
    </Suspense>
  );
}

function JourneyContent() {
  const { statusOf } = useProgress();
  const doneId = useSearchParams().get("done");
  const doneLesson = doneId ? getLesson(findModuleOf(doneId) ?? "", doneId)?.lesson : undefined;

  return (
    <div className="flex flex-col gap-6 animate-card-in">
      <ScreenHeader
        eyebrow="Journey"
        title="Physician track"
        subtitle="Foundations first, then your real workflows. Two-minute rounds."
      />

      {doneLesson && (
        <Card className="flex flex-col gap-1 border-success-bg bg-success-bg/40">
          <div className="mb-1">
            <Tag tone="success">Round complete</Tag>
          </div>
          <p className="text-[16px] leading-[24px] text-primary">
            Nice — you finished &ldquo;{doneLesson.title}.&rdquo; Your next round is queued below.
          </p>
        </Card>
      )}

      {modules.map((m) => (
        <ModuleCard key={m.id} module={m} statusOf={statusOf} />
      ))}

      <div className="flex flex-col gap-3">
        <Eyebrow>Coming next</Eyebrow>
        {lockedModules.map((m) => (
          <Card
            key={m.id}
            variant="subtle"
            className="flex items-center justify-between gap-3 cursor-pointer"
            role="button"
            tabIndex={0}
            onClick={() => trackLockedModuleClicked(m.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") trackLockedModuleClicked(m.id);
            }}
          >
            <div className="flex flex-col gap-0.5">
              <h3 className="font-medium text-primary">{m.title}</h3>
              <p className="text-[14px] leading-[20px] text-secondary">{m.why}</p>
            </div>
            <Tag tone="neutral">Locked</Tag>
          </Card>
        ))}
      </div>
    </div>
  );
}

function findModuleOf(lessonId: string): string | undefined {
  return modules.find((m) => m.lessons.some((l) => l.id === lessonId))?.id;
}
