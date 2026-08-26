"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
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
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [devCode, setDevCode] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      // Leave `verifying` true (and the full-screen loader up) through the
      // redirect itself — this page unmounts once the next route resolves,
      // so clearing it here would just flash the form back for an instant.
      router.push(data.redirect);
    } catch {
      setError("Something went wrong. Try again.");
      setVerifying(false);
    }
  }

  if (verifying) return <PageLoader />;

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
            A workflow-first AI learning coach for healthcare professionals — learn by doing, in
            two-minute rounds.
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
              {error && <p className="text-[15px] leading-[22px] text-error">{error}</p>}
            </form>
          </>
        ) : (
          <>
            <div className="flex w-full flex-col gap-1.5">
              <h2 className="text-h2 text-primary">Enter your code</h2>
              <p className="text-[15px] leading-[23px] text-secondary">
                We sent a 6-digit code to <span className="font-medium text-primary">{email}</span>.
                It expires in 10 minutes. In case, you do not see it in Inbox, check your Spam folder.
              </p>
            </div>

            {devCode && (
              <div className="w-full rounded-md border border-info-bg bg-info-bg/40 p-3">
                <Eyebrow>Dev mode — email not configured</Eyebrow>
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
              <Button type="submit" loading={verifying} disabled={code.length !== 6} className="w-full">
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
              <div style={{ textAlign: 'end', fontSize: '12px' }}> <span> Check Spam folder </span></div>
            </form>
          </>
        )}
      </main>
    </>
  );
}
