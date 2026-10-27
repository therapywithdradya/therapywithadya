import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyCheckoutSignature } from "@/lib/razorpay/verify";
import { confirmBooking } from "@/lib/booking/confirm";

const verifySchema = z.object({
  token: z.string().min(1, "Confirmation token is required"),
  razorpay_order_id: z.string().min(1, "Order ID is required"),
  razorpay_payment_id: z.string().min(1, "Payment ID is required"),
  razorpay_signature: z.string().min(1, "Signature is required"),
});

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "invalid_json", message: "Request body must be valid JSON" },
      { status: 400, headers: { "Cache-Control": "private, no-store" } },
    );
  }

  const parsed = verifySchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues.map((i) => i.message).join(", ");
    return NextResponse.json(
      { error: "invalid_input", message },
      { status: 400, headers: { "Cache-Control": "private, no-store" } },
    );
  }

  const {
    token,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = parsed.data;

  // 1. Verify HMAC-SHA256 signature in constant time
  const isValidSignature = verifyCheckoutSignature({
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    signature: razorpay_signature,
  });

  if (!isValidSignature) {
    return NextResponse.json(
      {
        error: "invalid_signature",
        message: "Payment signature verification failed. No state change performed.",
      },
      { status: 400, headers: { "Cache-Control": "private, no-store" } },
    );
  }

  // 2. Call shared confirmation handler
  try {
    const result = await confirmBooking({
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      source: "verify",
    });

    const redirectUrl = `/book/confirmation/${encodeURIComponent(token)}`;

    return NextResponse.json(
      {
        ok: result.ok,
        code: result.code,
        redirectUrl,
      },
      { status: 200, headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (err) {
    return NextResponse.json(
      {
        error: "confirmation_failed",
        message:
          err instanceof Error
            ? err.message
            : "An unexpected error occurred during confirmation.",
      },
      { status: 500, headers: { "Cache-Control": "private, no-store" } },
    );
  }
}
