import type { Card } from "@/content/types";
import { Tag } from "@/components/ui/Tag";
import { SandboxConsole } from "./SandboxConsole";

// Renders one card body by type (design.md §4.3). One idea per screen: the
// player owns layout/nav; this component only paints the card's content.

function Eyebrow({ children }: { children: string }) {
  return (
    <p className="font-mono text-[12px] uppercase tracking-wide text-muted">{children}</p>
  );
}

export function CardView({ card }: { card: Card }) {
  switch (card.type) {
    case "objective":
      return (
        <div className="flex flex-col gap-4">
          <Eyebrow>{card.eyebrow}</Eyebrow>
          <p className="font-display text-[26px] leading-tight text-primary">{card.payoff}</p>
          {card.body && <p className="text-secondary">{card.body}</p>}
        </div>
      );

    case "concept":
      return (
        <div className="flex flex-col gap-4">
          <Eyebrow>{card.eyebrow}</Eyebrow>
          <h2 className="font-display text-2xl leading-tight text-primary">{card.title}</h2>
          <ul className="flex flex-col gap-3">
            {card.points.map((p, i) => (
              <li key={i} className="flex gap-3 text-secondary">
                <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-pill bg-action" />
                <span className="text-primary">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      );

    case "goodVsBad":
      return (
        <div className="flex flex-col gap-4">
          <Eyebrow>{card.eyebrow}</Eyebrow>
          <h2 className="font-display text-2xl leading-tight text-primary">{card.title}</h2>
          <div className="flex flex-col gap-3">
            <div className="rounded-md border border-error-bg bg-error-bg/40 p-4">
              <div className="mb-2">
                <Tag tone="error">{card.bad.label}</Tag>
              </div>
              <p className="font-mono text-sm leading-relaxed text-primary">{card.bad.text}</p>
            </div>
            <div className="rounded-md border border-success-bg bg-success-bg/40 p-4">
              <div className="mb-2">
                <Tag tone="success">{card.good.label}</Tag>
              </div>
              <p className="font-mono text-sm leading-relaxed text-primary">{card.good.text}</p>
            </div>
          </div>
          <p className="text-secondary">{card.takeaway}</p>
        </div>
      );

    case "motivationalInsight":
      return (
        <div className="flex flex-col gap-4">
          <Eyebrow>{card.eyebrow}</Eyebrow>
          <h2 className="font-display text-2xl leading-tight text-primary">{card.title}</h2>
          <div className="rounded-md border border-info-bg bg-info-bg/40 p-4">
            <p className="text-primary">{card.insight}</p>
          </div>
          {card.source && (
            <p className="font-mono text-[12px] text-muted">Source: {card.source}</p>
          )}
        </div>
      );

    case "tryIt":
      return (
        <div className="flex flex-col gap-4">
          <Eyebrow>{card.eyebrow}</Eyebrow>
          <h2 className="font-display text-2xl leading-tight text-primary">{card.title}</h2>
          <p className="text-secondary">{card.prompt}</p>
          <SandboxConsole card={card} />
        </div>
      );

    case "recapInvest":
      return (
        <div className="flex flex-col gap-4">
          <Eyebrow>{card.eyebrow}</Eyebrow>
          <h2 className="font-display text-2xl leading-tight text-primary">{card.title}</h2>
          <ul className="flex flex-col gap-3">
            {card.recap.map((p, i) => (
              <li key={i} className="flex gap-3">
                <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-pill bg-action" />
                <span className="text-primary">{p}</span>
              </li>
            ))}
          </ul>
          <div className="rounded-md border border-success-bg bg-success-bg/40 p-4">
            <p className="text-success">{card.applyLine}</p>
          </div>
        </div>
      );
  }
}
