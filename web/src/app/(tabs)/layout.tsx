import Link from "next/link";
import { TabBar } from "@/components/nav/TabBar";
import { Brandmark } from "@/components/nav/Brandmark";
import { SkillBadge } from "@/components/nav/SkillBadge";
import { ThemeToggle } from "@/components/nav/ThemeToggle";
import { AppBackground } from "@/components/bg/AppBackground";
import { requireOnboardedUser } from "@/lib/auth";
import { initialsFromEmail } from "@/lib/initials";

/**
 * App shell for the primary tabs. Mobile-first: a single ≤640px column,
 * a quiet top bar, a scrolling main, and the persistent bottom tab bar.
 * The ambient background (design/app-bg.html) sits behind the column; header
 * and tab bar are frosted so it reads through while nav stays legible.
 */
export default async function TabsLayout({ children }: { children: React.ReactNode }) {
  const user = await requireOnboardedUser(); // gate: sign-in required, onboarding required
  const initials = initialsFromEmail(user.email);
  return (
    <>
      <AppBackground />
      <div className="mx-auto flex min-h-dvh max-w-[640px] flex-col">
        <header className="flex items-center justify-between gap-2 border-b bg-surface/80 px-5 py-3 backdrop-blur">
          <Link href="/today" aria-label="Charaka AI — Today">
            <Brandmark />
          </Link>
          <div className="flex items-center gap-2">
            <SkillBadge />
            <ThemeToggle />
            <Link
              href="/progress"
              aria-label={user.email ? `Signed in as ${user.email}` : "Your profile"}
              title={user.email ?? undefined}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-pill border bg-subtle font-sans text-[12px] font-semibold uppercase text-secondary hover:text-primary"
            >
              {initials}
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-5 pb-6 pt-5">{children}</main>

        <TabBar />
      </div>
    </>
  );
}
