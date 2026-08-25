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
    // --- Tier 2 (vault "clinical_ai_curriculum.md"): Generative AI, ambient
    // scribes, prompt engineering, and verification mechanics.
    {
      id: "llms-and-transformers",
      title: "LLMs and transformers in medicine",
      minutes: 4,
      cards: [
        {
          type: "objective",
          eyebrow: "Objective",
          payoff:
            "By the end you'll know why a long chart can make an LLM miss things buried in the middle — and how to work around it.",
        },
        {
          type: "concept",
          eyebrow: "Concept",
          title: "How the model reads text",
          points: [
            "Self-attention lets the model weigh the relationship between distant words in a sentence, not just neighboring ones.",
            "Text is broken into tokens — the context window is how much of that token stream the model can hold in one prompt.",
            "Foundation models are fine-tuned on medical corpora (PubMed, EHR notes) to learn clinical nomenclature and standard documentation formats.",
          ],
        },
        {
          type: "concept",
          eyebrow: "Knowledge check",
          title: "What went wrong here?",
          points: [
            "A clinician pastes a 40-page hospital course into an LLM and asks for a discharge summary.",
            "The output misses a surgical complication documented in the middle of the text.",
            "What technical limitation is most likely responsible?",
          ],
        },
        {
          type: "concept",
          eyebrow: "Answer",
          title: "How it maps",
          points: [
            "Context window saturation, or attention decay — the 'lost in the middle' phenomenon.",
            "Attention can dilute detail buried deep in a long input, even when it's technically inside the context window.",
          ],
        },
        {
          type: "recapInvest",
          eyebrow: "Recap",
          title: "You know where LLMs lose detail",
          recap: [
            "Self-attention connects distant words, but long inputs dilute that signal.",
            "The middle of a long document is the highest-risk place for a missed detail.",
          ],
          applyLine:
            "Split long charts into sections before summarizing, and check the middle first.",
        },
      ],
    },
    {
      id: "ambient-documentation",
      title: "Ambient clinical intelligence",
      minutes: 4,
      cards: [
        {
          type: "objective",
          eyebrow: "Objective",
          payoff:
            "By the end you'll know what ambient scribes actually do to a conversation before it becomes a note.",
        },
        {
          type: "concept",
          eyebrow: "Concept",
          title: "From conversation to chart",
          points: [
            "Ambient listening captures real-time, unstructured multi-party conversation in the exam room or at the bedside.",
            "The system filters out non-clinical dialogue and maps relevant findings into structured formats — SOAP notes, SBAR handoffs, discharge instructions.",
          ],
        },
        {
          type: "motivationalInsight",
          eyebrow: "Why it matters",
          title: "The time it gives back",
          insight:
            "Ambient documentation can cut after-hours EHR charting by 50-70%.",
          source: "Clinical AI curriculum, Module 2.2",
        },
        {
          type: "concept",
          eyebrow: "Knowledge check",
          title: "Where does this go in a SOAP note?",
          points: [
            "During a visit, a patient says: 'I've had a terrible migraine since Tuesday, and my cousin recommended feverfew, but it didn't help.'",
            "How should the ambient AI categorize this?",
          ],
        },
        {
          type: "concept",
          eyebrow: "Answer",
          title: "How it maps",
          points: [
            "Subjective (S) — chief complaint of migraine since Tuesday, plus a failed trial of an herbal supplement.",
            "It's what the patient reported, not an exam finding or a plan.",
          ],
        },
        {
          type: "recapInvest",
          eyebrow: "Recap",
          title: "You can predict what the scribe hears",
          recap: [
            "Ambient tools filter conversation into structured note sections.",
            "Anything the patient says about their own experience lands in Subjective.",
          ],
          applyLine:
            "Next ambient draft you review, check that patient-reported detail landed in the right section.",
        },
      ],
    },
    {
      id: "clinical-prompt-engineering",
      title: "Clinical prompt engineering",
      minutes: 5,
      cards: [
        {
          type: "objective",
          eyebrow: "Objective",
          payoff:
            "By the end you'll pick the right prompting technique for the task instead of writing every prompt the same way.",
        },
        {
          type: "concept",
          eyebrow: "Concept",
          title: "Three techniques, three jobs",
          points: [
            "Zero-shot: give the task with no examples — fast for simple, well-defined asks like a translation.",
            "Few-shot: give 1-3 examples of the output you want before asking — good for standardizing a note format.",
            "Chain-of-thought: ask the model to reason step by step before concluding — useful for complex triage or multi-factor decisions.",
          ],
        },
        {
          type: "goodVsBad",
          eyebrow: "Compare",
          title: "Rewriting post-op instructions",
          bad: {
            label: "Weak",
            text: "Rewrite this note for a patient.",
          },
          good: {
            label: "Stronger",
            text: "You are a cardiac nurse educator. Rewrite the following post-op discharge instructions for an adult patient reading at a 5th-grade level. Use short bullet points, avoid medical jargon, and highlight emergency red flags.",
          },
          takeaway:
            "The stronger prompt sets a role, an audience, a reading level, a format, and what to flag — that's what makes the output safer, not just shorter.",
        },
        {
          type: "recapInvest",
          eyebrow: "Recap",
          title: "You match the technique to the task",
          recap: [
            "Zero-shot for simple asks, few-shot to standardize format, chain-of-thought for multi-step reasoning.",
            "Role + audience + format + constraints beats a one-line instruction every time.",
          ],
          applyLine:
            "Next patient-facing rewrite, set the role and reading level explicitly.",
        },
      ],
    },
    {
      id: "hallucinations-and-omissions",
      title: "Hallucinations, omissions & verification",
      minutes: 4,
      cards: [
        {
          type: "objective",
          eyebrow: "Objective",
          payoff:
            "By the end you'll have a 3-step protocol for catching what an AI draft got wrong or left out.",
        },
        {
          type: "concept",
          eyebrow: "Concept",
          title: "Two different failure modes",
          points: [
            "Hallucination: the model generates plausible-sounding but factually fabricated information.",
            "Clinical omission: the model produces a well-structured plan but drops a contraindication or negative finding that was in the source.",
          ],
        },
        {
          type: "concept",
          eyebrow: "Concept",
          title: "The 3-step clinical review protocol",
          points: [
            "1. Cross-check vitals and numbers against the source.",
            "2. Audit allergies and negations — anything stated as absent or stopped.",
            "3. Assess clinical alignment — does the plan match what's actually in the chart.",
          ],
        },
        {
          type: "concept",
          eyebrow: "Knowledge check",
          title: "What went wrong here?",
          points: [
            "An AI discharge draft states: 'Patient tolerated Lisinopril 20 mg PO daily without adverse effects.'",
            "The actual chart shows Lisinopril was stopped on Day 2 for an intractable dry cough.",
            "What error occurred, and which step of the protocol catches it?",
          ],
        },
        {
          type: "concept",
          eyebrow: "Answer",
          title: "How it maps",
          points: [
            "Hallucination through omission — the draft states a fact contradicted by the record.",
            "Steps 1 and 3 catch it: matching active discharge orders against the final medication administration record before signing.",
          ],
        },
        {
          type: "recapInvest",
          eyebrow: "Recap",
          title: "You have a repeatable check",
          recap: [
            "Hallucination fabricates; omission drops something real.",
            "Vitals, allergies/negations, clinical alignment — in that order, every time.",
          ],
          applyLine: "Run the 3-step check on the next AI draft before you sign it.",
        },
      ],
    },
    // --- Tier 3 (vault "clinical_ai_curriculum.md"): predictive AI and
    // diagnostic decision support literacy — no checkpoint given for 3.2 in
    // the source, so that lesson closes without a knowledge check.
    {
      id: "predictive-analytics-early-warning",
      title: "Predictive analytics & early warning systems",
      minutes: 4,
      cards: [
        {
          type: "objective",
          eyebrow: "Objective",
          payoff:
            "By the end you'll know why a highly sensitive alert system can end up being ignored.",
        },
        {
          type: "concept",
          eyebrow: "Concept",
          title: "Catching risk before it happens",
          points: [
            "Early warning models analyze real-time EHR data — vitals, labs, demographics — to predict adverse events before they happen.",
            "Tuning a model to catch every potential case (high sensitivity) usually means more false alarms (lower specificity) — it's a trade-off, not a free win.",
          ],
        },
        {
          type: "concept",
          eyebrow: "Concept",
          title: "When alerts stop working",
          points: [
            "Alert fatigue: when a CDS system fires too many false positives, clinicians start habitually ignoring it.",
            "That's a safety risk in itself — a true alert can get dismissed along with the noise.",
          ],
        },
        {
          type: "concept",
          eyebrow: "Knowledge check",
          title: "What's happening here?",
          points: [
            "A hospital's AI sepsis alert flags 50 patients in week one; 48 are false alarms.",
            "By week three, clinicians stop opening the pop-ups entirely.",
            "What's happening, and what does it do to the alert's effectiveness?",
          ],
        },
        {
          type: "concept",
          eyebrow: "Answer",
          title: "How it maps",
          points: [
            "Alert fatigue — the high false-positive rate has conditioned staff to ignore the system.",
            "The predictive value is neutralized, whether or not the model itself is accurate.",
          ],
        },
        {
          type: "recapInvest",
          eyebrow: "Recap",
          title: "You can spot a fatigue risk",
          recap: [
            "Sensitivity and specificity trade off against each other — no model gets both for free.",
            "An ignored alert is as dangerous as a missed one.",
          ],
          applyLine:
            "Next CDS alert you see fire repeatedly, ask what its false-positive rate actually is.",
        },
      ],
    },
    {
      id: "computer-vision-diagnostics",
      title: "Computer vision in diagnostics",
      minutes: 3,
      cards: [
        {
          type: "objective",
          eyebrow: "Objective",
          payoff:
            "By the end you'll know what an AI is actually doing when it flags or reorders a scan for you.",
        },
        {
          type: "concept",
          eyebrow: "Concept",
          title: "Finding and bounding the anomaly",
          points: [
            "Image segmentation: deep learning models identify and draw exact boundaries around anomalies — for example, a tumor on an MRI.",
            "This is pixel-level output, not just a yes/no classification.",
          ],
        },
        {
          type: "concept",
          eyebrow: "Concept",
          title: "Reordering the worklist",
          points: [
            "Triage and prioritization: AI moves high-risk scans to the top of the radiologist's worklist for immediate human review.",
            "The model changes the order you see cases in — it doesn't make the call for you.",
          ],
        },
        {
          type: "recapInvest",
          eyebrow: "Recap",
          title: "You know what the model changed",
          recap: [
            "Segmentation draws the boundary; it doesn't diagnose.",
            "Triage reorders your queue; it doesn't remove a scan from human review.",
          ],
          applyLine:
            "When a scan jumps your queue, that's the triage model working as intended — read it like any other case.",
        },
      ],
    },
    // --- Tier 4 (vault "clinical_ai_curriculum.md"): bias, privacy, and
    // shadow AI. No checkpoint given for 4.1 in the source; the "Checkpoint
    // 4.1" scenario in the vault is Shadow-AI content, so it's placed on the
    // 4.2 lesson it actually matches.
    {
      id: "algorithmic-bias",
      title: "Algorithmic bias & representation",
      minutes: 3,
      cards: [
        {
          type: "objective",
          eyebrow: "Objective",
          payoff:
            "By the end you'll know the two places bias enters a clinical AI model before it ever reaches you.",
        },
        {
          type: "concept",
          eyebrow: "Concept",
          title: "Where bias comes from",
          points: [
            "Training data bias: if a model is trained mostly on one demographic, it will have a meaningfully higher error rate on underrepresented groups.",
            "Workflow bias: a model can reflect the structural biases already built into the healthcare system it was trained in — not just the data, the process.",
          ],
        },
        {
          type: "recapInvest",
          eyebrow: "Recap",
          title: "You know where to look",
          recap: [
            "A model's accuracy isn't uniform across patients unless its training data was.",
            "Bias can come from the workflow the data was captured in, not only the demographics in it.",
          ],
          applyLine:
            "Before trusting a model's output on an underrepresented patient, ask what population it was trained on.",
        },
      ],
    },
    {
      id: "privacy-hipaa-shadow-ai",
      title: "Privacy, HIPAA & shadow AI",
      minutes: 4,
      cards: [
        {
          type: "objective",
          eyebrow: "Objective",
          payoff:
            "By the end you'll know what 'shadow AI' is and why it's a compliance violation, not just a shortcut.",
        },
        {
          type: "concept",
          eyebrow: "Concept",
          title: "The risk of going around IT",
          points: [
            "Shadow AI: staff using unapproved, public AI tools to draft notes — actively violating privacy law by inputting Protected Health Information (PHI).",
            "Hospitals mitigate this with enterprise-secured cloud environments or local LLMs where data never leaves the firewall.",
          ],
        },
        {
          type: "concept",
          eyebrow: "Knowledge check",
          title: "What's happened here?",
          points: [
            "A physician copies a complex case — including the patient's age and zip code — into a free, public GenAI site to help generate a differential.",
            "What's happened here?",
          ],
        },
        {
          type: "concept",
          eyebrow: "Answer",
          title: "How it maps",
          points: [
            "A privacy violation via shadow AI.",
            "Age and zip code are enough to re-identify a patient in combination with other details — entering that into a public model exposes it to external servers you don't control.",
          ],
        },
        {
          type: "recapInvest",
          eyebrow: "Recap",
          title: "You know the line",
          recap: [
            "Public, general-purpose AI tools are not a safe destination for PHI — ever.",
            "Use only enterprise-approved, firewalled tools for anything with real patient detail.",
          ],
          applyLine:
            "Before you paste a case into any AI tool, check whether it's your institution's approved one.",
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
    // --- Tier 5 (vault "clinical_ai_curriculum.md"): AI for medical research
    // synthesis & evidence-based practice, merged onto the existing PRD-based
    // flagship lessons above.
    {
      id: "semantic-vs-keyword-search",
      title: "Semantic search vs keyword search",
      minutes: 4,
      cards: [
        {
          type: "objective",
          eyebrow: "Objective",
          payoff:
            "By the end you'll know why a semantic search tool finds papers a keyword search misses.",
        },
        {
          type: "concept",
          eyebrow: "Concept",
          title: "Two ways to search literature",
          points: [
            "Boolean/keyword search relies on exact term matches — it misses papers using alternative phrasing or synonyms.",
            "Semantic search converts abstracts into vector embeddings based on conceptual meaning, not exact words.",
          ],
        },
        {
          type: "concept",
          eyebrow: "Concept",
          title: "Why it matters for a literature review",
          points: [
            "Semantic search surfaces high-relevance papers across subspecialties without needing an exhaustive Boolean string.",
            "It speeds up the part of a review that used to mean guessing every synonym a paper might use.",
          ],
        },
        {
          type: "concept",
          eyebrow: "Knowledge check",
          title: "Why the gap?",
          points: [
            "A semantic search tool returns 85 highly relevant clinical trials on a topic; a strict keyword search on the same topic returns 12.",
            "Why the gap?",
          ],
        },
        {
          type: "concept",
          eyebrow: "Answer",
          title: "How it maps",
          points: [
            "Semantic understanding — vector embeddings map concepts and context, not exact character matches.",
            "The keyword search missed every paper that used different terminology for the same concept.",
          ],
        },
        {
          type: "recapInvest",
          eyebrow: "Recap",
          title: "You know which tool to reach for",
          recap: [
            "Keyword search is precise but brittle to phrasing.",
            "Semantic search trades some precision for recall across terminology.",
          ],
          applyLine:
            "Next literature search, try the semantic tool first if you suspect the topic has inconsistent terminology.",
        },
      ],
    },
    {
      id: "pico-extraction",
      title: "Automated PICO extraction",
      minutes: 4,
      cards: [
        {
          type: "objective",
          eyebrow: "Objective",
          payoff:
            "By the end you'll structure every evidence request around PICO instead of asking for a generic summary.",
        },
        {
          type: "concept",
          eyebrow: "Concept",
          title: "The framework",
          points: [
            "PICO: Population, Intervention, Comparison, Outcome.",
            "It's the frame that keeps a summary answerable and comparable across studies.",
          ],
        },
        {
          type: "concept",
          eyebrow: "Concept",
          title: "What AI can pull automatically",
          points: [
            "Specialized biomedical LLMs can parse trial PDFs to extract endpoints, sample sizes, and hazard ratios directly.",
            "That turns into comparative evidence tables across multiple RCTs in seconds, not an afternoon.",
          ],
        },
        {
          type: "concept",
          eyebrow: "Knowledge check",
          title: "What framework should they ask for?",
          points: [
            "A cardiologist asks an AI research assistant to summarize five recent multi-center trials comparing DOACs vs warfarin.",
            "What structured framework should they prompt the AI to use to keep the summary clinically rigorous?",
          ],
        },
        {
          type: "concept",
          eyebrow: "Answer",
          title: "How it maps",
          points: [
            "The PICO framework — it forces the same four fields out of every trial, which is what makes the five summaries comparable.",
          ],
        },
        {
          type: "recapInvest",
          eyebrow: "Recap",
          title: "You have a repeatable request shape",
          recap: [
            "PICO turns 'summarize these trials' into something structured and comparable.",
            "Ask for the same four fields every time you compare more than one study.",
          ],
          applyLine:
            "Next multi-trial question, ask for a PICO table before you ask for a narrative.",
        },
      ],
    },
    {
      id: "citation-verification",
      title: "Citation verification & phantom references",
      minutes: 4,
      cards: [
        {
          type: "objective",
          eyebrow: "Objective",
          payoff:
            "By the end you'll know why a citation that looks real can still be fabricated — and how to catch it.",
        },
        {
          type: "concept",
          eyebrow: "Concept",
          title: "Phantom citations",
          points: [
            "General-purpose LLMs frequently fabricate realistic-looking citations — real author names, plausible journal, fake DOI.",
            "A citation looking correct is not evidence that it exists.",
          ],
        },
        {
          type: "concept",
          eyebrow: "Concept",
          title: "The safeguard",
          points: [
            "Retrieval-Augmented Generation (RAG) connects the model directly to trusted databases, so claims are anchored to verified PMIDs.",
            "Verification standard: never cite or rely on an AI-generated reference without confirming the direct link or PubMed ID yourself.",
          ],
        },
        {
          type: "concept",
          eyebrow: "Knowledge check",
          title: "What happened here?",
          points: [
            "An AI-generated summary cites a 2024 NEJM paper, but the DOI actually links to an unrelated 2018 pediatric paper.",
            "What happened, and what technical safeguard should the tool have used?",
          ],
        },
        {
          type: "concept",
          eyebrow: "Answer",
          title: "How it maps",
          points: [
            "A hallucination — a phantom citation.",
            "The tool should be using Retrieval-Augmented Generation (RAG) to anchor claims to real, verifiable sources.",
          ],
        },
        {
          type: "recapInvest",
          eyebrow: "Recap",
          title: "You check the link, not the label",
          recap: [
            "A well-formatted citation can still be invented.",
            "Confirm the DOI or PMID resolves to the claim being made — every time, before you rely on it.",
          ],
          applyLine: "Next AI-cited claim, click through the DOI before you repeat it.",
        },
      ],
    },
    {
      id: "subspecialty-research-translation",
      title: "Subspecialty research translation",
      minutes: 4,
      cards: [
        {
          type: "objective",
          eyebrow: "Objective",
          payoff:
            "By the end you'll know what to ask for beyond the abstract when prepping a journal club or a bench-to-bedside translation.",
        },
        {
          type: "concept",
          eyebrow: "Concept",
          title: "Two translation jobs",
          points: [
            "Bench-to-bedside: turning basic science or pre-clinical discovery papers into actionable clinical takeaways.",
            "Automated journal club briefs: structured critiques that surface study limitations, statistical power, risk of bias, and external validity — not just the findings.",
          ],
        },
        {
          type: "concept",
          eyebrow: "Concept",
          title: "Cross-domain synthesis",
          points: [
            "AI can connect insights across fields that wouldn't normally cross a single specialist's reading list.",
            "That's useful for spotting relevant findings outside your subspecialty, but it raises the bar on verifying applicability.",
          ],
        },
        {
          type: "concept",
          eyebrow: "Knowledge check",
          title: "What should the AI analyze?",
          points: [
            "A neurology resident uses an AI tool to prep a 5-minute journal club presentation on a phase III stroke trial.",
            "Beyond the abstract, what should the AI be prompted to analyze for real-world clinical applicability?",
          ],
        },
        {
          type: "concept",
          eyebrow: "Answer",
          title: "How it maps",
          points: [
            "Limitations, risk of bias, and inclusion/exclusion criteria — external validity.",
            "The abstract tells you what was found; this tells you whether it applies outside the trial's population.",
          ],
        },
        {
          type: "recapInvest",
          eyebrow: "Recap",
          title: "You ask past the abstract",
          recap: [
            "A translation is only useful once you know its limits.",
            "Always ask for limitations, bias, and inclusion criteria alongside the findings.",
          ],
          applyLine:
            "Next journal club prep, ask the model for the limitations section before the summary.",
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
