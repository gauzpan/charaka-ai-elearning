import "server-only";
import { XMLParser } from "fast-xml-parser";
import { prisma } from "@/lib/prisma";
import { FEED_SOURCES, isAiRelevant, isPaywalled, type FeedSource } from "@/lib/feedSources";

// AI Feed refresh (Resources -> AI Feed): fetches a curated RSS source list,
// keyword-filters to AI/GenAI/prompting coverage, dedupes, ranks by recency,
// and keeps the top FEED_SIZE. Called by the Vercel Cron job (see
// vercel.json + api/feed/refresh/route.ts). No LLM involved — the source's
// own short description is used as-is, never summarized or invented.

export const FEED_SIZE = 10;
const FETCH_TIMEOUT_MS = 10_000;
const MAX_DESCRIPTION_LENGTH = 240;
const MAX_TITLE_LENGTH = 300;

interface RawFeedItem {
  url: string;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  sourceName: string;
  publishedAt: Date;
}

export interface RefreshResult {
  ok: boolean;
  itemCount: number;
  sourceResults: { name: string; ok: boolean; found: number; error?: string }[];
}

export async function refreshFeed(): Promise<RefreshResult> {
  const sourceResults: RefreshResult["sourceResults"] = [];
  const candidates: RawFeedItem[] = [];

  for (const source of FEED_SOURCES) {
    try {
      const items = await fetchSource(source);
      candidates.push(...items);
      sourceResults.push({ name: source.name, ok: true, found: items.length });
    } catch (err) {
      sourceResults.push({
        name: source.name,
        ok: false,
        found: 0,
        error: err instanceof Error ? err.message : "unknown error",
      });
    }
  }

  // Dedupe by canonical URL (multiple sources can carry the same story) —
  // keep whichever copy is most recent.
  const byUrl = new Map<string, RawFeedItem>();
  for (const item of candidates) {
    const existing = byUrl.get(item.url);
    if (!existing || item.publishedAt > existing.publishedAt) byUrl.set(item.url, item);
  }

  const top = [...byUrl.values()]
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
    .slice(0, FEED_SIZE);

  // Never wipe a good cache over a transient failure (e.g. one source
  // temporarily blocking us) — only replace the table when this run actually
  // produced something. A genuinely thin week just yields fewer than 10.
  if (top.length > 0) {
    await prisma.$transaction([
      prisma.feedItem.deleteMany({}),
      prisma.feedItem.createMany({ data: top }),
    ]);
  }

  return { ok: top.length > 0, itemCount: top.length, sourceResults };
}

async function fetchSource(source: FeedSource): Promise<RawFeedItem[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  let xml: string;
  try {
    const res = await fetch(source.rssUrl, {
      signal: controller.signal,
      // A default Node fetch UA gets a bot-protection challenge page from
      // some publishers instead of the feed — a normal browser-shaped UA
      // does not (verified by hand against each source in FEED_SOURCES).
      headers: { "User-Agent": "Mozilla/5.0 (compatible; CharakaAIFeed/1.0)" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    xml = await res.text();
  } finally {
    clearTimeout(timeout);
  }

  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
  const parsed: unknown = parser.parse(xml);
  const rawItems = (parsed as Rss)?.rss?.channel?.item;
  const items = Array.isArray(rawItems) ? rawItems : rawItems ? [rawItems] : [];

  const out: RawFeedItem[] = [];
  for (const item of items) {
    const rawTitle = textOf(item.title);
    const rawDescription = textOf(item.description);
    const rawLink = textOf(item.link);
    const rawPubDate = textOf(item.pubDate);
    if (!rawTitle || !rawLink) continue;

    const { text: title } = cleanHtml(rawTitle);
    const { text: description, embeddedImageUrl } = cleanHtml(rawDescription);
    if (!title || isPaywalled(title)) continue;
    if (!isAiRelevant(title, description)) continue;

    const publishedAt = rawPubDate ? new Date(rawPubDate) : new Date();
    if (Number.isNaN(publishedAt.getTime())) continue;

    out.push({
      url: canonicalizeUrl(rawLink),
      title: title.slice(0, MAX_TITLE_LENGTH),
      description: description.slice(0, MAX_DESCRIPTION_LENGTH),
      thumbnailUrl: extractThumbnailUrl(item) ?? embeddedImageUrl,
      sourceName: source.name,
      publishedAt,
    });
  }
  return out;
}

// --- RSS shape (only the fields we read) -----------------------------------

interface RssItem {
  title?: unknown;
  description?: unknown;
  link?: unknown;
  pubDate?: unknown;
  enclosure?: { "@_url"?: string };
  "media:thumbnail"?: { "@_url"?: string };
  "media:content"?: { "@_url"?: string } | { "@_url"?: string }[];
}
interface Rss {
  rss?: { channel?: { item?: RssItem | RssItem[] } };
}

function textOf(v: unknown): string {
  if (typeof v === "string") return v;
  if (typeof v === "number") return String(v);
  return "";
}

function extractThumbnailUrl(item: RssItem): string | null {
  const thumb = item["media:thumbnail"]?.["@_url"];
  if (thumb) return thumb;
  const content = item["media:content"];
  const contentUrl = Array.isArray(content) ? content[0]?.["@_url"] : content?.["@_url"];
  if (contentUrl) return contentUrl;
  const enclosure = item.enclosure?.["@_url"];
  return enclosure ?? null;
}

// --- text cleanup ------------------------------------------------------------

/** Decodes HTML entities and, for descriptions with embedded markup (some
 * publishers wrap the excerpt in a <figure>/<img>), extracts the image
 * before stripping all tags down to plain text. */
function cleanHtml(raw: string): { text: string; embeddedImageUrl: string | null } {
  const decoded = decodeEntities(raw);
  const imgMatch = decoded.match(/<img[^>]*\bsrc=["']([^"']+)["']/i);
  const text = decoded.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return { text, embeddedImageUrl: imgMatch ? imgMatch[1] : null };
}

// Named entities beyond the XML-standard 5 (&amp; &lt; &gt; &quot; &apos;) that
// WordPress-based publishers (Healthcare Dive, and others) commonly emit in
// RSS descriptions — smart quotes, dashes, ellipsis.
const NAMED_ENTITIES: Record<string, string> = {
  nbsp: " ",
  rsquo: "’",
  lsquo: "‘",
  rdquo: "”",
  ldquo: "“",
  mdash: "—",
  ndash: "–",
  hellip: "…",
};

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#0?39;/g, "'")
    .replace(/&([a-z]+);/gi, (full: string, name: string) => NAMED_ENTITIES[name.toLowerCase()] ?? full)
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCharCode(Number(code)));
}

function canonicalizeUrl(raw: string): string {
  try {
    const u = new URL(raw.trim());
    u.search = "";
    u.hash = "";
    return u.toString();
  } catch {
    return raw.trim();
  }
}
