import Link from "next/link";
import { Container } from "@/components/ui/container";
import { site } from "@/content/site";

const BASE = "/tempPages/design-6";

export function Design6BookingCta({
  headingId = "design6-booking-title",
  title,
  text,
  bookLabel,
}: {
  headingId?: string;
  title?: string;
  text?: string;
  bookLabel?: string;
}) {
  return (
    <section
      aria-labelledby={headingId}
      className="scroll-mt-48 bg-gradient-to-r from-[#E4E1FF] via-[#E8EDFF] to-[#DFF3EC] py-section text-slate-800 border-y border-indigo-200/70"
    >
      <Container className="max-w-3xl text-center">
        <h2
          id={headingId}
          className="font-heading text-heading text-slate-900 [overflow-wrap:anywhere]"
        >
          {title || site.home.bookingTitle}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lead text-slate-700 [overflow-wrap:anywhere]">
          {text ?? site.home.bookingText}
        </p>
        <Link
          href={`${BASE}/book`}
          className="mt-8 inline-flex min-h-12 max-w-full items-center justify-center rounded-button bg-[#FFFDF2] border border-amber-200/80 px-6 font-semibold text-indigo-700 shadow-soft [overflow-wrap:anywhere] hover:bg-white hover:border-indigo-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 transition"
        >
          {bookLabel || site.bookLabel}
        </Link>
      </Container>
    </section>
  );
}
