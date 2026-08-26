// AI Feed source list (Resources -> AI Feed). Curated, not exhaustive — each
// entry was verified by hand to (a) serve real RSS/XML over a plain fetch
// (several health-tech outlets front their RSS behind bot-protection that
// blocks a server-side fetch entirely — MobiHealthNews, Healthcare IT News,
// MedCity News, HIMSS, and Chief Healthcare Executive were tried and dropped
// for exactly this reason), (b) carry a real, direct article URL and a short
// description, not a redirect wrapper (Google News RSS was tried and
// dropped: its <link> is an obfuscated Google redirect and its <description>
// just re-wraps that same link, so it can satisfy neither "short
// description" nor "redirect to the main article"), and (c) actually yield
// real editorial articles, not gated/sponsored listings — Fierce Healthcare
// was tried and dropped for this reason: its main rss.xml is dominated by
// `/premium/webinar/` and `/sponsored/` listings (whose "description" is
// scraped calendar metadata, not prose), and its alternate homepage feed
// turned out to be stale, serving articles from roughly a decade ago.
export interface FeedSource {
  name: string;
  rssUrl: string;
}

export const FEED_SOURCES: FeedSource[] = [
  { name: "STAT News", rssUrl: "https://www.statnews.com/category/health-tech/feed/" },
  { name: "Healthcare Dive", rssUrl: "https://www.healthcaredive.com/feeds/news/" },
  { name: "HealthTech Magazine", rssUrl: "https://healthtechmagazine.net/rss.xml" },
];

// Word-boundary tokens (short enough that a plain substring match would false
// -positive — e.g. "ai" is a substring of "training", "maintain", "detail").
const WORD_BOUNDARY_TERMS = [/\bai\b/i, /\bgenai\b/i, /\bllm\b/i, /\bllms\b/i];

// Longer phrases where a plain substring match is safe.
const SUBSTRING_TERMS = [
  "artificial intelligence",
  "generative ai",
  "machine learning",
  "large language model",
  "chatbot",
  "chatgpt",
  "copilot",
  "prompting",
  "prompt engineering",
];

/** Is this item genuinely about AI/GenAI/prompting? (Sources are already
 * healthcare-vertical publications, so an AI-topic match alone is enough —
 * no separate "healthcare" check needed.) */
export function isAiRelevant(title: string, description: string): boolean {
  const text = `${title} ${description}`;
  if (WORD_BOUNDARY_TERMS.some((re) => re.test(text))) return true;
  const lower = text.toLowerCase();
  return SUBSTRING_TERMS.some((term) => lower.includes(term));
}

/** STAT's "STAT+:" prefix marks a paywalled article — exclude so no card
 * dead-ends at a paywall (design.md: honest, never a dead end). */
export function isPaywalled(title: string): boolean {
  return /^stat\+/i.test(title.trim());
}

// Topic taxonomy for the Today carousel's category pill. Deterministic
// keyword matching, not an LLM guess — every category assignment is
// reviewable from the rule that produced it, so the pill never presents an
// invented judgment about a real article. Order matters: first match wins,
// most specific rules first, "AI in Healthcare" is the honest fallback for
// anything that doesn't hit a more specific bucket (this is still literally
// true of every item in the feed, since isAiRelevant already gated it).
export const FEED_CATEGORIES = [
  "Research & Evidence",
  "Policy & Regulation",
  "Diagnostics & Imaging",
  "Clinical Documentation",
  "Patient Experience",
  "Clinical Practice",
  "Health IT & Operations",
  "AI in Healthcare",
] as const;
export type FeedCategory = (typeof FEED_CATEGORIES)[number];

const CATEGORY_RULES: [FeedCategory, RegExp][] = [
  ["Research & Evidence", /\bresearch\b|\bstudy\b|\bstudies\b|\btrial\b|\bevidence\b|\bpaper\b|\bjournal\b|publication/i],
  ["Policy & Regulation", /\bfda\b|regulat|\bpolicy\b|compliance|lawsuit|\blaw\b|congress/i],
  ["Diagnostics & Imaging", /diagnos|imaging|radiolog|\bscan\b|screening/i],
  ["Clinical Documentation", /documentation|charting|\bnote\b|\bnotes\b|\behr\b|\bemr\b|ambient|transcri/i],
  ["Patient Experience", /patient experience|patient communication|\bportal\b|patient engagement/i],
  ["Clinical Practice", /autonomy|\bclinician\b|\bclinicians\b|workforce|burnout|\bethic/i],
  ["Health IT & Operations", /infrastructure|cybersecurity|\bsoc\b|\bsecurity\b|interoperab|workflow|operations|revenue cycle|\bclaims\b|prior authorization|outsourc/i],
];

/** Deterministic topic classification for the category pill. Checks the
 * title alone first — a passing mention in the description (e.g. "Epic now
 * connects with medical imaging, analytics, AI...") shouldn't outrank what
 * the headline itself says the article is actually about. Only falls back
 * to title+description if nothing in the title matches. */
export function categoryFor(title: string, description: string): FeedCategory {
  for (const [category, pattern] of CATEGORY_RULES) {
    if (pattern.test(title)) return category;
  }
  const combined = `${title} ${description}`;
  for (const [category, pattern] of CATEGORY_RULES) {
    if (pattern.test(combined)) return category;
  }
  return "AI in Healthcare";
}

/** Category -> semantic Tag tone (design.md §7: color is scarce, meaning
 * -only). Several categories share a tone deliberately — the pill's text is
 * what differentiates categories, tone is just a coarse family grouping. No
 * category maps to "error" since none represent something wrong. */
export const CATEGORY_TONE: Record<FeedCategory, "info" | "success" | "warning" | "neutral"> = {
  "Research & Evidence": "info",
  "Policy & Regulation": "warning",
  "Diagnostics & Imaging": "success",
  "Clinical Documentation": "success",
  "Patient Experience": "info",
  "Clinical Practice": "neutral",
  "Health IT & Operations": "neutral",
  "AI in Healthcare": "neutral",
};
