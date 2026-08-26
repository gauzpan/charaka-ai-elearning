"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { EmptyState } from "@/components/ui/EmptyState";
import { buttonClasses } from "@/components/ui/Button";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { useProgress, LEVELS } from "@/lib/useProgress";
import { allLessons } from "@/content/modules";
import { mixpanel } from "@/lib/mixpanelClient";

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
      <ScreenHeader eyebrow="Progress" title="Where you stand" />

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
          {/* Dominant focal card — experience level, the one metric that matters. */}
          <Card variant="hero" className="flex items-center gap-4">
            <ProgressRing
              value={level.next !== null ? ((skillPoints - level.min) / (level.next - level.min)) * 100 : 100}
              size={64}
              strokeWidth={5}
              label="Level progress"
            >
              <span className="font-sans text-[11px] font-semibold text-secondary">
                {skillPoints}
              </span>
            </ProgressRing>
            <div className="flex flex-col gap-1">
              <Tag tone="success">Experience level</Tag>
              <p className="text-h2 text-primary">{level.name}</p>
              <p className="text-[14px] leading-[20px] text-secondary">
                {toNext !== null
                  ? `${toNext} skill points to ${nextLevelName(level.next!)}`
                  : "Top level reached"}
              </p>
            </div>
          </Card>

          {/* Supporting modules — asymmetric pair, not a repeat of the hero. */}
          <div className="grid grid-cols-2 gap-4">
            <Card variant="subtle" className="flex flex-col gap-1">
              <Eyebrow>Skill points</Eyebrow>
              <span className="font-display text-3xl font-semibold text-primary">{ready ? skillPoints : 0}</span>
              <span className="text-[14px] leading-[20px] text-secondary">earned by doing</span>
            </Card>
            <Card variant="subtle" className="flex flex-col gap-1">
              <Eyebrow>Rounds</Eyebrow>
              <span className="font-display text-3xl font-semibold text-primary">{done}</span>
              <span className="text-[14px] leading-[20px] text-secondary">of {total} done</span>
            </Card>
          </div>
        </>
      )}

      {/* mixpanel.reset() is synchronous/local (clears localStorage identity)
          — safe to fire on submit without blocking the native form POST that
          actually clears the session cookie server-side. */}
      <form
        action="/api/auth/signout"
        method="post"
        className="mt-2"
        onSubmit={() => mixpanel.reset()}
      >
        <button type="submit" className={buttonClasses("ghost", "w-full")}>
          Sign out
        </button>
      </form>
    </div>
  );
}
