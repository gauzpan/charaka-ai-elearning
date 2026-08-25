import { Eyebrow } from "./Eyebrow";

/**
 * The eyebrow + H1 + subtitle triple repeated at the top of every tab screen.
 * One definition keeps the hierarchy (label → primary title → supporting
 * description) consistent everywhere instead of each screen re-tuning it.
 */
export function ScreenHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="text-h1 text-primary">{title}</h1>
      {subtitle && <p className="text-[15px] leading-[23px] text-secondary">{subtitle}</p>}
    </div>
  );
}
