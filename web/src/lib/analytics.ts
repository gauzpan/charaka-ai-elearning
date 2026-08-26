import "server-only";
import { track } from "@/lib/mixpanel";
import { deviceTypeFromUA } from "@/lib/analyticsShared";

// Centralized, type-safe server-side event helpers — one function per
// product event in the tracking spec. Every event carries the same standard
// metadata (userId as distinct_id, a timestamp property, userRole,
// deviceType) alongside its own payload, so no call site has to remember to
// attach it by hand.
//
// distinct_id is always the app's own User.id — never a fresh/anonymous id —
// so every event for a signed-in user lands on that one Mixpanel profile.
// track() (lib/mixpanel.ts) is already fire-and-forget: a Mixpanel outage or
// missing token never throws or blocks the caller's real response.

interface StandardParams {
  userId: string;
  /** The User-Agent header — a Route Handler passes `req.headers.get("user-agent")`,
   *  a Server Component passes `(await headers()).get("user-agent")` (next/headers). */
  userAgent?: string | null;
  /** e.g. user.role from Prisma — pass what the caller already has in scope
   *  rather than re-querying the DB just for analytics. */
  userRole?: string | null;
}

function fire(
  { userId, userAgent, userRole }: StandardParams,
  event: string,
  payload: Record<string, string | number | boolean> = {},
): void {
  track(userId, event, {
    ...payload,
    timestamp: new Date().toISOString(),
    userRole: userRole ?? "unknown",
    deviceType: deviceTypeFromUA(userAgent),
  });
}

// --- Auth & Onboarding -------------------------------------------------

export function trackAuthCodeRequested(p: StandardParams & { userEmailDomain: string }) {
  fire(p, "auth_code_requested", { user_email_domain: p.userEmailDomain });
}

export function trackAuthCodeVerified(p: StandardParams & { isFirstLogin: boolean }) {
  fire(p, "auth_code_verified", { is_first_login: p.isFirstLogin });
}

/**
 * Fires on EVERY successful sign-in, regardless of method — unlike
 * account_created (fires once, ever, only for a new account) or
 * auth_code_verified (only covers the email-code path). This is the one
 * event to build retention/revisit-rate reports on, since it's the only
 * consistent "this user came back and signed in" signal across both auth
 * methods. distinct_id is already the user's stable User.id (so Mixpanel's
 * own Retention reports work off it without extra setup) — user_id is also
 * stamped as an explicit property here so it's directly visible/filterable
 * on the event itself, not just implicit in distinct_id.
 */
export function trackUserSignedIn(p: StandardParams & { method: "email_code" | "google" }) {
  fire(p, "user_signed_in", { user_id: p.userId, method: p.method });
}

export function trackOnboardingCompleted(
  p: StandardParams & { focusTaskSelected: string; studyWindowTime: string },
) {
  fire(p, "onboarding_completed", {
    focus_task_selected: p.focusTaskSelected,
    study_window_time: p.studyWindowTime,
  });
}

export function trackFirstLessonStarted(p: StandardParams & { lessonId: string; moduleId: string }) {
  fire(p, "first_lesson_started", { lesson_id: p.lessonId, module_id: p.moduleId });
}

export function trackFirstLessonCompleted(
  p: StandardParams & { lessonId: string; timeTakenSeconds: number },
) {
  fire(p, "first_lesson_completed", {
    lesson_id: p.lessonId,
    time_taken_seconds: p.timeTakenSeconds,
  });
}

// --- Today & Journey loops ----------------------------------------------

export function trackLessonCompleted(
  p: StandardParams & { lessonId: string; moduleId: string; pointsEarned: number },
) {
  fire(p, "lesson_completed", {
    lesson_id: p.lessonId,
    module_id: p.moduleId,
    points_earned: p.pointsEarned,
  });
}

// --- Practice loop --------------------------------------------------------

export function trackSandboxPromptSubmitted(p: StandardParams & { lessonId: string }) {
  fire(p, "sandbox_prompt_submitted", { lesson_id: p.lessonId });
}

// --- Progress, gamification, resources ------------------------------------

export function trackLevelUpgraded(p: StandardParams & { newLevel: string; totalPoints: number }) {
  fire(p, "level_upgraded", { new_level: p.newLevel, total_points: p.totalPoints });
}

export function trackToolkitToolBookmarked(
  p: StandardParams & { toolId: string; toolCategory: string },
) {
  fire(p, "toolkit_tool_bookmarked", { tool_id: p.toolId, tool_category: p.toolCategory });
}
