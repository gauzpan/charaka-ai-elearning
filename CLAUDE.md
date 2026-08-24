# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A  workspace for **Charaka AI** — a mobile-first, workflow-first AI-literacy e-learning product for healthcare professionals (physicians, nurses, care coordinators, allied health). There is no application code yet; the deliverables so far are planning docs, and the trajectory is PRD → design system → prototype. The parent workspace (`../CLAUDE.md`) sets the PM coach/build-partner posture — Socratic first, sparring partner not cheerleader.

## Source-of-truth documents

Read these before writing any product, copy, or prototype content — do not restate the product from memory.

Product requirements are mentioned here and any future things should be grounded using the PRD - @PRD/prd-rethink-casestusy5.docx.md  

Design UX is described in the following file - @design/design.md

## Progress & session continuity

The canonical running progress log lives in the local Obsidian vault, **not** in git:
`obsidian-vault/Charaka-app/Charaka AI — Session Progress & Context.md`

- **At the start of a session**, read that vault file to recover context (decisions, milestone status, next action).
- **As work advances**, update that same vault file — tick milestones, bump the "Next action," record new decisions.
- The `obsidian-vault/` folder is gitignored and machine-local; never commit it or expect it on another machine.

## Gotchas

- 
- **No real patient data, ever.** The sandbox and all examples use synthetic/anonymized data only; handling is HIPAA-aware. This is a safety requirement, not a nicety.

## Design-system rules (any prototype must obey `design/design.md`)

These are hard constraints, not suggestions:

- **Fonts**: **Space Grotesk** for display/headings and the wordmark (modern geometric — chosen over the design doc's original serif per user direction), Geist Sans for UI/body, Geist Mono for meta/prompts. **Never use Inter, Roboto, or Open Sans.**
- **Logo**: the product mark is `web/public/charka-logo.jpg`. The header uses only its botanical emblem, framed via a CSS crop (`Brandmark` component) — the file's baked-in wordmark/tagline are cropped out.
- **Color**: warm monochrome canvas; emerald `#006C4C` is the *single* interactive accent; pastels are semantic-only (info/success/warning/error). No gradients, no neon. Use the CSS tokens from the design doc's appendix verbatim.
- **Elevation**: nearly flat — 1px borders, rest = no shadow, hover ≤ `0 2px 8px rgba(0,0,0,0.04)`. No shadow-md/lg/xl.
- **No emoji anywhere** in UI or copy. Icons are thicker-stroke monochrome (Phosphor/Radix).
- **Voice**: peer-to-peer, plain, specific. Banned copy: hype clichés ("elevate", "seamless", "unleash", "game-changer"), condescension, childish gamification.
- **Layout**: ≤ 5 primary nav destinations (Hick's Law); one primary action, one title, one progress signal per screen; mobile-first, one-handed, thumb-zone actions; honest time estimates; respect `prefers-reduced-motion`.
- Logo

**Safety &amp; Bounds**  


- **No "Placeholder" Logic:** Do not leave comments like `// implement logic here`. Implement it or ask for clarification.  

- **Context Conservation:** Do not read `package-lock.json` or huge generated files unless explicitly debugging dependencies.  


**Directness**  


- **No preamble.** Skip "great question", "you're right". Lead with the answer.  

- **Disagree up front.** If my plan or code is wrong, say so with the reason — first, not buried. Silence reads as agreement.  

- **Hold under pushback.** Restate your reasoning; only move on a new fact, not my tone.  

- **No false certainty.** Say "I'm not sure" when you aren't. Mark speculation, and flag memory vs. a file you just read.  


**Working Discipline**  
For any feature or non-trivial bug fix:  


- **Analyze** — Read the involved files and `/docs`. Use `context7` / web for unfamiliar libraries or APIs. Never guess at signatures.  

- **Surface concerns** — Call out any technical, product, or design issues or improvements you notice while analyzing.  

- **Propose a plan** — Concise, no code, brief rationale. If anything is unclear, ask first.  

- **Wait for "proceed"** — Do not start implementing until I say so explicitly. Trivial edits (typos, one-line tweaks, requests prefixed with "just" / "quick") may skip the plan.  


**Subagent Orchestration**  


- **Parallel by default.** Decompose independent work across subagents in one message; relay their conclusions, not their file dumps.  

- **Model to task.** Opus for judgment (design, debugging, review), Sonnet for mechanical (renames, scaffolding, single-file edits). In `ultracode`, never let Sonnet leak onto judgment stages (find/verify/design/synthesize).  

- **Lock the contract first.** Fix shared schemas/signatures and assign non-overlapping files before fanning out.  

- **Orchestrator stays lean.** Don't redo agents' work — integrate and verify once at the end.

