import Link from "next/link";
import { Container } from "@/components/ui/container";
import { site } from "@/content/site";

export function BookingCta({
  headingId = "home-booking-title",
  title,
  text,
  bookHref,
  bookLabel,
}: {
  headingId?: string;
  title?: string;
  text?: string;
  bookHref?: string;
  bookLabel?: string;
}) {
  return (
    <section aria-labelledby={headingId} className="scroll-mt-48 bg-primary py-section text-on-primary">
      <Container className="max-w-3xl text-center">
        <h2
          id={headingId}
          className="font-heading text-heading text-on-primary [overflow-wrap:anywhere]"
        >
          {title || site.home.bookingTitle}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lead [overflow-wrap:anywhere]">
          {text ?? site.home.bookingText}
        </p>
        <Link
          href={bookHref || site.bookHref}
          className="mt-8 inline-flex min-h-12 max-w-full items-center justify-center rounded-button bg-background px-5 font-semibold text-ink shadow-soft [overflow-wrap:anywhere] hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-background"
        >
          {bookLabel || site.bookLabel}
        </Link>
      </Container>
    </section>
  );
}
