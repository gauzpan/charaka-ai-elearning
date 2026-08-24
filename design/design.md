# **Charaka AI — Design System**

> **Charaka AI** takes its name from Charaka, the ancient physician-teacher regarded as a father of medicine — a fitting namesake for a platform that teaches clinicians a new kind of practice. The lowercase word "round(s)" is still used generically in this document as clinical-practice terminology (a "daily round," "this week's round") distinct from the brand name.


|                           |                                                                                            |
| :------------------------- | :------------------------------------------------------------------------------------------ |
| **Product**               | Workflow-first, psychologically informed AI-literacy platform for healthcare professionals |
| **Primary platform**      | Mobile-first (iOS / Android), responsive web as companion                                  |
| **Design language**       | Premium utilitarian minimalism — warm monochrome, editorial type, flat surfaces            |
| **Status**                | v1 foundation — living document                                                            |
| **Audience for this doc** | Designers, engineers, content authors, PMs                                                 |


## **0 How to read this document**

The system is organized as three design layers plus a foundation:

> 1. **Conceptual design** — what the product *is* in the user's mind, and the psychology it runs on.
> 2. **Information design** — how content and navigation are structured so anything can be found and progress is always legible.
> 3. **Interaction design** — how the product responds, rewards, and forms habits.
> 4. **Foundations &amp; components** — the concrete tokens and parts that build every screen.

Every major decision traces back to a stated practice. See **§11 Practice Traceability Matrix** to audit coverage.

## **1 Product context &amp; north star**

### **1.1 Hypothesis we are designing against**

> If we build a psychologically informed, workflow-first AI learning platform that offers role-specific journeys, tutorials, AI toolkit, latest news related to AI in their domain and sandboxed practice — starting with healthcare professionals — then non-tech workers move from *"I get by, but I'm guessing"* to *"I am a confident AI copilot"*, driving sustained adoption, measurable productivity gains, and reduced burnout **without eroding professional identity**.

### **1.2 Who we design for**

Time-poor experts with high cognitive load, working in clinical environments, often learning in the gaps between tasks and on the move. They are novices at AI but masters of their own field — so the product must respect their expertise while lowering the stakes of being a beginner at *this*.


| Role           | Context of use                                                | AI focus example                                                                                                               |
| :-------------- | :------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------ |
| Physician      | Between patients, on call, commute, or at night personal time | Drafting notes, summarizing histories, differential support, understanding medical research studies, preparing for conferences |
| Radiologist    | At the workstation, reading lists                             | Image triage assistants, structured reporting                                                                                  |
| Nurse          | Shift breaks, handoffs                                        | Charting shortcuts, patient education, protocol lookups                                                                        |
| Allied / admin | Desk mobile                                                   | Scheduling, documentation, communication drafting                                                                              |


### **1.3 The core tension to protect against**

Beginners are fragile. A doctor who feels *incompetent* or *talked down to* will quit in one session. Every design choice defends **professional identity**: adult tone, clinical credibility, no childish gamification, no condescension.

### **1.4 North-star signals**

Confidence lift (self-reported), time-to-first-real-use of a skill at work, experience level with AI, and *reduced* effort per task over time. We explicitly **do not** optimize for raw time-in-app (see §10 guardrails).

## **2 Design principles**

Ten principles. The left column is the promise; the right column is the failure mode it exists to prevent (mapping to the "avoid" list).


| Principle                                                                               | Prevents                |
| :--------------------------------------------------------------------------------------- | :----------------------- |
| **1 Speak their world.** Every example is a real clinical task in their role.           | Unrelatable             |
| **2 One idea per screen.** Say what this is and why it matters, immediately.            | Unclear                 |
| **3 Fewest moving parts.** Hick's Law — limit visible choices to the essentials.        | Too complicated         |
| **4 Adult, evidence-based tone.** No cartoons, no hype, credibility first.              | Inappropriate           |
| **5 Designed for two minutes.** A useful unit of learning fits a coffee break.          | Too time-consuming      |
| **6 Always-legible location.** You always know where you are, what's done, what's next. | Confusing               |
| **7 Meet them mid-motion.** Offline, one-handed, glanceable, interruptible.             | Inconvenient            |
| **8 Shortest path to the answer.** Structured, searchable, reference-grade.             | Inefficient             |
| **9 Reward, don't lecture.** Momentum, mastery, and light play.                         | Boring                  |
| **10 One system, everywhere.** Same components, same rules, same voice.                 | Inconsistent / no value |


