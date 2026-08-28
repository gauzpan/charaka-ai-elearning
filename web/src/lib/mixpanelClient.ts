"use client";

import mixpanel from "mixpanel-browser";

// Client-side Mixpanel: autocapture (clicks, pageviews, scroll, rage/dead
// clicks, form submits) + Session Replay. This complements, not replaces,
// the server-side lib/mixpanel.ts events (account_created, lesson_completed)
// — both write to the same project, stitched by the same distinct_id
// (User.id), never email.
//
// Privacy posture (verified against current Mixpanel docs, not assumed):
// Session Replay masks ALL text and ALL inputs by default
// (record_mask_all_text / record_mask_all_inputs both default true) and
// blocks images/video — nothing here overrides those defaults. Autocapture's
// `input` tracking fires on interaction only; `capture_text_content` is
// false by default, so typed values (e.g. the Practice/Sandbox prompt
// textarea) are never captured as raw text either way. This matches the
// app's HIPAA-aware, no-real-patient-data posture without extra config.

let initialized = false;

// The mixpanel-browser singleton only sets up its internal state (hooks,
// persistence, config, etc.) inside .init() — calling .track()/.identify()/
// .register()/.reset() on it before that (e.g. NEXT_PUBLIC_MIXPANEL_TOKEN
// unset in this environment) throws deep inside the library's internals
// ("Cannot read properties of undefined (reading 'before_track')"), which
// can crash the whole page since it's an uncaught error inside a render-path
// effect. Every call site must check this first.
export function isMixpanelClientReady(): boolean {
  return initialized;
}

export function initMixpanelClient(): void {
  if (initialized) return;
  const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
  if (!token) return; // unset — client tracking is a silent no-op
  initialized = true;

  mixpanel.init(token, {
    autocapture: true,
    // Quick Start: record every session while traffic is low so nothing is
    // missed early. Revisit before real production volume — see the vault
    // progress log's Mixpanel next-steps note.
    record_sessions_percent: 100,
    persistence: "localStorage",
    debug: process.env.NODE_ENV !== "production",
  });
}

export { mixpanel };
