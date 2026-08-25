// Server-authoritative SYNTHETIC research context per Try-it task. Keyed by the
// TryItCard.taskId in src/content/modules.ts. Everything here is fictional — no
// real patient data ever enters the sandbox (design.md §9, hard requirement).

interface PracticeContext {
  title: string;
  abstract: string;
}

const CONTEXTS: Record<string, PracticeContext> = {
  "targeted-summary": {
    title: "Synthetic RCT — SGLT2 inhibitor in T2D with CKD",
    abstract:
      "SYNTHETIC ABSTRACT (fictional, no real patient data). A randomized, double-blind trial enrolled 4,210 adults with type 2 diabetes and CKD (eGFR 25–60) to an SGLT2 inhibitor vs placebo. Over a median 2.6 years, the primary composite (sustained eGFR decline ≥40%, ESKD, or renal death) occurred in 9.2% vs 13.8% (HR 0.64, 95% CI 0.53–0.77). Genital mycotic infections were more common with treatment (6.1% vs 2.0%). Patients over 75 and those with eGFR <30 were under-represented.",
  },
  "compare-evidence": {
    title: "Synthetic — two trials on extended anticoagulation after unprovoked VTE",
    abstract:
      "SYNTHETIC INPUTS (fictional). Trial A: 1,410 patients after a first unprovoked VTE randomized to extended DOAC vs placebo; recurrent VTE 2.1% vs 7.8% over 18 months (HR 0.26), major bleeding 1.3% vs 0.6%. Trial B: 980 patients, similar design; recurrent VTE 3.4% vs 4.9% (HR 0.71, 95% CI 0.44–1.14, ns), major bleeding 2.1% vs 0.8%. Trial A excluded high-bleeding-risk patients; Trial B did not.",
  },
  "verify-before-use": {
    title: "Synthetic — AI-generated synthesis on a novel therapy",
    abstract:
      "SYNTHETIC AI-GENERATED SYNTHESIS (fictional). 'Compound X reduces 30-day readmission in acute heart failure by 42% (Chen 2025), is well tolerated, and is now first-line per the 2025 guideline update.' The evidence base is described as three small single-center studies; effect sizes and confidence intervals are not given; one cited reference does not exist.",
  },
};

export function getPracticeContext(taskId: string): PracticeContext | null {
  return CONTEXTS[taskId] ?? null;
}
