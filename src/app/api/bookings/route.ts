import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import {
  getSessionBySlug,
  assertPayable,
} from "@/lib/booking/session-config";
import { bookingRules } from "@/lib/booking/booking-rules";
import {
  generateConfirmationToken,
  hashConfirmationToken,
} from "@/lib/booking/token";
import { createRazorpayOrder } from "@/lib/razorpay/client";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { getRateLimitEnv, getRazorpayEnv } from "@/lib/env.server";
import type { CreatePendingBookingResult } from "@/types/database";

const PROHIBITED_CLINICAL_FIELDS = [
  "diagnosis",
  "symptoms",
  "medication",
  "history",
  "prescription",
  "clinical_notes",
  "psychiatric_history",
  "mental_health_records",
];

const createBookingSchema = z.object({
  sessionSlug: z.string().min(1, "Session slug is required"),
  startAt: z.string().datetime({ message: "startAt must be a valid ISO 8601 UTC timestamp" }),
  customerName: z.string().trim().min(1, "Name is required").max(100, "Name cannot exceed 100 characters"),
  customerEmail: z.string().trim().email("Valid email is required").max(200, "Email cannot exceed 200 characters"),
  customerPhone: z
    .string()
    .trim()
    .min(7, "Phone number is too short")
    .max(20, "Phone number is too long")
    .regex(/^[0-9+()\- ]+$/, "Invalid phone number characters"),
  customerNote: z
    .string()
    .max(500, "Note cannot exceed 500 characters")
    .nullable()
    .optional(),
});

function isOriginAllowed(request: Request): boolean {
  const origin = request.headers.get("origin") || request.headers.get("referer");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  // In testing or development without siteUrl, allow
  if (!siteUrl || !origin) {
    return true;
  }

  try {
    const originHost = new URL(origin).host;
    const siteHost = new URL(siteUrl).host;
    return originHost === siteHost;
  } catch {
    return false;
  }
}