## **3 Conceptual design**

### **3.1 Mental model — "a coach in your pocket, not a course you enrolled in"**

The product should feel less like an LMS and more like a **regular practice with a coach**. Users don't "take a course"; they "do their rounds." This reframing lowers commitment anxiety and supports habit formation.  
Three surfaces, always reachable:

- **Learn** — micro-lessons, videos, flashcards, quizzes.  
- **Practice (Sandbox)** — a safe, patient-data-free environment to actually use AI prompts and see results, with guardrails and instant feedback. Can have dummy data for simulations.  
- **Toolkit –** A curated list of AI products related to the healthcare sector relevant to their domain and role  
- **AI NewsFeed –** Streaming curated list of updates related to AI and healthcare industry

### **3.2 The learning model — microlearning inside a habit loop**

The atomic unit is a **Card** (≤ 2 minutes). Cards chain into a **Lesson** (a microsession, 3–7 minutes). Lessons form **Modules**, modules form a **Journey** (role-specific track).  
Every session runs a habit loop:

TRIGGER            ACTION                REWARD                 INVESTMENT  
(notification,  →  one 2-min card    →  progress  streak   →  saved prompt,  
 streak, cue)      or micro-quiz          "you can use          note, next-up  
                                         this today" line        queued

- **Trigger** — time-based nudge tuned to the user's stated study window (commute, break).  
- **Action** — the smallest satisfying unit; never blocks on a big commitment.  
- **Reward** — immediate, tangible ("use this in your next note"), plus skill points as experience signal.  
- **Investment** — the user saves something (a prompt, a note) that makes tomorrow's session more valuable — the hook that compounds.

### **3.3 Role-based journeys**

Onboarding routes each user into a **Journey** for their role. Content, examples, and sandbox scenarios are all role-scoped. A radiologist never wastes a session on a nurse's charting example.

### **3.4 Psychological design system**

The five psychological levers, made concrete and each given a guardrail so they stay ethical:


| Lever             | How it shows up                                                                                                        | Guardrail                                   |
| :----------------- | :---------------------------------------------------------------------------------------------------------------------- | :------------------------------------------- |
| **Simplicity**    | One idea per card with bullet points and not paragraphs for text; default choices pre-selected; progressive disclosure | Never hide the exit or the "why"            |
| **Incentives**    | Mastery levels, skill points, competency badges, real-work payoff line on every lesson                                 | Frame as competence, not points-chasing     |
| **Microsessions** | 2-min cards, resumable anywhere, offline-capable                                                                       | Never require a long block to make progress |
| **Triggers**      | Smart notifications at the user's chosen window; contextual "try this at work" prompts                                 | User controls cadence; easy to mute         |
|                   |                                                                                                                        |                                             |


## **4 Information design**

### **4.1 Information architecture**

Charaka AI  
├─ Today            ← default landing: next micro-session, streak, one clear CTA  
│   └─ Session player (Card → Card → …)  
├─ Journey          ← the role track: modules, progress map, what's next  
│   └─ Module → Lesson → Card  
├─ Practice         ← sandbox scenarios, saved prompts, prompt library  
├─ Newsfeed            ← latest news update related to AI and healthcare  
└─ Library          ← saved prompts, AI toolkit, reference/encyclopedia: searchable, task-indexed  
    └─ Profile/Settings (progress stats, notifications, accessibility)

