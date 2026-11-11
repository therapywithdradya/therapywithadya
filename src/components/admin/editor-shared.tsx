"use client";

import type { ReactNode } from "react";
import type {
  EditableSessionItem,
  EditableSiteContent,
} from "@/lib/site-content-types";

export interface SiteContentTabProps {
  content: EditableSiteContent;
  setContent: React.Dispatch<React.SetStateAction<EditableSiteContent>>;
  onSave: (nextContent?: EditableSiteContent) => Promise<void>;
  isSaving: boolean;
  inputClass: string;
  textareaClass: string;
  onUploadFile?: (file: File, onSuccess: (url: string) => void) => Promise<void>;
}

export function AdminSectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8">
      <div className="border-b border-border pb-4">
        <h2 className="font-heading text-xl font-bold text-ink">{title}</h2>
        {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
      </div>
      <div className="mt-6 space-y-5">{children}</div>
    </div>
  );
}

export function AdminSaveBar({
  isSaving,
  label = "Save All Changes",
}: {
  isSaving: boolean;
  label?: string;
}) {
  return (
    <div className="sticky bottom-4 z-20 flex items-center justify-between gap-4 rounded-xl border border-border bg-surface/95 px-5 py-3.5 shadow-card backdrop-blur">
      <p className="text-xs text-muted sm:text-sm">
        Changes go live immediately across all public pages once saved.
      </p>
      <button
        type="submit"
        disabled={isSaving}
        className="shrink-0 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-on-primary shadow-soft transition-all hover:bg-primary-hover disabled:opacity-50"
      >
        {isSaving ? "Saving changes..." : label}
      </button>
    </div>
  );
}

