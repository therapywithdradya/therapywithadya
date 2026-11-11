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
import { site, wordmark } from "@/content/site";
import {
  getEventsAndWorkshops,
  getGalleryItems,
  getSessions,
  getTestimonials,
} from "@/lib/content";
import { getMetadataBase } from "@/lib/env.public";
import { clockMs } from "@/lib/format";
import { getSiteContent } from "@/lib/site-content.server";

export const revalidate = 60;

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
  const [sessions, testimonials, events, gallery, content] = await Promise.all([
    getSessions(),
    getTestimonials(),
    getEventsAndWorkshops(),
    getGalleryItems(),
    getSiteContent(),
  ]);
  const nowMs = clockMs();
  const approvedReviews = testimonials
    .filter((item) => item.is_approved)
    .sort((left, right) => left.sort_order - right.sort_order)
    .slice(0, 3);

  return (
    <>
      <Hero
        siteName={content.brand.siteName}
        support={content.hero.support}
        primaryCtaLabel={content.hero.primaryCtaLabel || content.brand.bookLabel}
        secondaryCtaLabel={content.hero.secondaryCtaLabel}
        bookHref={content.brand.bookHref}
        imageUrl={content.hero.imageUrl}
        imageAlt={content.hero.imageAlt}
        heading={
          <h1
            id="home-hero-title"
            className="font-heading text-display text-ink [overflow-wrap:anywhere]"
          >
            {content.hero.tagline}
          </h1>
        }
      />
      <AboutPreview
        eyebrow={content.homeSections.aboutEyebrow}
        intro={content.homeSections.aboutIntro}
        portraitSrc={content.homeSections.portraitUrl}
        portraitAlt={content.homeSections.portraitAlt}
        title={content.homeSections.aboutTitle}
        linkLabel={content.homeSections.aboutLinkLabel}
      />

      <ServicesOverview
        eyebrow={content.homeSections.servicesEyebrow}
        title={content.homeSections.servicesTitle}
        intro={content.homeSections.servicesIntro}
        services={content.services}
      />
      <SessionOptions
        sessions={sessions}
        eyebrow={content.homeSections.sessionsEyebrow}
        title={content.homeSections.sessionsTitle}
        intro={content.homeSections.sessionsIntro}
        linkLabel={content.homeSections.sessionsLinkLabel}
      />
      <BookingCta
        title={content.homeSections.bookingTitle}
        text={content.homeSections.bookingText}
        bookHref={content.brand.bookHref}
        bookLabel={content.brand.bookLabel}
      />
      <ReviewsPreview
        testimonials={approvedReviews}
        clientCount={content.brand.clientCount}
        eyebrow={content.homeSections.reviewsEyebrow}
        title={content.homeSections.reviewsTitle}
        intro={content.homeSections.reviewsIntro}
        linkLabel={content.homeSections.reviewsLinkLabel}
      />
      <EventsPreview
        events={events}
        nowMs={nowMs}
        eyebrow={content.homeSections.eventsEyebrow}
        title={content.homeSections.eventsTitle}
        emptyText={content.homeSections.eventsEmpty}
        linkLabel={content.homeSections.eventsLinkLabel}
      />
      <GalleryPreview
        items={gallery}
        eyebrow={content.homeSections.galleryEyebrow}
        title={content.homeSections.galleryTitle}
        emptyText={content.homeSections.galleryEmpty}
        linkLabel={content.homeSections.galleryLinkLabel}
      />
      <ContactSection
        eyebrow={content.homeSections.contactEyebrow}
        title={content.homeSections.contactTitle}
        intro={content.homeSections.contactIntro}
        email={content.contact.email}
        phone={content.contact.phone}
        whatsapp={content.contact.whatsapp}
        location={content.contact.location}
        socials={content.contact.socials}
        bookHref={content.brand.bookHref}
        bookLabel={content.brand.bookLabel}
      />
    </>
  );
}
