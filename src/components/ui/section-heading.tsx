import { cn } from "@/lib/utils";

export function SectionHeading({
  id,
  eyebrow,
  title,
  intro,
  className,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  intro?: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", className)}>
      {eyebrow ? (
        <p className="font-heading text-xs font-semibold tracking-[0.18em] text-primary uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h2 id={id} className="mt-2 font-heading text-heading text-ink">
        {title}
      </h2>
      {intro ? <p className="mt-3 text-lead text-muted">{intro}</p> : null}
    </div>
  );
}
