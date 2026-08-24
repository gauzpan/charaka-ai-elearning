// Content model for Charaka AI (design.md §4.3): Module → Lesson → Card.
// Content is typed TS (source of truth for the player), not a CMS or DB rows.
// The six card types map to the locked lesson shape:
// Objective → Concept → GoodVsBad → MotivationalInsight → TryIt → RecapInvest.

export type CardType =
  | "objective"
  | "concept"
  | "goodVsBad"
  | "motivationalInsight"
  | "tryIt"
  | "recapInvest";

interface BaseCard {
  type: CardType;
  /** Short mono eyebrow shown above the card body, e.g. "Objective". */
  eyebrow: string;
}

export interface ObjectiveCard extends BaseCard {
  type: "objective";
  /** "By the end you'll be able to ___ in your work." (design.md §4.5) */
  payoff: string;
  body?: string;
}

export interface ConceptCard extends BaseCard {
  type: "concept";
  title: string;
  /** One idea per card — bullet points, not paragraphs (design.md §3.4). */
  points: string[];
}

export interface GoodVsBadCard extends BaseCard {
  type: "goodVsBad";
  title: string;
  bad: { label: string; text: string };
  good: { label: string; text: string };
  /** Why the good one is better — the transferable rule. */
  takeaway: string;
}

export interface MotivationalInsightCard extends BaseCard {
  type: "motivationalInsight";
  title: string;
  /** A real-world fact/stat that motivates (design.md §5.1 Insights). */
  insight: string;
  source?: string;
}

export interface TryItCard extends BaseCard {
  type: "tryIt";
  title: string;
  prompt: string; // description of the task; live sandbox is M3
  /** The synthetic scenario the practice runs against (no real patient data). */
  scenario: string;
  /** Pre-filled editable prompt handed to the sandbox in M3. */
  starterPrompt: string;
  /** M2 renders a static handoff stub; M3 wires the live console. */
  taskId: string;
}

export interface RecapInvestCard extends BaseCard {
  type: "recapInvest";
  title: string;
  recap: string[];
  /** The "use this in your next note" payoff line. */
  applyLine: string;
}

export type Card =
  | ObjectiveCard
  | ConceptCard
  | GoodVsBadCard
  | MotivationalInsightCard
  | TryItCard
  | RecapInvestCard;

export interface Lesson {
  id: string;
  title: string;
  /** Honest estimate shown before start (design.md §4.4). */
  minutes: number;
  cards: Card[];
  /**
   * Optional shareable summary image (path under /public), shown on the
   * lesson-complete screen and offered to native share. Add more by dropping a
   * file in public/lessons and pointing here.
   */
  image?: string;
}

export interface Module {
  id: string;
  title: string;
  subtitle: string;
  kind: "foundation" | "flagship";
  lessons: Lesson[];
}

/** Future modules shown as locked cards (not built) — design.md §5.3. */
export interface LockedModule {
  id: string;
  title: string;
  why: string;
}
