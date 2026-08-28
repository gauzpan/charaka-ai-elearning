"use client";

import { mixpanel, isMixpanelClientReady } from "@/lib/mixpanelClient";
import { deviceTypeFromUA } from "@/lib/analyticsShared";

// Centralized, type-safe client-side event helpers — the browser-SDK
// counterpart to lib/analytics.ts, for events with no natural server
// round-trip (tab views, card views, share-button taps, feed clicks).
//
// Standard metadata: userId is handled by MixpanelClientInit's
// mixpanel.identify(user.id) — every track() call after that already lands
// on the right Mixpanel profile, not a fresh anonymous one. userRole and
// deviceType are registered ONCE as Mixpanel "super properties" (below) so
// they ride along on every event automatically, same effect as attaching
// them per-call without repeating it at every site. `mixpanel.track()` is
// already fire-and-forget (a network/beacon send) — it never blocks or
// throws into the caller.

let superPropsRegistered = false;

/** Called once by MixpanelClientInit after identify() resolves. */
export function registerAnalyticsSuperProps(userRole: string | null): void {
  if (superPropsRegistered || !isMixpanelClientReady()) return;
  superPropsRegistered = true;
  mixpanel.register({
    userRole: userRole ?? "unknown",
    deviceType: deviceTypeFromUA(typeof navigator !== "undefined" ? navigator.userAgent : null),
  });
}

function fire(event: string, payload: Record<string, string | number | boolean> = {}): void {
  if (!isMixpanelClientReady()) return; // e.g. NEXT_PUBLIC_MIXPANEL_TOKEN unset in this env
  mixpanel.track(event, { ...payload, timestamp: new Date().toISOString() });
}

// --- Auth & Onboarding -------------------------------------------------

export function trackAuthGoogleRequested(): void {
  fire("auth_google_requested", { is_google_login: true });
}

export function trackOnboardingStarted(entryPoint: string): void {
  fire("onboarding_started", { entry_point: entryPoint });
}

// --- Today & Journey loops ----------------------------------------------

export function trackTodayTabViewed(userLevel: string, pointsTotal: number): void {
  fire("today_tab_viewed", { user_level: userLevel, points_total: pointsTotal });
}

export function trackLessonCardViewed(lessonId: string): void {
  fire("lesson_card_viewed", { lesson_id: lessonId });
}

export function trackLockedModuleClicked(lockedModuleId: string): void {
  fire("locked_module_clicked", { locked_module_id: lockedModuleId });
}

// --- Practice loop --------------------------------------------------------

export function trackSandboxRubricEvaluated(lessonId: string, score: number): void {
  fire("sandbox_rubric_evaluated", { lesson_id: lessonId, score });
}

// --- Progress, gamification, resources ------------------------------------

export function trackLessonShareClicked(sharePlatform: string, lessonId: string): void {
  fire("lesson_share_clicked", { share_platform: sharePlatform, lesson_id: lessonId });
}

export function trackAiFeedClicked(feedTitle: string): void {
  fire("ai_feed_clicked", { feed_title: feedTitle });
}
