import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { site } from "@/content/site";
import { getTestimonials } from "@/lib/content";
import { marketingMetadata } from "@/lib/page-metadata";
import { getSiteContent } from "@/lib/site-content.server";
import type { TestimonialRow } from "@/types/database";

export const revalidate = 60;

export const metadata = marketingMetadata({
  title: site.pages.reviews.title,
  description: site.pages.reviews.description,
  path: "/reviews",
});


function StarRating({ rating }: { rating: number }) {
  const clamped = Math.min(5, Math.max(1, Math.round(rating)));
  return (
    <span
      role="img"
      aria-label={`${clamped} out of 5`}
      className="flex gap-0.5"
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`size-4 ${i < clamped ? "fill-primary text-primary" : "text-border"}`}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

function TestimonialCard({ item }: { item: TestimonialRow }) {
  const name = item.display_name.trim() || "Anonymous";

  return (
    <li className="min-w-0">
      <figure className="flex h-full flex-col rounded-card border border-border bg-surface p-6 shadow-soft">
        {typeof item.rating === "number" && item.rating > 0 ? (
          <div className="mb-4">
            <StarRating rating={item.rating} />
          </div>
        ) : null}
        <blockquote className="grow">
          <p className="text-ink leading-relaxed [overflow-wrap:anywhere]">{item.quote}</p>
        </blockquote>
        <figcaption className="mt-5 border-t border-border/60 pt-4 font-semibold text-primary [overflow-wrap:anywhere]">
          — {name}
        </figcaption>
      </figure>
    </li>
  );
}

export default async function ReviewsPage() {
  const [all, content] = await Promise.all([
    getTestimonials(),
    getSiteContent(),
  ]);
  const copy = content.pagesCopy.reviews;
  // Testimonials ARE filtered by is_approved (same as on the home page).
  const approved = all
    .filter((item) => item.is_approved)
    .sort((a, b) => a.sort_order - b.sort_order);

  const clientCount = content.brand.clientCount;

  return (
    <>
      {/* Hero / intro section — one h1 per page */}
      <Section aria-labelledby="reviews-page-title">
        <Container>
          <p className="font-heading text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            {copy.eyebrow}
          </p>
          <h1
            id="reviews-page-title"
            className="mt-3 font-heading text-display text-ink [overflow-wrap:anywhere]"
          >
            {copy.title}
          </h1>
          <p className="mt-4 max-w-[70ch] text-lead text-muted [overflow-wrap:anywhere]">
            {copy.intro}
          </p>
          {/* Show client count when set to a positive number */}
          {clientCount > 0 ? (
            <p className="mt-4 font-medium text-primary">
              Over {clientCount.toLocaleString("en-IN")}+ clients supported
            </p>
          ) : null}
        </Container>
      </Section>

      {approved.length === 0 ? (
        /* Empty state — calm message and a Book a session button */
        <Section aria-labelledby="reviews-empty-title" background="surface">
          <Container>
            <h2
              id="reviews-empty-title"
              className="font-heading text-heading text-ink [overflow-wrap:anywhere]"
            >
              {copy.listEyebrow}
            </h2>
            <p className="mt-6 text-muted">
              No reviews are published yet. Be the first to book a session.
            </p>
            <div className="mt-8">
              <Button href={content.brand.bookHref} id="reviews-empty-book-btn">
                {content.brand.bookLabel}
              </Button>
            </div>
          </Container>
        </Section>
      ) : (
        <Section aria-labelledby="reviews-list-title" background="surface">
          <Container>
            <SectionHeading
              id="reviews-list-title"
              eyebrow={copy.listEyebrow}
              title={copy.listTitle}
            />
            <ul className="mt-8 grid list-none gap-6 p-0 md:grid-cols-2 lg:grid-cols-3" role="list">
              {approved.map((item) => (
                <TestimonialCard key={item.id} item={item} />
              ))}
            </ul>
          </Container>
        </Section>
      )}

      {/* Closing CTA */}
      <Section aria-labelledby="reviews-cta-title">
        <Container>
          <h2
            id="reviews-cta-title"
            className="font-heading text-heading text-ink [overflow-wrap:anywhere]"
          >
            {copy.ctaTitle}
          </h2>
          <p className="mt-4 max-w-[60ch] text-muted [overflow-wrap:anywhere]">
            {copy.ctaText}
          </p>
          <div className="mt-8">
            <Button href={content.brand.bookHref} id="reviews-cta-book-btn">
              {content.brand.bookLabel}
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
