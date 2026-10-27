import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { site, visibleClientCount } from "@/content/site";
import { getTestimonials } from "@/lib/content";
import { marketingMetadata } from "@/lib/page-metadata";
import type { TestimonialRow } from "@/types/database";

export const dynamic = "force-dynamic";

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
          <p className="text-ink [overflow-wrap:anywhere]">{item.quote}</p>
        </blockquote>
        <figcaption className="mt-4 font-semibold text-muted [overflow-wrap:anywhere]">
          {name}
        </figcaption>
      </figure>
    </li>
  );
}

export default async function ReviewsPage() {
  const all = await getTestimonials();
  // Testimonials ARE filtered by is_approved (same as on the home page).
  const approved = all
    .filter((item) => item.is_approved)
    .sort((a, b) => a.sort_order - b.sort_order);

  const clientCount = visibleClientCount();

  return (
    <>
      {/* Hero / intro section — one h1 per page */}
      <Section aria-labelledby="reviews-page-title">
        <Container>
          <h1
            id="reviews-page-title"
            className="font-heading text-display text-ink [overflow-wrap:anywhere]"
          >
            {site.pages.reviews.title}
          </h1>
          <p className="mt-4 max-w-[70ch] text-lead text-muted [overflow-wrap:anywhere]">
            {site.pages.reviews.intro}
          </p>
          {/* Show client count only when visibleClientCount() returns a positive number */}
          {clientCount !== undefined && clientCount > 0 ? (
            <p className="mt-4 text-muted">
              {clientCount === 1 ? "1 client" : `${clientCount} clients`}
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
              Testimonials
            </h2>
            <p className="mt-6 text-muted">
              No reviews are published yet. Be the first to book a session.
            </p>
            <div className="mt-8">
              <Button href="/book" id="reviews-empty-book-btn">
                Book a session
              </Button>
            </div>
          </Container>
        </Section>
      ) : (
        <Section aria-labelledby="reviews-list-title" background="surface">
          <Container>
            <h2
              id="reviews-list-title"
              className="font-heading text-heading text-ink [overflow-wrap:anywhere]"
            >
              What clients say
            </h2>
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
            Ready to book?
          </h2>
          <p className="mt-4 max-w-[60ch] text-muted [overflow-wrap:anywhere]">
            Take the first step towards emotional well-being and personal growth. Book your confidential session today.
          </p>
          <div className="mt-8">
            <Button href="/book" id="reviews-cta-book-btn">
              Book a session
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
