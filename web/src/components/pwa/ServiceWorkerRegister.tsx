"use client";

import { useEffect } from "react";

// Registers the minimal offline service worker (public/sw.js). Only in
// production builds — a SW in dev interferes with HMR.
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // registration is best-effort; the app works without it
    });
  }, []);
  return null;
}
