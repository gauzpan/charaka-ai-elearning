# **Charaka AI — Design System**

> **Charaka AI** takes its name from Charaka, the ancient physician-teacher regarded as a father of medicine — a fitting namesake for a platform that teaches clinicians a new kind of practice. The lowercase word "round(s)" is still used generically in this document as clinical-practice terminology (a "daily round," "this week's round") distinct from the brand name.


|                           |                                                                                            |
| :------------------------- | :------------------------------------------------------------------------------------------ |
| **Product**               | Workflow-first, psychologically informed AI-literacy platform for healthcare professionals |
| **Primary platform**      | Mobile-first (iOS / Android), responsive web as companion                                  |
| **Design language**       | Premium clinical editorialism — warm monochrome, layered tactile surfaces, soft dimensional depth            |
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

The visual system is **premium clinical editorialism**: the existing warm monochrome canvas, editorial serif, geometric sans, emerald action color, and semantic pastels remain unchanged. The interface evolves from nearly-flat utilitarian surfaces into a **calm, layered, tactile, soft-dimensional experience**.

Color remains scarce and meaningful. Dimensionality comes primarily from tonal separation, nested surfaces, soft light, subtle gradients derived from existing tokens, restrained blur, overlap, imagery, and motion — **not from introducing a new palette or decorating every component**.

The intended feeling is:

> **calm, credible, tactile, editorial, modern, and alive — never playful, glossy, noisy, or generic.**

The interface should feel like a thoughtfully composed clinical instrument with the warmth of an editorial product, rather than a conventional flat SaaS dashboard.

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


### **6.3 Spacing, composition &amp; layout grid**

Keep the 4px base and 8-point rhythm:

**4 · 8 · 12 · 16 · 24 · 32 · 48 · 64**

Spacing is not only separation; it is a hierarchy tool. Use generous macro-whitespace around primary content and tighter rhythm inside a composed module.

Mobile edge padding remains **16–20px**. Content column caps around **640px on web**.

**Composition rule: design screens as scenes, not as stacks of components.**

A typical mobile screen should contain a deliberate hierarchy:

1. **Atmospheric canvas** — subtle tonal or radial light using existing neutral/semantic colors at very low opacity.
2. **Primary content plane** — the dominant screen statement, next action, or key metric.
3. **Secondary modules** — supporting cards with different visual weights.
4. **Interactive layer** — pills, circular actions, progress controls, or floating navigation.
5. **Micro-content** — metadata, timestamps, counts, and supporting context.

Avoid mechanically repeating identical full-width cards down the screen.

Prefer compositions such as:

- one dominant card + two compact supporting cards
- a large metric followed by a visual progress module
- horizontal rails for browseable secondary content
- asymmetric bento groupings where the content benefits from comparison
- an editorial hero that blends image/illustration and action
- overlapping or nested controls where they clarify interaction

Every screen still follows the product principle of **one clear title, one primary action, and one visible progress signal**. Expressive composition must improve hierarchy, not create additional decisions.

### **6.4 Radius, borders, surfaces &amp; elevation**

The previous radius scale remains the base system:

- **Radius sm**: 4px — compact buttons, inputs, utility controls.
- **Radius md**: 8px — standard components and nested modules.
- **Radius lg**: 12px — large cards and primary content surfaces.
- **Radius pill**: 9999px — tags, filters, segmented controls, compact status indicators.

Do not make every component a giant rounded rectangle. Radius communicates hierarchy.

**Surface model**

Use tonal layering rather than a flat page containing identical white cards:

- **Canvas** — `--bg-canvas`, optionally with a barely perceptible radial light or semantic tint at opacity ≤ 0.06.
- **Primary surface** — `--bg-surface`.
- **Nested surface** — `--bg-subtle`.
- **Semantic surface** — existing semantic pastel backgrounds only when meaning supports their use.
- **Elevated interaction** — a control that needs to feel touchable or temporarily above its parent.

**Borders**

`--border` remains part of the system, but a 1px border is **not mandatory on every card**. Use borders where they improve separation, especially for:

- dense information surfaces
- inputs
- list rows
- sheets
- adjacent same-tone surfaces

When tonal contrast, nesting, or elevation already establishes the boundary, omit the border.

**Soft elevation**

Depth must be subtle, calm, and physically believable:

- Resting primary cards may have no shadow or an almost imperceptible ambient shadow.
- Elevated cards may use a diffuse shadow with low opacity and a large blur.
- Interactive elements can combine a soft outer shadow with a faint inner highlight.
- Pressed elements should visually compress or settle closer to the parent surface.
- Avoid dark, hard, or obviously "floating" shadows.
- Never stack multiple heavy shadows.

Depth should come from a combination of **tone + overlap + spacing + soft light + motion**, not shadow alone.

