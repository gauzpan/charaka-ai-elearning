import Link from "next/link";
import { notFound } from "next/navigation";
import { getTryItCard, allTryItCards } from "@/content/modules";
import { SandboxConsole } from "@/components/session/SandboxConsole";
import { ScreenHeader } from "@/components/ui/ScreenHeader";

// Standalone sandbox — the Try-it console reachable directly from Practice,
// independent of lesson gating. Same component the in-lesson Try-it card uses.
export function generateStaticParams() {
  return allTryItCards().map((c) => ({ taskId: c.taskId }));
}

export default async function PracticeTaskPage({
  params,
}: {
  params: Promise<{ taskId: string }>;
}) {
  const { taskId } = await params;
  const card = getTryItCard(taskId);
  if (!card) notFound();

  return (
    <div className="flex flex-col gap-5 animate-card-in">
      <Link
        href="/practice"
        className="inline-flex items-center gap-1.5 font-sans text-[12px] font-medium uppercase tracking-[0.06em] text-secondary hover:text-primary"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Practice
      </Link>

      <ScreenHeader eyebrow="Sandbox" title={card.title} subtitle={card.prompt} />

      <SandboxConsole card={card} />
    </div>
  );
}
