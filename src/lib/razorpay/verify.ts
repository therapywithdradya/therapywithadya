import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { getRazorpayEnv } from "@/lib/env.server";

/**
 * Constant-time comparison between two hex strings.
 * Length is checked first because timingSafeEqual throws when buffer lengths differ.
 */
function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) {
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

export type VerifyCheckoutSignatureParams = {
  orderId: string;
  paymentId: string;
  signature: string;
};

/**
 * Verifies Razorpay Checkout signature returned by the client handler.
 * Expected: HMAC-SHA256(order_id + "|" + payment_id, RAZORPAY_KEY_SECRET)
 */
export function verifyCheckoutSignature({
  orderId,
  paymentId,
  signature,
}: VerifyCheckoutSignatureParams): boolean {
  if (!orderId || !paymentId || !signature) {
    return false;
  }

  const { RAZORPAY_KEY_SECRET } = getRazorpayEnv();
  const payload = `${orderId}|${paymentId}`;
  const expected = createHmac("sha256", RAZORPAY_KEY_SECRET)
    .update(payload)
    .digest("hex");

  return safeCompare(expected, signature);
}

/**
 * Verifies the X-Razorpay-Signature header against the raw webhook body.
 * Expected: HMAC-SHA256(rawBody, RAZORPAY_WEBHOOK_SECRET)
 */
export function verifyWebhookSignature(
  rawBody: string,
  signature: string,
): boolean {
  if (!rawBody || !signature) {
    return false;
  }

  const { RAZORPAY_WEBHOOK_SECRET } = getRazorpayEnv();
  const expected = createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");

  return safeCompare(expected, signature);
}
