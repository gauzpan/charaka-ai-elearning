import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { ScreenHeader } from "@/components/ui/ScreenHeader";

// Resources landing (design.md §3.1): two reference surfaces — the AI Newsfeed
// and the AI Toolkit. Two clear choices, one per card (Hick's Law).

const items: {
  href: string;
  name: string;
  desc: string;
  status?: string;
  icon: React.ReactNode;
}[] = [
  {
    href: "/resources/feed",
    name: "AI Feed",
    desc: "Ten updates on AI in healthcare, refreshed every week.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16" />
        <circle cx="5" cy="19" r="1" />
      </svg>
    ),
  },
  {
    href: "/resources/toolkit",
    name: "AI Toolkit",
    desc: "A curated list of AI tools used across healthcare work.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18" />
      </svg>
    ),
  },
];

export default function ResourcesPage() {
  return (
    <div className="flex flex-col gap-6 animate-card-in">
      <ScreenHeader
        eyebrow="Resources"
        title="Reference shelf"
        subtitle="The tools and updates worth knowing about — no lessons, just what to reach for."
      />

      <div className="flex flex-col gap-3">
        {items.map((it) => (
          <Link key={it.href} href={it.href} className="block">
            <Card variant="elevated" hover className="flex items-center gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-pill bg-action/10 text-action">
                {it.icon}
              </span>
              <div className="flex flex-1 flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-[17px] leading-[22px] text-primary">{it.name}</h3>
                  {it.status && <Tag tone="info">{it.status}</Tag>}
                </div>
                <p className="text-[14px] leading-[20px] text-secondary">{it.desc}</p>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-muted" aria-hidden>
                <path d="M9 6l6 6-6 6" />
              </svg>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
