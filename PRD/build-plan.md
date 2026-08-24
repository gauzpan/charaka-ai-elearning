# Charaka AI — MVP Build Plan

Implementation plan for the locked [`mvp-spec.md`](./mvp-spec.md). No code is written until this plan is signed off. Solo + AI-tooling build; sequenced shell-first, then the practice loop, then wiring.

---

## 0. Toolchain assumptions (verify before Phase 1)

- Node ≥ 18.18 (Next.js 14+ App Router requirement).
- **Package manager: npm** (decided).
- **Postgres: local Docker Postgres** for dev (decided) via `DATABASE_URL`; Supabase later (same Prisma connection string). A `docker-compose.yml` provides the dev DB.
- An Anthropic API key in `ANTHROPIC_API_KEY` (server-side only, never shipped to the browser).

---

## 1. Scaffold

- `create-next-app` — App Router, TypeScript, Tailwind, ESLint, `src/` dir, `@/*` alias, **non-interactive** flags.
- Add: `next-pwa`, `prisma` + `@prisma/client`, `@anthropic-ai/sdk`, `zod` (input validation on route handlers).
- `.env.local` with `DATABASE_URL`, `ANTHROPIC_API_KEY`, `AUTH_SECRET`; `.env.example` committed.
- `next.config.js` wrapped with `next-pwa` (register SW, skip in dev).

**Exit check:** dev server boots, blank themed page renders, PWA manifest served.

---

## 2. Foundations (design system → code)

Port `design/design.md` **verbatim** — this is a hard constraint, not interpretation.

- **CSS variables** — copy the appendix token block (`--bg-canvas`, `--action: #006C4C`, semantic pastels, radius, spacing, motion easing) into `globals.css` under `:root`.
- **Tailwind config** — map tokens to theme (`colors`, `borderRadius`, `spacing`, `fontFamily`, `boxShadow`). No default palette bleed; emerald is the only accent.
- **Fonts** — `next/font`: Geist Sans (UI/body), Geist Mono (meta/prompts), Newsreader (display/headings). Fallbacks per spec. **Never Inter/Roboto/Open Sans.**
- **Base components** — `Button` (primary/ghost, states), `Card` (1px border, 12px radius, flat), `Tag/Chip` (pastel-semantic, mono uppercase), `ProgressBar` (segmented), `ProgressRing`, `StreakIndicator`.
- Motion: transform/opacity only; card entry `translateY(12px)+fade` 600ms `cubic-bezier(0.16,1,0.3,1)`; respect `prefers-reduced-motion`.

**Exit check:** a tokens/component preview page matches the design doc; no emoji, no shadows at rest.

---

## 3. App shell & navigation

- Mobile-first layout; content column ~640px cap on web; 16–20px edge padding.
- **Bottom tab bar (4):** Today · Journey · Practice · Progress. Persistent, labeled, thumb-zone.
- Route group `(app)` for authed tabs; route stubs for each tab with proper Empty states (design doc §5.3).
- Six states designed per screen: loading (skeletons) / empty / error / success / offline / locked.

**Exit check:** all four tabs navigable, states render, back is always safe.

---

## 4. Data model (Prisma + Postgres)

Schema (Supabase-ready — plain Postgres, swap connection string later):

- **User** — `id`, `email` (unique), `role` (fixed `PHYSICIAN` for MVP), `studyWindow`, `createdAt`.
- **MagicLinkToken** — `id`, `userId`, `tokenHash`, `expiresAt`, `consumedAt`.
- **Progress** — `id`, `userId`, `moduleId`, `lessonId`, `cardIndex`, `completedAt`; streak fields (`currentStreak`, `lastActiveDate`).
- **SavedPrompt** — `id`, `userId`, `taskId`, `promptText`, `rubricScore`, `createdAt`. *(Success metric b.)*
- **ApplyIntent** — `id`, `userId`, `lessonId`, `createdAt`. *(Success metric a — the "I'll use this at work" tap.)*

**Exit check:** `prisma migrate dev` applies; seed script inserts the foundation + flagship content.

---

## 5. Content model & lesson player

- **Content as typed data** (TS/JSON, not a CMS) for MVP: `Module → Lesson → Card`.
  - Foundation module: ~3 cards (prompting fundamentals + safe-sharing).
  - Flagship module (research synthesis): ~3 lessons, each the 6-card sequence.
- **Card types:** Objective, Concept, GoodVsBad, MotivationalInsight, TryIt (sandbox handoff), RecapInvest.
- **Session player** — linear runner: top segmented step-bar, one primary action, `"2 of 6 · ~3 min left"`, auto-save per card, resumable.
- **Journey map** — foundation → flagship path; the four **locked** future cards (portal drafts, visit-notes, admin-workflow agents, build-with-AI/MCP) with "why/when it unlocks" copy.

**Exit check:** a full lesson plays start-to-finish; locked cards render with reasons.

---

## 6. Practice loop (the hypothesis-critical piece)

- **`/api/practice` Route Handler (server-side):** validate with zod → inject **synthetic paper** context + user prompt → call Claude (Sonnet-class) with server-side key → return output. No key in the browser; no real patient data; UI signposts "synthetic data."
- **Client-side rubric** — 4 deterministic checks (clinical question defined / evidence framing / verification demand / uncertainty flag) → score + one-line tip each. Instant, no LLM.
- **Sandbox console component** — editing / running / result / safe-data-notice states; pre-filled editable prompt.
- **Card 6 instrumentation** — "I'll use this at work" tap → `ApplyIntent`; save-prompt → `SavedPrompt`.

**Exit check:** edit prompt → real output + rubric coaching in one screen; both metrics persist.

---

## 7. Auth & onboarding

- **Magic-link:** request → email token (dev: log link to console / Mailhog) → verify route consumes token, sets session (signed cookie via `AUTH_SECRET`).
- **Onboarding (90s):** role fixed to physician (no picker) → pick a real task → pick study window → one 2-min win now → set gentle daily trigger (stored, notification wiring is post-MVP).

**Exit check:** sign in on a fresh device, progress/streak/saved-prompts persist to the account.

---

## 8. Polish & verification

- Offline: cache foundation + flagship content (PWA), sandbox degrades gracefully offline (needs network — signpost it).
- Accessibility: WCAG AA contrast on pastel-on-white pairs, ≥44×44pt targets, `prefers-reduced-motion`.
- Instrument a tiny metrics view (internal) confirming ApplyIntent + SavedPrompt counts move.
- Manual run-through of the full happy path + the six screen states.

---

## Sequencing & milestones

| Milestone | Phases | Demonstrates |
| :-- | :-- | :-- |
| **M1 — Themed shell** | 1–3 | App boots, on-brand, 4-tab nav, states |
| **M2 — Playable lesson** | 4–5 | Journey → lesson → 6 cards, progress persists |
| **M3 — Real practice loop** | 6 | The differentiator: real output + rubric coaching, metrics fire |
| **M4 — Accounts + polish** | 7–8 | Magic-link, onboarding, offline, a11y, metric check |

Build strictly in this order — M3 is the hypothesis test; M1–M2 make it demoable; M4 makes it real. If the week slips, M3 is the non-negotiable; M4 auth can fall back to `localStorage` (the original Q9 option a).

---

## Out of scope (reaffirmed)

Multi-role · peer/community · Newsfeed · Toolkit directory · quizzes · the four locked modules (locked cards only) · EHR · multilingual · notification delivery (trigger is stored, not sent).
