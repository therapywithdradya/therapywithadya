import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { site } from "@/content/site";
import { formatDuration } from "@/lib/format";
import type { PublicSession } from "@/lib/content";

const textLinkClass =
  "inline-flex min-h-11 max-w-full items-center rounded-sm font-semibold text-primary underline-offset-4 [overflow-wrap:anywhere] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";

export function SessionOptions({ sessions }: { sessions: PublicSession[] }) {
  return (
    <Section id="sessions" aria-labelledby="home-sessions-title" background="surface">
      <Container>
        <SectionHeading
          id="home-sessions-title"
          eyebrow="Sessions"
          title={site.home.sessionsTitle}
          intro={site.home.sessionsIntro}
        />
        <ul className="mt-8 grid list-none gap-6 p-0 md:grid-cols-2">
          {sessions.map((session) => (
            <li key={session.slug} className="min-w-0">
              <Card className="flex h-full flex-col">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h3 className="line-clamp-2 min-w-0 flex-1 font-heading text-[clamp(1.15rem,2vw,1.4rem)] text-ink [overflow-wrap:anywhere]">
                    {session.name}
                  </h3>
                  {session.mode === "online" ? <Badge>Online</Badge> : null}
                </div>
                <p className="mt-3 line-clamp-3 text-muted [overflow-wrap:anywhere]">
                  {session.description}
                </p>
                <dl className="mt-4 space-y-3">
                  <div className="min-w-0">
                    <dt className="font-semibold text-ink">Duration</dt>
                    <dd className="text-muted">{formatDuration(session.durationMinutes)}</dd>
                  </div>
                  <div className="min-w-0">
                    <dt className="font-semibold text-ink">Who it is for</dt>
                    <dd className="line-clamp-3 text-muted [overflow-wrap:anywhere]">
                      {session.whoItFor}
                    </dd>
                  </div>
                </dl>
                {session.priceLabel ? (
                  <p className="mt-4 text-ink [overflow-wrap:anywhere]">{session.priceLabel}</p>
                ) : null}
                <Button
                  href={`/book?session=${encodeURIComponent(session.slug)}`}
                  className="mt-6 w-full"
                >
                  Book this session
                </Button>
              </Card>
            </li>
          ))}
        </ul>
        <Link href="/sessions" className={`mt-8 ${textLinkClass}`}>
          View full session details
        </Link>
      </Container>
    </Section>
  );
}
