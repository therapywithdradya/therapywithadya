import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { SiteImage } from "@/components/ui/SiteImage";
import { filled, listedSocials, site, socialChannels, wordmark } from "@/content/site";
import {
  getEventsAndWorkshops,
  getGalleryItems,
  getSessions,
  getTestimonials,
} from "@/lib/content";
import { clockMs, formatDuration, formatEventDateRange } from "@/lib/format";
import { getSiteContent } from "@/lib/site-content.server";
import type { EventWorkshopRow } from "@/types/database";
import { Design6BookingCta } from "./components/design6-booking-cta";

export const revalidate = 60;

const BASE = "/tempPages/design-6";

const serviceCardPastels = [
  "bg-[#F4F2FF] border-indigo-200/80",
  "bg-[#FFF4F7] border-pink-200/80",
  "bg-[#EFF8F2] border-emerald-200/80",
  "bg-[#FBF6EB] border-amber-200/80",
  "bg-[#EFF7FF] border-sky-200/80",
  "bg-[#F6F1FF] border-violet-200/80",
];

function upcomingEvents(events: EventWorkshopRow[], nowMs: number): EventWorkshopRow[] {
  return events
    .filter((event) => {
      const boundary = Date.parse(event.ends_at ?? event.starts_at);
      return Number.isFinite(boundary) && boundary >= nowMs;
    })
    .sort((left, right) => Date.parse(left.starts_at) - Date.parse(right.starts_at))
    .slice(0, 2);
}

