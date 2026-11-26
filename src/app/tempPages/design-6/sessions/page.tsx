import Link from "next/link";
import { PolicySummary } from "@/components/policy/PolicySummary";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { getSessions } from "@/lib/content";
import { formatDuration } from "@/lib/format";
import { getSiteContent } from "@/lib/site-content.server";

export const revalidate = 60;

const BASE = "/tempPages/design-6";

export default async function Design6SessionsPage() {
  const [sessions, content] = await Promise.all([getSessions(), getSiteContent()]);
  const copy = content.sessionsPage;

  return (
    <>
      <section
        aria-labelledby="sessions-page-title"
        className="bg-gradient-to-b from-[#EFF8F2] via-[#FFFDF2] to-[#EFF7FF] py-section"
      >
        <Container>
          <p className="font-heading text-xs font-semibold tracking-[0.18em] text-emerald-700 uppercase">
            {copy.eyebrow}
          </p>
          <h1
            id="sessions-page-title"
            className="mt-3 max-w-[70ch] font-heading text-display text-slate-900 [overflow-wrap:anywhere]"
          >
            {copy.title}
          </h1>
          <p className="mt-4 max-w-[70ch] text-lead text-slate-600 [overflow-wrap:anywhere]">
            {copy.intro}
          </p>

          <ul className="mt-10 grid list-none gap-6 p-0 md:grid-cols-2 lg:grid-cols-3">
            {sessions.map((session) => (
              <li key={session.slug} className="min-w-0">
                <Card className="flex h-full flex-col border-indigo-200/80 bg-white/95 p-6">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-heading text-xs font-semibold tracking-[0.16em] text-indigo-600 uppercase">
                      {session.durationLabel ?? formatDuration(session.durationMinutes)}
                    </span>
                    {session.mode === "online" ? (
                      <Badge className="shrink-0 bg-emerald-50 text-emerald-800 border-emerald-200">
                        Online
                      </Badge>
                    ) : null}
                  </div>
                  <h2 className="mt-3 font-heading text-[clamp(1.25rem,2.2vw,1.5rem)] leading-snug text-slate-900 [overflow-wrap:anywhere]">
                    {session.name}
                  </h2>
                  <p className="mt-3 max-w-[70ch] text-sm leading-relaxed text-slate-600 [overflow-wrap:anywhere]">
                    {session.description}
                  </p>
                  <dl className="mt-5 flex-1 space-y-3 border-t border-slate-100 pt-4 text-sm">
                    <div className="min-w-0">
                      <dt className="font-semibold text-slate-800">Duration</dt>
                      <dd className="text-slate-600">
                        {session.durationLabel ?? formatDuration(session.durationMinutes)}
                      </dd>
                    </div>
                  </dl>
                  <div className="mt-6 border-t border-slate-100 pt-5">
                    {session.priceLabel ? (
                      <p className="text-xl font-bold text-indigo-600 [overflow-wrap:anywhere]">
                        {session.priceLabel}
                      </p>
                    ) : null}
                    <Link
                      href={`${BASE}/book?session=${encodeURIComponent(session.slug)}`}
                      className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-button bg-indigo-500 px-4 font-semibold text-white shadow-xs hover:bg-indigo-600 transition"
                    >
                      Book this session
                    </Link>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section
        aria-labelledby="booking-steps-title"
        className="bg-gradient-to-b from-[#FBF7EE] to-[#F5EDE0] py-section border-y border-amber-200/60"
      >
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
                <Card className="h-full border-amber-200/80 bg-white/90 p-5">
                  <span className="font-heading text-xs font-semibold tracking-[0.16em] text-indigo-600 uppercase">
                    Step 0{index + 1}
                  </span>
                  <p className="mt-2 font-medium text-slate-800 [overflow-wrap:anywhere]">{step}</p>
                </Card>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section
        aria-labelledby="sessions-policy-title"
        className="bg-gradient-to-b from-[#F5F2FF] to-[#FFFDF7] py-section"
      >
        <Container>
          <PolicySummary
            headingId="sessions-policy-title"
            policies={content.legalAndSafety.policies}
          />
        </Container>
      </section>
    </>
  );
}
