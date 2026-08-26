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
