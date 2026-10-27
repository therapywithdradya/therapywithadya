import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("server-only", () => ({}));

const mockRpc = vi.fn();
vi.mock("@/lib/supabase/admin", () => ({
  getSupabaseAdmin: () => ({
    rpc: mockRpc,
  }),
}));

const mockCheckRateLimit = vi.fn();
vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: (args: unknown) => mockCheckRateLimit(args),
  getClientIp: () => "127.0.0.1",
}));

const mockCreateRazorpayOrder = vi.fn();
vi.mock("@/lib/razorpay/client", () => ({
  createRazorpayOrder: (args: unknown) => mockCreateRazorpayOrder(args),
}));

vi.mock("@/lib/env.server", () => ({
  getRateLimitEnv: () => ({
    bookingLimit: 8,
    bookingWindowSeconds: 600,
  }),
  getRazorpayEnv: () => ({
    RAZORPAY_KEY_ID: "rzp_test_key_123",
  }),
}));

import { POST } from "./route";

describe("POST /api/bookings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCheckRateLimit.mockResolvedValue({
      allowed: true,
      remaining: 7,
      retry_after_seconds: 0,
    });
  });

  const validPayload = {
    sessionSlug: "session-a-60",
    startAt: "2026-11-05T04:30:00.000Z",
    customerName: "Priyanshu Verma",
    customerEmail: "priyanshu@example.com",
    customerPhone: "+919876543210",
    customerNote: "Looking for consultation",
  };

  it("creates a pending hold and Razorpay order on valid request", async () => {
    mockRpc.mockImplementation((rpcName: string) => {
      if (rpcName === "create_pending_booking") {
        return Promise.resolve({
          data: {
            ok: true,
            booking: {
              id: "book-uuid-999",
              session_name: "Individual Therapy Session (60 min)",
              start_at: "2026-11-05T04:30:00.000Z",
              end_at: "2026-11-05T05:30:00.000Z",
              price_paise: 150000,
              currency: "INR",
              hold_expires_at: "2026-11-05T04:45:00.000Z",
            },
          },
          error: null,
        });
      }
      if (rpcName === "attach_razorpay_order") {
        return Promise.resolve({ data: { ok: true, code: "attached" }, error: null });
      }
      return Promise.resolve({ data: null, error: null });
    });

    mockCreateRazorpayOrder.mockResolvedValue({
      id: "order_rzp_12345",
      amount: 150000,
      currency: "INR",
    });

    const req = new Request("https://example.com/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validPayload),
    });

    const res = await POST(req);
    expect(res.status).toBe(201);

    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.bookingId).toBe("book-uuid-999");
    expect(body.orderId).toBe("order_rzp_12345");
    expect(body.amountPaise).toBe(150000);
    expect(body.currency).toBe("INR");
    expect(body.keyId).toBe("rzp_test_key_123");
    expect(typeof body.publicToken).toBe("string");
    expect(body.publicToken.length).toBeGreaterThan(20);

    expect(mockCreateRazorpayOrder).toHaveBeenCalledWith({
      amountPaise: 150000,
      currency: "INR",
      receipt: "book-uuid-999",
      notes: {
        booking_id: "book-uuid-999",
        session_slug: "session-a-60",
      },
    });
  });

  it("rejects requests containing prohibited clinical fields", async () => {
    const prohibitedPayload = {
      ...validPayload,
      diagnosis: "Generalized Anxiety Disorder",
    };

    const req = new Request("https://example.com/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(prohibitedPayload),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const body = await res.json();
    expect(body.error).toBe("prohibited_clinical_data");
  });

  it("returns 409 slot_taken when database reports concurrency collision", async () => {
    mockRpc.mockResolvedValueOnce({
      data: {
        ok: false,
        code: "slot_taken",
      },
      error: null,
    });

    const req = new Request("https://example.com/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validPayload),
    });

    const res = await POST(req);
    expect(res.status).toBe(409);

    const body = await res.json();
    expect(body.error).toBe("slot_taken");
    expect(body.message).toContain("That time was just taken");
  });

  it("returns 429 when rate limit is exceeded", async () => {
    mockCheckRateLimit.mockResolvedValueOnce({
      allowed: false,
      remaining: 0,
      retry_after_seconds: 300,
    });

    const req = new Request("https://example.com/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validPayload),
    });

    const res = await POST(req);
    expect(res.status).toBe(429);
    expect(res.headers.get("Retry-After")).toBe("300");

    const body = await res.json();
    expect(body.error).toBe("rate_limited");
  });

  it("returns 400 for unknown session slug", async () => {
    const invalidSessionPayload = {
      ...validPayload,
      sessionSlug: "invalid-session-999",
    };

    const req = new Request("https://example.com/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invalidSessionPayload),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const body = await res.json();
    expect(body.error).toBe("invalid_session");
  });

  it("returns 502 when Razorpay order creation fails", async () => {
    mockRpc.mockResolvedValueOnce({
      data: {
        ok: true,
        booking: {
          id: "book-uuid-999",
          price_paise: 150000,
          hold_expires_at: "2026-11-05T04:45:00.000Z",
        },
      },
      error: null,
    });

    mockCreateRazorpayOrder.mockRejectedValueOnce(new Error("Gateway connection refused"));

    const req = new Request("https://example.com/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validPayload),
    });

    const res = await POST(req);
    expect(res.status).toBe(502);

    const body = await res.json();
    expect(body.error).toBe("payment_gateway_error");
  });
});
