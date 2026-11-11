"use client";

import { useRef } from "react";
import {
  AdminSaveBar,
  AdminSectionCard,
  type SiteContentTabProps,
} from "./editor-shared";

export function HeroHomeTab({
  content,
  setContent,
  onSave,
  isSaving,
  inputClass,
  textareaClass,
  onUploadFile,
}: SiteContentTabProps) {
  const heroUploadRef = useRef<HTMLInputElement>(null);
  const portraitUploadRef = useRef<HTMLInputElement>(null);

  const updateBrand = (patch: Partial<typeof content.brand>) =>
    setContent((prev) => ({ ...prev, brand: { ...prev.brand, ...patch } }));

  const updateContact = (patch: Partial<typeof content.contact>) =>
    setContent((prev) => ({ ...prev, contact: { ...prev.contact, ...patch } }));

  const updateSocial = (patch: Partial<typeof content.contact.socials>) =>
    setContent((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        socials: { ...prev.contact.socials, ...patch },
      },
    }));

  const updateHero = (patch: Partial<typeof content.hero>) =>
    setContent((prev) => ({ ...prev, hero: { ...prev.hero, ...patch } }));

  const updateHome = (patch: Partial<typeof content.homeSections>) =>
    setContent((prev) => ({
      ...prev,
      homeSections: { ...prev.homeSections, ...patch },
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-8">
      {/* 1. HERO SECTION */}
      <AdminSectionCard
        title="Homepage Hero Section"
        description="Customize the main headline, subheading paragraph, CTA button labels, and hero image shown at the top of the home page."
      >
        <div>
          <label className="block text-sm font-medium text-ink">
            Main Hero Headline (H1)
          </label>
          <textarea
            rows={3}
            value={content.hero.tagline}
            onChange={(e) => updateHero({ tagline: e.target.value })}
            className={textareaClass}
            placeholder="A safe, compassionate, and trauma-informed space to heal..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink">
            Hero Support Paragraph
          </label>
          <textarea
            rows={3}
            value={content.hero.support}
            onChange={(e) => updateHero({ support: e.target.value })}
            className={textareaClass}
            placeholder="Supporting adolescents and adults through anxiety, stress..."
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-ink">
              Primary CTA Button Label
            </label>
            <input
              type="text"
              value={content.hero.primaryCtaLabel}
              onChange={(e) => updateHero({ primaryCtaLabel: e.target.value })}
              className={inputClass}
              placeholder="Book a session"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink">
              Secondary CTA Button Label
            </label>
            <input
              type="text"
              value={content.hero.secondaryCtaLabel}
              onChange={(e) => updateHero({ secondaryCtaLabel: e.target.value })}
              className={inputClass}
              placeholder="Explore services"
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-background p-4">
            <span className="block text-sm font-semibold text-ink">Hero Image</span>
            <p className="mt-0.5 text-xs text-muted">
              Displayed beside the hero headline on the homepage.
            </p>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="h-20 w-32 shrink-0 overflow-hidden rounded-lg border border-border bg-surface">
                {content.hero.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={content.hero.imageUrl}
                    alt={content.hero.imageAlt || "Hero preview"}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1 space-y-2">
                {onUploadFile ? (
                  <>
                    <input
                      ref={heroUploadRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          onUploadFile(file, (url) => updateHero({ imageUrl: url }));
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => heroUploadRef.current?.click()}
                      className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-ink hover:border-primary/50"
                    >
                      Upload New Hero Photo
                    </button>
                  </>
                ) : null}
                <input
                  type="text"
                  value={content.hero.imageUrl}
                  onChange={(e) => updateHero({ imageUrl: e.target.value })}
                  className={inputClass}
                  placeholder="/images/hero-space.jpg"
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-background p-4">
            <label className="block text-sm font-semibold text-ink">
              Hero Image Alt Text (Accessibility)
            </label>
            <p className="mt-0.5 text-xs text-muted">
              Screen-reader description of the hero space photo.
            </p>
            <textarea
              rows={3}
              value={content.hero.imageAlt}
              onChange={(e) => updateHero({ imageAlt: e.target.value })}
              className={textareaClass}
            />
          </div>
        </div>
      </AdminSectionCard>

      {/* 2. BRAND, NAVIGATION CTA & CONTACT */}
      <AdminSectionCard
        title="Brand Identity, Navigation & Contact Details"
        description="Controls the site wordmark in the header/footer, practitioner name, supported client count badge, contact details, and social links."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-ink">
              Site Wordmark (Navbar &amp; Footer)
            </label>
            <input
              type="text"
              value={content.brand.siteName}
              onChange={(e) => updateBrand({ siteName: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink">Practitioner Name</label>
            <input
              type="text"
              value={content.brand.practitionerName}
              onChange={(e) => updateBrand({ practitionerName: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink">
              Clients Supported Count
            </label>
            <input
              type="number"
              min={0}
              step={50}
              value={content.brand.clientCount}
              onChange={(e) =>
                updateBrand({ clientCount: Math.max(0, Number(e.target.value) || 0) })
              }
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-ink">
              Header / Footer Book Button Label
            </label>
            <input
              type="text"
              value={content.brand.bookLabel}
              onChange={(e) => updateBrand({ bookLabel: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink">
              Header / Footer Book Button Destination
            </label>
            <input
              type="text"
              value={content.brand.bookHref}
              onChange={(e) => updateBrand({ bookHref: e.target.value })}
              className={inputClass}
              placeholder="/book"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="block text-sm font-medium text-ink">Email Address</label>
            <input
              type="email"
              value={content.contact.email}
              onChange={(e) => updateContact({ email: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink">Phone Number</label>
            <input
              type="text"
              value={content.contact.phone}
              onChange={(e) => updateContact({ phone: e.target.value })}
              className={inputClass}
              placeholder="+91 ..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink">WhatsApp Number</label>
            <input
              type="text"
              value={content.contact.whatsapp}
              onChange={(e) => updateContact({ whatsapp: e.target.value })}
              className={inputClass}
              placeholder="Digits with country code"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink">Availability Hours</label>
            <input
              type="text"
              value={content.contact.availabilityHours}
              onChange={(e) => updateContact({ availabilityHours: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink">Practice Location Label</label>
          <input
            type="text"
            value={content.contact.location}
            onChange={(e) => updateContact({ location: e.target.value })}
            className={inputClass}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="block text-sm font-medium text-ink">Instagram URL</label>
            <input
              type="url"
              value={content.contact.socials.instagram}
              onChange={(e) => updateSocial({ instagram: e.target.value })}
              className={inputClass}
              placeholder="https://instagram.com/..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink">LinkedIn URL</label>
            <input
              type="url"
              value={content.contact.socials.linkedin}
              onChange={(e) => updateSocial({ linkedin: e.target.value })}
              className={inputClass}
              placeholder="https://linkedin.com/in/..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink">YouTube URL</label>
            <input
              type="url"
              value={content.contact.socials.youtube}
              onChange={(e) => updateSocial({ youtube: e.target.value })}
              className={inputClass}
              placeholder="https://youtube.com/..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink">Facebook URL</label>
            <input
              type="url"
              value={content.contact.socials.facebook}
              onChange={(e) => updateSocial({ facebook: e.target.value })}
              className={inputClass}
              placeholder="https://facebook.com/..."
            />
          </div>
        </div>
      </AdminSectionCard>

      {/* 3. HOMEPAGE SECTION HEADINGS & COPY */}
      <AdminSectionCard
        title="Homepage Sections Copy"
        description="Customize every eyebrow, title, description, empty-state text, and link label across the sections on the homepage."
      >
        {/* About Preview Band */}
        <div className="rounded-xl border border-border bg-background p-4 space-y-4">
          <h3 className="font-heading text-base font-bold text-ink">About Preview Section</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-medium text-muted">Eyebrow</label>
              <input
                type="text"
                value={content.homeSections.aboutEyebrow}
                onChange={(e) => updateHome({ aboutEyebrow: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted">Heading</label>
              <input
                type="text"
                value={content.homeSections.aboutTitle}
                onChange={(e) => updateHome({ aboutTitle: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted">Link Label</label>
              <input
                type="text"
                value={content.homeSections.aboutLinkLabel}
                onChange={(e) => updateHome({ aboutLinkLabel: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-muted">Portrait Image URL</label>
              <div className="mt-1 flex items-center gap-2">
                <input
                  type="text"
                  value={content.homeSections.portraitUrl}
                  onChange={(e) => updateHome({ portraitUrl: e.target.value })}
                  className={`${inputClass} mt-0 flex-1`}
                />
                {onUploadFile ? (
                  <>
                    <input
                      ref={portraitUploadRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          onUploadFile(file, (url) => updateHome({ portraitUrl: url }));
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => portraitUploadRef.current?.click()}
                      className="shrink-0 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-semibold text-ink hover:border-primary/50"
                    >
                      Upload
                    </button>
                  </>
                ) : null}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted">Portrait Alt Text</label>
              <input
                type="text"
                value={content.homeSections.portraitAlt}
                onChange={(e) => updateHome({ portraitAlt: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted">
              About Intro Text (line breaks preserved)
            </label>
            <textarea
              rows={6}
              value={content.homeSections.aboutIntro}
              onChange={(e) => updateHome({ aboutIntro: e.target.value })}
              className={textareaClass}
            />
          </div>
        </div>

        {/* Services & Sessions Preview Bands */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-background p-4 space-y-3">
            <h3 className="font-heading text-base font-bold text-ink">Services Overview Band</h3>
            <input
              type="text"
              value={content.homeSections.servicesEyebrow}
              onChange={(e) => updateHome({ servicesEyebrow: e.target.value })}
              className={inputClass}
              placeholder="Eyebrow"
            />
            <input
              type="text"
              value={content.homeSections.servicesTitle}
              onChange={(e) => updateHome({ servicesTitle: e.target.value })}
              className={inputClass}
              placeholder="Title"
            />
            <textarea
              rows={3}
              value={content.homeSections.servicesIntro}
              onChange={(e) => updateHome({ servicesIntro: e.target.value })}
              className={textareaClass}
              placeholder="Intro copy"
            />
          </div>

          <div className="rounded-xl border border-border bg-background p-4 space-y-3">
            <h3 className="font-heading text-base font-bold text-ink">Session Options Band</h3>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={content.homeSections.sessionsEyebrow}
                onChange={(e) => updateHome({ sessionsEyebrow: e.target.value })}
                className={inputClass}
                placeholder="Eyebrow"
              />
              <input
                type="text"
                value={content.homeSections.sessionsLinkLabel}
                onChange={(e) => updateHome({ sessionsLinkLabel: e.target.value })}
                className={inputClass}
                placeholder="Link label"
              />
            </div>
            <input
              type="text"
              value={content.homeSections.sessionsTitle}
              onChange={(e) => updateHome({ sessionsTitle: e.target.value })}
              className={inputClass}
              placeholder="Title"
            />
            <textarea
              rows={3}
              value={content.homeSections.sessionsIntro}
              onChange={(e) => updateHome({ sessionsIntro: e.target.value })}
              className={textareaClass}
              placeholder="Intro copy"
            />
          </div>
        </div>

        {/* Booking CTA & Reviews Preview Bands */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-background p-4 space-y-3">
            <h3 className="font-heading text-base font-bold text-ink">Booking Callout Band</h3>
            <input
              type="text"
              value={content.homeSections.bookingTitle}
              onChange={(e) => updateHome({ bookingTitle: e.target.value })}
              className={inputClass}
              placeholder="Booking CTA Title"
            />
            <textarea
              rows={3}
              value={content.homeSections.bookingText}
              onChange={(e) => updateHome({ bookingText: e.target.value })}
              className={textareaClass}
              placeholder="Booking CTA Copy"
            />
          </div>

          <div className="rounded-xl border border-border bg-background p-4 space-y-3">
            <h3 className="font-heading text-base font-bold text-ink">Reviews Preview Band</h3>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={content.homeSections.reviewsEyebrow}
                onChange={(e) => updateHome({ reviewsEyebrow: e.target.value })}
                className={inputClass}
                placeholder="Eyebrow"
              />
              <input
                type="text"
                value={content.homeSections.reviewsLinkLabel}
                onChange={(e) => updateHome({ reviewsLinkLabel: e.target.value })}
                className={inputClass}
                placeholder="Link label"
              />
            </div>
            <input
              type="text"
              value={content.homeSections.reviewsTitle}
              onChange={(e) => updateHome({ reviewsTitle: e.target.value })}
              className={inputClass}
              placeholder="Title"
            />
            <textarea
              rows={2}
              value={content.homeSections.reviewsIntro}
              onChange={(e) => updateHome({ reviewsIntro: e.target.value })}
              className={textareaClass}
              placeholder="Intro copy"
            />
          </div>
        </div>

        {/* Events, Gallery, Contact Preview Bands */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-background p-4 space-y-3">
            <h3 className="font-heading text-sm font-bold text-ink">Events Preview Band</h3>
            <input
              type="text"
              value={content.homeSections.eventsEyebrow}
              onChange={(e) => updateHome({ eventsEyebrow: e.target.value })}
              className={inputClass}
              placeholder="Eyebrow"
            />
            <input
              type="text"
              value={content.homeSections.eventsTitle}
              onChange={(e) => updateHome({ eventsTitle: e.target.value })}
              className={inputClass}
              placeholder="Title"
            />
            <input
              type="text"
              value={content.homeSections.eventsEmpty}
              onChange={(e) => updateHome({ eventsEmpty: e.target.value })}
              className={inputClass}
              placeholder="Empty text"
            />
            <input
              type="text"
              value={content.homeSections.eventsLinkLabel}
              onChange={(e) => updateHome({ eventsLinkLabel: e.target.value })}
              className={inputClass}
              placeholder="Link label"
            />
          </div>

          <div className="rounded-xl border border-border bg-background p-4 space-y-3">
            <h3 className="font-heading text-sm font-bold text-ink">Gallery Preview Band</h3>
            <input
              type="text"
              value={content.homeSections.galleryEyebrow}
              onChange={(e) => updateHome({ galleryEyebrow: e.target.value })}
              className={inputClass}
              placeholder="Eyebrow"
            />
            <input
              type="text"
              value={content.homeSections.galleryTitle}
              onChange={(e) => updateHome({ galleryTitle: e.target.value })}
              className={inputClass}
              placeholder="Title"
            />
            <input
              type="text"
              value={content.homeSections.galleryEmpty}
              onChange={(e) => updateHome({ galleryEmpty: e.target.value })}
              className={inputClass}
              placeholder="Empty text"
            />
            <input
              type="text"
              value={content.homeSections.galleryLinkLabel}
              onChange={(e) => updateHome({ galleryLinkLabel: e.target.value })}
              className={inputClass}
              placeholder="Link label"
            />
          </div>

          <div className="rounded-xl border border-border bg-background p-4 space-y-3">
            <h3 className="font-heading text-sm font-bold text-ink">Contact Section Band</h3>
            <input
              type="text"
              value={content.homeSections.contactEyebrow}
              onChange={(e) => updateHome({ contactEyebrow: e.target.value })}
              className={inputClass}
              placeholder="Eyebrow"
            />
            <input
              type="text"
              value={content.homeSections.contactTitle}
              onChange={(e) => updateHome({ contactTitle: e.target.value })}
              className={inputClass}
              placeholder="Title"
            />
            <textarea
              rows={3}
              value={content.homeSections.contactIntro}
              onChange={(e) => updateHome({ contactIntro: e.target.value })}
              className={textareaClass}
              placeholder="Intro copy"
            />
          </div>
        </div>
      </AdminSectionCard>

      <AdminSaveBar isSaving={isSaving} label="Save Hero & Homepage Content" />
    </form>
  );
}

