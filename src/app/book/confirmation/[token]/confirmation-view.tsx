"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Calendar,
  Clock,
  User,
  AlertTriangle,
  Loader2,
  CalendarCheck,
  ArrowRight,
} from "lucide-react";

type BookingData = {
  id: string;
  bookingStatus: string;
  paymentStatus: string;
  sessionName: string;
  startAt: string;
  endAt: string;
  timezone: string;
  customerName: string;
  calendarSyncStatus: string;
  holdExpiresAt: string | null;
};

export function ConfirmationView({ token }: { token: string }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [pollCount, setPollCount] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;

    async function fetchStatus() {
      try {
        const res = await fetch(`/api/bookings/${encodeURIComponent(token)}`);
        if (!res.ok) {
          const errData = (await res.json().catch(() => ({}))) as { message?: string };
          throw new Error(errData.message || "Failed to locate reservation.");
        }
        const data = (await res.json()) as { ok: boolean; booking: BookingData };
        if (isMounted) {
          setBooking(data.booking);
          setLoading(false);

          // If still pending, poll up to 5 times every 3 seconds
          if (
            data.booking.bookingStatus === "pending" &&
            pollCount < 5
          ) {
            setTimeout(() => {
              if (isMounted) {
                setPollCount((prev) => prev + 1);
              }
            }, 3000);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Unable to load confirmation.");
          setLoading(false);
        }
      }
    }

    fetchStatus();

    return () => {
      isMounted = false;
    };
  }, [token, pollCount]);

  function formatTime(isoString: string): string {
    const d = new Date(isoString);
    return d.toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  function formatFullDate(isoString: string): string {
    const d = new Date(isoString);
    return d.toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-border bg-surface/50 p-12 text-center shadow-elevation-card">
        <Loader2 className="mx-auto size-10 animate-spin text-primary" />
        <h2 className="mt-4 text-xl font-serif text-ink">Verifying Reservation...</h2>
        <p className="mt-2 text-sm text-muted">Confirming payment and synchronizing calendar invitation.</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-error/30 bg-error/10 p-8 text-center shadow-elevation-card">
        <AlertTriangle className="mx-auto size-10 text-error" />
        <h2 className="mt-4 text-xl font-serif text-ink">Booking Lookup Failed</h2>
        <p className="mt-2 text-sm text-error/90">{error || "Could not find a booking matching this link."}</p>
        <Link
          href="/book"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition hover:bg-primary-hover"
        >
          Return to Booking Page
        </Link>
      </div>
    );
  }

  const isLostCollision =
    booking.bookingStatus === "failed" && booking.paymentStatus === "refund_pending";

  if (isLostCollision) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-border bg-surface/60 p-8 shadow-elevation-card space-y-6">
        <div className="flex items-center gap-3 text-primary">
          <AlertTriangle className="size-8 text-primary" />
          <h2 className="text-2xl font-serif text-ink">Slot Conflict Notice</h2>
        </div>
        <p className="text-sm leading-relaxed text-muted">
          Your payment was processed, but the reservation window expired or another client confirmed the exact same slot milliseconds prior.
        </p>
        <div className="rounded-xl border border-border bg-background p-4 text-xs text-muted space-y-2">
          <p>
            <strong>Resolution Guarantee:</strong> Zero double-bookings occur on our system. A full refund has been initiated and flagged for immediate manual review by Dr. Adya&apos;s administration team.
          </p>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Link
            href="/contact"
            className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-surface"
          >
            Contact Practice
          </Link>
          <Link
            href="/book"
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition hover:bg-primary-hover"
          >
            Choose Another Slot
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-surface/50 p-8 shadow-elevation-card backdrop-blur-md md:p-12 space-y-8">
      {/* Success Badge */}
      <div className="text-center space-y-3">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-accent/20 text-accent">
          <CheckCircle2 className="size-10" />
        </div>
        <span className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent border border-accent/20">
          Confirmed & Reserved
        </span>
        <h1 className="text-3xl font-serif text-ink">Your Appointment is Set</h1>
        <p className="text-sm text-muted">
          Thank you, <span className="text-ink font-medium">{booking.customerName}</span>. Your session has been confirmed.
        </p>
      </div>

      {/* Appointment Card */}
      <div className="rounded-xl border border-border bg-background/60 p-6 space-y-4">
        <div className="border-b border-border/50 pb-4">
          <span className="text-xs uppercase font-medium tracking-wider text-accent">Session Offering</span>
          <h2 className="text-xl font-serif font-medium text-ink mt-0.5">{booking.sessionName}</h2>
          <span className="text-xs text-muted">Consultant: Dr. Adya Vats (Clinical Psychologist)</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 text-sm">
          <div className="flex items-center gap-2.5 text-ink">
            <Calendar className="size-4 text-primary shrink-0" />
            <span>{formatFullDate(booking.startAt)}</span>
          </div>
          <div className="flex items-center gap-2.5 text-ink">
            <Clock className="size-4 text-primary shrink-0" />
            <span>
              {formatTime(booking.startAt)} – {formatTime(booking.endAt)} (IST)
            </span>
          </div>
          <div className="flex items-center gap-2.5 text-ink">
            <User className="size-4 text-muted shrink-0" />
            <span>{booking.customerName}</span>
          </div>
          <div className="flex items-center gap-2.5 text-ink">
            <CalendarCheck className="size-4 text-accent shrink-0" />
            <span className="text-xs text-accent">
              {booking.calendarSyncStatus === "synced"
                ? "Calendar Invite Dispatched"
                : "Calendar Sync Queued"}
            </span>
          </div>
        </div>
      </div>

      {/* Guidance Notes */}
      <div className="rounded-xl border border-border/60 bg-surface/40 p-5 text-xs text-muted space-y-2">
        <h3 className="font-semibold text-ink text-sm">Session Preparation & Guidelines:</h3>
        <ul className="list-disc pl-4 space-y-1">
          <li>A direct Google Meet link will be attached to your calendar invitation.</li>
          <li>Please find a quiet, private, and comfortable space with stable internet 5 minutes before your slot.</li>
          <li>Rescheduling or cancellation requires at least 24 hours prior notice.</li>
        </ul>
      </div>

      {/* Action CTA */}
      <div className="flex items-center justify-between border-t border-border pt-6">
        <Link
          href="/"
          className="text-sm font-medium text-muted hover:text-ink transition"
        >
          Return to Home
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-on-primary transition hover:bg-primary-hover shadow-elevation-soft"
        >
          Need to Ask a Question? <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
