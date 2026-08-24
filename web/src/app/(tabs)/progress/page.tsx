"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { EmptyState } from "@/components/ui/EmptyState";
import { buttonClasses } from "@/components/ui/Button";
import { useProgress, LEVELS } from "@/lib/useProgress";
import { allLessons } from "@/content/modules";

const nextLevelName = (min: number) =>
  LEVELS.find((l) => l.min === min)?.name ?? "the next level";

export default function ProgressPage() {
  const { ready, skillPoints, level, isCompleted } = useProgress();
  const lessons = allLessons();
  const done = lessons.filter((l) => isCompleted(l.lessonId)).length;
  const total = lessons.length;
  const toNext = level.next !== null ? level.next - skillPoints : null;

  return (
    <div className="flex flex-col gap-6 animate-card-in">
      <div className="flex flex-col gap-1">
        <p className="font-mono text-[12px] uppercase tracking-wide text-muted">Progress</p>
        <h1 className="text-2xl text-primary">Where you stand</h1>
      </div>

      {!ready ? (
        // Loading: stable-layout skeletons, never spinners (design.md §5.3).
        <>
          <div className="h-28 animate-pulse rounded-lg border bg-subtle" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-24 animate-pulse rounded-lg border bg-subtle" />
            <div className="h-24 animate-pulse rounded-lg border bg-subtle" />
          </div>
        </>
      ) : done === 0 ? (
        <EmptyState
          title="Your progress starts today"
          body="Your experience level, skill points, and rounds completed show up here once you finish your first round."
          action={
            <Link href="/today" className={buttonClasses("primary")}>
              Start your first round
            </Link>
          }
        />
      ) : (
        <>
          <Card className="flex flex-col gap-2">
            <Tag tone="success">Experience level</Tag>
            <p className="font-display text-2xl text-primary">{level.name}</p>
            <p className="text-sm text-secondary">
              {toNext !== null
                ? `${skillPoints} skill points · ${toNext} to ${nextLevelName(level.next!)}`
                : `${skillPoints} skill points · top level reached`}
            </p>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card className="flex flex-col gap-1">
              <span className="font-mono text-[12px] uppercase tracking-wide text-muted">Skill points</span>
              <span className="font-display text-3xl text-primary">{ready ? skillPoints : 0}</span>
              <span className="text-sm text-secondary">earned by doing</span>
            </Card>
            <Card className="flex flex-col gap-1">
              <span className="font-mono text-[12px] uppercase tracking-wide text-muted">Rounds</span>
              <span className="font-display text-3xl text-primary">{done}</span>
              <span className="text-sm text-secondary">of {total} done</span>
            </Card>
          </div>
        </>
      )}

      <form action="/api/auth/signout" method="post" className="mt-2">
        <button type="submit" className={buttonClasses("ghost", "w-full")}>
          Sign out
        </button>
      </form>
    </div>
  );
}