Five destinations maximum in the primary nav (Hick's Law). **Today** is the default so a returning user needs zero decisions to make progress.

### **4.2 Navigation model**

- **Bottom tab bar** (mobile): Today · Journey · Practice · Coach · Library. Persistent, labeled, consistent everywhere.  
- **In-session**: a linear player with a top progress bar and a single primary action. No competing nav during a session — the session owns the screen.  
- **Back is always safe**; progress is auto-saved per card.

### **4.3 Content model &amp; taxonomy**

Journey  (role track, weeks-long)  
 └ Module  (a competency, e.g. "Prompting clinical notes")  
    └ Lesson  (one microsession, 3–7 min)  
       └ Card  (one idea, ≤ 2 min: concept / video / flashcard / quiz / try-it)

Card types: **Concept**, **Micro-video** (≤ 90s), **Flashcard**, **Mini-quiz**, **Try-it** (sandbox practice handoff). Authors chunk every lesson so no single screen carries more than one idea.

### **4.4 Progress &amp; perspective system (always visible)**

People disengage when the path is unclear. Every level of the hierarchy exposes three facts:

> 1. **How far you've come** — steps completed / streak.
> 2. **How much remains** — cards left in lesson, lessons left in module.
> 3. **How much time it takes** — estimated minutes shown *before* they start, elapsed shown during.


| Surface          | Indicator                                                 |
| :---------------- | :--------------------------------------------------------- |
| Session player   | Segmented step bar (e.g. ●●●○○), "2 of 5 · 3 min left"    |
| Lesson list      | Ring or bar per lesson "12 min" estimate                  |
| Module / Journey | Progress map with completed / current / locked states     |
| Profile          | Streak, total time, modules complete, competencies earned |


Estimates are honest. A "2 min" card is really 2 minutes.

### **4.5 Content hierarchy &amp; chunking rules**

- **Chunk** every lesson into cards; one concept per card.  
- **Front-load the payoff**: each lesson opens with "By the end you'll be able to  in your work."  
- **Objectives are explicit** and visible before and after.  
- **Progressive disclosure**: advanced detail lives behind an optional "Go deeper" expander, never on the main path.

### **4.6 Efficiency &amp; findability (reference-grade)**

The **Library** is an encyclopedia for working clinicians: saved prompts, AI toolkit, task-indexed ("write a discharge summary"), searchable, filterable by role, and openable in ≤ 2 taps from anywhere. Saved prompts and completed lessons are re-findable. Search is a first-class, always-present affordance — the fastest path to an answer under time pressure.

## **5 Interaction design**

### **5.1 Key flows**

**Onboarding (first 90 seconds — earns the habit).**

> 1. Pick role → 2 Pick a real task you want to get better at → 3 Choose your study window (commute / break / evening) → 4 One 2-minute win *now* → 5 Set a gentle daily trigger. The user finishes their first session before committing to anything. First value precedes first friction.

**Daily microsession.** Open → **Today** shows exactly one next action → play 3–7 min of cards → end on a reward  "try this today in AI of your choice"  tomorrow queued.  
**Insights.** After every lesson, show an Insights to recall the Learning, summarize it and share a fact to motivate them to learn like some rela life facts.  
**Sandbox / Try-it.** Handoff from a lesson into a scenario with a pre-filled prompt the user edits and runs against safe, synthetic data. Instant model response, annotated with what worked. No real patient data ever enters the sandbox (enforced  signposted).

### **5.2 Microinteractions &amp; feedback**

Every action gets an immediate, proportionate response: tap states, card advance, correct/incorrect, streak increment, badge earned. Feedback is quiet and confident (see §6.6 motion). Nothing is silent; nothing is loud.

### **5.3 States (design all six for every screen)**


| State       | Rule                                                                                            |
| :----------- | :----------------------------------------------------------------------------------------------- |
| **Loading** | Skeletons, never spinners on content; keep layout stable                                        |
| **Empty**   | Explain one action ("Start your first round")                                                   |
| **Error**   | Plain language, a way forward, no blame                                                         |
| **Success** | Brief, specific, forward-pointing                                                               |
| **Offline** | Cached lessons remain playable; sync silently later                                             |
| **Locked**  | Show *why* and *when* it unlocks — never a dead end. Allow on demand unlocking via confirmation |


### **5.4 Gestures &amp; input**

One-handed by default: primary actions in the thumb zone (bottom third). Tap and swipe are primary; nothing critical hidden behind long-press. Flashcards flip on tap; sessions advance with a single clear button, not a hunt.

### **5.5 Notifications &amp; triggers**

- Fire at the user's chosen window, not ours.  
- Each notification carries a **specific, useful hook**: "2-min round: summarize a history faster."  
- Frequency is user-controlled; a single tap adjusts or mutes.  
- Types: streak-keeper, new role-relevant skill, cohort activity, "try this at work" nudge.

### **5.6 Gamification — calibrated for professionals**

Play is present but adult. It signals **competence**, not points for points' sake.


| Mechanic             | Professional framing                                                                                                          |
| :-------------------- | :----------------------------------------------------------------------------------------------------------------------------- |
| Levels               | **Competency levels** (Aware → Practiced → Fluent) per skill                                                                  |
| Badges               | Skill mastery optional CME-style completion markers                                                                           |
| Challenge            | Weekly "round" with your cohort                                                                                               |
| Leaderboard          | **Opt-in**, cohort-scoped, off by default                                                                                     |
| "Currency" /”Tokens” | Practice credits that unlock deeper sandbox scenarios — earned by doing, not paying , daily practice accumulates more tokens. |


Anything that would feel childish to an attending physician is rejected. Gamification is a garnish, never the meal.

### **5.7 FOMO &amp; social patterns (ethical only)**

Use honest social signal: a cohort of role-peers, "3 colleagues finished this week's round," fresh skill drops that are genuinely new. Never fabricate scarcity, never weaponize guilt, never dark-pattern the streak. If a nudge would embarrass a busy clinician, it doesn't ship.

## **6 Foundations (basic elements / design tokens)**

The visual system is **premium utilitarian minimalism**: warm monochrome canvas, editorial serif for headings, clean geometric sans for UI, muted pastels used *only* for semantic meaning. Clean and quiet so the content leads.

### **6.1 Color**

**Canvas &amp; surface**


| Token          | Value  | Use                                   |
| :-------------- | :------ | :------------------------------------- |
| -bg-canvas     | F4F6F8 | App background (soft grey canvas)     |
| -bg-surface    | FFFFFF | Cards, sheets, session player         |
| -bg-subtle     | F8FAFC | Nested/secondary surfaces             |
| -border        | E2E8F0 | All dividers &amp; card borders (1px) |
| -border-strong | CBD5E1 | Emphasis dividers                     |


**Text**


| Token           | Value  | Use                        |
| :--------------- | :------ | :-------------------------- |
| -text-primary   | 0F172A | Body/headings (deep slate) |
| -text-secondary | 475569 | Supporting text            |
| -text-muted     | 94A3B8 | Meta, timestamps, hints    |


**Interactive**


| Token         | Value  | Use                                        |
| :------------- | :------ | :------------------------------------------ |
| -action       | 006C4C | Primary button bg (emerald / forest green) |
| -action-hover | 00523A | Hover/pressed                              |
| -on-action    | FFFFFF | Text on primary                            |


**Semantic pastels** (background / text pairs — color is scarce, meaning-only)


| Meaning                   | Background | Text   | Use                           |
| :------------------------- | :---------- | :------ | :----------------------------- |
| Info / interactive accent | E0F2FE     | 0369A1 | Tips, "new", info tags, links |
| Success / mastery         | E8F5E9     | 006C4C | Correct answers, completion   |
| Warning / at-risk         | FEF3C7     | B45309 | Streak-at-risk, cautions      |
| Error / incorrect         | FEE2E2     | B91C1C | Errors, wrong answers         |


Emerald green is the single interactive accent so the app reads calm and trustworthy (well suited to a clinical audience) while staying monochrome-dominant.

### **6.2 Typography**


| Role                      | Family (target)                       | Notes                                             |
| :------------------------- | :------------------------------------- | :------------------------------------------------- |
| **Display / headings**    | Newsreader, Instrument Serif, serif   | Editorial serif; tracking 0.02em, line-height 1.1 |
| **UI / body / buttons**   | Geist Sans, SF Pro Display, system-ui | Geometric sans; body line-height 1.6              |
| **Meta / code / prompts** | Geist Mono, JetBrains Mono, monospace | Prompts, keystrokes, stats                        |


Never use Inter, Roboto, or Open Sans (banned defaults). Type scale (mobile):


| Token   | Size / line   | Use                     |
| :------- | :------------- | :----------------------- |
| display | 32 / 36 serif | Lesson intro, milestone |
| h1      | 24 / 30 serif | Screen title            |
| h2      | 20 / 28 sans  | Section                 |
| body    | 16 / 26 sans  | Default reading         |
| small   | 14 / 22 sans  | Supporting              |
| meta    | 12 / 16 mono  | Stats, tags, timers     |


### **6.3 Spacing &amp; layout grid**

4px base, 8-point rhythm: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 Generous macro-whitespace between sections. Content column caps around 640px on web; edge padding 16–20px on mobile. Bento-style asymmetric cards on larger surfaces.

### **6.4 Radius, borders, elevation**

- **Radius**: 8px default, 12px for large cards, 4px for buttons/inputs, 9999px for tags/badges only.  
- **Borders**: exactly 1px solid var(--border) on every card and divider.  
- **Elevation**: nearly flat. Rest  no shadow. Hover/active  0 2px 8px rgba(0,0,0,0.04) max. No shadow-md/lg/xl.

### **6.5 Iconography**

Thicker-stroke technical set (Phosphor Bold/Fill or Radix), standardized stroke width, monochrome (--text-secondary), pastel background only when carrying a semantic state. No thin-line generic sets, no emoji anywhere.

### **6.6 Motion**

Invisible-but-present. Animate only transform and opacity.

- Card/section entry: translateY(12px)  fade over 600ms, cubic-bezier(0.16,1,0.3,1).  
- Buttons: scale(0.98) on press.  
- Staggered list reveals: 80ms cascade.  
- Streak/badge earn: one restrained celebratory beat, then settle. Never confetti-storms. Respect prefers-reduced-motion.

### **6.7 Imagery &amp; illustration**

Monochromatic continuous-line ink sketches with a single offset pastel shape. Photography desaturated and warm, low-opacity grain, never oversaturated stock. Clinical imagery stays respectful and real. Backgrounds get depth from subtle texture/soft radial light at opacity ≤ 0.04, never flat-empty and never loud.

## **7 Component library**

Each component lists purpose  key states. Build once; reuse everywhere (Principle 10).


| Component                           | Purpose                                                 | Key states                                     |
| :----------------------------------- | :------------------------------------------------------- | :---------------------------------------------- |
| **Primary button**                  | The single action per screen                            | default / hover / pressed / disabled / loading |
| **Secondary / ghost button**        | Alternate action                                        | default / hover / disabled                     |
| **Card (base)**                     | Container: 1px border, 12px radius, flat                | rest / hover-lift / selected                   |
| **Lesson card**                     | Entry to a microsession — title, minutes, progress ring | not-started / in-progress / complete / locked  |
| **Flashcard**                       | Two-sided recall                                        | front / flipped / known / review-again         |
| **Quiz item**                       | One question per screen                                 | unanswered / correct / incorrect / explanation |
| **Progress bar (segmented)**        | Steps in a session                                      | filled / current / upcoming                    |
| **Progress ring**                   | Lesson/module completion                                | 0–100%, complete                               |
| **Streak indicator**                | Daily consistency                                       | active / at-risk / frozen                      |
| **Competency badge**                | Mastery level per skill                                 | Aware / Practiced / Fluent / earned            |
| **Tag / status chip**               | Meta labels                                             | pastel-semantic, uppercase, 12px mono          |
| **Bottom tab bar**                  | Primary nav (5 max)                                     | active / inactive                              |
| **Session player**                  | Linear card runner                                      | top step-bar one primary action                |
| **List row**                        | Library/journey items                                   | default / pressed / locked                     |
| **Bottom sheet / modal**            | Focused sub-task                                        | open / closing; dismissible                    |
| **Toast**                           | Lightweight confirmation                                | success / info / error, auto-dismiss           |
| **Coach message**                   | Peer/expert thread bubble                               | sent / received / expert-verified              |
| **Sandbox console**                 | Prompt input model output                               | editing / running / result / safe-data notice  |
| **Empty / locked / offline states** | Recovery orientation                                    | see §5.3                                       |


**Composition rule:** a screen shows one primary action, one clear title, and one visible progress signal. If a screen needs a second primary action, it needs to be two screens.

## **8 Content &amp; voice**

- **Tone**: peer-to-peer, respectful, plain, specific. You are a knowledgeable colleague, not a teacher scolding a student.  
- **Banned copy**: hype clichés ("elevate", "seamless", "unleash", "game-changer"), condescension, jargon-for-jargon's-sake, emoji.  
- **Every lesson states its payoff** in the user's real work: "Use this in your next progress note."  
- **Errors and misses** are framed as normal steps in learning, never failures.  
- **Microcopy** carries the load: labels, empty states, and nudges are where trust is won or lost.

## **9 Accessibility &amp; clinical context**

- **Contrast** ≥ WCAG AA (4.5:1 text); verify pastel-on-white pairs.  
- **Touch targets** ≥ 44×44pt; thumb-zone placement for primary actions.  
- **Motion** respects prefers-reduced-motion; nothing conveyed by color alone.  
- **One-handed, glanceable, interruptible** — designed for a clinician mid-shift.  
- **Offline-first** for core lessons; graceful sync.  
- **Privacy by design**: no real patient data in the sandbox; clear signposting; HIPAA-aware handling. This is a credibility and safety requirement, not a nicety.  
- **Legibility over density**: generous line-height and spacing serve tired eyes on small screens.

## **10 Measurement &amp; guardrails (anti-dark-pattern)**

We optimize for **confidence and real-world use**, not screen time.


| Track                                             | Not                 |
| :------------------------------------------------- | :------------------- |
| Skill applied at work (self-report prompts saved) | Raw minutes in app  |
| Streak *health* and easy recovery                 | Streak anxiety      |
| Confidence lift over baseline                     | Vanity completion % |
| Reduced effort per task over time                 | Endless engagement  |


Guardrails: no manufactured FOMO, no guilt notifications, no leaderboard by default, always-visible exit, honest time estimates, easy mute. If a mechanic boosts engagement but would make a busy clinician feel manipulated, it fails review.

## **11 Practice traceability matrix**

Proof that every practice you specified is expressed in the system.


| Practice                                                                                      | Where it lives                                                |
| :--------------------------------------------------------------------------------------------- | :------------------------------------------------------------- |
| Avoid *unrelatable*                                                                           | Role-specific journeys &amp; examples (§3.3, P1)              |
| Avoid *unclear*                                                                               | One idea per card, explicit objectives (§4.5, P2)             |
| Avoid *too complicated*                                                                       | 5-item nav, progressive disclosure, Hick's Law (§4.1, §6, P3) |
| Avoid *inappropriate*                                                                         | Adult tone, professional gamification (§5.6, §8, P4)          |
| Avoid *too time-consuming*                                                                    | 2-min cards, honest estimates (§3.2, §4.4, P5)                |
| Avoid *confusing*                                                                             | Always-legible location &amp; progress (§4.4, P6)             |
| Avoid *inconvenient*                                                                          | One-handed, offline, interruptible (§5.4, §9, P7)             |
| Avoid *inefficient*                                                                           | Task-indexed searchable Library (§4.6, P8)                    |
| Avoid *boring*                                                                                | Rewards, mastery, light play (§5.6, P9)                       |
| Avoid *inconsistent*                                                                          | One component system voice (§7, §8, P10)                      |
| **User psychology** (simple, incentives, microsessions, triggers, FOMO)                       | Psychological design system (§3.4)                            |
| **Habit framing**                                                                             | "Coach in your pocket" habit loop (§3.1–3.2)                  |
| **Design for perspective** (steps done / remaining / time)                                    | Progress &amp; perspective system (§4.4)                      |
| **Design for professionals** (clean, minimal)                                                 | Foundations (§6), whole visual language                       |
| **Design for microlearning** (videos, flashcards, quizzes, notifications)                     | Card types notifications (§4.3, §5.5)                         |
| **Design for minimalism** (Hick's Law)                                                        | Nav ≤ 5, one action per screen (§4.1, §7)                     |
| **Design for clarity &amp; convenience** (instructions, consistent nav, objectives, chunking) | §4.2, §4.5, §5.1 onboarding                                   |
| **Design for efficiency** (reachable info)                                                    | Library / search (§4.6)                                       |
| **Design for gamification** (challenges, scoreboards, points, levels, currency)               | Gamification, calibrated (§5.6)                               |


## **Appendix — token quick reference**

CSS  
:root {  
  / canvas &amp; surface /  
  -bg-canvas: F4F6F8;  
  -bg-surface: FFFFFF;  
  -bg-subtle: F8FAFC;  
  -border: E2E8F0;  
  -borderstrong: CBD5E1;

  / text /  
  -text-primary: 0F172A;  
  -text-secondary: 475569;  
  -text-muted: 94A3B8;

  / interactive /  
  -action: 006C4C;  
  -action-hover: 00523A;  
  -on-action: FFFFFF;

  / semantic (bg / text) /  
  -info-bg: E0F2FE;      -info-text: 0369A1;  
  -success-bg: E8F5E9;   -success-text: 006C4C;  
  -warning-bg: FEF3C7;   -warning-text: B45309;  
  -error-bg: FEE2E2;     -error-text: B91C1C;

  / radius /  
  -radius-sm: 4px;  
  -radius-md: 8px;  
  -radius-lg: 12px;  
  -radius-pill: 9999px;

  / spacing (8-pt) /  
  -space-1: 4px;  -space-2: 8px;  -space-3: 12px; -space-4: 16px;  
  -space-6: 24px; -space-8: 32px; -space-12: 48px; -space-16: 64px;

  / type /  
  -fontserif: 'Newsreader','Instrument Serif',serif;  
  -fontsans: 'Geist Sans','SF Pro Display',system-ui,sans-serif;  
  -fontmono: 'Geist Mono','JetBrains Mono',monospace;

  / elevation /  
  -shadow-hover: 0 2px 8px rgba(0,0,0,0.04);

  / motion /  
  -ease-out: cubic-bezier(0.16, 1, 0.3, 1);  
  -dur: 600ms;  
}  