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
      {intro ? (
        <div className="mt-3 space-y-2 text-lead text-muted [overflow-wrap:anywhere]">
          {intro.split(/\n\n+/).map((para, i) => (
            <p
              key={i}
              className={
                para.startsWith("*") && para.endsWith("*")
                  ? "italic text-ink/90"
                  : undefined
              }
            >
              {para.replace(/^\*|\*$/g, "").trim()}
            </p>
          ))}
        </div>
      ) : null}
    </div>
  );
}
