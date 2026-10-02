"use client";

/**
 * GalleryLightbox — progressive enhancement for gallery thumbnails.
 *
 * When JS is off, the thumbnail links navigate to the full-size image.
 * When JS is on, clicking opens a native <dialog> via showModal().
 *
 * Requirements met:
 * - Escape closes (native dialog behaviour).
 * - Clicking the backdrop closes.
 * - Left/Right arrow keys and visible prev/next buttons (aria-label) with wrap-around.
 * - Focus returns to the clicked thumbnail on close.
 * - Body scroll locked while open; restored on close and unmount.
 * - Image fits within 90vw × 80vh with object-contain.
 * - Caption and "N of M" counter (aria-live polite).
 * - No animation when prefers-reduced-motion is set.
 * - If HTMLDialogElement.showModal is missing, the link navigates instead.
 * - Single image: prev/next buttons hidden.
 * - Target: ~150 lines.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import type { GalleryItemRow } from "@/types/database";

type LightboxItem = Pick<GalleryItemRow, "id" | "image_path" | "alt_text" | "caption">;

export type GalleryLightboxProps = {
  items: LightboxItem[];
};

// Keeps a map from image id to its thumbnail <a> element so focus can be restored.
const thumbMap = new Map<string, HTMLAnchorElement>();

export function registerThumb(id: string, el: HTMLAnchorElement | null): void {
  if (el) {
    thumbMap.set(id, el);
  } else {
    thumbMap.delete(id);
  }
}

export function GalleryLightbox({ items }: GalleryLightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const triggerIdRef = useRef<string>("");

  const total = items.length;
  const current = items[index];

  const openAt = useCallback(
    (id: string) => {
      const idx = items.findIndex((item) => item.id === id);
      if (idx === -1) return;
      // Feature-detect showModal
      if (typeof HTMLDialogElement === "undefined" || !dialogRef.current?.showModal) {
        return; // let the link navigate
      }
      triggerIdRef.current = id;
      setIndex(idx);
      setOpen(true);
    },
    [items],
  );

  const close = useCallback(() => {
    setOpen(false);
    dialogRef.current?.close();
    document.body.style.overflow = "";
    const triggerEl = thumbMap.get(triggerIdRef.current);
    triggerEl?.focus();
  }, []);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + total) % total);
  }, [total]);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % total);
  }, [total]);

  // Open/close the native dialog
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      dialog.showModal?.();
      document.body.style.overflow = "hidden";
    } else {
      dialog.close?.();
      document.body.style.overflow = "";
    }
  }, [open]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, prev, next]);

  // Restore scroll on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Backdrop click closes
  function onDialogClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) {
      close();
    }
  }

  // Register each thumbnail's click handler via a data attribute approach:
  // The thumbnails rendered server-side have a data-lightbox-id attribute.
  // We attach a delegated click listener on mount.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement).closest<HTMLAnchorElement>(
        "a[data-lightbox-id]",
      );
      if (!anchor) return;
      const id = anchor.getAttribute("data-lightbox-id");
      if (!id) return;
      // Register this anchor for focus restoration
      thumbMap.set(id, anchor);
      if (typeof HTMLDialogElement !== "undefined" && dialogRef.current?.showModal) {
        e.preventDefault();
        openAt(id);
      }
      // else: let the link navigate naturally
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [openAt]);

  return (
    <dialog
      ref={dialogRef}
      aria-label="Image lightbox"
      className="lightbox-dialog"
      onClick={onDialogClick}
      onClose={close}
      style={{
        background: "transparent",
        border: "none",
        padding: 0,
        maxWidth: "none",
        maxHeight: "none",
        width: "100vw",
        height: "100vh",
        display: open ? "flex" : "none",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Backdrop */}
      <style>{`
        .lightbox-dialog::backdrop {
          background: rgba(0,0,0,0.85);
        }
        @media (prefers-reduced-motion: reduce) {
          .lightbox-dialog, .lightbox-dialog * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      {current ? (
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxWidth: "90vw",
            maxHeight: "90vh",
            gap: "0.75rem",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            type="button"
            aria-label="Close lightbox"
            onClick={close}
            style={{
              position: "absolute",
              top: "-2.5rem",
              right: 0,
              background: "none",
              border: "none",
              color: "#EAE8E1",
              cursor: "pointer",
              fontSize: "1.5rem",
              lineHeight: 1,
              minHeight: "44px",
              minWidth: "44px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>

          {/* Image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={current.id}
            src={current.image_path}
            alt={current.alt_text}
            style={{
              maxWidth: "90vw",
              maxHeight: "80vh",
              objectFit: "contain",
              display: "block",
              borderRadius: "8px",
            }}
          />

          {/* Caption and counter */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.25rem",
              color: "#EAE8E1",
            }}
          >
            {current.caption ? (
              <p
                style={{
                  maxWidth: "60ch",
                  textAlign: "center",
                  fontSize: "0.9rem",
                  overflowWrap: "anywhere",
                  margin: 0,
                }}
              >
                {current.caption}
              </p>
            ) : null}
            <p
              aria-live="polite"
              aria-atomic="true"
              style={{ fontSize: "0.8rem", color: "#B3B3AD", margin: 0 }}
            >
              {index + 1} of {total}
            </p>
          </div>

          {/* Prev/Next */}
          {total > 1 ? (
            <div
              style={{
                display: "flex",
                gap: "1rem",
                marginTop: "0.25rem",
              }}
            >
              <button
                type="button"
                aria-label="Previous image"
                onClick={prev}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "8px",
                  color: "#EAE8E1",
                  cursor: "pointer",
                  minHeight: "44px",
                  minWidth: "44px",
                  fontSize: "1.25rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ←
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={next}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "8px",
                  color: "#EAE8E1",
                  cursor: "pointer",
                  minHeight: "44px",
                  minWidth: "44px",
                  fontSize: "1.25rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                →
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </dialog>
  );
}
