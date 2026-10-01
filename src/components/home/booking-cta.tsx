import Link from "next/link";
import { Container } from "@/components/ui/container";
import { site } from "@/content/site";

export function BookingCta() {
  return (
    <section aria-labelledby="home-booking-title" className="scroll-mt-48 bg-primary py-section text-on-primary">
      <Container className="max-w-3xl text-center">
        <h2
          id="home-booking-title"
          className="font-heading text-heading text-on-primary [overflow-wrap:anywhere]"
        >
          {site.home.bookingTitle}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lead [overflow-wrap:anywhere]">
          {site.home.bookingText}
        </p>
        <Link
          href={site.bookHref}
          className="mt-8 inline-flex min-h-12 max-w-full items-center justify-center rounded-button bg-background px-5 font-semibold text-ink shadow-soft [overflow-wrap:anywhere] hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-background"
        >
          {site.bookLabel}
        </Link>
      </Container>
    </section>
  );
}
