import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { site } from "@/content/site";

const textLinkClass =
  "inline-flex min-h-11 max-w-full items-center rounded-sm font-semibold text-primary underline-offset-4 [overflow-wrap:anywhere] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";

export function ServicesOverview() {
  return (
    <Section aria-labelledby="home-services-title">
      <Container>
        <SectionHeading
          id="home-services-title"
          eyebrow="Services"
          title={site.home.servicesTitle}
          intro={site.home.servicesIntro}
          className="mx-auto text-center"
        />
        {site.services.length > 0 ? (
          <ul className="mt-8 grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {site.services.map((service) => (
              <li key={service.slug} className="min-w-0">
                <Card className="flex h-full flex-col">
                  <h3 className="line-clamp-2 font-heading text-[clamp(1.15rem,2vw,1.4rem)] text-ink [overflow-wrap:anywhere]">
                    {service.title}
                  </h3>
                  <p className="mt-3 line-clamp-4 flex-1 text-muted [overflow-wrap:anywhere]">
                    {service.shortDescription}
                  </p>
                  <Link href="/services" className={`mt-4 ${textLinkClass}`}>
                    View {service.title}
                  </Link>
                </Card>
              </li>
            ))}
          </ul>
        ) : null}
      </Container>
    </Section>
  );
}
