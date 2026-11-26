import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { site } from "@/content/site";
import { getEventsAndWorkshops } from "@/lib/content";
import { clockMs, formatEventDateRange } from "@/lib/format";
import { getSiteContent } from "@/lib/site-content.server";
import type { EventWorkshopRow } from "@/types/database";

export const revalidate = 60;

const BASE = "/tempPages/design-6";

function kindLabel(kind: EventWorkshopRow["kind"]): string {
  return kind === "workshop" ? "Workshop" : "Event";
}

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

  upcoming.sort((a, b) => Date.parse(a.starts_at) - Date.parse(b.starts_at));
  past.sort((a, b) => Date.parse(b.starts_at) - Date.parse(a.starts_at));
  return { upcoming, past: past.slice(0, 24) };
}

function EventDateDisplay({ event }: { event: EventWorkshopRow }) {
  const when = formatEventDateRange(event.starts_at, event.ends_at, site.businessTimezone);
  if (!when.startIso) {
    return <p className="mt-3 text-sm text-slate-500 [overflow-wrap:anywhere]">{when.text}</p>;
  }
  return (
    <p className="mt-3 text-sm text-slate-500 [overflow-wrap:anywhere]">
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
  return (
    <article className="flex h-full flex-col rounded-card border border-indigo-200/80 bg-white/95 shadow-soft overflow-hidden">
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
        <Badge className="w-fit bg-indigo-50 text-indigo-700 border-indigo-200">
          {kindLabel(event.kind)}
        </Badge>
        <h3 className="mt-3 font-heading text-[clamp(1.15rem,2vw,1.4rem)] text-slate-900 [overflow-wrap:anywhere]">
          {event.title}
        </h3>
        <EventDateDisplay event={event} />
        {event.location ? (
          <p className="mt-1 text-sm text-slate-500 [overflow-wrap:anywhere]">{event.location}</p>
        ) : null}
        <p className="mt-3 grow text-body text-slate-700 [overflow-wrap:anywhere]">
          {event.description}
        </p>
      </div>
    </article>
  );
}

export default async function Design6EventsPage() {
  const [events, content] = await Promise.all([getEventsAndWorkshops(), getSiteContent()]);
  const copy = content.pagesCopy.events;
  const nowMs = clockMs();
  const { upcoming, past } = splitEvents(events, nowMs);
  const hasAny = upcoming.length > 0 || past.length > 0;

  return (
    <>
      <section
        aria-labelledby="events-page-title"
        className="bg-gradient-to-b from-[#FFFDF2] to-[#F3F1FF] py-section"
      >
        <Container>
          <p className="font-heading text-xs font-semibold tracking-[0.18em] text-indigo-600 uppercase">
            {copy.eyebrow}
          </p>
          <h1
            id="events-page-title"
            className="mt-3 font-heading text-display text-slate-900 [overflow-wrap:anywhere]"
          >
            {copy.title}
          </h1>
          <p className="mt-4 max-w-[70ch] text-lead text-slate-600 [overflow-wrap:anywhere]">
            {copy.intro}
          </p>
        </Container>
      </section>

      {!hasAny ? (
        <section
          aria-labelledby="events-none-title"
          className="bg-gradient-to-b from-[#EFF7FF] to-[#E6F2FC] py-section border-y border-sky-200/60"
        >
          <Container>
            <h2 id="events-none-title" className="font-heading text-heading text-slate-900 [overflow-wrap:anywhere]">
              {copy.title}
            </h2>
            <p className="mt-6 text-slate-600">
              No events or workshops are scheduled right now. Check back soon or contact {content.brand.practitionerName} for custom bookings.
            </p>
          </Container>
        </section>
      ) : (
        <>
          <section
            aria-labelledby="events-upcoming-title"
            className="bg-gradient-to-b from-[#EFF7FF] to-[#E6F2FC] py-section border-y border-sky-200/60"
          >
            <Container>
              <SectionHeading
                id="events-upcoming-title"
                eyebrow={copy.upcomingEyebrow}
                title={copy.upcomingTitle}
              />
              {upcoming.length === 0 ? (
                <p className="mt-6 text-slate-600">No upcoming events right now.</p>
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
          </section>

          {past.length > 0 ? (
            <section
              aria-labelledby="events-past-title"
              className="bg-gradient-to-b from-[#FBF7EE] to-[#F5EDE0] py-section"
            >
              <Container>
                <SectionHeading
                  id="events-past-title"
                  eyebrow={copy.pastEyebrow}
                  title={copy.pastTitle}
                />
                <ul className="mt-8 grid list-none gap-6 p-0 md:grid-cols-2 lg:grid-cols-3" role="list">
                  {past.map((event) => (
                    <li key={event.id} className="min-w-0">
                      <EventCard event={event} />
                    </li>
                  ))}
                </ul>
              </Container>
            </section>
          ) : null}
        </>
      )}

      <section
        aria-labelledby="events-cta-title"
        className="bg-gradient-to-r from-[#EAE8FF] via-[#EFF8F2] to-[#FFF5F7] py-section border-t border-indigo-100"
      >
        <Container>
          <SectionHeading
            id="events-cta-title"
            eyebrow={copy.ctaEyebrow}
            title={copy.ctaTitle}
          />
          <p className="mt-4 max-w-[60ch] text-slate-600 [overflow-wrap:anywhere]">
            {copy.ctaText}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href={`${BASE}/contact`}
              className="inline-flex min-h-11 items-center rounded-button bg-indigo-500 px-6 font-semibold text-white shadow-xs hover:bg-indigo-600 transition"
            >
              Enquire about events and workshops
            </Link>
            <Link
              href={`${BASE}/book`}
              className="inline-flex min-h-11 items-center rounded-button border border-indigo-200 bg-white px-6 font-semibold text-indigo-700 shadow-xs hover:bg-indigo-50 transition"
            >
              {content.brand.bookLabel}
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
