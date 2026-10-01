import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { site } from "@/content/site";
import { formatEventDateRange } from "@/lib/format";
import type { EventWorkshopRow } from "@/types/database";

const textLinkClass =
  "inline-flex min-h-11 max-w-full items-center rounded-sm font-semibold text-primary underline-offset-4 [overflow-wrap:anywhere] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";

function upcomingEvents(events: EventWorkshopRow[], nowMs: number): EventWorkshopRow[] {
  return events
    .filter((event) => {
      const boundary = Date.parse(event.ends_at ?? event.starts_at);
      return Number.isFinite(boundary) && boundary >= nowMs;
    })
    .sort((left, right) => Date.parse(left.starts_at) - Date.parse(right.starts_at))
    .slice(0, 2);
}

function kindLabel(kind: EventWorkshopRow["kind"]): string {
  return kind === "workshop" ? "Workshop" : "Event";
}

export function EventsPreview({
  events,
  nowMs,
}: {
  events: EventWorkshopRow[];
  nowMs: number;
}) {
  const upcoming = upcomingEvents(events, nowMs);

  return (
    <Section aria-labelledby="home-events-title" background="surface">
      <Container>
        <SectionHeading id="home-events-title" eyebrow="Events" title={site.home.eventsTitle} />
        {upcoming.length === 0 ? (
          <p className="mt-6 text-muted">{site.home.eventsEmpty}</p>
        ) : (
          <ul className="mt-8 grid list-none gap-6 p-0 md:grid-cols-2">
            {upcoming.map((event) => {
              const when = formatEventDateRange(
                event.starts_at,
                event.ends_at,
                site.businessTimezone,
              );

              return (
                <li key={event.id} className="min-w-0">
                  <Card className="h-full">
                    <Badge>{kindLabel(event.kind)}</Badge>
                    <h3 className="mt-3 line-clamp-2 font-heading text-[clamp(1.15rem,2vw,1.4rem)] text-ink [overflow-wrap:anywhere]">
                      {event.title}
                    </h3>
                    {when.startIso ? (
                      <p className="mt-3 text-muted [overflow-wrap:anywhere]">
                        <time dateTime={when.startIso}>{when.startLabel}</time>
                        {when.endIso && when.endLabel ? (
                          <>
                            {" - "}
                            <time dateTime={when.endIso}>{when.endLabel}</time>
                          </>
                        ) : null}
                      </p>
                    ) : (
                      <p className="mt-3 text-muted">{when.text}</p>
                    )}
                  </Card>
                </li>
              );
            })}
          </ul>
        )}
        <Link href="/events" className={`mt-8 ${textLinkClass}`}>
          View events and workshops
        </Link>
      </Container>
    </Section>
  );
}
