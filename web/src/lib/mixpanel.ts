import "server-only";
import Mixpanel from "mixpanel";

// Mixpanel — server-side only (Quick Start scope). Every event this app
// tracks today is backend-observable (auth, progress), so there's no browser
// SDK and no client-exposed token; MIXPANEL_TOKEN never leaves the server.
// Fire-and-forget by design: analytics must never block or fail the real
// request it's attached to — errors are logged, never thrown.
//
// distinct_id is always the app's own User.id (a stable cuid), never email —
// see CLAUDE.md's identity rule. No event property here should ever carry
// free-text user input (e.g. a sandbox prompt body); this app is HIPAA-aware
// even though no real patient data is allowed in by design.

let client: Mixpanel.Mixpanel | null = null;

function mixpanel(): Mixpanel.Mixpanel | null {
  const token = process.env.MIXPANEL_TOKEN;
  if (!token) return null; // unset (CI, or intentionally disabled) — silent no-op
  if (!client) client = Mixpanel.init(token);
  return client;
}

export function track(
  distinctId: string,
  event: string,
  properties: Record<string, string | number | boolean> = {},
): void {
  const mp = mixpanel();
  if (!mp) return;
  mp.track(event, { distinct_id: distinctId, ...properties }, (err) => {
    if (err) console.error(`[mixpanel] track "${event}" failed:`, err);
  });
}

export function setProfile(distinctId: string, properties: Record<string, string | number | boolean>): void {
  const mp = mixpanel();
  if (!mp) return;
  mp.people.set(distinctId, properties, (err) => {
    if (err) console.error("[mixpanel] people.set failed:", err);
  });
}
