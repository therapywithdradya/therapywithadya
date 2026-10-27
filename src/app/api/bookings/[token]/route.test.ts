import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("server-only", () => ({}));

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

const mockConfirmBooking = vi.fn();
vi.mock("@/lib/booking/confirm", () => ({
  confirmBooking: (args: unknown) => mockConfirmBooking(args),
}));

import { GET } from "./route";

describe("GET /api/bookings/[token]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const sampleBooking = {
    id: "booking-123",
    booking_status: "confirmed",
    payment_status: "paid",
    session_name: "Individual Therapy",
    start_at: "2026-11-05T04:30:00.000Z",
    end_at: "2026-11-05T05:30:00.000Z",
    timezone: "Asia/Kolkata",
    customer_name: "Aditi Sharma",
    razorpay_order_id: "order_abc",
    hold_expires_at: null,
    calendar_sync_status: "synced",
  };

  it("returns sanitized booking details for a valid token", async () => {
    mockRpc.mockResolvedValueOnce({
      data: {
        ok: true,
        booking: sampleBooking,
      },
      error: null,
    });

    const req = new Request("https://example.com/api/bookings/valid_token_12345");
    const res = await GET(req, {
      params: Promise.resolve({ token: "valid_token_12345" }),
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.booking.customerName).toBe("Aditi Sharma");
    expect(body.booking.bookingStatus).toBe("confirmed");
    expect(body.booking.paymentStatus).toBe("paid");
    expect(body.booking.calendarSyncStatus).toBe("synced");
    expect(mockFetchRazorpayOrderPayments).not.toHaveBeenCalled();
  });

  it("triggers recovery path when booking is pending with an order ID and payment is captured", async () => {
    const pendingBooking = {
      ...sampleBooking,
      booking_status: "pending",
      payment_status: "unpaid",
      razorpay_order_id: "order_pending_123",
    };

    const confirmedBooking = {
      ...sampleBooking,
      booking_status: "confirmed",
      payment_status: "paid",
    };

    mockRpc
      .mockResolvedValueOnce({
        data: { ok: true, booking: pendingBooking },
        error: null,
      })
      .mockResolvedValueOnce({
        data: { ok: true, booking: confirmedBooking },
        error: null,
      });

    mockFetchRazorpayOrderPayments.mockResolvedValueOnce([
      {
        id: "pay_captured_99",
        amount: 250000,
        status: "captured",
        captured: true,
      },
    ]);

    mockConfirmBooking.mockResolvedValueOnce({
      ok: true,
      code: "confirmed",
      bookingId: "booking-123",
      alreadyConfirmed: false,
    });

    const req = new Request("https://example.com/api/bookings/valid_token_12345");
    const res = await GET(req, {
      params: Promise.resolve({ token: "valid_token_12345" }),
    });

    expect(res.status).toBe(200);
    expect(mockFetchRazorpayOrderPayments).toHaveBeenCalledWith("order_pending_123");
    expect(mockConfirmBooking).toHaveBeenCalledWith({
      razorpayOrderId: "order_pending_123",
      razorpayPaymentId: "pay_captured_99",
      amountPaise: 250000,
      source: "recovery",
    });

    const body = await res.json();
    expect(body.booking.bookingStatus).toBe("confirmed");
  });

  it("returns 404 for unknown or expired tokens", async () => {
    mockRpc.mockResolvedValueOnce({
      data: { ok: false, code: "not_found" },
      error: null,
    });

    const req = new Request("https://example.com/api/bookings/unknown_token");
    const res = await GET(req, {
      params: Promise.resolve({ token: "unknown_token" }),
    });

    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toBe("not_found");
  });
});
