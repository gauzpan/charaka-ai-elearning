import "server-only";
import { Resend } from "resend";

// Login-code delivery. Falls back to console-log (dev/local) when RESEND_API_KEY
// isn't set, so local dev and CI never need a real email provider. Once the key
// is present (Vercel prod/preview), codes are actually emailed and never echoed
// back in the API response — see api/auth/request/route.ts.

const FROM = process.env.EMAIL_FROM || "Charaka AI <onboarding@resend.dev>";

let client: Resend | null = null;
function resend(): Resend {
  if (!client) client = new Resend(process.env.RESEND_API_KEY);
  return client;
}

export function emailDeliveryEnabled(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export async function sendLoginCodeEmail(email: string, code: string): Promise<void> {
  if (!emailDeliveryEnabled()) {
    console.log(`\n[auth] Login code for ${email}: ${code}\n`);
    return;
  }

  const { error } = await resend().emails.send({
    from: FROM,
    to: email,
    subject: `${code} — your Charaka AI sign-in code`,
    text: `Your sign-in code is:\n\n${code}\n\nIt expires in 10 minutes. If you didn't request this, you can ignore it.`,
    html: `
      <p>Your Charaka AI sign-in code:</p>
      <p style="font-size:28px;font-weight:600;letter-spacing:0.1em;font-family:monospace">${code}</p>
      <p style="color:#666;font-size:13px">Expires in 10 minutes. If you didn't request this, you can ignore it.</p>
    `,
  });

  if (error) {
    // Surface as a thrown error so the route can 500 rather than silently
    // tell the user "check your email" when nothing was sent.
    throw new Error(`Resend send failed: ${error.message}`);
  }
}