### **6.5 Atmospheric treatment &amp; imagery**

Do not introduce new brand colors.

Use the existing palette to create restrained atmosphere:

- `--bg-canvas` remains the dominant background.
- `--bg-surface` and `--bg-subtle` establish tonal planes.
- Existing info, success, warning, and error pastels may create soft contextual fields only when their semantic meaning remains intact.
- `--action` remains the single strong interactive accent.

Atmospheric treatments may include:

- soft radial light
- extremely low-opacity blurred fields
- a semantic tint fading into the canvas
- subtle texture or grain
- a low-contrast illustration partially embedded into a card

Background atmosphere must never reduce contrast or compete with clinical content.

**Imagery and illustration are first-class UX elements when they improve comprehension or motivation.**

Use:

- respectful, role-relevant photography
- desaturated, warm photography with subtle grain
- monochromatic continuous-line clinical/technical illustrations
- a single offset semantic pastel shape where appropriate
- editorial cropping
- image masks integrated into cards
- illustrations that support empty, milestone, onboarding, or learning moments

Avoid generic stock-photo rectangles. Images should participate in the composition and may extend to card edges or sit behind a readable content layer.

### **6.6 Iconography &amp; tactile controls**

Keep the thicker-stroke technical icon direction (Phosphor Bold/Fill or Radix) and standardized stroke weight.

Icons remain predominantly `--text-secondary`. Existing semantic pastel backgrounds may sit behind an icon when they communicate a state.

Prefer controls with a clear tactile identity:

- circular utility actions for singular icon tasks
- pill-shaped category filters
- compact segmented controls
- circular or rounded progress affordances
- one visually dominant primary action per screen

Avoid a screen full of identical rectangular buttons.

Selected controls should change through a combination of:

- fill or tonal plane
- contrast
- subtle elevation
- icon/text state
- restrained motion

Do not rely on color alone.

### **6.7 Motion &amp; state transitions**

Motion is **invisible until it is useful**. It should make the interface feel responsive, connected, and physically coherent.

Animate primarily:

- `transform`
- `opacity`

Also animate progress values when the implementation can do so accessibly without causing layout instability.

Motion patterns:

- **Screen/section entry**: small translateY (8–12px) + fade; do not animate every element equally.
- **Primary card reveal**: establish the main content first; supporting modules may follow with a restrained 60–80ms cascade.
- **Button press**: scale to approximately `0.98`, then return with a quick settle.
- **Pill selection**: background/indicator and content position should transition rather than jump.
- **Card advance**: outgoing content exits and incoming content enters as one connected state change.
- **Progress**: rings, bars, and segmented steps animate toward the new value rather than appearing instantaneously.
- **Navigation**: the active indicator should move or morph between destinations when technically appropriate.
- **Success/mastery**: one brief, restrained confirmation beat, then settle.

Default easing remains:

`cubic-bezier(0.16, 1, 0.3, 1)`

Default long entry duration remains approximately **600ms**, but direct interactions should feel substantially faster. Do not make users wait for animation.

Never use confetti storms, bouncing UI, continuous decorative motion, or motion that competes with reading. Respect `prefers-reduced-motion` and provide equivalent non-motion feedback.

### **6.7 Imagery &amp; illustration**

Monochromatic continuous-line ink sketches with a single offset pastel shape. Photography desaturated and warm, low-opacity grain, never oversaturated stock. Clinical imagery stays respectful and real. Backgrounds get depth from subtle texture/soft radial light at opacity ≤ 0.04, never flat-empty and never loud.

## **7 Component library**

Each component lists purpose  key states. Build once; reuse everywhere (Principle 10).


| Component                           | Purpose                                                 | Key states                                     |
| :----------------------------------- | :------------------------------------------------------- | :---------------------------------------------- |
| **Primary button**                  | The single action per screen                            | default / hover / pressed / disabled / loading |
| **Secondary / ghost button**        | Alternate action                                        | default / hover / disabled                     |
| **Card (base)**                     | Layered content surface; tonal boundary first, optional 1px border, soft depth | rest / pressed / selected / elevated |
| **Feature / hero card**             | Dominant editorial surface combining key action, visual context, and optional imagery | default / active / completed / loading |
| **Lesson card**                     | Entry to a microsession — title, minutes, progress visualization, contextual payoff | not-started / in-progress / complete / locked  |
| **Flashcard**                       | Two-sided recall                                        | front / flipped / known / review-again         |
| **Quiz item**                       | One question per screen                                 | unanswered / correct / incorrect / explanation |
| **Progress bar (segmented)**        | Steps in a session                                      | filled / current / upcoming                    |
| **Progress ring**                   | Lesson/module completion                                | 0–100%, complete                               |
| **Streak indicator**                | Daily consistency                                       | active / at-risk / frozen                      |
| **Competency badge**                | Mastery level per skill                                 | Aware / Practiced / Fluent / earned            |
| **Tag / status chip**               | Meta labels                                             | pastel-semantic, uppercase, 12px mono          |
| **Bottom tab bar**                  | Primary nav (5 max); may sit as a subtly elevated rounded surface when it improves focus | active / inactive / transitioning |
| **Session player**                  | Linear card runner                                      | top step-bar one primary action                |
| **List row**                        | Library/journey items                                   | default / pressed / locked                     |
| **Bottom sheet / modal**            | Focused sub-task                                        | open / closing; dismissible                    |
| **Toast**                           | Lightweight confirmation                                | success / info / error, auto-dismiss           |
| **Coach message**                   | Peer/expert thread bubble                               | sent / received / expert-verified              |
| **Sandbox console**                 | Prompt input model output                               | editing / running / result / safe-data notice  |
| **Empty / locked / offline states** | Recovery orientation                                    | see §5.3                                       |


