// Referral-loop share helpers. The shared link is the app's public site, UTM-
// tagged so referrals are attributable. A real per-user referral code arrives
// with accounts (M4); until then UTM campaign is the attribution.

function siteBase(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000")
  );
}

export function shareUrl(source: string): string {
  const u = new URL(siteBase());
  u.searchParams.set("utm_source", source);
  u.searchParams.set("utm_medium", "social");
  u.searchParams.set("utm_campaign", "lesson_share");
  return u.toString();
}

export function shareText(lessonTitle: string): string {
  return `I just completed "${lessonTitle}" on Charaka AI — building practical AI skills for clinical work.`;
}

export function linkedInHref(url: string): string {
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
}

export function xHref(text: string, url: string): string {
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
}
