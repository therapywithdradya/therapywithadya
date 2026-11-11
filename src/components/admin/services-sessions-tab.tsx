"use client";

import type { EditableServiceItem } from "@/lib/site-content-types";
import {
  AdminSaveBar,
  AdminSectionCard,
  SessionOfferingsEditor,
  StringListEditor,
  type SiteContentTabProps,
} from "./editor-shared";

export function ServicesSessionsTab({
  content,
  setContent,
  onSave,
  isSaving,
  inputClass,
  textareaClass,
}: SiteContentTabProps) {
  const updateServicesPage = (patch: Partial<typeof content.servicesPage>) =>
    setContent((prev) => ({
      ...prev,
      servicesPage: { ...prev.servicesPage, ...patch },
    }));

  const updateService = (index: number, patch: Partial<EditableServiceItem>) => {
    const current = content.services[index];
    if (!current) return;
    const next = [...content.services];
    next[index] = { ...current, ...patch };
    setContent((prev) => ({ ...prev, services: next }));
  };

  const moveService = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= content.services.length) return;
    const next = [...content.services];
    const [item] = next.splice(index, 1);
    if (!item) return;
    next.splice(target, 0, item);
    setContent((prev) => ({ ...prev, services: next }));
  };

  const updateSessionsPage = (patch: Partial<typeof content.sessionsPage>) =>
    setContent((prev) => ({
      ...prev,
      sessionsPage: { ...prev.sessionsPage, ...patch },
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-8">
      {/* 1. LIVE BOOKABLE SESSION TYPES & FEES */}
      <AdminSectionCard
        title="Bookable Session Offerings & Fees"
        description="These session options appear on the homepage, /sessions page, and Step 1 of /book (including Razorpay checkout fees and slot duration)."
      >
        <SessionOfferingsEditor
          sessions={content.sessions}
          onChange={(sessions) => setContent((prev) => ({ ...prev, sessions }))}
          inputClass={inputClass}
          textareaClass={textareaClass}
        />
      </AdminSectionCard>

      {/* 2. SERVICES PAGE HEADER & CARDS */}
      <AdminSectionCard
        title="Services Page Copy & Service Cards"
        description="Edit the /services page header and add, edit, reorder, or remove individual service cards shown on both /services and the homepage Services Overview."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-ink">Page Eyebrow</label>
            <input
              type="text"
              value={content.servicesPage.eyebrow}
              onChange={(e) => updateServicesPage({ eyebrow: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink">Page Heading</label>
            <input
              type="text"
              value={content.servicesPage.title}
              onChange={(e) => updateServicesPage({ title: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink">Page Intro Paragraph</label>
          <textarea
            rows={2}
            value={content.servicesPage.intro}
            onChange={(e) => updateServicesPage({ intro: e.target.value })}
            className={textareaClass}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-ink">Offerings Eyebrow</label>
            <input
              type="text"
              value={content.servicesPage.offeringsEyebrow}
              onChange={(e) => updateServicesPage({ offeringsEyebrow: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink">Offerings Heading</label>
            <input
              type="text"
              value={content.servicesPage.offeringsTitle}
              onChange={(e) => updateServicesPage({ offeringsTitle: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink">Offerings Intro</label>
          <textarea
            rows={2}
            value={content.servicesPage.offeringsIntro}
            onChange={(e) => updateServicesPage({ offeringsIntro: e.target.value })}
            className={textareaClass}
          />
        </div>

        <div className="border-t border-border pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-ink">
              Service Cards ({content.services.length})
            </span>
            <button
              type="button"
              onClick={() =>
                setContent((prev) => ({
                  ...prev,
                  services: [
                    ...prev.services,
                    {
                      slug: `service-${prev.services.length + 1}`,
                      eyebrow: "New Offering",
                      title: "New Service",
                      hook: "",
                      shortDescription: "",
                      longDescription: "",
                      highlightsTitle: "",
                      highlights: [],
                      href: "/contact",
                      linkLabel: "Enquire now",
                    },
                  ],
                }))
              }
              className="rounded-lg border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20"
            >
              + Add Service Card
            </button>
          </div>

          <div className="space-y-5">
            {content.services.map((service, idx) => (
              <div
                key={`${service.slug}-${idx}`}
                className="rounded-xl border border-border bg-background p-5 space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
                  <span className="font-heading text-sm font-bold text-primary">
                    Service {idx + 1}: {service.title || service.slug}
                  </span>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => moveService(idx, -1)}
                      disabled={idx === 0}
                      className="rounded border border-border bg-surface px-2 py-1 text-xs text-muted hover:text-ink disabled:opacity-30"
                    >
                      ↑ Up
                    </button>
                    <button
                      type="button"
                      onClick={() => moveService(idx, 1)}
                      disabled={idx === content.services.length - 1}
                      className="rounded border border-border bg-surface px-2 py-1 text-xs text-muted hover:text-ink disabled:opacity-30"
                    >
                      ↓ Down
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setContent((prev) => ({
                          ...prev,
                          services: prev.services.filter((_, i) => i !== idx),
                        }))
                      }
                      className="rounded border border-red-900/40 bg-[#2a1215] px-2.5 py-1 text-xs text-red-400 hover:bg-red-950"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-medium text-muted">Eyebrow</label>
                    <input
                      type="text"
                      value={service.eyebrow}
                      onChange={(e) => updateService(idx, { eyebrow: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted">Title</label>
                    <input
                      type="text"
                      value={service.title}
                      onChange={(e) => updateService(idx, { title: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted">Slug</label>
                    <input
                      type="text"
                      value={service.slug}
                      onChange={(e) => updateService(idx, { slug: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted">Hook Line</label>
                  <input
                    type="text"
                    value={service.hook}
                    onChange={(e) => updateService(idx, { hook: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-muted">
                      Short Description (Home Overview)
                    </label>
                    <textarea
                      rows={3}
                      value={service.shortDescription}
                      onChange={(e) => updateService(idx, { shortDescription: e.target.value })}
                      className={textareaClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted">
                      Long Description (/services Page)
                    </label>
                    <textarea
                      rows={3}
                      value={service.longDescription}
                      onChange={(e) => updateService(idx, { longDescription: e.target.value })}
                      className={textareaClass}
                    />
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="space-y-2 rounded-lg border border-border/60 bg-surface/40 p-3">
                    <label className="block text-xs font-medium text-muted">
                      Highlights Heading (optional)
                    </label>
                    <input
                      type="text"
                      value={service.highlightsTitle ?? ""}
                      onChange={(e) => updateService(idx, { highlightsTitle: e.target.value })}
                      className={inputClass}
                      placeholder="e.g., Focus areas"
                    />
                    <StringListEditor
                      label="Highlights Bullet List"
                      items={service.highlights ?? []}
                      onChange={(highlights) => updateService(idx, { highlights })}
                      inputClass={inputClass}
                      textareaClass={textareaClass}
                      addLabel="+ Add bullet"
                    />
                  </div>

                  <div className="space-y-2 rounded-lg border border-border/60 bg-surface/40 p-3">
                    <label className="block text-xs font-medium text-muted">
                      Secondary Highlights Heading (optional)
                    </label>
                    <input
                      type="text"
                      value={service.secondaryHighlightsTitle ?? ""}
                      onChange={(e) =>
                        updateService(idx, { secondaryHighlightsTitle: e.target.value })
                      }
                      className={inputClass}
                      placeholder="e.g., Workshop formats"
                    />
                    <StringListEditor
                      label="Secondary Bullet List"
                      items={service.secondaryHighlights ?? []}
                      onChange={(secondaryHighlights) =>
                        updateService(idx, { secondaryHighlights })
                      }
                      inputClass={inputClass}
                      textareaClass={textareaClass}
                      addLabel="+ Add bullet"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-medium text-muted">
                      Meta Note (optional)
                    </label>
                    <input
                      type="text"
                      value={service.metaNote ?? ""}
                      onChange={(e) => updateService(idx, { metaNote: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted">
                      Button Link Path
                    </label>
                    <input
                      type="text"
                      value={service.href ?? "/book"}
                      onChange={(e) => updateService(idx, { href: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted">Button Label</label>
                    <input
                      type="text"
                      value={service.linkLabel ?? ""}
                      onChange={(e) => updateService(idx, { linkLabel: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AdminSectionCard>

      {/* 3. SESSIONS & BOOK PAGE COPY */}
      <AdminSectionCard
        title="/sessions & /book Page Copy"
        description="Edit the headings, intro text, and 4 booking steps shown on the Sessions & Booking pages."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-ink">Sessions Page Eyebrow</label>
            <input
              type="text"
              value={content.sessionsPage.eyebrow}
              onChange={(e) => updateSessionsPage({ eyebrow: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink">Sessions Page Title</label>
            <input
              type="text"
              value={content.sessionsPage.title}
              onChange={(e) => updateSessionsPage({ title: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink">Sessions Page Intro</label>
          <textarea
            rows={2}
            value={content.sessionsPage.intro}
            onChange={(e) => updateSessionsPage({ intro: e.target.value })}
            className={textareaClass}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-ink">Booking Steps Eyebrow</label>
            <input
              type="text"
              value={content.sessionsPage.bookingStepsEyebrow}
              onChange={(e) => updateSessionsPage({ bookingStepsEyebrow: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink">Booking Steps Title</label>
            <input
              type="text"
              value={content.sessionsPage.bookingStepsTitle}
              onChange={(e) => updateSessionsPage({ bookingStepsTitle: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink">Booking Steps Intro</label>
          <textarea
            rows={2}
            value={content.sessionsPage.bookingStepsIntro}
            onChange={(e) => updateSessionsPage({ bookingStepsIntro: e.target.value })}
            className={textareaClass}
          />
        </div>

        <StringListEditor
          label="How Booking Works (Numbered Steps)"
          items={content.sessionsPage.bookingSteps}
          onChange={(bookingSteps) => updateSessionsPage({ bookingSteps })}
          inputClass={inputClass}
          textareaClass={textareaClass}
          addLabel="+ Add Step"
        />

        <div className="border-t border-border pt-5 space-y-4">
          <h3 className="font-heading text-base font-bold text-ink">/book Page Header Copy</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-muted">Book Page Eyebrow</label>
              <input
                type="text"
                value={content.sessionsPage.bookPageEyebrow}
                onChange={(e) => updateSessionsPage({ bookPageEyebrow: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted">Book Page Heading</label>
              <input
                type="text"
                value={content.sessionsPage.bookPageTitle}
                onChange={(e) => updateSessionsPage({ bookPageTitle: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted">Book Page Intro</label>
            <textarea
              rows={2}
              value={content.sessionsPage.bookPageIntro}
              onChange={(e) => updateSessionsPage({ bookPageIntro: e.target.value })}
              className={textareaClass}
            />
          </div>
        </div>
      </AdminSectionCard>

      <AdminSaveBar isSaving={isSaving} label="Save Services & Sessions" />
    </form>
  );
}
