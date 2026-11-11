"use client";

import type {
  EditableApproachItem,
  EditableQualificationItem,
  EditableWorkCard,
} from "@/lib/site-content-types";
import {
  AdminSaveBar,
  AdminSectionCard,
  StringListEditor,
  type SiteContentTabProps,
} from "./editor-shared";

export function AboutEditorTab({
  content,
  setContent,
  onSave,
  isSaving,
  inputClass,
  textareaClass,
}: SiteContentTabProps) {
  const about = content.aboutPage;

  const updateAbout = (patch: Partial<typeof content.aboutPage>) =>
    setContent((prev) => ({ ...prev, aboutPage: { ...prev.aboutPage, ...patch } }));

  const updateWorkCard = (index: number, patch: Partial<EditableWorkCard>) => {
    const current = about.professionalWork[index];
    if (!current) return;
    const next = [...about.professionalWork];
    next[index] = { ...current, ...patch };
    updateAbout({ professionalWork: next });
  };

  const updateApproachCard = (index: number, patch: Partial<EditableApproachItem>) => {
    const current = about.approaches[index];
    if (!current) return;
    const next = [...about.approaches];
    next[index] = { ...current, ...patch };
    updateAbout({ approaches: next });
  };

  const updateQualification = (
    index: number,
    patch: Partial<EditableQualificationItem>,
  ) => {
    const current = about.qualifications[index];
    if (!current) return;
    const next = [...about.qualifications];
    next[index] = { ...current, ...patch };
    updateAbout({ qualifications: next });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-8">
      {/* 1. Hero Badges & Biography */}
      <AdminSectionCard
        title="About Page Header, Badges & Full Biography"
        description="Edit the badge chips shown under the About page intro and every paragraph in your biography."
      >
        <StringListEditor
          label="About Hero Highlight Badges"
          helperText="Displayed as subtle pill badges below the About page intro."
          items={about.heroBadges}
          onChange={(heroBadges) => updateAbout({ heroBadges })}
          placeholder="e.g., 5+ Years Experience"
          inputClass={inputClass}
          textareaClass={textareaClass}
          addLabel="+ Add badge"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-ink">Biography Eyebrow</label>
            <input
              type="text"
              value={about.biographyEyebrow}
              onChange={(e) => updateAbout({ biographyEyebrow: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink">Biography Heading</label>
            <input
              type="text"
              value={about.biographyTitle}
              onChange={(e) => updateAbout({ biographyTitle: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>

        <StringListEditor
          label="Biography Paragraphs"
          helperText="Each entry becomes a well-spaced paragraph in the Biography section on /about."
          items={about.bioParagraphs}
          onChange={(bioParagraphs) => updateAbout({ bioParagraphs })}
          placeholder="Write paragraph..."
          multiline
          inputClass={inputClass}
          textareaClass={textareaClass}
          addLabel="+ Add paragraph"
        />
      </AdminSectionCard>

      {/* 2. Professional Work Cards */}
      <AdminSectionCard
        title="Areas of Work & Practice Cards"
        description="Edit the grid of cards highlighting your clinical experience, workshops, and therapeutic spaces."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-ink">Section Eyebrow</label>
            <input
              type="text"
              value={about.workEyebrow}
              onChange={(e) => updateAbout({ workEyebrow: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink">Section Heading</label>
            <input
              type="text"
              value={about.workTitle}
              onChange={(e) => updateAbout({ workTitle: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink">Section Intro Paragraph</label>
          <textarea
            rows={2}
            value={about.workIntro}
            onChange={(e) => updateAbout({ workIntro: e.target.value })}
            className={textareaClass}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-ink">Work Cards</span>
            <button
              type="button"
              onClick={() =>
                updateAbout({
                  professionalWork: [
                    ...about.professionalWork,
                    { eyebrow: "New Area", description: "" },
                  ],
                })
              }
              className="rounded-lg border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary hover:bg-primary/20"
            >
              + Add Work Card
            </button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {about.professionalWork.map((card, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-border bg-background p-4 space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-primary uppercase">
                    Card {idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      updateAbout({
                        professionalWork: about.professionalWork.filter((_, i) => i !== idx),
                      })
                    }
                    className="rounded border border-red-900/40 bg-[#2a1215] px-2 py-0.5 text-xs text-red-400 hover:bg-red-950"
                  >
                    Remove
                  </button>
                </div>
                <input
                  type="text"
                  value={card.eyebrow}
                  onChange={(e) => updateWorkCard(idx, { eyebrow: e.target.value })}
                  className={inputClass}
                  placeholder="Card Eyebrow / Title"
                />
                <textarea
                  rows={3}
                  value={card.description}
                  onChange={(e) => updateWorkCard(idx, { description: e.target.value })}
                  className={textareaClass}
                  placeholder="Card description..."
                />
              </div>
            ))}
          </div>
        </div>
      </AdminSectionCard>

      {/* 3. Academic Research */}
      <AdminSectionCard
        title="Academic Research & Publications"
        description="Manage the research section heading, summary, and individual research papers."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-ink">Research Eyebrow</label>
            <input
              type="text"
              value={about.researchEyebrow}
              onChange={(e) => updateAbout({ researchEyebrow: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink">Research Heading</label>
            <input
              type="text"
              value={about.researchTitle}
              onChange={(e) => updateAbout({ researchTitle: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink">Research Intro</label>
          <textarea
            rows={2}
            value={about.researchIntro}
            onChange={(e) => updateAbout({ researchIntro: e.target.value })}
            className={textareaClass}
          />
        </div>

        <StringListEditor
          label="Research Papers / Citations"
          items={about.researchPapers}
          onChange={(researchPapers) => updateAbout({ researchPapers })}
          placeholder="Paper title and citation details..."
          multiline
          inputClass={inputClass}
          textareaClass={textareaClass}
          addLabel="+ Add Research Paper"
        />
      </AdminSectionCard>

      {/* 4. Specialized Training & Concerns Supported */}
      <AdminSectionCard
        title="Specialized Training & Concerns Supported"
        description="Customize your integrative approach summary and the list of concerns you work with."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-ink">Section Eyebrow</label>
            <input
              type="text"
              value={about.certificationsEyebrow}
              onChange={(e) => updateAbout({ certificationsEyebrow: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink">Section Heading</label>
            <input
              type="text"
              value={about.certificationsTitle}
              onChange={(e) => updateAbout({ certificationsTitle: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink">Certifications Summary</label>
          <textarea
            rows={2}
            value={about.certificationsSummary}
            onChange={(e) => updateAbout({ certificationsSummary: e.target.value })}
            className={textareaClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink">Training Philosophy</label>
          <textarea
            rows={2}
            value={about.certificationsPhilosophy}
            onChange={(e) => updateAbout({ certificationsPhilosophy: e.target.value })}
            className={textareaClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink">Concerns Block Heading</label>
          <input
            type="text"
            value={about.concernsHeading}
            onChange={(e) => updateAbout({ concernsHeading: e.target.value })}
            className={inputClass}
          />
        </div>

        <StringListEditor
          label="Concerns Supported List"
          items={about.concernsSupported}
          onChange={(concernsSupported) => updateAbout({ concernsSupported })}
          placeholder="e.g., Anxiety, overthinking, and burnout"
          inputClass={inputClass}
          textareaClass={textareaClass}
          addLabel="+ Add Concern"
        />

        <div>
          <label className="block text-sm font-medium text-ink">Closing Note Below Concerns</label>
          <textarea
            rows={2}
            value={about.concernsOutro}
            onChange={(e) => updateAbout({ concernsOutro: e.target.value })}
            className={textareaClass}
          />
        </div>
      </AdminSectionCard>

      {/* 5. Therapeutic Approaches & Qualifications */}
      <AdminSectionCard
        title="Therapeutic Approaches, Qualifications & Philosophy"
        description="Add or edit modality cards, credentials/qualifications, and your overall philosophy of care."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-ink">Approaches Eyebrow</label>
            <input
              type="text"
              value={about.approachesEyebrow}
              onChange={(e) => updateAbout({ approachesEyebrow: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink">Approaches Heading</label>
            <input
              type="text"
              value={about.approachesTitle}
              onChange={(e) => updateAbout({ approachesTitle: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink">Approaches Intro</label>
          <textarea
            rows={2}
            value={about.approachesIntro}
            onChange={(e) => updateAbout({ approachesIntro: e.target.value })}
            className={textareaClass}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-ink">Modality Cards</span>
            <button
              type="button"
              onClick={() =>
                updateAbout({
                  approaches: [...about.approaches, { name: "New Modality", desc: "" }],
                })
              }
              className="rounded-lg border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary hover:bg-primary/20"
            >
              + Add Approach
            </button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {about.approaches.map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-border bg-background p-4 space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-primary uppercase">
                    Approach {idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      updateAbout({
                        approaches: about.approaches.filter((_, i) => i !== idx),
                      })
                    }
                    className="rounded border border-red-900/40 bg-[#2a1215] px-2 py-0.5 text-xs text-red-400 hover:bg-red-950"
                  >
                    Remove
                  </button>
                </div>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => updateApproachCard(idx, { name: e.target.value })}
                  className={inputClass}
                  placeholder="Approach name"
                />
                <textarea
                  rows={2}
                  value={item.desc}
                  onChange={(e) => updateApproachCard(idx, { desc: e.target.value })}
                  className={textareaClass}
                  placeholder="Short description..."
                />
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-border pt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-ink">Qualifications Eyebrow</label>
              <input
                type="text"
                value={about.qualificationsEyebrow}
                onChange={(e) => updateAbout({ qualificationsEyebrow: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink">Qualifications Heading</label>
              <input
                type="text"
                value={about.qualificationsTitle}
                onChange={(e) => updateAbout({ qualificationsTitle: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-ink">Credentials List</span>
            <button
              type="button"
              onClick={() =>
                updateAbout({
                  qualifications: [...about.qualifications, { title: "", issuer: "" }],
                })
              }
              className="rounded-lg border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary hover:bg-primary/20"
            >
              + Add Qualification
            </button>
          </div>
          <div className="space-y-3">
            {about.qualifications.map((qual, idx) => (
              <div
                key={idx}
                className="flex flex-col gap-2 rounded-xl border border-border bg-background p-3 sm:flex-row sm:items-center"
              >
                <input
                  type="text"
                  value={qual.title}
                  onChange={(e) => updateQualification(idx, { title: e.target.value })}
                  className={`${inputClass} mt-0 flex-1`}
                  placeholder="Degree / Certification title"
                />
                <input
                  type="text"
                  value={qual.issuer ?? ""}
                  onChange={(e) => updateQualification(idx, { issuer: e.target.value })}
                  className={`${inputClass} mt-0 sm:w-56`}
                  placeholder="Institution / Issuer (optional)"
                />
                <button
                  type="button"
                  onClick={() =>
                    updateAbout({
                      qualifications: about.qualifications.filter((_, i) => i !== idx),
                    })
                  }
                  className="shrink-0 rounded border border-red-900/40 bg-[#2a1215] px-2.5 py-2 text-xs font-medium text-red-400 hover:bg-red-950"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-border pt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-ink">Philosophy Eyebrow</label>
              <input
                type="text"
                value={about.philosophyEyebrow}
                onChange={(e) => updateAbout({ philosophyEyebrow: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink">Philosophy Heading</label>
              <input
                type="text"
                value={about.philosophyTitle}
                onChange={(e) => updateAbout({ philosophyTitle: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink">Philosophy of Care Copy</label>
            <textarea
              rows={3}
              value={about.approach}
              onChange={(e) => updateAbout({ approach: e.target.value })}
              className={textareaClass}
            />
          </div>
        </div>
      </AdminSectionCard>

      <AdminSaveBar isSaving={isSaving} label="Save About Page Content" />
    </form>
  );
}
