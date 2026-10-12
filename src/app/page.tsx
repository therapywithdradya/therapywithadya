import type { Metadata } from "next";
import { AboutPreview } from "@/components/home/about-preview";
import { BookingCta } from "@/components/home/booking-cta";
import { ContactSection } from "@/components/home/contact-section";
import { EventsPreview } from "@/components/home/events-preview";
import { GalleryPreview } from "@/components/home/gallery-preview";
import { Hero } from "@/components/home/hero";
import { ReviewsPreview } from "@/components/home/reviews-preview";
import { ServicesOverview } from "@/components/home/services-overview";
import { SessionOptions } from "@/components/home/session-options";
import { positioningLine, site, visibleClientCount, wordmark } from "@/content/site";
import {
  getEventsAndWorkshops,
  getGalleryItems,
  getSessions,
  getTestimonials,
} from "@/lib/content";
import { getMetadataBase } from "@/lib/env.public";
import { clockMs } from "@/lib/format";

export const revalidate = 3600;

const homeTitle = wordmark();

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: { absolute: homeTitle },
  description: site.home.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: homeTitle,
    title: homeTitle,
    description: site.home.description,
    images: [
      {
        url: "/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Therapy with Dr. Adya Vats - Psychologist and Counselor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: homeTitle,
    description: site.home.description,
    images: ["/images/og-default.jpg"],
  },
};

export default async function Home() {
  const [sessions, testimonials, events, gallery] = await Promise.all([
    getSessions(),
    getTestimonials(),
    getEventsAndWorkshops(),
    getGalleryItems(),
  ]);
  const nowMs = clockMs();
  const approvedReviews = testimonials
    .filter((item) => item.is_approved)
    .sort((left, right) => left.sort_order - right.sort_order)
    .slice(0, 3);

  return (
    <>
      <Hero
        heading={
          <h1
            id="home-hero-title"
            className="font-heading text-display text-ink [overflow-wrap:anywhere]"
          >
            {positioningLine()}
          </h1>
        }
      />
      <AboutPreview />
      <ServicesOverview />
      <SessionOptions sessions={sessions} />
      <BookingCta />
      <ReviewsPreview testimonials={approvedReviews} clientCount={visibleClientCount()} />
      <EventsPreview events={events} nowMs={nowMs} />
      <GalleryPreview items={gallery} />
      <ContactSection />
    </>
  );
}
