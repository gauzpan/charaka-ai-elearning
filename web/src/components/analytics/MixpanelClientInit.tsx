"use client";

import { useEffect } from "react";
import { initMixpanelClient, isMixpanelClientReady, mixpanel } from "@/lib/mixpanelClient";
import { registerAnalyticsSuperProps } from "@/lib/analyticsClient";

// Mounted once in the root layout, mirrors ServiceWorkerRegister's pattern:
// a browser-only side effect with no UI. Initializes autocapture + Session
// Replay, then identifies the signed-in user (if any) so client events and
// replay sessions stitch to the same distinct_id as the server-side events
// in lib/mixpanel.ts — Mixpanel's own replay docs call this out as required
// for "server-side stitching" to work.
export function MixpanelClientInit() {
  useEffect(() => {
    initMixpanelClient();

    let cancelled = false;
    fetch("/api/me")
      .then((r) => r.json())
      .then((data: { id?: string; role?: string }) => {
        if (cancelled || !data.id || !isMixpanelClientReady()) return;
        mixpanel.identify(data.id);
        registerAnalyticsSuperProps(data.role ?? null);
      })
      .catch(() => {
        // identity is best-effort — anonymous autocapture/replay still works
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
