"use client";

import { useSyncExternalStore } from "react";

// Light/dark control. Default is dark (the product default — design.md's
// dark palette), regardless of device preference; a tap sets an explicit
// choice on <html data-theme> and persists it. Read via useSyncExternalStore
// so SSR renders a stable value and the client swaps to the resolved theme
// without a hydration-mismatch warning.

const STORAGE_KEY = "charaka.theme";
type Theme = "light" | "dark";

const listeners = new Set<() => void>();

function stored(): Theme | null {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === "light" || v === "dark" ? v : null;
  } catch {
    return null;
  }
}

function resolved(): Theme {
  return stored() ?? "dark";
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function setTheme(next: Theme) {
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // best-effort persistence
  }
  document.documentElement.dataset.theme = next;
  listeners.forEach((l) => l());
}

function SunIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  );
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, resolved, () => "dark" as Theme);
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="grid h-9 w-9 place-items-center rounded-sm text-secondary transition-colors hover:bg-subtle hover:text-primary"
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
