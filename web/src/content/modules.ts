import type { Module, LockedModule, TryItCard } from "./types";

// --- Foundation: shared-core GenAI-literacy lessons (vault "Tier 1: Gen AI
// Foundation") that gate the flagship. Concept-led, no sandbox — that's the
// flagship's job. The last lesson here unlocks the research workflow track.
const foundation: Module = {
  id: "foundation",
  title: "Foundations",
  subtitle: "The shared core, before your role track.",
  kind: "foundation",
  lessons: [
    {
      id: "prompting-and-safety",
      title: "Prompting & safe sharing",
      minutes: 3,
      image: "/lessons/prompting-module/lesson1.png",
      cards: [
        {
          type: "objective",
          eyebrow: "Objective",
          payoff:
            "By the end you'll write a prompt that gets a usable answer, and know what never to paste in.",
          body: "Two habits underpin everything else in this track: asking well, and sharing safely.",
        },
        {
          type: "concept",
          eyebrow: "Concept",
          title: "A good prompt carries context, task, and constraints",
          points: [
            "Context: who it's for and the clinical situation.",
            "Task: the one thing you want back.",
            "Constraints: length, format, reading level, what to leave out.",
            "Vague in, vague out. The model can't read the chart you're picturing.",
          ],
        },
        {
          type: "goodVsBad",
          eyebrow: "Compare",
          title: "Same goal, two prompts",
          bad: {
            label: "Weak",
            text: "Summarize this article.",
          },
          good: {
            label: "Stronger",
            text: "Summarize this RCT for a busy clinician in 5 bullets: population, intervention, primary outcome with effect size, key limitation, and whether it changes first-line management.",
          },
          takeaway:
            "Name the reader, the structure, and the decision you're trying to make. The output stops being generic.",
        },
        {
          type: "concept",
          eyebrow: "Safety",
          title: "What never goes into a general AI tool",
          points: [
            "No real patient identifiers — name, MRN, DOB, dates, rare details that re-identify.",
            "De-identify or use synthetic stand-ins before you paste.",
            "You stay accountable for anything you act on. The model is a draft, not a decision.",
          ],
        },
        {
          type: "recapInvest",
          eyebrow: "Recap",
          title: "You've got the two habits",
          recap: [
            "Context + task + constraints beats a one-liner.",
            "De-identify before you paste — every time.",
          ],
          applyLine:
            "Bring a context-rich prompt to your next question. Next up: how clinical AI actually works.",
        },
      ],
    },
    {
      id: "ai-hierarchy",
      title: "The AI hierarchy in healthcare",
      minutes: 4,
      image: "/lessons/prompting-module/lesson2.png",
      cards: [
        {
          type: "objective",
          eyebrow: "Objective",
          payoff:
            "By the end you'll be able to name which kind of AI sits behind a clinical tool — and why that tells you how far to trust it.",
          body: "Clinical AI has moved from hardcoded rules to systems that generate new documentation. Knowing which is which sets your expectations.",
        },
        {
          type: "concept",
          eyebrow: "Concept",
          title: "Rules and patterns",
          points: [
            "Rule-based (traditional AI): explicit IF-THEN rules written by clinical experts — deterministic checks like drug-drug interaction alerts.",
            "Machine learning: finds statistical patterns in tabular data with no hardcoded rules — e.g. predicting 30-day readmission risk.",
          ],
        },
        {
          type: "concept",
          eyebrow: "Concept",
          title: "Neural nets and generation",
          points: [
            "Deep learning: multi-layered neural networks for complex, high-dimensional data — e.g. classifying skin lesions from clinical photos.",
            "Generative AI: trained on massive text and multimodal data to create new, context-aware content — e.g. summarizing a 7-day stay into a discharge summary.",
          ],
        },
        {
          type: "concept",
          eyebrow: "Knowledge check",
          title: "Which technology is at work?",
          points: [
            "An EHR flags hyperkalemia risk for a patient on spironolactone and lisinopril.",
            "A separate tool reads a shift of nursing notes and drafts an SBAR handoff.",
            "Which kind of AI powers each?",
          ],
        },
        {
          type: "concept",
          eyebrow: "Answer",
          title: "How it maps",
          points: [
            "The hyperkalemia alert: rule-based / traditional AI — a deterministic drug-interaction rule.",
            "The SBAR draft: generative AI — it synthesizes unstructured notes into new structured text.",
          ],
        },
        {
          type: "recapInvest",
          eyebrow: "Recap",
          title: "You can place any tool on the ladder",
          recap: [
            "Rule-based and ML answer fixed questions; deep learning and GenAI handle messy, high-dimensional input.",
            "Only GenAI generates new text — and that's the part that needs your review.",
          ],
          applyLine:
            "Next time a vendor says 'AI', ask which kind — it tells you how much to verify.",
        },
      ],
    },
    {
      id: "clinical-data-types",
      title: "Structured vs unstructured data",
      minutes: 4,
      image: "/lessons/prompting-module/lesson3.png",
      cards: [
        {
          type: "objective",
          eyebrow: "Objective",
          payoff:
            "By the end you'll spot which clinical data a tool can read straight from a database field and which needs AI to interpret.",
        },
        {
          type: "concept",
          eyebrow: "Concept",
          title: "Structured data",
          points: [
            "Standardized values in fixed database fields.",
            "Heart rate, WBC count, ICD-10 codes, medication dosage.",
            "Traditional ML and decision trees handle this well.",
          ],
        },
        {
          type: "concept",
          eyebrow: "Concept",
          title: "Unstructured data",
          points: [
            "Free text, continuous signals, or visual media with no rigid schema.",
            "Progress notes, ECG waveforms, MRI scans.",
            "This is where deep learning and language models earn their keep.",
          ],
        },
        {
          type: "motivationalInsight",
          eyebrow: "Why it matters",
          title: "The 80% you couldn't query",
          insight:
            "Roughly 80% of medical data is unstructured. Modern AI is what finally lets clinicians pull actionable insight from that previously hard-to-search majority.",
        },
        {
          type: "concept",
          eyebrow: "Knowledge check",
          title: "Name the data types",
          points: [
            "An intake record shows BP 88/56 mmHg, HR 122, temp 39.1°C.",
            "A note reads: 'patient lethargic, skin warm and flushed, productive cough for 3 days.'",
            "Which is structured, which is unstructured?",
          ],
        },
        {
          type: "concept",
          eyebrow: "Answer",
          title: "How it maps",
          points: [
            "The vitals are structured data — discrete numeric fields.",
            "The clinical note is unstructured data — free-form narrative.",
          ],
        },
        {
          type: "recapInvest",
          eyebrow: "Recap",
          title: "You can tell what a tool is reading",
          recap: [
            "Structured = fixed fields; unstructured = the narrative around them.",
            "GenAI's value is turning that narrative into something usable.",
          ],
          applyLine:
            "Notice how much of your day lives in unstructured notes — that's where AI can save you time.",
        },
      ],
    },
    {
      id: "reasoning-and-liability",
      title: "Reasoning, hallucinations & liability",
      minutes: 4,
      image: "/lessons/prompting-module/lesson4.png",
      cards: [
        {
          type: "objective",
          eyebrow: "Objective",
          payoff:
            "By the end you'll know why GenAI can sound confident and be wrong — and where accountability lands when it is.",
        },
        {
          type: "concept",
          eyebrow: "Concept",
          title: "Deterministic vs probabilistic",
          points: [
            "Deterministic systems give the exact same output for the same input, every time — like an eGFR formula.",
            "GenAI is probabilistic: it picks the most likely next words from training weights.",
            "That's why it can state incorrect facts with total confidence — hallucinations.",
          ],
        },
        {
          type: "concept",
          eyebrow: "Concept",
          title: "Human-in-the-loop, always",
          points: [
            "Clinical AI is built for augmentation, not automation.",
            "Every AI draft or flag must be reviewed, edited, and approved by a licensed professional.",
            "The rule: never sign an AI-generated note or order without active clinical validation.",
          ],
        },
        {
          type: "concept",
          eyebrow: "Knowledge check",
          title: "Who is responsible?",
          points: [
            "An ambient AI drafts a note saying 'no known drug allergies,' missing a penicillin anaphylaxis.",
            "The clinician signs it unread; the patient has a reaction.",
            "Where does liability land?",
          ],
        },
        {
          type: "concept",
          eyebrow: "Answer",
          title: "The accountability standard",
          points: [
            "The clinician is legally and professionally responsible.",
            "The AI is an unlicensed assistant — signing the note certifies that you verified it.",
          ],
        },
        {
          type: "recapInvest",
          eyebrow: "Recap",
          title: "You own the sign-off",
          recap: [
            "Probabilistic models trade certainty for fluency — verify before you trust.",
            "The signature is yours, and so is the accountability.",
          ],
          applyLine:
            "That's the foundation done — your research workflow track is now open.",
        },
      ],
    },
  ],
};

