import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { site } from "@/content/site";
import type { EditableServiceItem } from "@/lib/site-content-types";

const textLinkClass =
  "inline-flex min-h-11 max-w-full items-center rounded-sm font-semibold text-primary underline-offset-4 [overflow-wrap:anywhere] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";

export function ServicesOverview({
  eyebrow,
  title,
  intro,
  services,
}: {
  eyebrow?: string;
  title?: string;
  intro?: string;
  services?: readonly EditableServiceItem[];
} = {}) {
  const displayServices = services ?? site.services;

  return (
    <Section aria-labelledby="home-services-title">
      <Container>
        <SectionHeading
          id="home-services-title"
          eyebrow={eyebrow || "Services"}
          title={title || site.home.servicesTitle}
          intro={intro ?? site.home.servicesIntro}
          className="mx-auto text-center"
        />
        {displayServices.length > 0 ? (
          <ul className="mt-8 grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {displayServices.map((service) => (
              <li key={service.slug} className="min-w-0">
                <Card className="flex h-full flex-col">
                  <p className="font-heading text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                    {service.eyebrow}
                  </p>
                  <h3 className="mt-2 line-clamp-2 font-heading text-[clamp(1.15rem,2vw,1.4rem)] leading-snug text-ink [overflow-wrap:anywhere]">
                    {service.title}
                  </h3>
                  <p className="mt-3 line-clamp-4 flex-1 text-muted [overflow-wrap:anywhere]">
                    {service.shortDescription}
                  </p>
                  <div className="mt-5 border-t border-border/60 pt-3">
                    <Link href={`/services#${service.slug}`} className={textLinkClass}>
                      View {service.title}
                    </Link>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        ) : null}
      </Container>
    </Section>
  );
}
