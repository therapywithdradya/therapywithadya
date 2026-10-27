import "server-only";

import { getRazorpayEnv } from "@/lib/env.server";

export type RazorpayOrder = {
  id: string;
  entity: "order";
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string | null;
  status: "created" | "attempted" | "paid";
  attempts: number;
  notes: Record<string, string>;
  created_at: number;
};

export type RazorpayPayment = {
  id: string;
  entity: "payment";
  amount: number;
  currency: string;
  status: "created" | "authorized" | "captured" | "refunded" | "failed";
  order_id: string;
  method: string;
  captured: boolean;
  description: string | null;
  amount_refunded: number;
  refund_status: string | null;
  email: string | null;
  contact: string | null;
  error_code: string | null;
  error_description: string | null;
  created_at: number;
};

export type RazorpayPaymentList = {
  entity: "collection";
  count: number;
  items: RazorpayPayment[];
};

export type CreateOrderParams = {
  amountPaise: number;
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
};

function getAuthHeader(): string {
  const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = getRazorpayEnv();
  const credentials = Buffer.from(
    `${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`,
  ).toString("base64");
  return `Basic ${credentials}`;
}

const BASE_URL = "https://api.razorpay.com/v1";

/**
 * Creates a Razorpay Order.
 * amount must be a positive integer in paise (e.g. 250000 for ₹2,500).
 */
export async function createRazorpayOrder({
  amountPaise,
  currency = "INR",
  receipt,
  notes,
}: CreateOrderParams): Promise<RazorpayOrder> {
  if (!Number.isInteger(amountPaise) || amountPaise <= 0) {
    throw new Error(
      `Invalid amount: ${amountPaise}. Must be a positive integer in paise.`,
    );
  }

  const res = await fetch(`${BASE_URL}/orders`, {
    method: "POST",
    headers: {
      Authorization: getAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: amountPaise,
      currency,
      receipt,
      notes: notes ?? {},
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const err = (await res.json()) as { error?: { description?: string } };
      if (err.error?.description) {
        message = err.error.description;
      }
    } catch {
      // ignore JSON parse error
    }
    throw new Error(`Razorpay order creation failed: ${message}`);
  }

  return (await res.json()) as RazorpayOrder;
}

/**
 * Fetches an order by its Razorpay ID.
 */
export async function fetchRazorpayOrder(orderId: string): Promise<RazorpayOrder> {
  const res = await fetch(`${BASE_URL}/orders/${encodeURIComponent(orderId)}`, {
    method: "GET",
    headers: {
      Authorization: getAuthHeader(),
    },
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch Razorpay order "${orderId}": HTTP ${res.status}`,
    );
  }

  return (await res.json()) as RazorpayOrder;
}

/**
 * Fetches all payments associated with a Razorpay Order ID.
 */
export async function fetchRazorpayOrderPayments(
  orderId: string,
): Promise<RazorpayPayment[]> {
  const res = await fetch(
    `${BASE_URL}/orders/${encodeURIComponent(orderId)}/payments`,
    {
      method: "GET",
      headers: {
        Authorization: getAuthHeader(),
      },
      signal: AbortSignal.timeout(10_000),
    },
  );

  if (!res.ok) {
    throw new Error(
      `Failed to fetch payments for Razorpay order "${orderId}": HTTP ${res.status}`,
    );
  }

  const list = (await res.json()) as RazorpayPaymentList;
  return list.items ?? [];
}

/**
 * Fetches a single payment by its payment ID.
 */
export async function fetchRazorpayPayment(
  paymentId: string,
): Promise<RazorpayPayment> {
  const res = await fetch(
    `${BASE_URL}/payments/${encodeURIComponent(paymentId)}`,
    {
      method: "GET",
      headers: {
        Authorization: getAuthHeader(),
      },
      signal: AbortSignal.timeout(10_000),
    },
  );

  if (!res.ok) {
    throw new Error(
      `Failed to fetch Razorpay payment "${paymentId}": HTTP ${res.status}`,
    );
  }

  return (await res.json()) as RazorpayPayment;
}
