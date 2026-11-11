"use client";

import type { ReactNode } from "react";
import type { EditableSiteContent } from "@/lib/site-content-types";

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
