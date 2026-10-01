import { PolicySummary } from "@/components/policy/PolicySummary";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { site } from "@/content/site";
import { getSessions } from "@/lib/content";
import { formatDuration } from "@/lib/format";
import { marketingMetadata } from "@/lib/page-metadata";

const pageCopy = site.pages.sessions;

export const metadata = marketingMetadata({
  title: pageCopy.title,
  description: pageCopy.description,
  path: "/sessions",
});

export default async function SessionsPage() {
  const sessions = await getSessions();

  return (
    <>
      <Section aria-labelledby="sessions-page-title">
        <Container>
          <h1
            id="sessions-page-title"
            className="max-w-[70ch] font-heading text-display text-ink [overflow-wrap:anywhere]"
          >
            {pageCopy.title}
          </h1>
          <p className="mt-4 max-w-[70ch] text-lead text-muted [overflow-wrap:anywhere]">
            {pageCopy.intro}
          </p>
          <ul className="mt-10 grid list-none gap-6 p-0 lg:grid-cols-2">
            {sessions.map((session) => (
              <li key={session.slug} className="min-w-0">
                <Card className="flex h-full flex-col">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <h2 className="min-w-0 flex-1 font-heading text-[clamp(1.35rem,3vw,2rem)] text-ink [overflow-wrap:anywhere]">
                      {session.name}
                    </h2>
                    {session.mode === "online" ? <Badge>Online</Badge> : null}
                  </div>
                  <p className="mt-3 max-w-[70ch] text-muted [overflow-wrap:anywhere]">
                    {session.description}
                  </p>
                  <dl className="mt-4 space-y-3">
                    <div className="min-w-0">
                      <dt className="font-semibold text-ink">Duration</dt>
                      <dd className="text-muted">{formatDuration(session.durationMinutes)}</dd>
                    </div>
                    <div className="min-w-0">
                      <dt className="font-semibold text-ink">Who it is for</dt>
                      <dd className="text-muted [overflow-wrap:anywhere]">{session.whoItFor}</dd>
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
        </Container>
      </Section>
      <Section aria-labelledby="booking-steps-title" background="surface">
        <Container>
          <h2
            id="booking-steps-title"
            className="font-heading text-heading text-ink [overflow-wrap:anywhere]"
          >
            How booking works
          </h2>
          <ol className="mt-6 max-w-[70ch] list-decimal space-y-3 pl-6">
            {site.bookingSteps.map((step) => (
              <li key={step} className="ps-2 [overflow-wrap:anywhere]">
                {step}
              </li>
            ))}
          </ol>
        </Container>
      </Section>
      <Section aria-labelledby="sessions-policy-title">
        <Container>
          <PolicySummary headingId="sessions-policy-title" />
        </Container>
      </Section>
    </>
  );
}
