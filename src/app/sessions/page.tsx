import { PolicySummary } from "@/components/policy/PolicySummary";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { site } from "@/content/site";
import { getSessions } from "@/lib/content";
import { formatDuration } from "@/lib/format";
import { marketingMetadata } from "@/lib/page-metadata";
import { getSiteContent } from "@/lib/site-content.server";

const pageCopy = site.pages.sessions;

export const revalidate = 60;

export const metadata = marketingMetadata({
  title: pageCopy.title,
  description: pageCopy.description,
  path: "/sessions",
});

export default async function SessionsPage() {
  const [sessions, content] = await Promise.all([getSessions(), getSiteContent()]);
  const copy = content.sessionsPage;

  return (
    <>
      <Section aria-labelledby="sessions-page-title">
        <Container>
          <p className="font-heading text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            {copy.eyebrow}
          </p>
          <h1
            id="sessions-page-title"
            className="mt-3 max-w-[70ch] font-heading text-display text-ink [overflow-wrap:anywhere]"
          >
            {copy.title}
          </h1>
          <p className="mt-4 max-w-[70ch] text-lead text-muted [overflow-wrap:anywhere]">
            {copy.intro}
          </p>

          <ul className="mt-10 grid list-none gap-6 p-0 md:grid-cols-2 lg:grid-cols-3">
            {sessions.map((session) => (
              <li key={session.slug} className="min-w-0">
                <Card className="flex h-full flex-col">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-heading text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                      {session.durationLabel ?? formatDuration(session.durationMinutes)}
                    </span>
                    {session.mode === "online" ? <Badge className="shrink-0">Online</Badge> : null}
                  </div>
                  <h2 className="mt-3 font-heading text-[clamp(1.25rem,2.2vw,1.5rem)] leading-snug text-ink [overflow-wrap:anywhere]">
                    {session.name}
                  </h2>
                  <p className="mt-3 max-w-[70ch] text-sm leading-relaxed text-muted [overflow-wrap:anywhere]">
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
                        <dt className="font-semibold text-ink">Approaches may include</dt>
                        <dd className="text-muted [overflow-wrap:anywhere]">{session.approaches}</dd>
                      </div>
                    ) : null}
                    <div className="min-w-0">
                      <dt className="font-semibold text-ink">Who it is for</dt>
                      <dd className="text-muted [overflow-wrap:anywhere]">{session.whoItFor}</dd>
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
        </Container>
      </Section>

      <Section aria-labelledby="booking-steps-title" background="surface">
        <Container>
          <SectionHeading
            id="booking-steps-title"
            eyebrow={copy.bookingStepsEyebrow}
            title={copy.bookingStepsTitle}
            intro={copy.bookingStepsIntro}
          />
          <ol className="mt-8 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {copy.bookingSteps.map((step, index) => (
              <li key={step} className="min-w-0">
                <Card className="h-full bg-background/70 p-5">
                  <span className="font-heading text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                    Step 0{index + 1}
                  </span>
                  <p className="mt-2 font-medium text-ink [overflow-wrap:anywhere]">{step}</p>
                </Card>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section aria-labelledby="sessions-policy-title">
        <Container>
          <PolicySummary
            headingId="sessions-policy-title"
            policies={content.legalAndSafety.policies}
          />
        </Container>
      </Section>
    </>
  );
}
