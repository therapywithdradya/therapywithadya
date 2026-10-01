export function SectionHeading({
  id,
  eyebrow,
  title,
  intro,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  intro?: string;
}) {
  return (
    <div className="max-w-2xl">
      {eyebrow ? (
        <p className="text-sm font-medium tracking-wide text-muted">{eyebrow}</p>
      ) : null}
      <h2 id={id} className="mt-2 font-serif text-heading text-ink">
        {title}
      </h2>
      {intro ? <p className="mt-3 text-lead text-muted">{intro}</p> : null}
    </div>
  );
}
