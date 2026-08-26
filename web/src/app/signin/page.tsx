"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, buttonClasses } from "@/components/ui/Button";
import { AppBackground } from "@/components/bg/AppBackground";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PageLoader } from "@/components/ui/PageLoader";

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInContent />
    </Suspense>
  );
}

type Step = "email" | "code";

function SignInContent() {
  const router = useRouter();
  const params = useSearchParams();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [devCode, setDevCode] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(
    params.get("error") === "google" ? "Google sign-in didn't go through. Try again." : null,
  );

  async function requestCode() {
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/request", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError("Couldn't send a code. Try again.");
        return;
      }
      setDevCode(data.devCode ?? null);
      setCode("");
      setStep("code");
    } catch {
      setError("Couldn't send a code. Try again.");
    } finally {
      setSending(false);
    }
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    setVerifying(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError("That code is wrong or expired. Try again or resend.");
        setCode("");
        setVerifying(false);
        return;
      }
      setRedirecting(true);
      router.push(data.redirect);
    } catch {
      setError("Something went wrong. Try again.");
      setVerifying(false);
    }
  }

  function continueWithGoogle() {
    setRedirecting(true);
    window.location.href = "/api/auth/google/start";
  }

  if (redirecting || verifying) return <PageLoader />;

  return (
    <>
      <AppBackground />
      <main className="mx-auto flex min-h-dvh max-w-[440px] flex-col items-center justify-center gap-8 px-5 py-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <img
            src="/app-logo.webp"
            alt=""
            aria-hidden
            className="h-28 w-28 shrink-0 object-contain"
          />
          <h1 className="font-display text-4xl font-semibold tracking-tight text-primary">
            Charaka AI
          </h1>
          <p className="max-w-[320px] text-[16px] leading-[25px] text-secondary">
            Clinical intelligence, built for your next round.
          </p>
        </div>

        {step === "email" ? (
          <>
            <div className="flex w-full flex-col gap-1.5">
              <h2 className="text-h2 text-primary">Sign in</h2>
              <p className="text-[15px] leading-[23px] text-secondary">
                We&rsquo;ll email you a one-time code — no password. Your progress and saved
                prompts live in your account.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                requestCode();
              }}
              className="flex w-full flex-col gap-3"
            >
              <label htmlFor="email" className="text-label">
                Work email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@clinic.org"
                className="h-12 w-full rounded-sm border bg-surface px-4 text-base text-primary outline-none focus-visible:border-strong focus-visible:ring-2 focus-visible:ring-action"
              />
              <Button type="submit" loading={sending} className="w-full">
                Send code
              </Button>
            </form>

            <div className="flex w-full items-center gap-3 py-1" aria-hidden>
              <div className="h-px flex-1 bg-[var(--border)]" />
              <span className="text-meta text-muted">or</span>
              <div className="h-px flex-1 bg-[var(--border)]" />
            </div>

            <button
              type="button"
              onClick={continueWithGoogle}
              className={buttonClasses("ghost", "w-full")}
            >
              <GoogleIcon />
              Continue with Google
            </button>

            {error && <p className="text-[15px] leading-[22px] text-error">{error}</p>}
          </>
        ) : (
          <>
            <div className="flex w-full flex-col gap-1.5">
              <h2 className="text-h2 text-primary">Enter your code</h2>
              <p className="text-[15px] leading-[23px] text-secondary">
                We sent a 6-digit code to <span className="font-medium text-primary">{email}</span>.
                It expires in 10 minutes.
              </p>
            </div>

            {devCode && (
              <div className="w-full rounded-md border border-info-bg bg-info-bg/40 p-3">
                <Eyebrow>No email provider configured — showing the code directly</Eyebrow>
                <p className="mt-1 font-mono text-[20px] font-semibold tracking-[0.15em] text-info">
                  {devCode}
                </p>
              </div>
            )}

            <form onSubmit={verifyCode} className="flex w-full flex-col gap-3">
              <label htmlFor="code" className="text-label">
                6-digit code
              </label>
              <input
                id="code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
                maxLength={6}
                pattern="\d{6}"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                className="h-14 w-full rounded-sm border bg-surface px-4 text-center font-mono text-[24px] tracking-[0.3em] text-primary outline-none focus-visible:border-strong focus-visible:ring-2 focus-visible:ring-action"
              />
              <Button type="submit" disabled={code.length !== 6} className="w-full">
                Verify
              </Button>
              {error && <p className="text-[15px] leading-[22px] text-error">{error}</p>}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setStep("email");
                    setError(null);
                  }}
                  className="font-mono text-[14px] font-medium text-secondary hover:text-primary"
                >
                  Use a different email
                </button>
                <button
                  type="button"
                  onClick={() => requestCode()}
                  disabled={sending}
                  className="font-mono text-[14px] font-medium text-secondary hover:text-primary disabled:opacity-50"
                >
                  Resend code
                </button>
              </div>
            </form>
          </>
        )}
      </main>
    </>
  );
}

// Official Google "G" mark — a fixed multicolor brand asset, kept as-is
// rather than swapped for the app's monochrome icon set (design.md's icon
// rules govern this product's own iconography, not third-party brand marks).
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden focusable="false">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.13-.84 2.09-1.8 2.73v2.27h2.91c1.7-1.57 2.69-3.88 2.69-6.64Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.26c-.81.54-1.84.86-3.05.86-2.34 0-4.32-1.58-5.03-3.71H.96v2.33A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.71A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.71V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.04l3.01-2.33Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.96l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z"
      />
    </svg>
  );
}