export async function POST(request: Request): Promise<Response> {
  // 1. Origin verification for CSRF protection on browser POSTs
  if (!isOriginAllowed(request)) {
    return NextResponse.json(
      { error: "forbidden", message: "Cross-origin request rejected" },
      { status: 403, headers: { "Cache-Control": "private, no-store" } },
    );
  }

  // 2. Rate limiting (max 8 booking attempts per 10 min per IP)
  const rateLimitEnv = getRateLimitEnv();
  const clientIp = getClientIp(request);
  try {
    const rateLimit = await checkRateLimit({
      key: `booking:${clientIp}`,
      limit: rateLimitEnv.bookingLimit,
      windowSeconds: rateLimitEnv.bookingWindowSeconds,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "rate_limited",
          message: "Too many booking attempts. Please wait a few minutes before trying again.",
        },
        {
          status: 429,
          headers: {
            "Cache-Control": "private, no-store",
            "Retry-After": String(rateLimit.retry_after_seconds),
          },
        },
      );
    }
  } catch {
    return NextResponse.json(
      {
        error: "service_unavailable",
        message: "Booking service temporarily unavailable. Please try again shortly.",
      },
      { status: 503, headers: { "Cache-Control": "private, no-store" } },
    );
  }

  // 3. Parse and validate JSON payload
  let rawJson: unknown;
  try {
    rawJson = await request.json();
  } catch {
    return NextResponse.json(
      { error: "invalid_json", message: "Request body must be valid JSON" },
      { status: 400, headers: { "Cache-Control": "private, no-store" } },
    );
  }

  // Privacy boundary: check for prohibited clinical field names
  if (rawJson && typeof rawJson === "object") {
    const bodyKeys = Object.keys(rawJson as Record<string, unknown>);
    const foundProhibited = bodyKeys.filter((k) =>
      PROHIBITED_CLINICAL_FIELDS.includes(k.toLowerCase()),
    );
    if (foundProhibited.length > 0) {
      return NextResponse.json(
        {
          error: "prohibited_clinical_data",
          message:
            "Clinical or medical history fields are prohibited on this booking form for privacy compliance.",
        },
        { status: 400, headers: { "Cache-Control": "private, no-store" } },
      );
    }
  }

  const parseResult = createBookingSchema.safeParse(rawJson);
  if (!parseResult.success) {
    const issues = parseResult.error.issues.map((i) => i.message).join(", ");
    return NextResponse.json(
      { error: "invalid_input", message: issues },
      { status: 400, headers: { "Cache-Control": "private, no-store" } },
    );
  }

  const {
    sessionSlug,
    startAt,
    customerName,
    customerEmail,
    customerPhone,
    customerNote,
  } = parseResult.data;

  // 4. Validate session offering and price
  const sessionConfig = getSessionBySlug(sessionSlug);
  if (!sessionConfig) {
    return NextResponse.json(
      { error: "invalid_session", message: `Unknown session offering: "${sessionSlug}"` },
      { status: 400, headers: { "Cache-Control": "private, no-store" } },
    );
  }

  try {
    assertPayable(sessionConfig);
  } catch (err) {
    return NextResponse.json(
      {
        error: "invalid_session_configuration",
        message: err instanceof Error ? err.message : "Session is not payable",
      },
      { status: 400, headers: { "Cache-Control": "private, no-store" } },
    );
  }

  // 5. Generate secure client confirmation token
  const rawToken = generateConfirmationToken();
  const tokenHash = hashConfirmationToken(rawToken);

  // 6. Call create_pending_booking stored procedure
  const supabase = getSupabaseAdmin();
  const { data: dbData, error: dbError } = await supabase.rpc(
    "create_pending_booking",
    {
      p_session_slug: sessionConfig.slug,
      p_session_name: sessionConfig.name,
      p_price_paise: sessionConfig.pricePaise,
      p_duration_minutes: sessionConfig.durationMinutes,
      p_buffer_minutes: sessionConfig.bufferMinutes,
      p_start_at: startAt,
      p_customer_name: customerName,
      p_customer_email: customerEmail,
      p_customer_phone: customerPhone,
      p_customer_note: customerNote || null,
      p_timezone: bookingRules.timezone,
      p_token_hash: tokenHash,
    },
  );

  if (dbError || !dbData) {
    return NextResponse.json(
      {
        error: "database_error",
        message: "Failed to reserve appointment hold. Please try again.",
      },
      { status: 500, headers: { "Cache-Control": "private, no-store" } },
    );
  }

  const bookingResult = dbData as CreatePendingBookingResult;

  if (!bookingResult.ok) {
    if (bookingResult.code === "slot_taken") {
      return NextResponse.json(
        {
          error: "slot_taken",
          message: "That time was just taken. Please pick another.",
        },
        { status: 409, headers: { "Cache-Control": "private, no-store" } },
      );
    }

    return NextResponse.json(
      {
        error: bookingResult.code,
        message: `Unable to reserve slot: ${bookingResult.code}`,
      },
      { status: 400, headers: { "Cache-Control": "private, no-store" } },
    );
  }

  const bookingId = bookingResult.booking.id;

  // 7. Create Razorpay order
  let order;
  try {
    order = await createRazorpayOrder({
      amountPaise: sessionConfig.pricePaise,
      currency: "INR",
      receipt: bookingId,
      notes: {
        booking_id: bookingId,
        session_slug: sessionConfig.slug,
      },
    });
  } catch (err) {
    // If order creation fails, return 502 Bad Gateway
    return NextResponse.json(
      {
        error: "payment_gateway_error",
        message: `Failed to initialize checkout with payment gateway: ${err instanceof Error ? err.message : String(err)}`,
      },
      { status: 502, headers: { "Cache-Control": "private, no-store" } },
    );
  }

  // 8. Attach Razorpay order ID to booking row
  const { error: attachError } = await supabase.rpc("attach_razorpay_order", {
    p_booking_id: bookingId,
    p_order_id: order.id,
  });

  if (attachError) {
    return NextResponse.json(
      {
        error: "database_error",
        message: "Failed to link payment order with reservation.",
      },
      { status: 500, headers: { "Cache-Control": "private, no-store" } },
    );
  }

  // 9. Success: return checkout parameters to client
  const { RAZORPAY_KEY_ID } = getRazorpayEnv();

  return NextResponse.json(
    {
      ok: true,
      bookingId,
      orderId: order.id,
      amountPaise: sessionConfig.pricePaise,
      currency: "INR",
      keyId: RAZORPAY_KEY_ID,
      publicToken: rawToken,
      holdExpiresAt: bookingResult.booking.hold_expires_at,
    },
    { status: 201, headers: { "Cache-Control": "private, no-store" } },
  );
}
