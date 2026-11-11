import { BookingCta } from "@/components/home/booking-cta";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { site } from "@/content/site";
import { marketingMetadata } from "@/lib/page-metadata";
import { getSiteContent } from "@/lib/site-content.server";

const pageCopy = site.pages.services;

export const revalidate = 60;

export const metadata = marketingMetadata({
  title: pageCopy.title,
  description: pageCopy.description,
  path: "/services",
});

export default async function ServicesPage() {
  const content = await getSiteContent();
  const services = content.services;
  const copy = content.servicesPage;

  return (
    <>
      <Section aria-labelledby="services-page-title">
        <Container>
          <p className="font-heading text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            {copy.eyebrow}
          </p>
          <h1
            id="services-page-title"
            className="mt-3 max-w-[70ch] font-heading text-display text-ink [overflow-wrap:anywhere]"
          >
            {copy.title}
          </h1>
          <p className="mt-4 max-w-[70ch] text-lead text-muted [overflow-wrap:anywhere]">
            {copy.intro}
          </p>
        </Container>
      </Section>

      <Section aria-labelledby="services-offerings-title" background="surface">
        <Container>
          <SectionHeading
            id="services-offerings-title"
            eyebrow={copy.offeringsEyebrow}
            title={copy.offeringsTitle}
            intro={copy.offeringsIntro}
            className="mx-auto text-center"
          />

          {services.length > 0 ? (
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              {services.map((service) => (
                <section
                  key={service.slug}
                  id={service.slug}
                  aria-labelledby={`service-${service.slug}`}
                  className="scroll-mt-28 flex"
                >
                  <Card className="flex h-full w-full flex-col bg-background/70 p-6 sm:p-8">
                    <p className="font-heading text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                      {service.eyebrow}
                    </p>
                    <h2
                      id={`service-${service.slug}`}
                      className="mt-2 font-heading text-[clamp(1.3rem,2.4vw,1.7rem)] leading-snug text-ink [overflow-wrap:anywhere]"
                    >
                      {service.title}
                    </h2>
                    {service.hook ? (
                      <p className="mt-3 border-l-2 border-primary pl-3.5 text-sm font-medium italic text-ink/90 [overflow-wrap:anywhere]">
                        {service.hook}
                      </p>
                    ) : null}
                    <p className="mt-4 text-sm leading-relaxed text-muted [overflow-wrap:anywhere]">
                      {service.longDescription}
                    </p>

                    <div className="mt-5 flex-1 space-y-4 border-t border-border/60 pt-5">
                      {service.highlights && service.highlights.length > 0 ? (
                        <div>
                          <h3 className="text-xs font-semibold tracking-wider text-primary uppercase">
                            {service.highlightsTitle ?? "Focus areas"}
                          </h3>
                          <ul className="mt-2.5 flex list-none flex-wrap gap-2 p-0">
                            {service.highlights.map((item) => (
                              <li
                                key={item}
                                className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-ink"
                              >
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      {service.secondaryHighlights && service.secondaryHighlights.length > 0 ? (
                        <div>
                          <h3 className="text-xs font-semibold tracking-wider text-primary uppercase">
                            {service.secondaryHighlightsTitle}
                          </h3>
                          <ul className="mt-2.5 flex list-none flex-wrap gap-2 p-0">
                            {service.secondaryHighlights.map((item) => (
                              <li
                                key={item}
                                className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-ink"
                              >
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </div>

                    <div className="mt-6 border-t border-border/60 pt-5">
                      {service.metaNote ? (
                        <p className="text-sm font-medium text-ink [overflow-wrap:anywhere]">
                          {service.metaNote}
                        </p>
                      ) : null}
                      {service.href ? (
                        <div className={service.metaNote ? "mt-4" : ""}>
                          <Button href={service.href} variant="secondary" className="w-full sm:w-auto">
                            {service.linkLabel ?? `View ${service.title}`}
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  </Card>
                </section>
              ))}
            </div>
          ) : (
            <p className="mt-6 max-w-[70ch] text-muted [overflow-wrap:anywhere]">
              Service outlines will be listed here when they are published.
            </p>
          )}
        </Container>
      </Section>

      <BookingCta
        headingId="services-booking-title"
        title={content.homeSections.bookingTitle}
        text={content.homeSections.bookingText}
        bookHref={content.brand.bookHref}
        bookLabel={content.brand.bookLabel}
      />
    </>
  );
}
