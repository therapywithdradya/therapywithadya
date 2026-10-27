import "server-only";

import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { fetchRazorpayPayment } from "@/lib/razorpay/client";
import { createCalendarBookingEvent } from "@/lib/calendar/google";
import { sendBookingNotificationEmails } from "@/lib/notifications/email";
import type { ConfirmBookingPaymentResult } from "@/types/database";

export type ConfirmBookingParams = {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  amountPaise?: number;
  source: "verify" | "webhook" | "recovery";
};

export type ConfirmBookingResponse = {
  ok: boolean;
  code: string;
  bookingId: string | null;
  alreadyConfirmed: boolean;
};

/**
 * Shared, idempotent booking confirmation function.
 * Called by:
 * 1. /api/payments/verify (Path 1: Checkout redirect)
 * 2. /api/webhooks/razorpay (Path 2: Webhooks)
 * 3. /api/bookings/[token] (Path 3: Browser recovery)
 *
 * Guarantees:
 * - Payment must be captured in INR with matching amount.
 * - Double confirmation is a no-op (does not duplicate calendar event).
 * - Late payments where slot was taken mark booking as failed + refund_pending.
 * - Calendar sync failure never rolls back the confirmed payment.
 */
export async function confirmBooking({
  razorpayOrderId,
  razorpayPaymentId,
  amountPaise,
}: ConfirmBookingParams): Promise<ConfirmBookingResponse> {
  const supabase = getSupabaseAdmin();

  // 1. Resolve and verify amount from Razorpay if not provided or to ensure verification
  let verifiedAmountPaise = amountPaise;
  if (verifiedAmountPaise === undefined) {
    const payment = await fetchRazorpayPayment(razorpayPaymentId);
    if (payment.order_id !== razorpayOrderId) {
      return {
        ok: false,
        code: "order_mismatch",
        bookingId: null,
        alreadyConfirmed: false,
      };
    }
    if (payment.status !== "captured" && !payment.captured) {
      return {
        ok: false,
        code: "payment_not_captured",
        bookingId: null,
        alreadyConfirmed: false,
      };
    }
    if (payment.currency !== "INR") {
      return {
        ok: false,
        code: "currency_mismatch",
        bookingId: null,
        alreadyConfirmed: false,
      };
    }
    verifiedAmountPaise = payment.amount;
  }

  // 2. Call the database atomic confirmation function
  const { data: dbResult, error: dbError } = await supabase.rpc(
    "confirm_booking_payment",
    {
      p_razorpay_order_id: razorpayOrderId,
      p_razorpay_payment_id: razorpayPaymentId,
      p_amount_paise: verifiedAmountPaise,
      p_currency: "INR",
    },
  );

  if (dbError || !dbResult) {
    throw new Error(
      `confirm_booking_payment RPC failed: ${dbError?.message ?? "no data"}`,
      { cause: dbError },
    );
  }

  const result = dbResult as ConfirmBookingPaymentResult;

  // 3. If newly confirmed, trigger Google Calendar event creation and email notifications
  if (result.ok && result.code === "confirmed" && result.booking_id) {
    await syncCalendarEvent(result.booking_id);
    await dispatchConfirmationEmails(result.booking_id);
  }

  return {
    ok: result.ok,
    code: result.code,
    bookingId: result.booking_id,
    alreadyConfirmed: result.already_confirmed,
  };
}

/**
 * Syncs Google Calendar event for a confirmed booking.
 * Fail-safe: calendar failure is recorded in DB without rolling back confirmation.
 */
async function syncCalendarEvent(bookingId: string): Promise<void> {
  const supabase = getSupabaseAdmin();

  const { data: booking, error: fetchError } = await supabase
    .from("bookings")
    .select(
      "id, session_name, customer_name, customer_email, customer_note, starts_at, ends_at, timezone, razorpay_order_id",
    )
    .eq("id", bookingId)
    .single();

  if (fetchError || !booking) {
    await supabase.rpc("mark_calendar_failed", {
      p_booking_id: bookingId,
      p_error: `Failed to load booking for calendar sync: ${fetchError?.message ?? "not found"}`,
    });
    return;
  }

  try {
    const calendarEvent = await createCalendarBookingEvent({
      bookingId: booking.id,
      sessionName: booking.session_name,
      customerName: booking.customer_name,
      customerEmail: booking.customer_email,
      customerNote: booking.customer_note,
      startsAt: new Date(booking.starts_at),
      endsAt: new Date(booking.ends_at),
      timezone: booking.timezone,
      razorpayOrderId: booking.razorpay_order_id,
    });

    await supabase.rpc("mark_calendar_synced", {
      p_booking_id: booking.id,
      p_google_event_id: calendarEvent.googleEventId,
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    await supabase.rpc("mark_calendar_failed", {
      p_booking_id: booking.id,
      p_error: errorMessage,
    });
  }
}

/**
 * Dispatches email notifications for confirmed booking.
 * Fail-safe: errors do not bubble up or affect the booking confirmation.
 */
async function dispatchConfirmationEmails(bookingId: string): Promise<void> {
  try {
    const supabase = getSupabaseAdmin();
    const { data: booking, error: fetchError } = await supabase
      .from("bookings")
      .select(
        "id, session_name, customer_name, customer_email, customer_phone, customer_note, duration_minutes, amount_paise, starts_at, ends_at, timezone",
      )
      .eq("id", bookingId)
      .single();

    if (fetchError || !booking) {
      console.error(
        "[Notifications] Failed to load booking for email dispatch:",
        fetchError?.message ?? "not found",
      );
      return;
    }

    await sendBookingNotificationEmails({
      bookingId: booking.id,
      customerName: booking.customer_name,
      customerEmail: booking.customer_email,
      customerPhone: booking.customer_phone,
      customerNote: booking.customer_note,
      sessionName: booking.session_name,
      durationMinutes: booking.duration_minutes,
      amountPaise: booking.amount_paise,
      startsAt: new Date(booking.starts_at),
      endsAt: new Date(booking.ends_at),
      timezone: booking.timezone,
    });
  } catch (err) {
    console.error("[Notifications] Unexpected error dispatching emails:", err);
  }
}

