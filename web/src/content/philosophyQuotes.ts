// Today's closing line (design.md: microcopy carries the load). Real,
// verifiable quotes only from philosophers/physician-philosophers writing
// about medicine and care — no fabricated or misattributed lines (per
// CLAUDE.md: no invented quotes). Rotates once per day, not per render —
// deterministic from the date so server and client agree (no hydration
// mismatch) and it still changes daily, matching the app's daily-round habit
// loop (design.md §3.2).

export interface PhilosophyQuote {
  text: string;
  author: string;
}

export const PHILOSOPHY_QUOTES: PhilosophyQuote[] = [
  { text: "It is more important to know what sort of person has a disease than what sort of disease a person has.", author: "Hippocrates" },
  { text: "Wherever the art of medicine is loved, there is also a love of humanity.", author: "Hippocrates" },
  { text: "Natural forces within us are the true healers of disease.", author: "Hippocrates" },
  { text: "The good physician treats the disease; the great physician treats the patient who has the disease.", author: "William Osler" },
  { text: "Medicine is a science of uncertainty and an art of probability.", author: "William Osler" },
  { text: "The physician should not treat the disease but the patient who is suffering from it.", author: "Maimonides" },
  { text: "The art of medicine consists in amusing the patient while nature cures the disease.", author: "Voltaire" },
  { text: "The art of healing comes from nature, not from the physician.", author: "Paracelsus" },
];

/** Deterministic by calendar day (not per render) so SSR and the client
 * hydrate to the same text. */
export function todaysPhilosophyQuote(date: Date = new Date()): PhilosophyQuote {
  const dayIndex = Math.floor(date.getTime() / 86_400_000);
  const i = ((dayIndex % PHILOSOPHY_QUOTES.length) + PHILOSOPHY_QUOTES.length) % PHILOSOPHY_QUOTES.length;
  return PHILOSOPHY_QUOTES[i];
}
