// Pure helpers shared by the server (lib/analytics.ts) and client
// (lib/analyticsClient.ts) analytics wrappers. No "use client"/"server-only"
// directive here — this file must be importable from both.

export type DeviceType = "mobile" | "tablet" | "desktop" | "unknown";

/** Coarse device-type classification from a User-Agent string. Good enough
 *  for analytics segmentation — not a full UA-parsing library on purpose. */
export function deviceTypeFromUA(ua: string | null | undefined): DeviceType {
  if (!ua) return "unknown";
  if (/ipad|tablet(?!.*mobile)/i.test(ua)) return "tablet";
  if (/mobi|iphone|ipod|android.*mobile/i.test(ua)) return "mobile";
  return "desktop";
}
