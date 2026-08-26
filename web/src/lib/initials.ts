// Two-letter initials from an email address (no name field in the schema).
// "john.doe@x" → "JD"; "newdoc@x" → "NE". Falls back gracefully — a
// passkey-only account may have no email at all.
export function initialsFromEmail(email: string | null): string {
  if (!email) return "CA"; // "Charaka AI" — generic mark for email-less accounts
  const local = (email.split("@")[0] || email).trim();
  const parts = local.split(/[._\-+]+/).filter(Boolean);
  const raw =
    parts.length >= 2 ? parts[0][0] + parts[1][0] : local.slice(0, 2) || "?";
  return raw.toUpperCase();
}