**Composition rule:** a screen shows one primary action, one clear title, and one visible progress signal. The screen should be composed as a hierarchy of dominant and supporting surfaces rather than a uniform stack of cards. If a screen needs a second primary action, it needs to be two screens.

### **7.1 Modern mobile interaction patterns**

Use the following patterns selectively when they make a workflow clearer:

- **Editorial hero surfaces** for Today, onboarding, milestones, and high-value learning moments.
- **Asymmetric bento groups** for related metrics or options that benefit from scanning.
- **Horizontally scrollable rails** for categories, journeys, tools, or recommendations.
- **Pill filters and segmented controls** when users can browse a small set of visible options.
- **Circular utility actions** for focused icon-only tasks.
- **Visual progress modules** — rings, segmented bars, milestone maps, or compact data objects — instead of text-only completion status.
- **Floating or elevated navigation** when persistent navigation benefits from separation from scrolling content.
- **Bottom sheets** for focused secondary tasks without abandoning context.
- **Progressive disclosure** for advanced clinical or AI detail.
- **Contextual image/illustration cards** when visual context makes a concept faster to understand.

Do not apply every pattern to every screen. Modernity comes from deliberate composition and interaction, not from maximum decoration.

### **7.2 Anti-patterns**

Reject:

- generic white-card dashboards
- identical cards repeated in long vertical stacks
- every component having the same border, radius, and elevation
- decorative gradients without informational purpose
- semantic colors used as arbitrary decoration
- glass effects that reduce readability
- exaggerated 3D or glossy skeuomorphism
- heavy shadows
- tiny tap targets
- hidden critical actions behind gestures
- childish reward animations
- dense enterprise-table layouts on mobile
- motion added only because it looks "modern"

The target is **soft dimensionality with professional restraint**, not visual novelty for its own sake.

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

---

## **Appendix — modern interface style directive**

When implementing or generating new Charaka AI screens, preserve the existing tokens and follow this instruction:

> **Keep the Charaka AI color palette, typography, semantic meanings, and clinical credibility exactly as defined in this system. Do not introduce a new visual palette. Replace generic flat UI compositions with a calm, premium, soft-dimensional mobile experience built from layered tonal surfaces, restrained atmospheric light, varied card hierarchy, editorial composition, tactile pill/circular controls, contextual imagery, visual progress, progressive disclosure, and purposeful microinteractions.**
>
> **Design the whole screen as a composition, not as a vertical stack of isolated components. Use one dominant focal point, supporting modules with varied visual weight, and clear thumb-zone actions. Create depth through tone, nesting, overlap, subtle elevation, and motion rather than heavy shadows or excessive decoration.**
>
> **The result must remain adult, evidence-based, accessible, clinically credible, and efficient for time-poor healthcare professionals. The interface should feel calm, tactile, modern, editorial, and alive — never childish, glossy, noisy, generic, or like a conventional flat SaaS dashboard.**

### **Quick implementation checklist**

- [ ] Existing color tokens remain unchanged.
- [ ] Semantic pastel colors still communicate semantic meaning.
- [ ] `--action` remains the dominant interactive accent.
- [ ] Each screen has a clear dominant focal point.
- [ ] Supporting cards vary in hierarchy, density, or composition where useful.
- [ ] Depth comes from tonal layers, nesting, overlap, soft light, and subtle elevation.
- [ ] Borders are used intentionally, not automatically around every card.
- [ ] Primary actions are visually tactile and reachable in the thumb zone.
- [ ] Progress is visual whenever possible.
- [ ] Images/illustrations are integrated into the composition rather than dropped into generic rectangles.
- [ ] Motion communicates state change, causality, or feedback.
- [ ] Accessibility, contrast, reduced motion, and 44×44pt touch targets remain intact.
- [ ] The final screen does not resemble a generic white-card dashboard.