// --- Flagship: research / standards-of-care synthesis. Three lessons, each the
// locked 6-card shape. Grounded in PRD Module 2 lesson blocks.
const flagship: Module = {
  id: "research-synthesis",
  title: "Research & standards-of-care synthesis",
  subtitle: "Physician track — your first workflow.",
  kind: "flagship",
  lessons: [
    {
      id: "targeted-summary",
      title: "Ask AI for a targeted paper summary",
      minutes: 5,
      cards: [
        {
          type: "objective",
          eyebrow: "Objective",
          payoff:
            "By the end you'll turn a vague 'summarize this' into a summary aimed at a real clinical question.",
        },
        {
          type: "concept",
          eyebrow: "Concept",
          title: "Start from the decision, not the paper",
          points: [
            "Define the clinical question first: what would change your management?",
            "Ask the model to answer that question, using the paper as evidence.",
            "Request structure you can scan: population, effect size, limitation, applicability.",
          ],
        },
        {
          type: "goodVsBad",
          eyebrow: "Compare",
          title: "Two ways to ask about the same trial",
          bad: {
            label: "Weak",
            text: "Give me the key points of this paper.",
          },
          good: {
            label: "Stronger",
            text: "I'm deciding whether to add this drug for a 68-year-old with reduced-EF heart failure. From this paper: does it help that population, how large is the effect, and what's the main reason it might not apply to my patient?",
          },
          takeaway:
            "Anchor the summary to a patient and a decision. You get relevance and applicability, not a book report.",
        },
        {
          type: "motivationalInsight",
          eyebrow: "Why this matters",
          title: "This is already the most common physician use",
          insight:
            "Summarizing research and standards of care is the single most common physician AI use — nearly 40% report using it in their workflow, with strong expected growth.",
          source: "2026 AMA physician AI sentiment report",
        },
        {
          type: "tryIt",
          eyebrow: "Try it",
          title: "Aim a summary at a real question",
          prompt:
            "Rewrite the starter prompt so it targets a specific patient and decision, then run it against the synthetic abstract.",
          scenario:
            "Synthetic abstract: a randomized trial of an SGLT2 inhibitor vs placebo in adults with type 2 diabetes and CKD. No real patient data.",
          starterPrompt:
            "Summarize this trial in 5 bullets for a clinician deciding whether to start this drug in a 70-year-old with T2D and eGFR 40: population, primary outcome with effect size, one key limitation, and whether it applies to that patient.",
          taskId: "targeted-summary",
        },
        {
          type: "recapInvest",
          eyebrow: "Recap",
          title: "Summaries now answer a question",
          recap: [
            "Lead with the decision; the paper is evidence for it.",
            "Ask for applicability to your patient, not just findings.",
          ],
          applyLine: "Use this on the next paper a colleague forwards you.",
        },
      ],
    },
    {
      id: "compare-evidence",
      title: "Compare evidence across papers",
      minutes: 5,
      cards: [
        {
          type: "objective",
          eyebrow: "Objective",
          payoff:
            "By the end you'll have AI line up two studies side by side so the disagreement is obvious.",
        },
        {
          type: "concept",
          eyebrow: "Concept",
          title: "Force a structured comparison",
          points: [
            "Give the model both sources and one comparison frame.",
            "Ask for a table: design, population, effect size, risk of bias, applicability.",
            "Make it state where the studies disagree and why that might be.",
          ],
        },
        {
          type: "goodVsBad",
          eyebrow: "Compare",
          title: "Comparing two guidelines",
          bad: {
            label: "Weak",
            text: "Which of these two papers is better?",
          },
          good: {
            label: "Stronger",
            text: "Compare these two trials on the same question in a table: design, population, primary outcome and effect size, main limitation, and applicability to primary care. Then say where they disagree and which is more relevant to an outpatient setting.",
          },
          takeaway:
            "'Better' is unanswerable. A shared frame plus 'where do they disagree' surfaces the real tension.",
        },
        {
          type: "motivationalInsight",
          eyebrow: "Why this matters",
          title: "Comparison is where errors hide",
          insight:
            "A model will happily declare a winner even when the studies aren't comparable. Making it lay out the frame first is how you catch a false equivalence before it reaches a patient.",
        },
        {
          type: "tryIt",
          eyebrow: "Try it",
          title: "Put two trials in one frame",
          prompt:
            "Edit the starter prompt to demand a comparison table and an explicit disagreement line, then run it.",
          scenario:
            "Synthetic inputs: two abstracts on anticoagulation after a first unprovoked VTE — one favors extended therapy, one is neutral. No real patient data.",
          starterPrompt:
            "Compare these two trials in a table (design, population, primary outcome + effect size, main limitation, applicability to outpatient care). Then state plainly where they disagree and which better fits a low-bleeding-risk outpatient.",
          taskId: "compare-evidence",
        },
        {
          type: "recapInvest",
          eyebrow: "Recap",
          title: "You can make studies argue",
          recap: [
            "One comparison frame across both sources.",
            "Always ask where — and why — they disagree.",
          ],
          applyLine: "Use this next time two guidelines seem to conflict.",
        },
      ],
    },
    {
      id: "verify-before-use",
      title: "Verify before you use it",
      minutes: 4,
      cards: [
        {
          type: "objective",
          eyebrow: "Objective",
          payoff:
            "By the end you'll have a fast checklist for catching a confident-but-wrong AI synthesis.",
        },
        {
          type: "concept",
          eyebrow: "Concept",
          title: "Treat every synthesis as a draft to verify",
          points: [
            "Check citations exist and say what the model claims — models invent references.",
            "Spot-check the effect sizes and direction against the source.",
            "In emerging or ambiguous evidence, distrust a clean, confident answer.",
            "You are the human in the loop. Nothing goes to a patient unverified.",
          ],
        },
        {
          type: "goodVsBad",
          eyebrow: "Compare",
          title: "Accepting vs verifying an output",
          bad: {
            label: "Risky",
            text: "The summary cites three trials supporting it — good enough, I'll use it.",
          },
          good: {
            label: "Safe",
            text: "Two of the three citations are real and match; the third doesn't exist. I drop that claim and re-check the effect size against the source before I rely on it.",
          },
          takeaway:
            "A plausible citation is not a real one. Verify existence and content before the claim earns your trust.",
        },
        {
          type: "motivationalInsight",
          eyebrow: "Why this matters",
          title: "Verification is what protects your judgment",
          insight:
            "Physicians consistently rank accuracy, safety, and liability as top concerns with AI. A verification habit is what lets you use these tools without outsourcing the call that's yours to make.",
          source: "PRD user insights; 2026 AMA report",
        },
        {
          type: "tryIt",
          eyebrow: "Try it",
          title: "Make the model expose its own weak points",
          prompt:
            "Adjust the starter prompt to force the model to flag uncertainty and list what you should verify, then run it.",
          scenario:
            "Synthetic input: an AI-generated one-paragraph synthesis on a novel therapy with thin evidence. No real patient data.",
          starterPrompt:
            "Review this synthesis. List every claim that needs verifying, flag anything where the evidence is thin or emerging, and separate what's well-supported from what's speculative. Do not smooth over uncertainty.",
          taskId: "verify-before-use",
        },
        {
          type: "recapInvest",
          eyebrow: "Recap",
          title: "You've closed the loop",
          recap: [
            "Citations: check they exist and match.",
            "Ask the model to flag its own uncertainty before you rely on it.",
          ],
          applyLine:
            "Run this check on the next AI answer before it informs a real decision.",
        },
      ],
    },
  ],
};

