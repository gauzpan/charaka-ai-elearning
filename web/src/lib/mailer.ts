import "server-only";
import nodemailer from "nodemailer";

// Shared Gmail-SMTP sender, used by both the generic /api/send-email route
// and the auth flow's login-code email (lib/email.ts) — one transporter, one
// place that knows about EMAIL_USER/EMAIL_PASS.
//
// EMAIL_PASS must be a Gmail "App Password" (Google Account → Security →
// 2-Step Verification → App passwords), NOT the account's normal login
// password — Google blocks plain-password SMTP auth for virtually all
// accounts now. Generating one requires 2-Step Verification to be turned on.

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return transporter;
}

export function mailerConfigured(): boolean {
  return Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);
}

export async function sendMail(params: { to: string; subject: string; text: string; html?: string }): Promise<void> {
  await getTransporter().sendMail({
    from: process.env.EMAIL_USER,
    to: params.to,
    subject: params.subject,
    text: params.text,
    html: params.html,
  });
}
