// Deterministic client-side prompt rubric (design/build-plan Phase 6). No LLM:
// four heuristic checks over the user's prompt text, each with a one-line tip.
// This is coaching on how they ASK — instant, offline, and reproducible.

export interface RubricDimension {
  key: string;
  label: string;
  pass: boolean;
  tip: string;
}

export interface RubricResult {
  dimensions: RubricDimension[];
  score: number; // passes, 0–4
}

interface Check {
  key: string;
  label: string;
  test: RegExp;
  passTip: string;
  failTip: string;
}

const CHECKS: Check[] = [
  {
    key: "clinicalQuestion",
    label: "Clinical question",
    test: /\b(decid\w*|should|whether|patient|year[- ]old|\d+\s*yo\b|first[- ]line|manage\w*|start\b|initiat\w*|my patient)\b|\?/i,
    passTip: "Anchored to a real decision.",
    failTip: "Name the patient and the decision you're trying to make.",
  },
  {
    key: "evidenceFraming",
    label: "Evidence framing",
    test: /\b(population|effect size|primary outcome|outcome|limitation|applicab\w*|compare|comparison|evidence|sample|risk of bias|design|absolute risk|number needed)\b/i,
    passTip: "Asks for structured evidence.",
    failTip: "Ask for population, effect size, and the main limitation.",
  },
  {
    key: "verificationDemand",
    label: "Verification",
    test: /\b(verify|verif\w*|check|cross[- ]check|citation|cite|source|confirm|accurate|accuracy|validate)\b/i,
    passTip: "Requests something to verify.",
    failTip: "Ask what you should verify before relying on it.",
  },
  {
    key: "uncertaintyFlag",
    label: "Uncertainty",
    test: /\b(uncertain\w*|confidence|caveat|gap|gaps|emerging|assumption|flag|thin evidence|speculat\w*|do not smooth|weak\w*)\b/i,
    passTip: "Prompts for uncertainty.",
    failTip: "Ask the model to flag gaps or low-confidence claims.",
  },
];

export function evaluatePrompt(text: string): RubricResult {
  const dimensions = CHECKS.map((c) => {
    const pass = c.test.test(text);
    return { key: c.key, label: c.label, pass, tip: pass ? c.passTip : c.failTip };
  });
  return { dimensions, score: dimensions.filter((d) => d.pass).length };
}
