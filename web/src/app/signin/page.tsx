"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button, buttonClasses } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { AppBackground } from "@/components/bg/AppBackground";
import { Eyebrow } from "@/components/ui/Eyebrow";

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInContent />
    </Suspense>
  );
}

type Status = "idle" | "sending" | "sent" | "error";

function SignInContent() {
  const linkError = useSearchParams().get("error") === "link";
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [devLink, setDevLink] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/auth/request", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        return;
      }
      setDevLink(data.devLink ?? null);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

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

        <div className="flex w-full flex-col gap-1.5">
          <h2 className="text-h2 text-primary">Sign in</h2>
          <p className="text-[15px] leading-[23px] text-secondary">
            We&rsquo;ll send a one-time link — no password. Your progress and saved prompts live
            in your account.
          </p>
        </div>

        {linkError && (
          <div className="w-full rounded-md border border-error-bg bg-error-bg/40 p-3">
            <p className="text-sm text-error">That link was invalid or expired. Request a new one.</p>
          </div>
        )}

        {status === "sent" ? (
          <Card className="flex w-full flex-col gap-3">
            <Tag tone="success">Link sent</Tag>
            <p className="text-secondary">
              {devLink
                ? "Dev mode: the link is in your server console. You can also open it directly:"
                : "Check your email for the sign-in link."}
            </p>
            {devLink && (
              <a href={devLink} className={buttonClasses("primary", "w-full")}>
                Open Email link
              </a>
            )}
            <button
              onClick={() => setStatus("idle")}
              className="font-mono text-[12px] font-medium text-secondary hover:text-primary"
            >
              Use a different email
            </button>
          </Card>
        ) : (
          <form onSubmit={submit} className="flex w-full flex-col gap-3">
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
            <Button type="submit" loading={status === "sending"} className="w-full">
              Send Email code
            </Button>
            {status === "error" && (
              <p className="text-sm text-error">Something went wrong. Try again.</p>
            )}
          </form>
        )}
      </main>
    </>
  );
}
