import Link from "next/link";
import { BookingCta } from "@/components/home/booking-cta";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { site } from "@/content/site";
import { marketingMetadata } from "@/lib/page-metadata";

const textLinkClass =
  "inline-flex min-h-11 max-w-full items-center rounded-sm font-semibold text-primary underline-offset-4 [overflow-wrap:anywhere] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";

const pageCopy = site.pages.services;

export const metadata = marketingMetadata({
  title: pageCopy.title,
  description: pageCopy.description,
  path: "/services",
});

export default function ServicesPage() {
  const services = site.services;

  return (
    <>
      <Section aria-labelledby="services-page-title">
        <Container>
          <h1
            id="services-page-title"
            className="max-w-[70ch] font-heading text-display text-ink [overflow-wrap:anywhere]"
          >
            {pageCopy.title}
          </h1>
          <p className="mt-4 max-w-[70ch] text-lead text-muted [overflow-wrap:anywhere]">
            {pageCopy.intro}
          </p>
          {services.length > 0 ? (
            <div className="mt-10 space-y-6">
              {services.map((service) => (
                <section key={service.slug} aria-labelledby={`service-${service.slug}`}>
                  <Card>
                    <h2
                      id={`service-${service.slug}`}
                      className="font-heading text-[clamp(1.35rem,3vw,2rem)] text-ink [overflow-wrap:anywhere]"
                    >
                      {service.title}
                    </h2>
                    <p className="mt-3 max-w-[70ch] text-muted [overflow-wrap:anywhere]">
                      {service.longDescription}
                    </p>
                    {service.href ? (
                      <Link href={service.href} className={`mt-4 ${textLinkClass}`}>
                        {service.linkLabel ?? `View ${service.title}`}
                      </Link>
                    ) : null}
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
      <BookingCta headingId="services-booking-title" />
    </>
  );
}
