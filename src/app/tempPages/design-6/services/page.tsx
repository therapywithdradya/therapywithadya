import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { getSiteContent } from "@/lib/site-content.server";
import { Design6BookingCta } from "../components/design6-booking-cta";

export const revalidate = 60;

const BASE = "/tempPages/design-6";

const cardPastels = [
  "bg-[#F4F2FF] border-indigo-200/80",
  "bg-[#FFF4F7] border-pink-200/80",
  "bg-[#EFF8F2] border-emerald-200/80",
  "bg-[#FBF6EB] border-amber-200/80",
  "bg-[#EFF7FF] border-sky-200/80",
  "bg-[#F6F1FF] border-violet-200/80",
];

function mapServiceHref(href?: string): string {
  if (!href) return `${BASE}/contact`;
  if (href.startsWith("/")) return `${BASE}${href}`;
  return href;
}

export default async function Design6ServicesPage() {
  const content = await getSiteContent();
  const services = content.services;
  const copy = content.servicesPage;

  return (
    <>
      <section
        aria-labelledby="services-page-title"
        className="bg-gradient-to-b from-[#FFFDF2] via-[#EFF7FF] to-[#FBF7EE] py-section"
      >
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h1
              id="services-page-title"
              className="font-heading text-display text-slate-900 [overflow-wrap:anywhere]"
            >
              {copy.title || "Services"}
            </h1>
            <h2
              id="services-offerings-title"
              className="mt-3 font-heading text-heading text-indigo-600"
            >
              {copy.offeringsTitle || "What I Offer"}
            </h2>
            <p className="mt-4 text-lead text-slate-600 [overflow-wrap:anywhere]">
              {copy.offeringsIntro || copy.intro}
            </p>
          </div>

          {services.length > 0 ? (
            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              {services.map((service, idx) => (
                <section
                  key={service.slug}
                  id={service.slug}
                  aria-labelledby={`service-${service.slug}`}
                  className="scroll-mt-28 flex"
                >
                  <Card
                    className={`flex h-full w-full flex-col p-6 sm:p-8 ${
                      cardPastels[idx % cardPastels.length]
                    }`}
                  >
                    <p className="font-heading text-xs font-semibold tracking-[0.16em] text-indigo-600 uppercase">
                      {service.eyebrow}
                    </p>
                    <h2
                      id={`service-${service.slug}`}
                      className="mt-2 font-heading text-[clamp(1.3rem,2.4vw,1.7rem)] leading-snug text-slate-900 [overflow-wrap:anywhere]"
                    >
                      {service.title}
                    </h2>
                    {service.hook ? (
                      <p className="mt-3 border-l-2 border-indigo-400 pl-3.5 text-sm font-medium italic text-slate-800 [overflow-wrap:anywhere]">
                        {service.hook}
                      </p>
                    ) : null}
                    <div className="mt-4 space-y-2 text-sm leading-relaxed text-slate-600 [overflow-wrap:anywhere]">
                      {service.longDescription.split(/\n\n+/).map((para, i) => (
                        <p key={i}>{para.trim()}</p>
                      ))}
                    </div>

                    {service.highlights && service.highlights.length > 0 ? (
                      <div className="mt-5 flex-1 space-y-4 border-t border-slate-200/70 pt-5">
                        {service.topicsHeading ? (
                          <h3 className="font-heading text-xs font-bold tracking-wider text-slate-900 uppercase">
                            {service.topicsHeading}
                          </h3>
                        ) : null}
                        <div>
                          <h4 className="text-xs font-semibold tracking-wider text-indigo-600 uppercase">
                            {service.highlightsTitle ?? "Focus areas"}
                          </h4>
                          <ul className="mt-2.5 flex list-none flex-wrap gap-2 p-0">
                            {service.highlights.map((item) => (
                              <li
                                key={item}
                                className="rounded-full border border-slate-200/80 bg-white/90 px-3 py-1 text-xs font-medium text-slate-800"
                              >
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {service.secondaryHighlights && service.secondaryHighlights.length > 0 ? (
                          <div>
                            <h4 className="text-xs font-semibold tracking-wider text-indigo-600 uppercase">
                              {service.secondaryHighlightsTitle}
                            </h4>
                            <ul className="mt-2.5 flex list-none flex-wrap gap-2 p-0">
                              {service.secondaryHighlights.map((item) => (
                                <li
                                  key={item}
                                  className="rounded-full border border-slate-200/80 bg-white/90 px-3 py-1 text-xs font-medium text-slate-800"
                                >
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : null}
                      </div>
                    ) : null}

                    <div className="mt-6 border-t border-slate-200/70 pt-5">
                      {service.metaNote ? (
                        <p className="text-sm font-medium text-slate-800 [overflow-wrap:anywhere]">
                          {service.metaNote}
                        </p>
                      ) : null}
                      {service.href ? (
                        <div className={service.metaNote ? "mt-4" : ""}>
                          <Link
                            href={mapServiceHref(service.href)}
                            className="inline-flex min-h-11 items-center justify-center rounded-button border border-indigo-200 bg-white px-5 text-sm font-semibold text-indigo-700 shadow-xs hover:bg-indigo-50 transition w-full sm:w-auto"
                          >
                            {service.linkLabel ?? `View ${service.title}`}
                          </Link>
                        </div>
                      ) : null}
                    </div>
                  </Card>
                </section>
              ))}
            </div>
          ) : (
            <p className="mt-6 max-w-[70ch] text-slate-600 [overflow-wrap:anywhere]">
              Service outlines will be listed here when they are published.
            </p>
          )}
        </Container>
      </section>

      <Design6BookingCta
        headingId="services-booking-title"
        title={content.homeSections.bookingTitle}
        text={content.homeSections.bookingText}
        bookLabel={content.brand.bookLabel}
      />
    </>
  );
}
