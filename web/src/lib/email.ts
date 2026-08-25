import "server-only";
import { Resend } from "resend";

// Magic-link delivery. Falls back to console-log (dev/local) when RESEND_API_KEY
// isn't set, so local dev and CI never need a real email provider. Once the key
// is present (Vercel prod/preview), links are actually emailed and never echoed
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

export async function sendMagicLinkEmail(email: string, link: string): Promise<void> {
  if (!emailDeliveryEnabled()) {
    console.log(`\n[auth] Magic link for ${email}:\n${link}\n`);
    return;
  }

  const { error } = await resend().emails.send({
    from: FROM,
    to: email,
    subject: "Sign in to Charaka AI",
    text: `Sign in with this link (expires in 15 minutes):\n\n${link}\n\nIf you didn't request this, you can ignore it.`,
    html: `
      <p>Tap below to sign in to Charaka AI. This link expires in 15 minutes.</p>
      <p><a href="${link}">Sign in to Charaka AI</a></p>
      <p style="color:#666;font-size:13px">If you didn't request this, you can ignore it.</p>
    `,
  });

  if (error) {
    // Surface as a thrown error so the route can 500 rather than silently
    // tell the user "check your email" when nothing was sent.
    throw new Error(`Resend send failed: ${error.message}`);
  }
}
