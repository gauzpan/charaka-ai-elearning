import "server-only";
import { MailtrapClient } from "mailtrap";

// Login-code delivery. Falls back to console-log (dev/local) when
// MAILTRAP_API_TOKEN isn't set, so local dev and CI never need a real email
// provider. Once the token is present (Vercel prod/preview), codes are
// actually emailed and never echoed back in the API response — see
// api/auth/request/route.ts.
//
// Note: Mailtrap's production Sending API (used here) requires a verified
// domain in the Mailtrap dashboard (Sending → Domains), same as any
// transactional email provider — EMAIL_FROM must be an address on that
// domain. Mailtrap's "sandbox" mode is a separate, non-production feature
// that only delivers to Mailtrap's own test inbox, not a real recipient, so
// it isn't useful for a real magic-code flow and isn't wired up here.

const FROM_NAME = "Charaka AI";

let client: MailtrapClient | null = null;
function mailtrap(): MailtrapClient {
  if (!client) client = new MailtrapClient({ token: process.env.MAILTRAP_API_TOKEN! });
  return client;
}

export function emailDeliveryEnabled(): boolean {
  return Boolean(process.env.MAILTRAP_API_TOKEN);
}

export async function sendLoginCodeEmail(email: string, code: string): Promise<void> {
  if (!emailDeliveryEnabled()) {
    console.log(`\n[auth] Login code for ${email}: ${code}\n`);
    return;
  }

  // const fromEmail = process.env.EMAIL_FROM;
  // if (!fromEmail) {
  //   throw new Error("EMAIL_FROM is not set — required whenever MAILTRAP_API_TOKEN is set");
  // }

  try {
    await mailtrap().send({
      from: { name: FROM_NAME, email: 'hello@demomailtrap.co' },
      to: [{ email }],
      subject: `${code} — your Charaka AI sign-in code`,
      text: `Your sign-in code is:\n\n${code}\n\nIt expires in 10 minutes. If you didn't request this, you can ignore it.`,
      html: `
        <p>Your Charaka AI sign-in code:</p>
        <p style="font-size:28px;font-weight:600;letter-spacing:0.1em;font-family:monospace">${code}</p>
        <p style="color:#666;font-size:13px">Expires in 10 minutes. If you didn't request this, you can ignore it.</p>
      `,
    });
  } catch (err) {
    // Surface as a thrown error so the route can 500 rather than silently
    // tell the user "check your email" when nothing was sent.
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Mailtrap send failed: ${message}`);
  }
}
