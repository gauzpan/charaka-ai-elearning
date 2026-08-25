/** Tiny classnames joiner — filters falsy values. Keeps deps at zero. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
