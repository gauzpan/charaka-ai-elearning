"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { allLessons } from "@/content/modules";

// M2 persists progress client-side (localStorage) — offline-first (design.md §9)
// and no throwaway auth plumbing before real accounts land in M4, which will
// sync this same shape to the Progress table.
//
// Backed by a module-level external store read via useSyncExternalStore: SSR
// and the first client render use the empty server snapshot, then React swaps
// to the hydrated client snapshot without a hydration-mismatch warning.

// Per-user cache key. v1 was a single shared key that leaked progress across
// users on one browser; v2 namespaces by user id so each account keeps and
// resumes its own progress (DB stays the source of truth).
const LEGACY_KEY = "charaka.progress.v1";
const STORAGE_PREFIX = "charaka.progress.v2:";
let activeUserId: string | null = null;
const storageKey = () => `${STORAGE_PREFIX}${activeUserId ?? "anon"}`;

interface LessonState {
  cardIndex: number; // last card reached (0-based)
  completedAt: string | null;
}

interface ProgressState {
  lessons: Record<string, LessonState>;
  skillPoints: number;
}

const SERVER_SNAPSHOT: ProgressState = {
  lessons: {},
  skillPoints: 0,
};

export type LessonStatus = "completed" | "current" | "upcoming" | "locked";

// Skill points are the recurring signal (design.md §3.4 "skill points as
// experience signal"), replacing the streak. Earned by doing; an experience
// level is derived from the accumulated total (§5.6 — competence framing).
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

function countCompleted(lessons: Record<string, LessonState>): number {
  return Object.values(lessons).filter((l) => l.completedAt).length;
}

// --- external store ---------------------------------------------------------

let cache: ProgressState = SERVER_SNAPSHOT;
const listeners = new Set<() => void>();

function loadLocal(): ProgressState {
  try {
    const raw = window.localStorage.getItem(storageKey());
    if (!raw) return { lessons: {}, skillPoints: 0 };
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    const lessons = parsed.lessons ?? {};
    const skillPoints =
      typeof parsed.skillPoints === "number"
        ? parsed.skillPoints
        : countCompleted(lessons) * POINTS_PER_LESSON;
    return { lessons, skillPoints };
  } catch {
    return { lessons: {}, skillPoints: 0 };
  }
}

// The cache is filled by activateUser (once the user id is known), not lazily
// on read — so we never hydrate one user's cache under another's key.
function getSnapshot(): ProgressState {
  return cache;
}

function getServerSnapshot(): ProgressState {
  return SERVER_SNAPSHOT;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function commit(next: ProgressState) {
  cache = next;
  try {
    window.localStorage.setItem(storageKey(), JSON.stringify(next));
  } catch {
    // storage unavailable (private mode, quota) — progress is best-effort.
  }
  listeners.forEach((l) => l());
}

// --- account sync (M4) ------------------------------------------------------
// The DB is the source of truth for a signed-in user; localStorage is a cache
// namespaced per user so accounts don't see each other's progress.

let booted = false;

/** Switch the store to a user: load their cache, drop the legacy shared key,
 *  then merge in the account's DB progress. Safe to call repeatedly. */
function activateUser(userId: string) {
  if (activeUserId === userId) return;
  activeUserId = userId;
  try {
    window.localStorage.removeItem(LEGACY_KEY); // one-time reset of the old shared cache
  } catch {
    // ignore
  }
  cache = loadLocal();
  listeners.forEach((l) => l());
  pullAndMerge();
}

async function pullAndMerge() {
  try {
    const res = await fetch("/api/progress");
    if (!res.ok) return;
    const data = (await res.json()) as {
      lessons?: Record<string, { cardIndex: number; completedAt: string | null }>;
    };
    const server = data.lessons ?? {};
    const prev = cache;
    const lessons: Record<string, LessonState> = { ...prev.lessons };
    for (const [id, s] of Object.entries(server)) {
      const local = lessons[id];
      lessons[id] = {
        cardIndex: Math.max(local?.cardIndex ?? 0, s.cardIndex ?? 0),
        completedAt: local?.completedAt ?? s.completedAt ?? null,
      };
    }
    const skillPoints = Math.max(prev.skillPoints, countCompleted(lessons) * POINTS_PER_LESSON);
    commit({ lessons, skillPoints });
  } catch {
    // offline or unauthenticated — keep the local cache
  }
}

function pushLesson(lessonId: string, cardIndex: number, completed: boolean) {
  fetch("/api/progress", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ lessonId, cardIndex, completed }),
  }).catch(() => {
    // best-effort; the local cache still holds the change
  });
}

// --- hook -------------------------------------------------------------------

export function useProgress() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Resolve the signed-in user once, then load their namespaced cache + DB state.
  useEffect(() => {
    if (booted) return;
    booted = true;
    fetch("/api/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((me) => activateUser(me?.id ?? "anon"))
      .catch(() => activateUser("anon"));
  }, []);

  const setCardIndex = useCallback((lessonId: string, cardIndex: number) => {
    const prev = cache;
    const existing = prev.lessons[lessonId] ?? { cardIndex: 0, completedAt: null };
    const nextIndex = Math.max(existing.cardIndex, cardIndex);
    commit({
      ...prev,
      // Never move the saved index backwards on resume.
      lessons: { ...prev.lessons, [lessonId]: { ...existing, cardIndex: nextIndex } },
    });
    pushLesson(lessonId, nextIndex, Boolean(existing.completedAt));
  }, []);

  const completeLesson = useCallback((lessonId: string) => {
    const prev = cache;
    const existing = prev.lessons[lessonId] ?? { cardIndex: 0, completedAt: null };
    // Award points only on first completion — re-finishing never re-awards.
    const firstCompletion = existing.completedAt === null;
    commit({
      ...prev,
      lessons: {
        ...prev.lessons,
        [lessonId]: { ...existing, completedAt: existing.completedAt ?? new Date().toISOString() },
      },
      skillPoints: prev.skillPoints + (firstCompletion ? POINTS_PER_LESSON : 0),
    });
    pushLesson(lessonId, existing.cardIndex, true);
  }, []);

  const isCompleted = useCallback(
    (lessonId: string) => Boolean(state.lessons[lessonId]?.completedAt),
    [state],
  );

  const cardIndexOf = useCallback(
    (lessonId: string) => state.lessons[lessonId]?.cardIndex ?? 0,
    [state],
  );

  /** Lesson status. No gating — every lesson (and its Try-it practice) is open;
   *  status only reflects progress: completed, the next-up "current", or upcoming. */
  const statusOf = useCallback(
    (lessonId: string): LessonStatus => {
      if (state.lessons[lessonId]?.completedAt) return "completed";
      const firstOpen = allLessons().find((l) => !state.lessons[l.lessonId]?.completedAt);
      return firstOpen?.lessonId === lessonId ? "current" : "upcoming";
    },
    [state],
  );

  /** The lesson a returning user should resume/start next. */
  const nextLesson = useCallback(() => {
    const flat = allLessons();
    return flat.find((l) => !state.lessons[l.lessonId]?.completedAt) ?? null;
  }, [state]);

  return {
    // True once the client store has hydrated (server snapshot is a stable ref).
    ready: state !== SERVER_SNAPSHOT,
    skillPoints: state.skillPoints,
    level: levelFor(state.skillPoints),
    setCardIndex,
    completeLesson,
    isCompleted,
    cardIndexOf,
    statusOf,
    nextLesson,
    reset: () => commit({ lessons: {}, skillPoints: 0 }),
  };
}
