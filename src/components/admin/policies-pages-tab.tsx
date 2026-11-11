"use client";

import type { EditableCrisisResource } from "@/lib/site-content-types";
import {
  AdminSaveBar,
  AdminSectionCard,
  type SiteContentTabProps,
} from "./editor-shared";

export function PoliciesPagesTab({
  content,
  setContent,
  onSave,
  isSaving,
  inputClass,
  textareaClass,
}: SiteContentTabProps) {
  const { pagesCopy, legalAndSafety } = content;

  const updateLegal = (patch: Partial<typeof legalAndSafety>) =>
    setContent((prev) => ({
      ...prev,
      legalAndSafety: { ...prev.legalAndSafety, ...patch },
    }));

  const updatePolicy = (patch: Partial<typeof legalAndSafety.policies>) =>
    setContent((prev) => ({
      ...prev,
      legalAndSafety: {
        ...prev.legalAndSafety,
        policies: { ...prev.legalAndSafety.policies, ...patch },
      },
    }));

  const updateResource = (index: number, patch: Partial<EditableCrisisResource>) => {
    const current = legalAndSafety.safetyResources[index];
    if (!current) return;
    const next = [...legalAndSafety.safetyResources];
    next[index] = { ...current, ...patch };
    updateLegal({ safetyResources: next });
  };

  const updatePage = <K extends keyof typeof pagesCopy>(
    key: K,
    patch: Partial<(typeof pagesCopy)[K]>,
  ) => {
    setContent((prev) => ({
      ...prev,
      pagesCopy: {
        ...prev.pagesCopy,
        [key]: { ...prev.pagesCopy[key], ...patch },
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-8">
      {/* 1. POLICIES & TERMS */}
      <AdminSectionCard
        title="Practice Policies & Terms Summary"
        description="Controls the policy summaries shown on /sessions, /book, /privacy, and /terms-and-cancellation."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-ink">
              Cancellation Notice (Hours)
            </label>
            <input
              type="number"
              min={0}
              max={168}
              value={legalAndSafety.policies.cancellationNoticeHours}
              onChange={(e) =>
                updatePolicy({
                  cancellationNoticeHours: Math.max(0, Number(e.target.value) || 0),
                })
              }
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink">Legal Last Updated Label</label>
            <input
              type="text"
              value={legalAndSafety.legalLastUpdated}
              onChange={(e) => updateLegal({ legalLastUpdated: e.target.value })}
              className={inputClass}
            />
          </div>
          <div className="flex items-end pb-2">
            <label className="flex items-center gap-2 text-sm text-ink cursor-pointer">
              <input
                type="checkbox"
                checked={legalAndSafety.policies.confirmed}
                onChange={(e) => updatePolicy({ confirmed: e.target.checked })}
                className="h-4 w-4 accent-primary"
              />
              <span>Policies Reviewed &amp; Confirmed (hide draft banner)</span>
            </label>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-ink">Payment Terms</label>
            <textarea
              rows={2}
              value={legalAndSafety.policies.paymentTerms}
              onChange={(e) => updatePolicy({ paymentTerms: e.target.value })}
              className={textareaClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink">Refund Policy Summary</label>
            <textarea
              rows={2}
              value={legalAndSafety.policies.refundSummary}
              onChange={(e) => updatePolicy({ refundSummary: e.target.value })}
              className={textareaClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink">Rescheduling Summary</label>
            <textarea
              rows={2}
              value={legalAndSafety.policies.reschedulingSummary}
              onChange={(e) => updatePolicy({ reschedulingSummary: e.target.value })}
              className={textareaClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink">
              Minors / Parental Consent Policy
            </label>
            <textarea
              rows={2}
              value={legalAndSafety.policies.minorsSummary}
              onChange={(e) => updatePolicy({ minorsSummary: e.target.value })}
              className={textareaClass}
            />
          </div>
        </div>
      </AdminSectionCard>

      {/* 2. SAFETY NOTICE & CRISIS HELPLINES */}
      <AdminSectionCard
        title="Emergency Notice & Crisis Helplines"
        description="Displayed at the bottom of Booking, Sessions, Contact, and Terms pages."
      >
        <div>
          <label className="block text-sm font-medium text-ink">Safety Notice Heading</label>
          <input
            type="text"
            value={legalAndSafety.safetyHeading}
            onChange={(e) => updateLegal({ safetyHeading: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink">Safety Notice Disclaimer</label>
          <textarea
            rows={2}
            value={legalAndSafety.safetyText}
            onChange={(e) => updateLegal({ safetyText: e.target.value })}
            className={textareaClass}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-ink">Crisis Helplines</span>
            <button
              type="button"
              onClick={() =>
                updateLegal({
                  safetyResources: [...legalAndSafety.safetyResources, { label: "", tel: "" }],
                })
              }
              className="rounded-lg border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary hover:bg-primary/20"
            >
              + Add Helpline
            </button>
          </div>
          {legalAndSafety.safetyResources.map((res, idx) => (
            <div key={idx} className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                type="text"
                value={res.label}
                onChange={(e) => updateResource(idx, { label: e.target.value })}
                className={`${inputClass} mt-0 flex-1`}
                placeholder="Helpline name & details (e.g., Tele-MANAS (India, 24x7): 14416)"
              />
              <input
                type="text"
                value={res.tel}
                onChange={(e) => updateResource(idx, { tel: e.target.value })}
                className={`${inputClass} mt-0 sm:w-44`}
                placeholder="Phone digits (e.g., 14416)"
              />
              <button
                type="button"
                onClick={() =>
                  updateLegal({
                    safetyResources: legalAndSafety.safetyResources.filter((_, i) => i !== idx),
                  })
                }
                className="shrink-0 rounded border border-red-900/40 bg-[#2a1215] px-2.5 py-2 text-xs text-red-400 hover:bg-red-950"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </AdminSectionCard>

      {/* 3. SUBPAGE HEADERS & INTROS */}
      <AdminSectionCard
        title="Subpage Headers, Headings & Intros"
        description="Customize titles, eyebrows, and introductory text across Events, Gallery, Reviews, Contact, Privacy, and Terms pages."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {/* Events */}
          <div className="rounded-xl border border-border bg-background p-4 space-y-2.5">
            <h3 className="font-heading text-base font-bold text-ink">/events Page Copy</h3>
            <input
              type="text"
              value={pagesCopy.events.eyebrow}
              onChange={(e) => updatePage("events", { eyebrow: e.target.value })}
              className={inputClass}
              placeholder="Eyebrow"
            />
            <input
              type="text"
              value={pagesCopy.events.title}
              onChange={(e) => updatePage("events", { title: e.target.value })}
              className={inputClass}
              placeholder="Title"
            />
            <textarea
              rows={2}
              value={pagesCopy.events.intro}
              onChange={(e) => updatePage("events", { intro: e.target.value })}
              className={textareaClass}
              placeholder="Intro"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={pagesCopy.events.upcomingTitle}
                onChange={(e) => updatePage("events", { upcomingTitle: e.target.value })}
                className={inputClass}
                placeholder="Upcoming heading"
              />
              <input
                type="text"
                value={pagesCopy.events.pastTitle}
                onChange={(e) => updatePage("events", { pastTitle: e.target.value })}
                className={inputClass}
                placeholder="Past heading"
              />
            </div>
            <input
              type="text"
              value={pagesCopy.events.ctaTitle}
              onChange={(e) => updatePage("events", { ctaTitle: e.target.value })}
              className={inputClass}
              placeholder="CTA heading"
            />
            <textarea
              rows={2}
              value={pagesCopy.events.ctaText}
              onChange={(e) => updatePage("events", { ctaText: e.target.value })}
              className={textareaClass}
              placeholder="CTA paragraph"
            />
          </div>

          {/* Contact */}
          <div className="rounded-xl border border-border bg-background p-4 space-y-2.5">
            <h3 className="font-heading text-base font-bold text-ink">/contact Page Copy</h3>
            <input
              type="text"
              value={pagesCopy.contact.eyebrow}
              onChange={(e) => updatePage("contact", { eyebrow: e.target.value })}
              className={inputClass}
              placeholder="Eyebrow"
            />
            <input
              type="text"
              value={pagesCopy.contact.title}
              onChange={(e) => updatePage("contact", { title: e.target.value })}
              className={inputClass}
              placeholder="Title"
            />
            <textarea
              rows={2}
              value={pagesCopy.contact.intro}
              onChange={(e) => updatePage("contact", { intro: e.target.value })}
              className={textareaClass}
              placeholder="Intro"
            />
            <input
              type="text"
              value={pagesCopy.contact.cardTitle}
              onChange={(e) => updatePage("contact", { cardTitle: e.target.value })}
              className={inputClass}
              placeholder="Direct channels card title"
            />
            <input
              type="text"
              value={pagesCopy.contact.appointmentsTitle}
              onChange={(e) => updatePage("contact", { appointmentsTitle: e.target.value })}
              className={inputClass}
              placeholder="Appointments card title"
            />
            <textarea
              rows={2}
              value={pagesCopy.contact.appointmentsText}
              onChange={(e) => updatePage("contact", { appointmentsText: e.target.value })}
              className={textareaClass}
              placeholder="Appointments card text"
            />
          </div>

          {/* Gallery */}
          <div className="rounded-xl border border-border bg-background p-4 space-y-2.5">
            <h3 className="font-heading text-base font-bold text-ink">/gallery Page Copy</h3>
            <input
              type="text"
              value={pagesCopy.gallery.eyebrow}
              onChange={(e) => updatePage("gallery", { eyebrow: e.target.value })}
              className={inputClass}
              placeholder="Eyebrow"
            />
            <input
              type="text"
              value={pagesCopy.gallery.title}
              onChange={(e) => updatePage("gallery", { title: e.target.value })}
              className={inputClass}
              placeholder="Title"
            />
            <textarea
              rows={2}
              value={pagesCopy.gallery.intro}
              onChange={(e) => updatePage("gallery", { intro: e.target.value })}
              className={textareaClass}
              placeholder="Intro"
            />
          </div>

          {/* Reviews */}
          <div className="rounded-xl border border-border bg-background p-4 space-y-2.5">
            <h3 className="font-heading text-base font-bold text-ink">/reviews Page Copy</h3>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={pagesCopy.reviews.eyebrow}
                onChange={(e) => updatePage("reviews", { eyebrow: e.target.value })}
                className={inputClass}
                placeholder="Eyebrow"
              />
              <input
                type="text"
                value={pagesCopy.reviews.title}
                onChange={(e) => updatePage("reviews", { title: e.target.value })}
                className={inputClass}
                placeholder="Title"
              />
            </div>
            <textarea
              rows={2}
              value={pagesCopy.reviews.intro}
              onChange={(e) => updatePage("reviews", { intro: e.target.value })}
              className={textareaClass}
              placeholder="Intro"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={pagesCopy.reviews.listTitle}
                onChange={(e) => updatePage("reviews", { listTitle: e.target.value })}
                className={inputClass}
                placeholder="List heading"
              />
              <input
                type="text"
                value={pagesCopy.reviews.ctaTitle}
                onChange={(e) => updatePage("reviews", { ctaTitle: e.target.value })}
                className={inputClass}
                placeholder="Closing CTA title"
              />
            </div>
            <textarea
              rows={2}
              value={pagesCopy.reviews.ctaText}
              onChange={(e) => updatePage("reviews", { ctaText: e.target.value })}
              className={textareaClass}
              placeholder="Closing CTA text"
            />
          </div>

          {/* Privacy */}
          <div className="rounded-xl border border-border bg-background p-4 space-y-2.5">
            <h3 className="font-heading text-base font-bold text-ink">/privacy Header Copy</h3>
            <input
              type="text"
              value={pagesCopy.privacy.title}
              onChange={(e) => updatePage("privacy", { title: e.target.value })}
              className={inputClass}
              placeholder="Title"
            />
            <textarea
              rows={2}
              value={pagesCopy.privacy.intro}
              onChange={(e) => updatePage("privacy", { intro: e.target.value })}
              className={textareaClass}
              placeholder="Intro"
            />
          </div>

          {/* Terms */}
          <div className="rounded-xl border border-border bg-background p-4 space-y-2.5">
            <h3 className="font-heading text-base font-bold text-ink">
              /terms-and-cancellation Header Copy
            </h3>
            <input
              type="text"
              value={pagesCopy.termsAndCancellation.title}
              onChange={(e) =>
                updatePage("termsAndCancellation", { title: e.target.value })
              }
              className={inputClass}
              placeholder="Title"
            />
            <textarea
              rows={2}
              value={pagesCopy.termsAndCancellation.intro}
              onChange={(e) =>
                updatePage("termsAndCancellation", { intro: e.target.value })
              }
              className={textareaClass}
              placeholder="Intro"
            />
          </div>
        </div>
      </AdminSectionCard>

      <AdminSaveBar isSaving={isSaving} label="Save Policies & Subpage Copy" />
    </form>
  );
}
