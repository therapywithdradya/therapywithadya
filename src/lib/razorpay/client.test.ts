import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("server-only", () => ({}));

const mockRazorpayEnv = {
  RAZORPAY_KEY_ID: "rzp_test_key123",
  RAZORPAY_KEY_SECRET: "rzp_secret456",
  RAZORPAY_WEBHOOK_SECRET: "rzp_webhook789",
};

vi.mock("@/lib/env.server", () => ({
  getRazorpayEnv: () => mockRazorpayEnv,
}));

import {
  createRazorpayOrder,
  fetchRazorpayOrder,
  fetchRazorpayOrderPayments,
  fetchRazorpayPayment,
} from "./client";

describe("Razorpay client", () => {
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFetch = vi.fn();
    vi.stubGlobal("fetch", mockFetch);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("createRazorpayOrder", () => {
    it("creates an order with Basic auth and returns the order data", async () => {
      const fakeOrder = {
        id: "order_123",
        entity: "order",
        amount: 250000,
        currency: "INR",
        receipt: "booking_abc",
        status: "created",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => fakeOrder,
      });

      const order = await createRazorpayOrder({
        amountPaise: 250000,
        currency: "INR",
        receipt: "booking_abc",
      });

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const [url, options] = mockFetch.mock.calls[0]!;
      expect(url).toBe("https://api.razorpay.com/v1/orders");
      expect(options.method).toBe("POST");
      expect(options.headers.Authorization).toBe(
        `Basic ${Buffer.from("rzp_test_key123:rzp_secret456").toString("base64")}`,
      );
      expect(order).toEqual(fakeOrder);
    });

    it("rejects non-positive or non-integer amounts", async () => {
      await expect(
        createRazorpayOrder({ amountPaise: -100, receipt: "rec_1" }),
      ).rejects.toThrow(/Invalid amount/);

      await expect(
        createRazorpayOrder({ amountPaise: 2500.5, receipt: "rec_1" }),
      ).rejects.toThrow(/Invalid amount/);
    });

    it("throws a descriptive error when Razorpay returns non-200", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          error: { description: "Receipt length exceeds limit" },
        }),
      });

      await expect(
        createRazorpayOrder({ amountPaise: 250000, receipt: "rec_too_long" }),
      ).rejects.toThrow(/Receipt length exceeds limit/);
    });
  });

  describe("fetchRazorpayOrder", () => {
    it("fetches order by ID with Basic auth", async () => {
      const fakeOrder = { id: "order_xyz", status: "paid" };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => fakeOrder,
      });

      const result = await fetchRazorpayOrder("order_xyz");
      expect(result).toEqual(fakeOrder);
      expect(mockFetch.mock.calls[0]![0]).toBe(
        "https://api.razorpay.com/v1/orders/order_xyz",
      );
    });
  });

  describe("fetchRazorpayOrderPayments", () => {
    it("fetches payment list for an order", async () => {
      const fakeList = {
        entity: "collection",
        count: 1,
        items: [{ id: "pay_1", amount: 250000, status: "captured" }],
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => fakeList,
      });

      const payments = await fetchRazorpayOrderPayments("order_xyz");
      expect(payments).toEqual(fakeList.items);
      expect(mockFetch.mock.calls[0]![0]).toBe(
        "https://api.razorpay.com/v1/orders/order_xyz/payments",
      );
    });
  });

  describe("fetchRazorpayPayment", () => {
    it("fetches single payment by payment ID", async () => {
      const fakePayment = { id: "pay_999", amount: 250000, status: "captured" };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => fakePayment,
      });

      const payment = await fetchRazorpayPayment("pay_999");
      expect(payment).toEqual(fakePayment);
      expect(mockFetch.mock.calls[0]![0]).toBe(
        "https://api.razorpay.com/v1/payments/pay_999",
      );
    });
  });
});
