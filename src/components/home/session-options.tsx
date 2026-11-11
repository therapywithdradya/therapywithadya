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

export function SessionOptions({
  sessions,
  eyebrow,
  title,
  intro,
  linkLabel,
}: {
  sessions: PublicSession[];
  eyebrow?: string;
  title?: string;
  intro?: string;
  linkLabel?: string;
}) {
  return (
    <Section id="sessions" aria-labelledby="home-sessions-title" background="surface">
      <Container>
        <SectionHeading
          id="home-sessions-title"
          eyebrow={eyebrow || "Sessions"}
          title={title || site.home.sessionsTitle}
          intro={intro ?? site.home.sessionsIntro}
        />
        <ul className="mt-8 grid list-none gap-6 p-0 md:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => (
            <li key={session.slug} className="min-w-0">
              <Card className="flex h-full flex-col">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-heading text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                    {session.durationLabel ?? formatDuration(session.durationMinutes)}
                  </span>
                  {session.mode === "online" ? <Badge className="shrink-0">Online</Badge> : null}
                </div>
                <h3 className="mt-3 font-heading text-[clamp(1.2rem,2vw,1.45rem)] leading-snug text-ink [overflow-wrap:anywhere]">
                  {session.name}
                </h3>
                <p className="mt-3 line-clamp-3 text-muted [overflow-wrap:anywhere]">
                  {session.description}
                </p>
                <dl className="mt-5 flex-1 space-y-3 border-t border-border/60 pt-4 text-sm">
                  <div className="min-w-0">
                    <dt className="font-semibold text-ink">Duration</dt>
                    <dd className="text-muted">
                      {session.durationLabel ?? formatDuration(session.durationMinutes)}
                    </dd>
                  </div>
                  {session.approaches ? (
                    <div className="min-w-0">
                      <dt className="font-semibold text-ink">Approaches</dt>
                      <dd className="line-clamp-2 text-muted [overflow-wrap:anywhere]">
                        {session.approaches}
                      </dd>
                    </div>
                  ) : null}
                  <div className="min-w-0">
                    <dt className="font-semibold text-ink">Who it is for</dt>
                    <dd className="line-clamp-3 text-muted [overflow-wrap:anywhere]">
                      {session.whoItFor}
                    </dd>
                  </div>
                </dl>
                <div className="mt-6 border-t border-border/60 pt-5">
                  {session.priceLabel ? (
                    <p className="text-xl font-bold text-primary [overflow-wrap:anywhere]">
                      {session.priceLabel}
                    </p>
                  ) : null}
                  <Button
                    href={`/book?session=${encodeURIComponent(session.slug)}`}
                    className="mt-4 w-full"
                  >
                    Book this session
                  </Button>
                </div>
              </Card>
            </li>
          ))}
        </ul>
        <Link href="/sessions" className={`mt-8 ${textLinkClass}`}>
          {linkLabel || "View full session details"}
        </Link>
      </Container>
    </Section>
  );
}
