import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { site } from "@/content/site";
import type { TestimonialRow } from "@/types/database";

const textLinkClass =
  "inline-flex min-h-11 max-w-full items-center rounded-sm font-semibold text-primary underline-offset-4 [overflow-wrap:anywhere] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";

export function ReviewsPreview({
  testimonials,
  clientCount,
}: {
  testimonials: TestimonialRow[];
  clientCount?: number;
}) {
  if (testimonials.length === 0) {
    return null;
  }

  const countLabel =
    clientCount === undefined || clientCount <= 0
      ? undefined
      : clientCount === 1
        ? "1 client"
        : `${clientCount} clients`;

  return (
    <Section aria-labelledby="home-reviews-title">
      <Container>
        <SectionHeading
          id="home-reviews-title"
          eyebrow="Reviews"
          title={site.home.reviewsTitle}
          intro={site.home.reviewsIntro}
        />
        {countLabel ? <p className="mt-4 text-muted">{countLabel}</p> : null}
        <ul className="mt-8 grid list-none gap-6 p-0 lg:grid-cols-3">
          {testimonials.map((item) => (
            <li key={item.id} className="min-w-0">
              <figure className="h-full rounded-card border border-border bg-surface p-6 shadow-soft">
                <blockquote>
                  <p className="line-clamp-6 text-ink [overflow-wrap:anywhere]">{item.quote}</p>
                </blockquote>
                <figcaption className="mt-4 font-semibold text-muted [overflow-wrap:anywhere]">
                  {item.display_name}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
        <Link href="/reviews" className={`mt-8 ${textLinkClass}`}>
          Read reviews
        </Link>
      </Container>
    </Section>
  );
}
