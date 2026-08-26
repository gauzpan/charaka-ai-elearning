import "server-only";

// Dummy mail sender — no third-party email provider is wired up. The code is
// always logged server-side and echoed in the request's API response, so
// sign-in works end-to-end for demos/dev without any real delivery. Swap
// this implementation for a real provider (Resend, SES, etc.) before any
// deployment that needs to reach real inboxes.

export function emailDeliveryEnabled(): boolean {
  return false;
}

export async function sendLoginCodeEmail(email: string, code: string): Promise<void> {
  console.log(`\n[auth] (dummy email) Login code for ${email}: ${code}\n`);
}
