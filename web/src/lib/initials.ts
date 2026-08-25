// Two-letter initials from an email address (no name field in the schema).
// "john.doe@x" → "JD"; "newdoc@x" → "NE". Falls back gracefully.
export function initialsFromEmail(email: string): string {
  const local = (email.split("@")[0] || email).trim();
  const parts = local.split(/[._\-+]+/).filter(Boolean);
  const raw =
    parts.length >= 2 ? parts[0][0] + parts[1][0] : local.slice(0, 2) || "?";
  return raw.toUpperCase();
}
