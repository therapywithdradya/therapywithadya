import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { site } from "@/content/site";
import {
  getEventsAndWorkshops,
} from "@/lib/content";
import { clockMs, formatEventDateRange } from "@/lib/format";
import { marketingMetadata } from "@/lib/page-metadata";
import type { EventWorkshopRow } from "@/types/database";

// Time-based ISR: the upcoming/past split depends on the current time.
// The page is regenerated at most once per hour (same mechanism as the home page).
// An event that ends will remain in "Upcoming" until the next regeneration.
// Logged in DECISIONS.md row for Phase 4c.
export const revalidate = 3600;

export const metadata = marketingMetadata({
  title: site.pages.events.title,
  description: site.pages.events.description,
  path: "/events",
});

const textLinkClass =
  "inline-flex min-h-11 max-w-full items-center rounded-sm font-semibold text-primary underline-offset-4 [overflow-wrap:anywhere] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";

function kindLabel(kind: EventWorkshopRow["kind"]): string {
  return kind === "workshop" ? "Workshop" : "Event";
}

/** "Upcoming" means (ends_at ?? starts_at) is at or after nowMs — same definition as the home page. */
function splitEvents(
  events: EventWorkshopRow[],
  nowMs: number,
): { upcoming: EventWorkshopRow[]; past: EventWorkshopRow[] } {
  const upcoming: EventWorkshopRow[] = [];
  const past: EventWorkshopRow[] = [];

  for (const event of events) {
    const boundary = Date.parse(event.ends_at ?? event.starts_at);
    if (Number.isFinite(boundary) && boundary >= nowMs) {
      upcoming.push(event);
    } else {
      past.push(event);
    }
  }

  // Upcoming: soonest first
  upcoming.sort((a, b) => Date.parse(a.starts_at) - Date.parse(b.starts_at));
  // Past: most recent first, capped at 24 items.
  // Cap of 24 is logged in DECISIONS.md Phase 4c.
  past.sort((a, b) => Date.parse(b.starts_at) - Date.parse(a.starts_at));
  const pastCapped = past.slice(0, 24);

  return { upcoming, past: pastCapped };
}

function EventDateDisplay({ event }: { event: EventWorkshopRow }) {
  const when = formatEventDateRange(
    event.starts_at,
    event.ends_at,
    site.businessTimezone,
  );

  if (!when.startIso) {
    // Date unavailable — render plain text, no <time> element
    return <p className="mt-3 text-sm text-muted [overflow-wrap:anywhere]">{when.text}</p>;
  }

  return (
    <p className="mt-3 text-sm text-muted [overflow-wrap:anywhere]">
      <time dateTime={when.startIso}>{when.startLabel}</time>
      {when.endIso && when.endLabel ? (
        <>
          {" \u2013 "}
          <time dateTime={when.endIso}>{when.endLabel}</time>
        </>
      ) : null}
    </p>
  );
}

function EventCard({ event }: { event: EventWorkshopRow }) {
  // The events table has no image alt column.
  // Alt text form: Photo for "<title>" — see KNOWN_ISSUES.md for the image_alt column note.
  // Items with no image_path render as text-only cards (no SiteImage neutral block).
  return (
    <article className="flex h-full flex-col rounded-card border border-border bg-surface shadow-soft overflow-hidden">
      {event.image_path ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={event.image_path}
          alt={`Photo for "${event.title}"`}
          width={800}
          height={450}
          loading="lazy"
          decoding="async"
          className="aspect-[16/9] w-full object-cover"
        />
      ) : null}
      <div className="flex flex-1 flex-col p-6">
        <Badge tone="accent">{kindLabel(event.kind)}</Badge>
        <h3 className="mt-3 font-heading text-[clamp(1.15rem,2vw,1.4rem)] text-ink [overflow-wrap:anywhere]">
          {event.title}
        </h3>
        <EventDateDisplay event={event} />
        {event.location ? (
          <p className="mt-1 text-sm text-muted [overflow-wrap:anywhere]">{event.location}</p>
        ) : null}
        <p className="mt-3 grow text-body text-ink [overflow-wrap:anywhere]">
          {event.description}
        </p>
      </div>
    </article>
  );
}

export default async function EventsPage() {
  const events = await getEventsAndWorkshops();
  const nowMs = clockMs();
  const { upcoming, past } = splitEvents(events, nowMs);
  const hasAny = upcoming.length > 0 || past.length > 0;

  return (
    <>
      {/* Hero / intro section — one h1 per page */}
      <Section aria-labelledby="events-page-title">
        <Container>
          <h1
            id="events-page-title"
            className="font-heading text-display text-ink [overflow-wrap:anywhere]"
          >
            {site.pages.events.title}
          </h1>
          <p className="mt-4 max-w-[70ch] text-lead text-muted [overflow-wrap:anywhere]">
            {site.pages.events.intro}
          </p>
        </Container>
      </Section>

      {!hasAny ? (
        /* No events at all — one friendly message, no empty headings */
        <Section aria-labelledby="events-none-title" background="surface">
          <Container>
            <h2 id="events-none-title" className="font-heading text-heading text-ink [overflow-wrap:anywhere]">
              Events and Workshops
            </h2>
            <p className="mt-6 text-muted">
              [DUMMY] No events or workshops are scheduled right now. Check back soon.
            </p>
          </Container>
        </Section>
      ) : (
        <>
          {/* Upcoming section */}
          <Section aria-labelledby="events-upcoming-title" background="surface">
            <Container>
              <h2
                id="events-upcoming-title"
                className="font-heading text-heading text-ink [overflow-wrap:anywhere]"
              >
                Upcoming
              </h2>
              {upcoming.length === 0 ? (
                <p className="mt-6 text-muted">No upcoming events right now.</p>
              ) : (
                <ul className="mt-8 grid list-none gap-6 p-0 md:grid-cols-2" role="list">
                  {upcoming.map((event) => (
                    <li key={event.id} className="min-w-0">
                      <EventCard event={event} />
                    </li>
                  ))}
                </ul>
              )}
            </Container>
          </Section>

          {/* Past section — only rendered when there are past items */}
          {past.length > 0 ? (
            <Section aria-labelledby="events-past-title">
              <Container>
                <h2
                  id="events-past-title"
                  className="font-heading text-heading text-ink [overflow-wrap:anywhere]"
                >
                  Past
                </h2>
                <ul className="mt-8 grid list-none gap-6 p-0 md:grid-cols-2 lg:grid-cols-3" role="list">
                  {past.map((event) => (
                    <li key={event.id} className="min-w-0">
                      <EventCard event={event} />
                    </li>
                  ))}
                </ul>
              </Container>
            </Section>
          ) : null}
        </>
      )}

      {/* Closing CTA */}
      <Section aria-labelledby="events-cta-title" background="surface">
        <Container>
          <h2
            id="events-cta-title"
            className="font-heading text-heading text-ink [overflow-wrap:anywhere]"
          >
            Get in touch
          </h2>
          <p className="mt-4 max-w-[60ch] text-muted [overflow-wrap:anywhere]">
            [DUMMY] Interested in a workshop or have a question about an event?
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className={textLinkClass}
              id="events-cta-enquire"
            >
              Enquire about events and workshops
            </Link>
            <Link
              href="/book"
              className={textLinkClass}
              id="events-cta-book"
            >
              Book a session
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
