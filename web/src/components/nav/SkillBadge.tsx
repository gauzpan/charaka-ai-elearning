"use client";

import { Tag } from "@/components/ui/Tag";
import { useProgress } from "@/lib/useProgress";

// Skill-points chip in the app header: experience level + accumulated points
// (design.md §3.4 / §5.6 — competence framing, always-legible progress §4.4).
// "Learner · 0" until the first round is finished.
export function SkillBadge() {
  const { ready, level, skillPoints } = useProgress();
  const points = ready ? skillPoints : 0;
  return (
    <Tag tone={points > 0 ? "success" : "neutral"}>
      {level.name} · {points}
    </Tag>
  );
}