export function StringListEditor({
  label,
  helperText,
  items,
  onChange,
  placeholder = "Enter item...",
  multiline = false,
  inputClass,
  textareaClass,
  addLabel = "+ Add item",
}: {
  label: string;
  helperText?: string;
  items: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  multiline?: boolean;
  inputClass: string;
  textareaClass: string;
  addLabel?: string;
}) {
  const handleItemChange = (index: number, value: string) => {
    const next = [...items];
    next[index] = value;
    onChange(next);
  };

  const handleRemove = (index: number) => {
    onChange(items.filter((_, idx) => idx !== index));
  };

  const handleMove = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    const [item] = next.splice(index, 1);
    if (item === undefined) return;
    next.splice(target, 0, item);
    onChange(next);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="block text-sm font-medium text-ink">{label}</span>
        <button
          type="button"
          onClick={() => onChange([...items, ""])}
          className="rounded-lg border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary hover:bg-primary/20"
        >
          {addLabel}
        </button>
      </div>
      {helperText ? <p className="mt-1 text-xs text-muted">{helperText}</p> : null}

      <div className="mt-2.5 space-y-2.5">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-start gap-2">
            {multiline ? (
              <textarea
                rows={2}
                value={item}
                onChange={(e) => handleItemChange(idx, e.target.value)}
                placeholder={placeholder}
                className={`${textareaClass} mt-0 flex-1`}
              />
            ) : (
              <input
                type="text"
                value={item}
                onChange={(e) => handleItemChange(idx, e.target.value)}
                placeholder={placeholder}
                className={`${inputClass} mt-0 flex-1`}
              />
            )}
            <div className="flex shrink-0 gap-1 pt-1">
              <button
                type="button"
                onClick={() => handleMove(idx, -1)}
                disabled={idx === 0}
                title="Move up"
                className="rounded border border-border bg-background px-2 py-1 text-xs text-muted hover:text-ink disabled:opacity-30"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => handleMove(idx, 1)}
                disabled={idx === items.length - 1}
                title="Move down"
                className="rounded border border-border bg-background px-2 py-1 text-xs text-muted hover:text-ink disabled:opacity-30"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                title="Remove"
                className="rounded border border-red-900/40 bg-[#2a1215] px-2.5 py-1 text-xs font-medium text-red-400 hover:bg-red-950"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border p-3 text-xs text-muted">
            No items yet. Click &ldquo;{addLabel}&rdquo; to add one.
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function SessionOfferingsEditor({
  sessions,
  onChange,
  inputClass,
  textareaClass,
}: {
  sessions: EditableSessionItem[];
  onChange: (next: EditableSessionItem[]) => void;
  inputClass: string;
  textareaClass: string;
}) {
  const updateSession = (index: number, patch: Partial<EditableSessionItem>) => {
    const current = sessions[index];
    if (!current) return;
    const next = [...sessions];
    next[index] = { ...current, ...patch };
    onChange(next);
  };

  const moveSession = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= sessions.length) return;
    const next = [...sessions];
    const [item] = next.splice(index, 1);
    if (!item) return;
    next.splice(target, 0, item);
    onChange(next);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-sm font-semibold text-ink">
            Bookable Session Offerings &amp; Fees ({sessions.length})
          </span>
          <p className="text-xs text-muted">
            Each session here powers Home, /sessions, Step 1 of /book, slot duration, and Razorpay checkout fees.
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            onChange([
              ...sessions,
              {
                slug: `custom-session-${sessions.length + 1}`,
                name: "New Session Type",
                description: "",
                approaches: "",
                whoItFor: "",
                durationMinutes: 60,
                durationLabel: "60 minutes",
                bufferMinutes: 15,
                pricePaise: 200000,
              },
            ])
          }
          className="rounded-lg border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20"
        >
          + Add Session Type
        </button>
      </div>

      <div className="space-y-5">
        {sessions.map((session, idx) => {
          const feeRupees = Math.round(session.pricePaise / 100);
          return (
            <div
              key={`${session.slug}-${idx}`}
              className="rounded-xl border border-border bg-background p-5 space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-heading text-sm font-bold text-primary">
                    Session {idx + 1}: {session.name || session.slug}
                  </span>
                  <span className="rounded-full border border-border bg-surface px-2.5 py-0.5 text-xs font-semibold text-ink">
                    ₹{feeRupees.toLocaleString("en-IN")} · {session.durationLabel || `${session.durationMinutes} min`}
                  </span>
                </div>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => moveSession(idx, -1)}
                    disabled={idx === 0}
                    className="rounded border border-border bg-surface px-2 py-1 text-xs text-muted hover:text-ink disabled:opacity-30"
                  >
                    ↑ Up
                  </button>
                  <button
                    type="button"
                    onClick={() => moveSession(idx, 1)}
                    disabled={idx === sessions.length - 1}
                    className="rounded border border-border bg-surface px-2 py-1 text-xs text-muted hover:text-ink disabled:opacity-30"
                  >
                    ↓ Down
                  </button>
                  <button
                    type="button"
                    disabled={sessions.length <= 1}
                    onClick={() => onChange(sessions.filter((_, i) => i !== idx))}
                    className="rounded border border-red-900/40 bg-[#2a1215] px-2.5 py-1 text-xs text-red-400 hover:bg-red-950 disabled:opacity-30"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-muted">Display Title</label>
                  <input
                    type="text"
                    value={session.name}
                    onChange={(e) => updateSession(idx, { name: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted">URL Slug</label>
                  <input
                    type="text"
                    value={session.slug}
                    onChange={(e) => updateSession(idx, { slug: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted">Fee (INR ₹)</label>
                  <input
                    type="number"
                    min={0}
                    step={50}
                    value={feeRupees}
                    onChange={(e) =>
                      updateSession(idx, {
                        pricePaise: Math.max(0, Number(e.target.value) || 0) * 100,
                      })
                    }
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-medium text-muted">
                    Calendar Duration (mins)
                  </label>
                  <input
                    type="number"
                    min={15}
                    max={240}
                    value={session.durationMinutes}
                    onChange={(e) =>
                      updateSession(idx, {
                        durationMinutes: Math.max(15, Number(e.target.value) || 60),
                      })
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted">
                    Duration Display Label
                  </label>
                  <input
                    type="text"
                    value={session.durationLabel ?? ""}
                    onChange={(e) => updateSession(idx, { durationLabel: e.target.value })}
                    className={inputClass}
                    placeholder="e.g., 60–75 minutes"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted">
                    Buffer After Slot (mins)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={120}
                    value={session.bufferMinutes}
                    onChange={(e) =>
                      updateSession(idx, {
                        bufferMinutes: Math.max(0, Number(e.target.value) || 0),
                      })
                    }
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted">Session Description</label>
                <textarea
                  rows={2}
                  value={session.description}
                  onChange={(e) => updateSession(idx, { description: e.target.value })}
                  className={textareaClass}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-muted">
                    Approaches May Include (optional)
                  </label>
                  <input
                    type="text"
                    value={session.approaches ?? ""}
                    onChange={(e) => updateSession(idx, { approaches: e.target.value })}
                    className={inputClass}
                    placeholder="CBT • REBT • Mindfulness"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted">Who It Is For</label>
                  <input
                    type="text"
                    value={session.whoItFor}
                    onChange={(e) => updateSession(idx, { whoItFor: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
