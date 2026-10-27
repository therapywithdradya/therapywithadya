import { describe, it, expect, vi } from "vitest";
import { createHmac } from "node:crypto";

vi.mock("server-only", () => ({}));

const mockRazorpayEnv = {
  RAZORPAY_KEY_ID: "rzp_test_1234567890",
  RAZORPAY_KEY_SECRET: "test_secret_key_abcdef",
  RAZORPAY_WEBHOOK_SECRET: "test_webhook_secret_xyz123",
};

vi.mock("@/lib/env.server", () => ({
  getRazorpayEnv: () => mockRazorpayEnv,
}));

import { verifyCheckoutSignature, verifyWebhookSignature } from "./verify";

describe("Razorpay signature verification", () => {
  describe("verifyCheckoutSignature", () => {
    it("returns true for a valid checkout signature", () => {
      const orderId = "order_EKwxwAgIt421";
      const paymentId = "pay_29QQoUBi66xm2f";
      const payload = `${orderId}|${paymentId}`;
      const validSignature = createHmac("sha256", mockRazorpayEnv.RAZORPAY_KEY_SECRET)
        .update(payload)
        .digest("hex");

      const result = verifyCheckoutSignature({
        orderId,
        paymentId,
        signature: validSignature,
      });

      expect(result).toBe(true);
    });

    it("returns false for a tampered signature", () => {
      const orderId = "order_EKwxwAgIt421";
      const paymentId = "pay_29QQoUBi66xm2f";

      const result = verifyCheckoutSignature({
        orderId,
        paymentId,
        signature: "bad_signature_value_1234567890abcdef",
      });

      expect(result).toBe(false);
    });

    it("returns false if any argument is empty", () => {
      expect(
        verifyCheckoutSignature({ orderId: "", paymentId: "pay_1", signature: "sig" }),
      ).toBe(false);
      expect(
        verifyCheckoutSignature({ orderId: "ord_1", paymentId: "", signature: "sig" }),
      ).toBe(false);
      expect(
        verifyCheckoutSignature({ orderId: "ord_1", paymentId: "pay_1", signature: "" }),
      ).toBe(false);
    });
  });

  describe("verifyWebhookSignature", () => {
    it("returns true for a valid webhook signature matching raw payload", () => {
      const rawBody = JSON.stringify({
        event: "payment.captured",
        payload: { payment: { entity: { id: "pay_123" } } },
      });
      const validSignature = createHmac("sha256", mockRazorpayEnv.RAZORPAY_WEBHOOK_SECRET)
        .update(rawBody)
        .digest("hex");

      const result = verifyWebhookSignature(rawBody, validSignature);
      expect(result).toBe(true);
    });

    it("returns false if raw body does not match signature", () => {
      const rawBody = '{"event":"payment.captured"}';
      const modifiedBody = '{"event":"payment.captured", "extra": 1}';
      const signature = createHmac("sha256", mockRazorpayEnv.RAZORPAY_WEBHOOK_SECRET)
        .update(rawBody)
        .digest("hex");

      const result = verifyWebhookSignature(modifiedBody, signature);
      expect(result).toBe(false);
    });

    it("returns false if inputs are empty", () => {
      expect(verifyWebhookSignature("", "sig")).toBe(false);
      expect(verifyWebhookSignature("body", "")).toBe(false);
    });
  });
});
