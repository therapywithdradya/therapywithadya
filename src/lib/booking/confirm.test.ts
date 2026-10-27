import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("server-only", () => ({}));

const mockRpc = vi.fn();
const mockFrom = vi.fn();

vi.mock("@/lib/supabase/admin", () => ({
  getSupabaseAdmin: () => ({
    rpc: mockRpc,
    from: mockFrom,
  }),
}));

const mockFetchRazorpayPayment = vi.fn();
vi.mock("@/lib/razorpay/client", () => ({
  fetchRazorpayPayment: (id: string) => mockFetchRazorpayPayment(id),
}));

const mockCreateCalendarBookingEvent = vi.fn();
vi.mock("@/lib/calendar/google", () => ({
  createCalendarBookingEvent: (args: unknown) => mockCreateCalendarBookingEvent(args),
}));

import { confirmBooking } from "./confirm";

describe("confirmBooking", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("confirms a booking and triggers calendar event creation on new confirmation", async () => {
    mockRpc.mockImplementation((rpcName: string) => {
      if (rpcName === "confirm_booking_payment") {
        return Promise.resolve({
          data: {
            ok: true,
            code: "confirmed",
            booking_id: "book-uuid-123",
            already_confirmed: false,
          },
          error: null,
        });
      }
      if (rpcName === "mark_calendar_synced") {
        return Promise.resolve({ data: { ok: true, code: "synced" }, error: null });
      }
      return Promise.resolve({ data: null, error: null });
    });

    const mockSingle = vi.fn().mockResolvedValue({
      data: {
        id: "book-uuid-123",
        session_name: "Individual Therapy",
        customer_name: "Aditi Sharma",
        customer_email: "aditi@example.com",
        customer_note: "Looking forward to this",
        starts_at: "2026-11-05T04:30:00.000Z",
        ends_at: "2026-11-05T05:30:00.000Z",
        timezone: "Asia/Kolkata",
        razorpay_order_id: "order_123",
      },
      error: null,
    });

    mockFrom.mockReturnValue({
      select: () => ({
        eq: () => ({
          single: mockSingle,
        }),
      }),
    });

    mockCreateCalendarBookingEvent.mockResolvedValue({
      googleEventId: "adyasbookuuid123",
    });

    const result = await confirmBooking({
      razorpayOrderId: "order_123",
      razorpayPaymentId: "pay_456",
      amountPaise: 250000,
      source: "verify",
    });

    expect(result.ok).toBe(true);
    expect(result.code).toBe("confirmed");
    expect(mockCreateCalendarBookingEvent).toHaveBeenCalledTimes(1);
    expect(mockRpc).toHaveBeenCalledWith("mark_calendar_synced", {
      p_booking_id: "book-uuid-123",
      p_google_event_id: "adyasbookuuid123",
    });
  });

  it("does not re-create calendar event if already_confirmed is true", async () => {
    mockRpc.mockResolvedValueOnce({
      data: {
        ok: true,
        code: "already_confirmed",
        booking_id: "book-uuid-123",
        already_confirmed: true,
      },
      error: null,
    });

    const result = await confirmBooking({
      razorpayOrderId: "order_123",
      razorpayPaymentId: "pay_456",
      amountPaise: 250000,
      source: "webhook",
    });

    expect(result.ok).toBe(true);
    expect(result.alreadyConfirmed).toBe(true);
    expect(mockCreateCalendarBookingEvent).not.toHaveBeenCalled();
  });

  it("records calendar failure in DB if calendar event insert throws", async () => {
    mockRpc.mockImplementation((rpcName: string) => {
      if (rpcName === "confirm_booking_payment") {
        return Promise.resolve({
          data: {
            ok: true,
            code: "confirmed",
            booking_id: "book-uuid-123",
            already_confirmed: false,
          },
          error: null,
        });
      }
      if (rpcName === "mark_calendar_failed") {
        return Promise.resolve({ data: { ok: true, code: "recorded" }, error: null });
      }
      return Promise.resolve({ data: null, error: null });
    });

    mockFrom.mockReturnValue({
      select: () => ({
        eq: () => ({
          single: () =>
            Promise.resolve({
              data: {
                id: "book-uuid-123",
                session_name: "Individual Therapy",
                customer_name: "Aditi Sharma",
                customer_email: "aditi@example.com",
                customer_note: null,
                starts_at: "2026-11-05T04:30:00.000Z",
                ends_at: "2026-11-05T05:30:00.000Z",
                timezone: "Asia/Kolkata",
                razorpay_order_id: "order_123",
              },
              error: null,
            }),
        }),
      }),
    });

    mockCreateCalendarBookingEvent.mockRejectedValue(new Error("Google API quota exceeded"));

    const result = await confirmBooking({
      razorpayOrderId: "order_123",
      razorpayPaymentId: "pay_456",
      amountPaise: 250000,
      source: "verify",
    });

    expect(result.ok).toBe(true); // Confirmation still succeeds!
    expect(mockRpc).toHaveBeenCalledWith("mark_calendar_failed", {
      p_booking_id: "book-uuid-123",
      p_error: "Google API quota exceeded",
    });
  });

  it("fetches payment from Razorpay if amountPaise is not supplied", async () => {
    mockFetchRazorpayPayment.mockResolvedValue({
      id: "pay_456",
      order_id: "order_123",
      amount: 250000,
      currency: "INR",
      status: "captured",
      captured: true,
    });

    mockRpc.mockResolvedValueOnce({
      data: {
        ok: true,
        code: "confirmed",
        booking_id: "book-uuid-123",
        already_confirmed: false,
      },
      error: null,
    });

    mockFrom.mockReturnValue({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: { message: "not found" } }),
        }),
      }),
    });

    await confirmBooking({
      razorpayOrderId: "order_123",
      razorpayPaymentId: "pay_456",
      source: "recovery",
    });

    expect(mockFetchRazorpayPayment).toHaveBeenCalledWith("pay_456");
    expect(mockRpc).toHaveBeenCalledWith("confirm_booking_payment", {
      p_razorpay_order_id: "order_123",
      p_razorpay_payment_id: "pay_456",
      p_amount_paise: 250000,
      p_currency: "INR",
    });
  });
});
