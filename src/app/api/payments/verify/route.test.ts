import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("server-only", () => ({}));

const mockVerifyCheckoutSignature = vi.fn();
vi.mock("@/lib/razorpay/verify", () => ({
  verifyCheckoutSignature: (args: unknown) => mockVerifyCheckoutSignature(args),
}));

const mockConfirmBooking = vi.fn();
vi.mock("@/lib/booking/confirm", () => ({
  confirmBooking: (args: unknown) => mockConfirmBooking(args),
}));

import { POST } from "./route";

describe("POST /api/payments/verify", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validPayload = {
    token: "token_abc_12345",
    razorpay_order_id: "order_123",
    razorpay_payment_id: "pay_456",
    razorpay_signature: "valid_signature_hex",
  };

  it("returns 200 with redirectUrl on valid signature and confirmed booking", async () => {
    mockVerifyCheckoutSignature.mockReturnValue(true);
    mockConfirmBooking.mockResolvedValue({
      ok: true,
      code: "confirmed",
      bookingId: "book-uuid-1",
      alreadyConfirmed: false,
    });

    const req = new Request("https://example.com/api/payments/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validPayload),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.code).toBe("confirmed");
    expect(body.redirectUrl).toBe("/book/confirmation/token_abc_12345");

    expect(mockConfirmBooking).toHaveBeenCalledWith({
      razorpayOrderId: "order_123",
      razorpayPaymentId: "pay_456",
      source: "verify",
    });
  });

  it("returns 400 invalid_signature when signature check fails without writing state", async () => {
    mockVerifyCheckoutSignature.mockReturnValue(false);

    const req = new Request("https://example.com/api/payments/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validPayload),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const body = await res.json();
    expect(body.error).toBe("invalid_signature");
    expect(mockConfirmBooking).not.toHaveBeenCalled();
  });

  it("handles late payment collision (paid_slot_lost) gracefully", async () => {
    mockVerifyCheckoutSignature.mockReturnValue(true);
    mockConfirmBooking.mockResolvedValue({
      ok: false,
      code: "paid_slot_lost",
      bookingId: "book-uuid-1",
      alreadyConfirmed: false,
    });

    const req = new Request("https://example.com/api/payments/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validPayload),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.code).toBe("paid_slot_lost");
    expect(body.redirectUrl).toBe("/book/confirmation/token_abc_12345");
  });
});
