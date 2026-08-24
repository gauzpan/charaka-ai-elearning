import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { prisma } from "@/lib/prisma";
import { requireOnboardedUser } from "@/lib/auth";

// Internal metrics view — the two MVP success metrics (design.md §10, PRD §10):
// "I'll use this at work" taps (ApplyIntent) and prompts kept (SavedPrompt).
// Gated behind requireOnboardedUser; deliberately NOT in the primary tab bar.
// Product-level totals across all users, not per-user, so it reads as a dashboard.
export const dynamic = "force-dynamic";

export const metadata = { title: "Metrics · Charaka AI" };

export default async function MetricsPage() {
  await requireOnboardedUser(); // gate: sign-in + onboarding required

  const [applyIntentCount, savedPromptCount, applyUsers, savedUsers, totalUsers] =
    await Promise.all([
      prisma.applyIntent.count(),
      prisma.savedPrompt.count(),
      prisma.applyIntent.findMany({ distinct: ["userId"], select: { userId: true } }),
      prisma.savedPrompt.findMany({ distinct: ["userId"], select: { userId: true } }),
      prisma.user.count({ where: { onboardedAt: { not: null } } }),
    ]);

  const metrics = [
    {
      label: "Apply intent",
      value: applyIntentCount,
      unit: "taps",
      users: applyUsers.length,
      note: '"I\'ll use this at work" taps on lesson recaps',
    },
    {
      label: "Saved prompts",
      value: savedPromptCount,
      unit: "kept",
      users: savedUsers.length,
      note: "prompts users chose to keep from a Try-it card",
    },
  ];

  return (
    <div className="mx-auto flex min-h-dvh max-w-[640px] flex-col gap-6 px-5 py-8">
      <div className="flex flex-col gap-1">
        <p className="font-mono text-[12px] uppercase tracking-wide text-muted">Internal · Metrics</p>
        <h1 className="text-2xl text-primary">Success signals</h1>
        <p className="text-secondary">
          The two capability signals we optimize for — real-world use, not screen time.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {metrics.map((m) => (
          <Card key={m.label} className="flex flex-col gap-2">
            <Tag tone="success">{m.label}</Tag>
            <span className="font-display text-4xl text-primary">
              {m.value.toLocaleString()}
            </span>
            <span className="font-mono text-[12px] uppercase tracking-wide text-muted">
              {m.unit} · {m.users.toLocaleString()}{" "}
              {m.users === 1 ? "user" : "users"}
            </span>
            <p className="text-sm text-secondary">{m.note}</p>
          </Card>
        ))}
      </div>

      <Card className="flex items-center justify-between gap-3 bg-subtle">
        <span className="text-sm text-secondary">Onboarded users</span>
        <span className="font-display text-2xl text-primary">
          {totalUsers.toLocaleString()}
        </span>
      </Card>

      <Link href="/today" className="font-mono text-[12px] text-action hover:text-action-hover">
        Back to Today
      </Link>
    </div>
  );
}
