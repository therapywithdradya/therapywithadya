import { site } from "@/content/site";

export function SafetyNotice({
  headingLevel = "h2",
  id = "safety-notice-title",
}: {
  headingLevel?: "h2" | "h3";
  id?: string;
}) {
  const HeadingTag = headingLevel;
  const { heading, text, resources } = site.safetyNotice;

  return (
    <aside
      aria-labelledby={id}
      className="rounded-card border border-border bg-surface p-6 shadow-soft"
    >
      <HeadingTag
        id={id}
        className="font-heading text-heading text-ink [overflow-wrap:anywhere]"
      >
        {heading}
      </HeadingTag>
      <p className="mt-3 text-muted [overflow-wrap:anywhere]">{text}</p>
      <ul className="mt-4 list-none space-y-2 p-0" role="list">
        {resources.map((resource) => (
          <li key={resource.tel} className="min-w-0">
            <a
              href={`tel:${resource.tel}`}
              className="inline-flex min-h-11 items-center rounded-sm font-semibold text-primary underline-offset-4 [overflow-wrap:anywhere] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
              {resource.label}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
