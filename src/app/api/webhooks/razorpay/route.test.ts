import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("server-only", () => ({}));

const mockVerifyWebhookSignature = vi.fn();
vi.mock("@/lib/razorpay/verify", () => ({
  verifyWebhookSignature: (body: string, sig: string) =>
    mockVerifyWebhookSignature(body, sig),
}));

const mockConfirmBooking = vi.fn();
vi.mock("@/lib/booking/confirm", () => ({
  confirmBooking: (args: unknown) => mockConfirmBooking(args),
}));

const mockRpc = vi.fn();
vi.mock("@/lib/supabase/admin", () => ({
  getSupabaseAdmin: () => ({
    rpc: mockRpc,
  }),
}));

const mockFetchRazorpayOrderPayments = vi.fn();
vi.mock("@/lib/razorpay/client", () => ({
  fetchRazorpayOrderPayments: (orderId: string) =>
    mockFetchRazorpayOrderPayments(orderId),
}));

import { POST } from "./route";

describe("POST /api/webhooks/razorpay", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const capturedEvent = {
    id: "evt_12345",
    event: "payment.captured",
    payload: {
      payment: {
        entity: {
          id: "pay_xyz",
          order_id: "order_abc",
          amount: 250000,
          currency: "INR",
        },
      },
    },
  };

  it("processes payment.captured event successfully", async () => {
    mockVerifyWebhookSignature.mockReturnValue(true);
    mockRpc.mockImplementation((rpcName: string) => {
      if (rpcName === "record_razorpay_event") {
        return Promise.resolve({ data: true, error: null }); // newly inserted
      }
      if (rpcName === "mark_razorpay_event_processed") {
        return Promise.resolve({ data: true, error: null });
      }
      return Promise.resolve({ data: null, error: null });
    });

    mockConfirmBooking.mockResolvedValue({
      ok: true,
      code: "confirmed",
      bookingId: "book-1",
      alreadyConfirmed: false,
    });

    const rawPayload = JSON.stringify(capturedEvent);
    const req = new Request("https://example.com/api/webhooks/razorpay", {
      method: "POST",
      headers: {
        "x-razorpay-signature": "valid_signature",
        "Content-Type": "application/json",
      },
      body: rawPayload,
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.status).toBe("processed");
    expect(mockConfirmBooking).toHaveBeenCalledWith({
      razorpayOrderId: "order_abc",
      razorpayPaymentId: "pay_xyz",
      amountPaise: 250000,
      source: "webhook",
    });
  });

  it("short-circuits duplicate events with 200 duplicate_ignored", async () => {
    mockVerifyWebhookSignature.mockReturnValue(true);
    mockRpc.mockImplementation((rpcName: string) => {
      if (rpcName === "record_razorpay_event") {
        return Promise.resolve({ data: false, error: null }); // already exists!
      }
      return Promise.resolve({ data: null, error: null });
    });

    const rawPayload = JSON.stringify(capturedEvent);
    const req = new Request("https://example.com/api/webhooks/razorpay", {
      method: "POST",
      headers: {
        "x-razorpay-signature": "valid_signature",
      },
      body: rawPayload,
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.status).toBe("duplicate_ignored");
    expect(mockConfirmBooking).not.toHaveBeenCalled();
  });

  it("rejects invalid signature with 400", async () => {
    mockVerifyWebhookSignature.mockReturnValue(false);

    const req = new Request("https://example.com/api/webhooks/razorpay", {
      method: "POST",
      headers: {
        "x-razorpay-signature": "bad_signature",
      },
      body: JSON.stringify(capturedEvent),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const body = await res.json();
    expect(body.error).toBe("invalid_signature");
    expect(mockRpc).not.toHaveBeenCalled();
  });

  it("handles payment.failed by marking payment failed in DB", async () => {
    mockVerifyWebhookSignature.mockReturnValue(true);
    mockRpc.mockImplementation((rpcName: string) => {
      if (rpcName === "record_razorpay_event") {
        return Promise.resolve({ data: true, error: null });
      }
      if (rpcName === "mark_payment_failed") {
        return Promise.resolve({ data: { ok: true, code: "marked_failed" }, error: null });
      }
      if (rpcName === "mark_razorpay_event_processed") {
        return Promise.resolve({ data: true, error: null });
      }
      return Promise.resolve({ data: null, error: null });
    });

    const failedEvent = {
      id: "evt_fail_1",
      event: "payment.failed",
      payload: {
        payment: {
          entity: {
            id: "pay_failed_1",
            order_id: "order_abc",
          },
        },
      },
    };

    const req = new Request("https://example.com/api/webhooks/razorpay", {
      method: "POST",
      headers: {
        "x-razorpay-signature": "valid_signature",
      },
      body: JSON.stringify(failedEvent),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(mockRpc).toHaveBeenCalledWith("mark_payment_failed", {
      p_razorpay_order_id: "order_abc",
    });
  });
});
