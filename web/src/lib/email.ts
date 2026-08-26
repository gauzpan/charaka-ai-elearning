import "server-only";
import { sendMail, mailerConfigured } from "@/lib/mailer";

// Login-code delivery via Gmail SMTP (see lib/mailer.ts). Falls back to
// console-log when EMAIL_USER/EMAIL_PASS aren't set (local dev, CI), so
// local dev never needs real credentials. Once they're present, codes are
// actually emailed and never echoed back in the API response — see
// api/auth/request/route.ts.

export function emailDeliveryEnabled(): boolean {
  return mailerConfigured();
}

export async function sendLoginCodeEmail(email: string, code: string): Promise<void> {
  if (!emailDeliveryEnabled()) {
    console.log(`\n[auth] Login code for ${email}: ${code}\n`);
    return;
  }

  try {
    await sendMail({
      to: email,
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
    throw new Error(`Gmail send failed: ${message}`);
  }
}
