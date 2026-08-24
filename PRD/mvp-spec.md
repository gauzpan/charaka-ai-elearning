# Charaka AI — MVP Spec

**Physician research-synthesis slice.** Locked via a grilling session; every decision below traces to a settled question (Q#).

> Scope discipline: the parent PRD's "MVP" is really a v1. This document is the *actual* MVP — the smallest coded slice that proves one hypothesis. Anything not listed here is deliberately out.

---

## Hypothesis under test — *(Q1: d + b)*

Right role-specific content **+** real in-app practice makes clinicians who *already dabble* with AI actually upskill and **apply** it at work.

**Falsified if:** users complete the loop but don't signal intent-to-use (see success metrics).

## Deliverable — *(Q2)*

A full working, coded, **mobile-first PWA** with a real practice loop. Not a mockup, not a clickable prototype.

## Constraints — *(Q3)*

Solo builder + AI tooling, days-to-a-week window. Every scope decision below serves buildability.

---

## Scope

- **Role:** Physician only *(Q4a)*. Nurse / care-coordinator = next release.
- **Flagship task built end-to-end:** Research / standards-of-care synthesis *(Q7a)* — highest-evidence physician AI use (2026 AMA ~40%), richest teaching surface for prompt-construction + verification.
- **Content volume** *(Q8b)*: one short **foundation module** (prompting fundamentals + safe-sharing, ~3 cards) that **gates** one **flagship workflow module** (~3 lessons), each ending in the practice loop. This shows a *journey* (foundation → applied) without a full curriculum.
- **Shown but NOT built — locked Journey cards** (uses the design doc's Locked state: "show why and when it unlocks, never a dead end"):
  - Patient-portal reply drafts
  - Visit-note documentation
  - **Agents for automating administrative workflows** in day-to-day clinical care
  - Build-with-AI / MCP (advanced)

  The demo looks broad and ambitious; only one lesson is actually built.

---

## Core practice loop — *(Q5c: hybrid)*

A **real LLM** produces the output; a **deterministic client-side rubric** produces the coaching. This keeps the practice *real* (the differentiator vs. "watch but can't do it") while keeping coaching instant and cheap.

### Coaching rubric — 4 dimensions *(Q10)*
Each scored present/absent → one-line coaching tip. These mirror the flagship module's learning outcomes, so coaching *teaches the skill*, not generic "be specific":

1. **Clinical question defined** — narrowed to a specific clinical question, not "summarize this paper."
2. **Evidence framing** — asked for comparison / strengths / limitations / gaps.
3. **Verification demand** — asked for citations or sources to check.
4. **Uncertainty flag** — asked the model to flag ambiguous or emerging evidence.

Example coaching: *"3/4 — you didn't ask it to flag uncertainty. Add that and re-run."*

---

## Flagship lesson — 6-card sequence — *(Q11)*

Runs the design doc's habit loop (TRIGGER → ACTION → REWARD → INVESTMENT). One idea per card.

1. **Objective** — "By the end: turn a paper into a clinical briefing you can trust."
2. **Concept** — anatomy of a good research-synthesis prompt (the 4 rubric dimensions, taught).
3. **Good-vs-bad example** — two prompts side by side.
4. **Motivational insight** — a real clinician "AI for good" example; sets up *why* this matters, **before** practice.
5. **Try-it / sandbox** — pre-filled prompt against a **synthetic** paper; user edits and runs; real LLM output + rubric coaching. No real patient data ever; signposted in-UI.
6. **Recap + invest** — recap the learning, **"I'll use this at work" tap**, **save-prompt**, tomorrow queued.

*Exactly six cards. No mini-quiz (replaced by card 4). No 7th card.*

---

## Success metrics — instrument from day one — *(Q6: a + b)*

- **Intent-to-apply:** "I'll use this at work" tap (card 6).
- **Saved-prompt count:** behavioral proxy for real intent-to-apply.

Engagement/return metrics are the *second* hypothesis, not this one — tracked but not the success bar.

---

## Onboarding & auth — *(Q9b)*

- **Magic-link accounts** — progress, streak, and saved prompts are real and portable.
- **Onboarding** = design doc's first-90-seconds flow **minus** the role picker (physician is fixed) → faster first value.

---

## Architecture — *(Q12)*

**Next.js (App Router) fullstack + Tailwind CSS + `next-pwa` + PostgreSQL via Prisma (Supabase-ready).**

- **Route Handlers (server-side):**
  - Magic-link issue / verify.
  - `/practice` — injects the synthetic paper context + user prompt, calls the LLM with the **server-side API key** (no secret in the browser), returns the output.
- **Rubric scoring:** client-side (4 deterministic checks, no LLM needed).
- **Persistence:** progress / streak / saved-prompts stored against the account in Postgres.
- **Model:** latest capable Claude (Sonnet-class for prompt critique + synthesis at this latency/cost).
- **Supabase migration path:** Prisma against plain Postgres now → swap the connection string later.

---

## Navigation (MVP)

**Today · Journey · Practice · Progress** — four destinations. Newsfeed / Toolkit / Library dropped for MVP (nothing to fill them yet). ≤5 nav rule honored.

---

## Non-negotiable design & safety rules — *(design.md + CLAUDE.md)*

- Design tokens used **verbatim** from `design/design.md` appendix.
- Emerald `#006C4C` is the **single** interactive accent; pastels semantic-only.
- Serif (Newsreader / Instrument Serif) for display, Geist Sans for UI, Geist Mono for meta. **Never Inter / Roboto / Open Sans.**
- Flat surfaces — 1px borders, no shadow at rest.
- **No emoji anywhere.**
- One primary action, one title, one progress signal per screen.
- **Synthetic data only, signposted.** No real patient data enters the sandbox. HIPAA-aware.

---

## Explicitly OUT of MVP

Multi-role tracks · peer / community layer · Newsfeed · Toolkit directory · mini-quizzes · the four locked modules (rendered as locked cards only) · EHR integration · real auth beyond magic-link · multilingual support.
