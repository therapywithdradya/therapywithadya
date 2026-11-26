import { Star } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { getTestimonials } from "@/lib/content";
import { getSiteContent } from "@/lib/site-content.server";
import type { TestimonialRow } from "@/types/database";

export const revalidate = 60;

const BASE = "/tempPages/design-6";

const cardPastels = [
  "bg-white/95 border-pink-200/80",
  "bg-[#FFFDF6] border-amber-200/80",
  "bg-[#F5F2FF] border-indigo-200/80",
];

function StarRating({ rating }: { rating: number }) {
  const clamped = Math.min(5, Math.max(1, Math.round(rating)));
  return (
    <span role="img" aria-label={`${clamped} out of 5`} className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`size-4 ${i < clamped ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

function TestimonialCard({ item, idx }: { item: TestimonialRow; idx: number }) {
  const name = item.display_name.trim() || "Anonymous";
  return (
    <li className="min-w-0">
      <figure
        className={`flex h-full flex-col rounded-card border p-6 shadow-soft ${
          cardPastels[idx % cardPastels.length]
        }`}
      >
        {typeof item.rating === "number" && item.rating > 0 ? (
          <div className="mb-4">
            <StarRating rating={item.rating} />
          </div>
        ) : null}
        <blockquote className="grow">
          <p className="text-slate-700 leading-relaxed [overflow-wrap:anywhere]">{item.quote}</p>
        </blockquote>
        <figcaption className="mt-5 border-t border-slate-200/70 pt-4 font-semibold text-indigo-600 [overflow-wrap:anywhere]">
          — {name}
        </figcaption>
      </figure>
    </li>
  );
}

export default async function Design6ReviewsPage() {
  const [all, content] = await Promise.all([getTestimonials(), getSiteContent()]);
  const copy = content.pagesCopy.reviews;
  const approved = all
    .filter((item) => item.is_approved)
    .sort((a, b) => a.sort_order - b.sort_order);
  const clientCount = content.brand.clientCount;

  return (
    <>
      <section
        aria-labelledby="reviews-page-title"
        className="bg-gradient-to-b from-[#FFFDF2] via-[#FFF5F7] to-[#FCEAF0] py-section"
      >
        <Container>
          <p className="font-heading text-xs font-semibold tracking-[0.18em] text-pink-700 uppercase">
            {copy.eyebrow}
          </p>
          <h1
            id="reviews-page-title"
            className="mt-3 font-heading text-display text-slate-900 [overflow-wrap:anywhere]"
          >
            {copy.title}
          </h1>
          <p className="mt-4 max-w-[70ch] text-lead text-slate-600 [overflow-wrap:anywhere]">
            {copy.intro}
          </p>
          {clientCount > 0 ? (
            <p className="mt-4 font-medium text-indigo-600">
              Over {clientCount.toLocaleString("en-IN")}+ clients supported
            </p>
          ) : null}
        </Container>
      </section>

      {approved.length === 0 ? (
        <section
          aria-labelledby="reviews-empty-title"
          className="bg-gradient-to-b from-[#F5F2FF] to-[#ECE7FF] py-section"
        >
          <Container>
            <h2
              id="reviews-empty-title"
              className="font-heading text-heading text-slate-900 [overflow-wrap:anywhere]"
            >
              {copy.listEyebrow}
            </h2>
            <p className="mt-6 text-slate-600">
              No reviews are published yet. Be the first to book a session.
            </p>
            <div className="mt-8">
              <Link
                href={`${BASE}/book`}
                className="inline-flex min-h-11 items-center rounded-button bg-indigo-500 px-6 font-semibold text-white shadow-xs hover:bg-indigo-600 transition"
              >
                {content.brand.bookLabel}
              </Link>
            </div>
          </Container>
        </section>
      ) : (
        <section
          aria-labelledby="reviews-list-title"
          className="bg-gradient-to-b from-[#EFF7FF] to-[#F3F1FF] py-section border-y border-indigo-100"
        >
          <Container>
            <SectionHeading
              id="reviews-list-title"
              eyebrow={copy.listEyebrow}
              title={copy.listTitle}
            />
            <ul className="mt-8 grid list-none gap-6 p-0 md:grid-cols-2 lg:grid-cols-3" role="list">
              {approved.map((item, idx) => (
                <TestimonialCard key={item.id} item={item} idx={idx} />
              ))}
            </ul>
          </Container>
        </section>
      )}

      <section
        aria-labelledby="reviews-cta-title"
        className="bg-gradient-to-r from-[#FBF7EE] via-[#EFF8F2] to-[#EAE8FF] py-section"
      >
        <Container>
          <h2
            id="reviews-cta-title"
            className="font-heading text-heading text-slate-900 [overflow-wrap:anywhere]"
          >
            {copy.ctaTitle}
          </h2>
          <p className="mt-4 max-w-[60ch] text-slate-600 [overflow-wrap:anywhere]">
            {copy.ctaText}
          </p>
          <div className="mt-8">
            <Link
              href={`${BASE}/book`}
              className="inline-flex min-h-11 items-center rounded-button bg-indigo-500 px-6 font-semibold text-white shadow-xs hover:bg-indigo-600 transition"
            >
              {content.brand.bookLabel}
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
