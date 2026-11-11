import { site } from "@/content/site";
import type { EditableCrisisResource } from "@/lib/site-content-types";

export function SafetyNotice({
  headingLevel = "h2",
  id = "safety-notice-title",
  heading,
  text,
  resources,
}: {
  headingLevel?: "h2" | "h3";
  id?: string;
  heading?: string;
  text?: string;
  resources?: EditableCrisisResource[];
}) {
  const HeadingTag = headingLevel;
  const resolvedHeading = heading || site.safetyNotice.heading;
  const resolvedText = text || site.safetyNotice.text;
  const resolvedResources =
    resources && resources.length > 0 ? resources : site.safetyNotice.resources;

  return (
    <aside
      aria-labelledby={id}
      className="rounded-card border border-border bg-surface p-6 shadow-soft"
    >
      <HeadingTag
        id={id}
        className="font-heading text-heading text-ink [overflow-wrap:anywhere]"
      >
        {resolvedHeading}
      </HeadingTag>
      <p className="mt-3 text-muted [overflow-wrap:anywhere]">{resolvedText}</p>
      <ul className="mt-4 list-none space-y-2 p-0" role="list">
        {resolvedResources.map((resource) => (
          <li key={`${resource.tel}-${resource.label}`} className="min-w-0">
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
