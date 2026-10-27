import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/razorpay/verify";
import { confirmBooking } from "@/lib/booking/confirm";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { fetchRazorpayOrderPayments } from "@/lib/razorpay/client";

export async function POST(request: Request): Promise<Response> {
  const signature = request.headers.get("x-razorpay-signature");
  if (!signature) {
    return NextResponse.json(
      { error: "missing_signature", message: "X-Razorpay-Signature header missing" },
      { status: 400, headers: { "Cache-Control": "private, no-store" } },
    );
  }

  // 1. Read raw text body BEFORE any JSON parsing (critical for HMAC validity)
  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return NextResponse.json(
      { error: "read_error", message: "Failed to read request payload" },
      { status: 400, headers: { "Cache-Control": "private, no-store" } },
    );
  }

  // 2. Verify HMAC-SHA256 signature in constant time
  const isValid = verifyWebhookSignature(rawBody, signature);
  if (!isValid) {
    return NextResponse.json(
      { error: "invalid_signature", message: "Webhook signature verification failed" },
      { status: 400, headers: { "Cache-Control": "private, no-store" } },
    );
  }

  // 3. Parse JSON event
  let eventData: Record<string, unknown>;
  try {
    eventData = JSON.parse(rawBody) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { error: "invalid_json", message: "Payload was not valid JSON" },
      { status: 400, headers: { "Cache-Control": "private, no-store" } },
    );
  }

  const eventId = typeof eventData.event_id === "string" ? eventData.event_id : (eventData.id as string);
  const eventType = typeof eventData.event === "string" ? eventData.event : "";

  if (!eventId || !eventType) {
    return NextResponse.json(
      { error: "invalid_event_structure", message: "Event ID or type missing" },
      { status: 400, headers: { "Cache-Control": "private, no-store" } },
    );
  }

  const payload = (eventData.payload as Record<string, unknown>) ?? {};
  const paymentEntity = (payload.payment as { entity?: Record<string, unknown> })?.entity;
  const orderEntity = (payload.order as { entity?: Record<string, unknown> })?.entity;

  const orderId =
    (paymentEntity?.order_id as string | undefined) ||
    (orderEntity?.id as string | undefined) ||
    null;

  let paymentId = (paymentEntity?.id as string | undefined) || null;

  // 4. Record event for strict idempotency
  const supabase = getSupabaseAdmin();
  const { data: wasInserted, error: insertError } = await supabase.rpc(
    "record_razorpay_event",
    {
      p_event_id: eventId,
      p_event_type: eventType,
      p_order_id: orderId,
      p_payment_id: paymentId,
    },
  );

  if (insertError) {
    return NextResponse.json(
      { error: "database_error", message: insertError.message },
      { status: 500, headers: { "Cache-Control": "private, no-store" } },
    );
  }

  // If already recorded, duplicate delivery → return 200 immediately
  if (!wasInserted) {
    return NextResponse.json(
      { ok: true, status: "duplicate_ignored" },
      { status: 200, headers: { "Cache-Control": "private, no-store" } },
    );
  }

  // 5. Handle event types
  try {
    if (eventType === "payment.captured" || eventType === "order.paid") {
      // If payment ID is missing on order.paid, lookup payments for this order
      if (!paymentId && orderId) {
        const orderPayments = await fetchRazorpayOrderPayments(orderId);
        const capturedPayment = orderPayments.find(
          (p) => p.status === "captured" || p.captured,
        );
        if (capturedPayment) {
          paymentId = capturedPayment.id;
        }
      }

      if (orderId && paymentId) {
        const amountPaise = typeof paymentEntity?.amount === "number" ? paymentEntity.amount : undefined;

        await confirmBooking({
          razorpayOrderId: orderId,
          razorpayPaymentId: paymentId,
          amountPaise,
          source: "webhook",
        });
      }
    } else if (eventType === "payment.failed" && orderId) {
      // payment.failed only marks payment_status = failed while pending; doesn't cancel hold
      await supabase.rpc("mark_payment_failed", {
        p_razorpay_order_id: orderId,
      });
    }

    // Mark event processed
    await supabase.rpc("mark_razorpay_event_processed", {
      p_event_id: eventId,
    });

    return NextResponse.json(
      { ok: true, status: "processed" },
      { status: 200, headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (err) {
    // 500 status causes Razorpay to retry delivery
    return NextResponse.json(
      {
        error: "processing_failed",
        message: err instanceof Error ? err.message : String(err),
      },
      { status: 500, headers: { "Cache-Control": "private, no-store" } },
    );
  }
}
