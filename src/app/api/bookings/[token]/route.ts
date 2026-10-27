import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { hashConfirmationToken } from "@/lib/booking/token";
import { fetchRazorpayOrderPayments } from "@/lib/razorpay/client";
import { confirmBooking } from "@/lib/booking/confirm";
import type { BookingByTokenResult } from "@/types/database";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> },
): Promise<Response> {
  const { token } = await params;

  if (!token || typeof token !== "string" || token.length < 10) {
    return NextResponse.json(
      { error: "invalid_token", message: "Invalid confirmation token format" },
      { status: 400, headers: { "Cache-Control": "private, no-store" } },
    );
  }

  const tokenHash = hashConfirmationToken(token);
  const supabase = getSupabaseAdmin();

  // 1. Fetch booking by SHA-256 token hash
  const { data: dbData, error: dbError } = await supabase.rpc(
    "get_booking_by_token_hash",
    {
      p_token_hash: tokenHash,
    },
  );

  if (dbError || !dbData) {
    return NextResponse.json(
      { error: "database_error", message: "Failed to look up booking" },
      { status: 500, headers: { "Cache-Control": "private, no-store" } },
    );
  }

  const result = dbData as BookingByTokenResult;
  if (!result.ok) {
    return NextResponse.json(
      { error: "not_found", message: "Booking not found or link has expired" },
      { status: 404, headers: { "Cache-Control": "private, no-store" } },
    );
  }

  let booking = result.booking;

  // 2. Recovery path: if pending with an order ID, check if payment was captured at Razorpay
  if (booking.booking_status === "pending" && booking.razorpay_order_id) {
    try {
      const payments = await fetchRazorpayOrderPayments(booking.razorpay_order_id);
      const capturedPayment = payments.find(
        (p) => p.status === "captured" || p.captured,
      );

      if (capturedPayment) {
        await confirmBooking({
          razorpayOrderId: booking.razorpay_order_id,
          razorpayPaymentId: capturedPayment.id,
          amountPaise: capturedPayment.amount,
          source: "recovery",
        });

        // Re-read status after recovery confirmation
        const { data: refreshedData } = await supabase.rpc(
          "get_booking_by_token_hash",
          { p_token_hash: tokenHash },
        );
        if (refreshedData && (refreshedData as BookingByTokenResult).ok) {
          booking = (refreshedData as BookingByTokenResult & { ok: true }).booking;
        }
      }
    } catch {
      // Recovery failure should not break status read; return current DB state
    }
  }

  // 3. Return sanitized public booking details (zero sensitive tokens or keys)
  return NextResponse.json(
    {
      ok: true,
      booking: {
        id: booking.id,
        bookingStatus: booking.booking_status,
        paymentStatus: booking.payment_status,
        sessionName: booking.session_name,
        startAt: booking.start_at,
        endAt: booking.end_at,
        timezone: booking.timezone,
        customerName: booking.customer_name,
        calendarSyncStatus: booking.calendar_sync_status,
        holdExpiresAt: booking.hold_expires_at,
      },
    },
    { status: 200, headers: { "Cache-Control": "private, no-store" } },
  );
}