export default async function Design6HomePage() {
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
  const upcoming = upcomingEvents(events, nowMs);
  const galleryPreview = [...gallery].sort((a, b) => a.sort_order - b.sort_order).slice(0, 6);

  const heroImage = site.home.heroImage;
  const resolvedBrand = content.brand.siteName?.trim() || wordmark();
  const resolvedSupport = content.hero.support ?? site.home.support;
  const resolvedPrimaryLabel = content.hero.primaryCtaLabel?.trim() || content.brand.bookLabel;
  const resolvedSecondaryLabel = content.hero.secondaryCtaLabel?.trim() || "View session options";
  const resolvedImageUrl = content.hero.imageUrl?.trim() || heroImage.src;
  const resolvedImageAlt = content.hero.imageAlt?.trim() || heroImage.alt;

  const portrait = site.home.portrait;
  const aboutPortraitSrc = content.homeSections.portraitUrl || portrait.src;
  const aboutPortraitAlt = content.homeSections.portraitAlt || portrait.alt;
  const aboutIntro = content.homeSections.aboutIntro || site.home.aboutIntro;

  const displayServices = content.services ?? site.services;
  const clientCount = content.brand.clientCount;

  const rawEmail = content.contact.email;
  const rawPhone = content.contact.phone;
  const rawWhatsapp = content.contact.whatsapp;
  const rawLocation = content.contact.location;
  const email = filled(rawEmail) ? rawEmail.trim() : undefined;
  const phone = filled(rawPhone) ? rawPhone.trim() : undefined;
  const whatsapp = filled(rawWhatsapp) ? rawWhatsapp.trim() : undefined;
  const location = filled(rawLocation) ? rawLocation.trim() : undefined;
  const socials = content.contact.socials
    ? socialChannels.flatMap((ch) => {
        const href = content.contact.socials[ch.key];
        return filled(href) ? [{ key: ch.key, label: ch.label, href: href.trim() }] : [];
      })
    : listedSocials();
  const waDigits = whatsapp ? whatsapp.replace(/\D/g, "") : "";
  const waUrl =
    whatsapp && whatsapp.startsWith("http")
      ? whatsapp
      : waDigits
        ? `https://wa.me/${waDigits}`
        : undefined;
  const hasContactDetails = Boolean(email || phone || whatsapp || location || socials.length > 0);

  return (
    <>
      {/* 1. HERO — Soft Yellowish-White → Light Indigo → Soft Sky Blue */}
      <section
        aria-labelledby="home-hero-title"
        className="relative overflow-hidden bg-gradient-to-b from-[#FFFDF2] via-[#F2F0FF] to-[#EAF4FF] py-14 sm:py-20 lg:py-24"
      >
        <Container className="grid min-w-0 items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12 xl:gap-16">
          <div className="min-w-0">
            <p className="max-w-full font-heading text-xs sm:text-sm font-semibold tracking-[0.18em] text-indigo-600 uppercase [overflow-wrap:anywhere]">
              {resolvedBrand}
            </p>
            <h1
              id="home-hero-title"
              className="mt-3.5 font-heading text-[clamp(1.85rem,3.4vw,2.85rem)] font-medium leading-[1.22] tracking-tight text-slate-900 [overflow-wrap:anywhere]"
            >
              {content.hero.tagline}
            </h1>
            <p className="mt-4 max-w-xl text-base sm:text-lg leading-relaxed text-slate-600 [overflow-wrap:anywhere]">
              {resolvedSupport}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href={`${BASE}/book`}
                className="inline-flex min-h-12 items-center justify-center rounded-button bg-indigo-500 px-6 font-semibold text-white shadow-soft hover:bg-indigo-600 transition w-full sm:w-auto"
              >
                {resolvedPrimaryLabel}
              </Link>
              <Link
                href={`${BASE}/sessions`}
                className="inline-flex min-h-12 items-center justify-center rounded-button border border-indigo-200 bg-[#FFFDF5] px-6 font-semibold text-indigo-700 shadow-xs hover:bg-white hover:border-indigo-300 transition w-full sm:w-auto"
              >
                {resolvedSecondaryLabel}
              </Link>
            </div>
          </div>
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="relative w-full">
              <div
                className="absolute -inset-2 rounded-[1.75rem] bg-gradient-to-tr from-indigo-200/50 via-amber-100/50 to-pink-100/50 blur-lg pointer-events-none"
                aria-hidden="true"
              />
              <SiteImage
                src={resolvedImageUrl}
                alt={resolvedImageAlt}
                width={heroImage.width}
                height={heroImage.height}
                sizes="(min-width: 1024px) 36rem, 100vw"
                priority
                className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] w-full rounded-[1.5rem] border-4 border-white/90 object-cover shadow-card"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* 2. ABOUT PREVIEW — Warm Beige */}
      <section
        aria-labelledby="home-about-title"
        className="bg-gradient-to-b from-[#FBF7EE] to-[#F5EDE0] py-section border-y border-amber-200/60"
      >
        <Container>
          <SectionHeading
            id="home-about-title"
            eyebrow={content.homeSections.aboutEyebrow || "About"}
            title={content.homeSections.aboutTitle || site.home.aboutTitle}
            className="mx-auto text-center"
          />
          <div className="mx-auto mt-8 grid max-w-4xl items-center gap-8 md:grid-cols-[minmax(0,16rem)_minmax(0,1fr)]">
            <SiteImage
              src={aboutPortraitSrc}
              alt={aboutPortraitAlt}
              width={portrait.width}
              height={portrait.height}
              sizes="(min-width: 768px) 16rem, 100vw"
              className="aspect-[4/5] w-full rounded-[1.25rem] border-4 border-white object-cover shadow-card"
            />
            <div className="min-w-0 rounded-2xl border border-amber-200/70 bg-[#FFFDF8]/90 p-6 sm:p-8 shadow-soft">
              <div className="border-l-2 border-indigo-400 pl-5 space-y-3 text-slate-600 [overflow-wrap:anywhere]">
                {aboutIntro.split(/\n\n+/).map((para, i) => (
                  <p key={i}>{para.trim()}</p>
                ))}
              </div>
              <Link
                href={`${BASE}/about`}
                className="mt-5 inline-flex min-h-11 items-center font-semibold text-indigo-600 underline-offset-4 hover:underline"
              >
                {content.homeSections.aboutLinkLabel || "Read more about me"}
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. SERVICES OVERVIEW — Light Sky Blue */}
      <section
        aria-labelledby="home-services-title"
        className="bg-gradient-to-b from-[#EFF7FF] to-[#E6F2FC] py-section"
      >
        <Container>
          <SectionHeading
            id="home-services-title"
            eyebrow={content.homeSections.servicesEyebrow || "Services"}
            title={content.homeSections.servicesTitle || site.home.servicesTitle}
            intro={content.homeSections.servicesIntro ?? site.home.servicesIntro}
            className="mx-auto text-center"
          />
          {displayServices.length > 0 ? (
            <ul className="mt-8 grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
              {displayServices.map((service, idx) => (
                <li key={service.slug} className="min-w-0">
                  <div
                    className={`flex h-full flex-col rounded-card border p-6 shadow-soft transition hover:shadow-card ${
                      serviceCardPastels[idx % serviceCardPastels.length]
                    }`}
                  >
                    <p className="font-heading text-xs font-semibold tracking-[0.16em] text-indigo-600 uppercase">
                      {service.eyebrow}
                    </p>
                    <h3 className="mt-2 line-clamp-2 font-heading text-[clamp(1.15rem,2vw,1.4rem)] leading-snug text-slate-900 [overflow-wrap:anywhere]">
                      {service.title}
                    </h3>
                    <p className="mt-3 line-clamp-4 flex-1 text-slate-600 [overflow-wrap:anywhere]">
                      {service.shortDescription}
                    </p>
                    <div className="mt-5 border-t border-slate-200/70 pt-3">
                      <Link
                        href={`${BASE}/services#${service.slug}`}
                        className="inline-flex min-h-11 items-center font-semibold text-indigo-600 underline-offset-4 hover:underline [overflow-wrap:anywhere]"
                      >
                        View {service.title}
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : null}
        </Container>
      </section>

      {/* 4. SESSION OPTIONS — Soft Sage Green */}
      <section
        id="sessions"
        aria-labelledby="home-sessions-title"
        className="bg-gradient-to-b from-[#EFF8F2] to-[#E3F2E8] py-section border-y border-emerald-200/60"
      >
        <Container>
          <SectionHeading
            id="home-sessions-title"
            eyebrow={content.homeSections.sessionsEyebrow || "Sessions"}
            title={content.homeSections.sessionsTitle || site.home.sessionsTitle}
            intro={content.homeSections.sessionsIntro ?? site.home.sessionsIntro}
          />
          <ul className="mt-8 grid list-none gap-6 p-0 md:grid-cols-2 lg:grid-cols-3">
            {sessions.map((session) => (
              <li key={session.slug} className="min-w-0">
                <div className="flex h-full flex-col rounded-card border border-emerald-200/80 bg-[#FFFDF9] p-6 shadow-soft">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-heading text-xs font-semibold tracking-[0.16em] text-emerald-700 uppercase">
                      {session.durationLabel ?? formatDuration(session.durationMinutes)}
                    </span>
                    {session.mode === "online" ? (
                      <Badge className="shrink-0 bg-emerald-50 text-emerald-800 border-emerald-200">
                        Online
                      </Badge>
                    ) : null}
                  </div>
                  <h3 className="mt-3 font-heading text-[clamp(1.2rem,2vw,1.45rem)] leading-snug text-slate-900 [overflow-wrap:anywhere]">
                    {session.name}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-slate-600 [overflow-wrap:anywhere]">
                    {session.description}
                  </p>
                  <dl className="mt-5 flex-1 space-y-3 border-t border-slate-100 pt-4 text-sm">
                    <div className="min-w-0">
                      <dt className="font-semibold text-slate-800">Duration</dt>
                      <dd className="text-slate-600">
                        {session.durationLabel ?? formatDuration(session.durationMinutes)}
                      </dd>
                    </div>
                  </dl>
                  <div className="mt-6 border-t border-slate-100 pt-5">
                    {session.priceLabel ? (
                      <p className="text-xl font-bold text-indigo-600 [overflow-wrap:anywhere]">
                        {session.priceLabel}
                      </p>
                    ) : null}
                    <Link
                      href={`${BASE}/book?session=${encodeURIComponent(session.slug)}`}
                      className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-button bg-indigo-500 px-4 font-semibold text-white shadow-xs hover:bg-indigo-600 transition"
                    >
                      Book this session
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <Link
            href={`${BASE}/sessions`}
            className="mt-8 inline-flex min-h-11 items-center font-semibold text-emerald-800 underline-offset-4 hover:underline"
          >
            {content.homeSections.sessionsLinkLabel || "View full session details"}
          </Link>
        </Container>
      </section>

      {/* 5. BOOKING CTA — Light Pastel Indigo + Soft Yellowish-White */}
      <Design6BookingCta
        title={content.homeSections.bookingTitle}
        text={content.homeSections.bookingText}
        bookLabel={content.brand.bookLabel}
      />

      {/* 6. REVIEWS PREVIEW — Soft Blush Pink */}
      {approvedReviews.length > 0 ? (
        <section
          aria-labelledby="home-reviews-title"
          className="bg-gradient-to-b from-[#FFF5F7] to-[#FCEAF0] py-section"
        >
          <Container>
            <SectionHeading
              id="home-reviews-title"
              eyebrow={content.homeSections.reviewsEyebrow || "Reviews"}
              title={content.homeSections.reviewsTitle || site.home.reviewsTitle}
              intro={content.homeSections.reviewsIntro ?? site.home.reviewsIntro}
            />
            {clientCount > 0 ? (
              <p className="mt-4 font-medium text-pink-700">
                Over {clientCount.toLocaleString("en-IN")}+ clients supported
              </p>
            ) : null}
            <ul className="mt-8 grid list-none gap-6 p-0 lg:grid-cols-3">
              {approvedReviews.map((item) => (
                <li key={item.id} className="min-w-0">
                  <figure className="flex h-full flex-col rounded-card border border-pink-200/70 bg-white/90 p-6 shadow-soft">
                    <blockquote className="grow">
                      <p className="line-clamp-6 leading-relaxed text-slate-700 [overflow-wrap:anywhere]">
                        {item.quote}
                      </p>
                    </blockquote>
                    <figcaption className="mt-4 border-t border-pink-100 pt-3 font-semibold text-indigo-600 [overflow-wrap:anywhere]">
                      — {item.display_name || "Anonymous"}
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
            <Link
              href={`${BASE}/reviews`}
              className="mt-8 inline-flex min-h-11 items-center font-semibold text-pink-700 underline-offset-4 hover:underline"
            >
              {content.homeSections.reviewsLinkLabel || "Read reviews"}
            </Link>
          </Container>
        </section>
      ) : null}

      {/* 7. EVENTS PREVIEW — Soft Yellowish-Cream */}
      <section
        aria-labelledby="home-events-title"
        className="bg-gradient-to-b from-[#FFFDF2] to-[#FAF3DC] py-section border-y border-amber-200/60"
      >
        <Container>
          <SectionHeading
            id="home-events-title"
            eyebrow={content.homeSections.eventsEyebrow || "Events"}
            title={content.homeSections.eventsTitle || site.home.eventsTitle}
          />
          {upcoming.length === 0 ? (
            <p className="mt-6 text-slate-600">
              {content.homeSections.eventsEmpty ?? site.home.eventsEmpty}
            </p>
          ) : (
            <ul className="mt-8 grid list-none gap-6 p-0 md:grid-cols-2">
              {upcoming.map((event) => {
                const when = formatEventDateRange(
                  event.starts_at,
                  event.ends_at,
                  site.businessTimezone,
                );
                return (
                  <li key={event.id} className="min-w-0">
                    <div className="h-full rounded-card border border-amber-200 bg-white/90 p-6 shadow-soft">
                      <Badge className="bg-amber-50 text-amber-800 border-amber-200">
                        {event.kind === "workshop" ? "Workshop" : "Event"}
                      </Badge>
                      <h3 className="mt-3 line-clamp-2 font-heading text-[clamp(1.15rem,2vw,1.4rem)] text-slate-900 [overflow-wrap:anywhere]">
                        {event.title}
                      </h3>
                      {when.startIso ? (
                        <p className="mt-3 text-slate-600 [overflow-wrap:anywhere]">
                          <time dateTime={when.startIso}>{when.startLabel}</time>
                          {when.endIso && when.endLabel ? (
                            <>
                              {" - "}
                              <time dateTime={when.endIso}>{when.endLabel}</time>
                            </>
                          ) : null}
                        </p>
                      ) : (
                        <p className="mt-3 text-slate-600">{when.text}</p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          <Link
            href={`${BASE}/events`}
            className="mt-8 inline-flex min-h-11 items-center font-semibold text-indigo-600 underline-offset-4 hover:underline"
          >
            {content.homeSections.eventsLinkLabel || "View events and workshops"}
          </Link>
        </Container>
      </section>

      {/* 8. GALLERY PREVIEW — Soft Lavender */}
      <section
        aria-labelledby="home-gallery-title"
        className="bg-gradient-to-b from-[#F5F2FF] to-[#ECE7FF] py-section"
      >
        <Container>
          <SectionHeading
            id="home-gallery-title"
            eyebrow={content.homeSections.galleryEyebrow || "Gallery"}
            title={content.homeSections.galleryTitle || site.home.galleryTitle}
          />
          {galleryPreview.length === 0 ? (
            <p className="mt-6 text-slate-600">
              {content.homeSections.galleryEmpty ?? site.home.galleryEmpty}
            </p>
          ) : (
            <ul className="mt-8 grid list-none grid-cols-2 gap-3 p-0 sm:gap-4 lg:grid-cols-3">
              {galleryPreview.map((item) => (
                <li key={item.id} className="min-w-0">
                  <Link href={`${BASE}/gallery`} className="block rounded-[1.25rem]">
                    <SiteImage
                      src={item.image_path}
                      alt={item.alt_text}
                      width={1200}
                      height={800}
                      sizes="(min-width: 1024px) 22rem, 50vw"
                      className="aspect-[3/2] w-full rounded-[1.25rem] border-2 border-white object-cover shadow-soft"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Link
            href={`${BASE}/gallery`}
            className="mt-8 inline-flex min-h-11 items-center font-semibold text-indigo-700 underline-offset-4 hover:underline"
          >
            {content.homeSections.galleryLinkLabel || "View the gallery"}
          </Link>
        </Container>
      </section>

      {/* 9. CONTACT SECTION — Warm Beige to Light Blue */}
      <section
        aria-labelledby="home-contact-title"
        className="bg-gradient-to-b from-[#FBF7EE] to-[#EDF6FF] py-section border-t border-indigo-100"
      >
        <Container>
          <SectionHeading
            id="home-contact-title"
            eyebrow={content.homeSections.contactEyebrow || "Contact"}
            title={content.homeSections.contactTitle || site.home.contactTitle}
            intro={content.homeSections.contactIntro ?? site.home.contactIntro}
          />
          {hasContactDetails ? (
            <ul className="mt-6 max-w-xl list-none space-y-2 p-0">
              {email ? (
                <li>
                  <a
                    href={`mailto:${email}`}
                    className="inline-flex min-h-11 items-center gap-2 text-slate-700 underline-offset-4 hover:text-indigo-600 hover:underline"
                  >
                    <Mail className="size-5 shrink-0 text-indigo-500" aria-hidden="true" />
                    <span>{email}</span>
                  </a>
                </li>
              ) : null}
              {phone ? (
                <li>
                  <a
                    href={`tel:${phone.replace(/\s+/g, "")}`}
                    className="inline-flex min-h-11 items-center gap-2 text-slate-700 underline-offset-4 hover:text-indigo-600 hover:underline"
                  >
                    <Phone className="size-5 shrink-0 text-indigo-500" aria-hidden="true" />
                    <span>{phone}</span>
                  </a>
                </li>
              ) : null}
              {waUrl ? (
                <li>
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 text-slate-700 underline-offset-4 hover:text-indigo-600 hover:underline"
                  >
                    <span>WhatsApp ({whatsapp})</span>
                  </a>
                </li>
              ) : null}
              {location ? (
                <li className="flex min-h-11 items-center gap-2 text-slate-700 [overflow-wrap:anywhere]">
                  <MapPin className="size-5 shrink-0 text-emerald-600" aria-hidden="true" />
                  <span>{location}</span>
                </li>
              ) : null}
              {socials.length > 0 ? (
                <li>
                  <ul className="list-none space-y-1 p-0">
                    {socials.map((item) => (
                      <li key={item.key}>
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-11 items-center gap-2 text-indigo-600 underline-offset-4 hover:underline"
                        >
                          {item.label}
                          <span className="sr-only"> (opens in a new tab)</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : null}
            </ul>
          ) : null}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href={`${BASE}/contact`}
              className="inline-flex min-h-11 items-center justify-center rounded-button bg-indigo-500 px-6 font-semibold text-white shadow-xs hover:bg-indigo-600 transition w-full sm:w-auto"
            >
              Contact page
            </Link>
            <Link
              href={`${BASE}/book`}
              className="inline-flex min-h-11 items-center justify-center rounded-button border border-indigo-200 bg-white px-6 font-semibold text-indigo-700 shadow-xs hover:bg-indigo-50 transition w-full sm:w-auto"
            >
              {content.brand.bookLabel}
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
