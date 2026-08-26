// Shared, framework-agnostic level/points logic — importable from both
// client code (useProgress.ts) and server routes (analytics, /api/progress),
// so "what level is N points" is computed identically everywhere instead of
// drifting between a client copy and a server copy.

export const POINTS_PER_LESSON = 100;

export const LEVELS = [
  { name: "Learner", min: 0 },
  { name: "Enabled", min: 100 },
  { name: "Proficient", min: 250 },
  { name: "Expert", min: 400 },
] as const;

export interface LevelInfo {
  name: string;
  min: number;
  /** Points needed to reach the next tier, or null at the top level. */
  next: number | null;
}

export function levelFor(points: number): LevelInfo {
  let idx = 0;
  for (let i = 0; i < LEVELS.length; i++) {
    if (points >= LEVELS[i].min) idx = i;
  }
  const current = LEVELS[idx];
  const next = idx < LEVELS.length - 1 ? LEVELS[idx + 1].min : null;
  return { name: current.name, min: current.min, next };
}
