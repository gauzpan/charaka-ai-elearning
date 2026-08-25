import type { Card } from "@/content/types";
import { Tag } from "@/components/ui/Tag";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SandboxConsole } from "./SandboxConsole";

// Renders one card body by type (design.md §4.3). One idea per screen: the
// player owns layout/nav; this component only paints the card's content.
//
// Typography hierarchy per card: eyebrow (label) → title (h2, or h1-weight
// for the objective's "major moment") → explanation → bullets → semantic
// panel. gap-5 between those tiers reads as more separated than the content
// within a tier (bullets keep their own tighter gap-3).

const bodyText = "text-[16px] leading-[26px] text-secondary";
const emphasisPanel = "rounded-md p-4";

export function CardView({ card }: { card: Card }) {
  switch (card.type) {
    case "objective":
      return (
        <div className="flex flex-col gap-5">
          <Eyebrow>{card.eyebrow}</Eyebrow>
          <p className="text-h1 text-primary">{card.payoff}</p>
          {card.body && <p className={bodyText}>{card.body}</p>}
        </div>
      );

    case "concept":
      return (
        <div className="flex flex-col gap-5">
          <Eyebrow>{card.eyebrow}</Eyebrow>
          <h2 className="text-h2 text-primary">{card.title}</h2>
          <ul className="flex flex-col gap-3">
            {card.points.map((p, i) => (
              <li key={i} className="flex gap-3">
                <span aria-hidden className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-pill bg-action" />
                <span className="text-[16px] font-[450] leading-[26px] text-primary">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      );

    case "goodVsBad":
      return (
        <div className="flex flex-col gap-5">
          <Eyebrow>{card.eyebrow}</Eyebrow>
          <h2 className="text-h2 text-primary">{card.title}</h2>
          <div className="flex flex-col gap-3">
            <div
              className={`${emphasisPanel} border border-error-bg bg-error-bg/40`}
              style={{ boxShadow: "var(--shadow-hover)" }}
            >
              <div className="mb-2">
                <Tag tone="error">{card.bad.label}</Tag>
              </div>
              <p className="font-mono text-[16px] leading-[25px] text-primary">{card.bad.text}</p>
            </div>
            <div
              className={`${emphasisPanel} border border-success-bg bg-success-bg/40`}
              style={{ boxShadow: "var(--shadow-hover)" }}
            >
              <div className="mb-2">
                <Tag tone="success">{card.good.label}</Tag>
              </div>
              <p className="font-mono text-[16px] leading-[25px] text-primary">{card.good.text}</p>
            </div>
          </div>
          <p className={`${bodyText} font-medium text-primary`}>{card.takeaway}</p>
        </div>
      );

    case "motivationalInsight":
      return (
        <div className="flex flex-col gap-5">
          <Eyebrow>{card.eyebrow}</Eyebrow>
          <h2 className="text-h2 text-primary">{card.title}</h2>
          <div
            className={`${emphasisPanel} border border-info-bg bg-info-bg/40`}
            style={{ boxShadow: "var(--shadow-hover)" }}
          >
            <p className="text-[16px] font-medium leading-[26px] text-primary">{card.insight}</p>
          </div>
          {card.source && <p className="text-meta">Source: {card.source}</p>}
        </div>
      );

    case "tryIt":
      return (
        <div className="flex flex-col gap-5">
          <Eyebrow>{card.eyebrow}</Eyebrow>
          <h2 className="text-h2 text-primary">{card.title}</h2>
          <p className={bodyText}>{card.prompt}</p>
          <SandboxConsole card={card} />
        </div>
      );

    case "recapInvest":
      return (
        <div className="flex flex-col gap-5">
          <Eyebrow>{card.eyebrow}</Eyebrow>
          <h2 className="text-h2 text-primary">{card.title}</h2>
          <ul className="flex flex-col gap-3">
            {card.recap.map((p, i) => (
              <li key={i} className="flex gap-3">
                <span aria-hidden className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-pill bg-action" />
                <span className="text-[16px] font-[450] leading-[26px] text-primary">{p}</span>
              </li>
            ))}
          </ul>
          <div
            className={`${emphasisPanel} border border-success-bg bg-success-bg/40`}
            style={{ boxShadow: "var(--shadow-hover)" }}
          >
            <p className="text-[16px] font-medium leading-[26px] text-success">{card.applyLine}</p>
          </div>
        </div>
      );
  }
}