export const modules: Module[] = [foundation, flagship];

export const lockedModules: LockedModule[] = [
  {
    id: "portal-drafts",
    title: "Patient-portal reply drafts",
    why: "Unlocks after you finish the research workflow.",
  },
  {
    id: "visit-notes",
    title: "Visit-note documentation",
    why: "Unlocks after you finish the research workflow.",
  },
  {
    id: "admin-agents",
    title: "Agents for admin workflows",
    why: "Advanced track — coming in a later release.",
  },
  {
    id: "build-with-ai",
    title: "Build with AI (MCP & tools)",
    why: "Advanced track — coming in a later release.",
  },
];

// --- Lookup helpers used by the player and journey map.
export function getModule(moduleId: string): Module | undefined {
  return modules.find((m) => m.id === moduleId);
}

export function getLesson(moduleId: string, lessonId: string) {
  const mod = getModule(moduleId);
  const lesson = mod?.lessons.find((l) => l.id === lessonId);
  if (!mod || !lesson) return undefined;
  return { module: mod, lesson };
}

/** Flat ordered list of every lesson, for "next lesson" and gating logic. */
export function allLessons() {
  return modules.flatMap((m) =>
    m.lessons.map((l) => ({ moduleId: m.id, lessonId: l.id, lesson: l, module: m })),
  );
}

/** Every Try-it sandbox task across the content — powers the Practice tab so the
 *  sandbox is reachable directly, not only inside a (gated) lesson. */
export function allTryItCards(): TryItCard[] {
  return modules.flatMap((m) =>
    m.lessons.flatMap((l) => l.cards.filter((c): c is TryItCard => c.type === "tryIt")),
  );
}

export function getTryItCard(taskId: string): TryItCard | undefined {
  return allTryItCards().find((c) => c.taskId === taskId);
}
