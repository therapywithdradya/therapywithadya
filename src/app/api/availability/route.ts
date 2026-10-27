import { NextResponse } from "next/server";
import { getAvailability } from "@/lib/availability/service";
import { AvailabilityInputError } from "@/lib/availability/types";
import { createSupabaseBookedProvider } from "@/lib/availability/supabase";
import { createGoogleBusyProvider } from "@/lib/calendar/google";
import { bookingRules } from "@/lib/booking/booking-rules";
import { getSessionBySlug } from "@/lib/booking/session-config";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

// ---------------------------------------------------------------------------
// In-memory response cache (TTL 30 seconds per ARCHITECTURE.md)
// ---------------------------------------------------------------------------

const CACHE_TTL_MS = 30_000;

type CacheEntry = {
  slots: string[];
  expiresAt: number;
};

const availabilityCache = new Map<string, CacheEntry>();

/** @internal Reset cache — for testing only */
export function _resetAvailabilityCacheForTesting(): void {
  availabilityCache.clear();
}

// Maximum query range in days per ARCHITECTURE.md line 108/182
const MAX_QUERY_DAYS = 42;

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const sessionSlug =
    searchParams.get("session") || searchParams.get("sessionTypeId") || "";
  const fromDate =
    searchParams.get("fromDate") || searchParams.get("from") || "";
  const toDate = searchParams.get("toDate") || searchParams.get("to") || "";

  // 1. Validate required query parameters
  if (!sessionSlug || !fromDate || !toDate) {
    return NextResponse.json(
      {
        error: "invalid_input",
        message: "Missing required query parameters: session, fromDate, toDate",
      },
      {
        status: 400,
        headers: { "Cache-Control": "private, no-store" },
      },
    );
  }

  // 2. Validate session exists
  const sessionConfig = getSessionBySlug(sessionSlug);
  if (!sessionConfig) {
    return NextResponse.json(
      {
        error: "invalid_session",
        message: `Unknown session type: "${sessionSlug}"`,
      },
      {
        status: 400,
        headers: { "Cache-Control": "private, no-store" },
      },
    );
  }

  // 3. Rate limiting (max 30 reads per 5 min per IP)
  const clientIp = getClientIp(request);
  try {
    const rateLimit = await checkRateLimit({
      key: `avail:${clientIp}`,
      limit: 30,
      windowSeconds: 300,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "rate_limited",
          message: "Too many requests. Please try again later.",
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
    // Fail closed: if rate limiter backend fails, return 503
    return NextResponse.json(
      {
        error: "availability_unavailable",
        message:
          "Availability is temporarily unavailable. Please try again in a few minutes.",
      },
      {
        status: 503,
        headers: { "Cache-Control": "private, no-store" },
      },
    );
  }

  // 4. In-memory TTL Cache check
  const cacheKey = `${sessionSlug}:${fromDate}:${toDate}`;
  const cached = availabilityCache.get(cacheKey);
  if (cached && Date.now() < cached.expiresAt) {
    return NextResponse.json(
      {
        timezone: bookingRules.timezone,
        sessionTypeId: sessionConfig.slug,
        slots: cached.slots,
      },
      {
        status: 200,
        headers: { "Cache-Control": "private, no-store" },
      },
    );
  }

  // 5. Query availability engine
  try {
    const effectiveRules = {
      ...bookingRules,
      maxRangeDays: MAX_QUERY_DAYS,
    };

    const slots = await getAvailability({
      fromDate,
      toDate,
      session: {
        durationMinutes: sessionConfig.durationMinutes,
        bufferMinutes: sessionConfig.bufferMinutes,
      },
      now: new Date(),
      busyProvider: createGoogleBusyProvider(),
      bookedProvider: createSupabaseBookedProvider(),
      rules: effectiveRules,
    });

    const slotStarts = slots.map((s) => s.start);

    // Cache successful response (do not cache errors)
    availabilityCache.set(cacheKey, {
      slots: slotStarts,
      expiresAt: Date.now() + CACHE_TTL_MS,
    });

    return NextResponse.json(
      {
        timezone: bookingRules.timezone,
        sessionTypeId: sessionConfig.slug,
        slots: slotStarts,
      },
      {
        status: 200,
        headers: { "Cache-Control": "private, no-store" },
      },
    );
  } catch (err) {
    if (err instanceof AvailabilityInputError) {
      return NextResponse.json(
        {
          error: "invalid_input",
          message: err.message,
        },
        {
          status: 400,
          headers: { "Cache-Control": "private, no-store" },
        },
      );
    }

    // Fail closed: calendar down, database down, corrupt data, or timeout
    return NextResponse.json(
      {
        error: "availability_unavailable",
        message:
          "Availability is temporarily unavailable. Please try again in a few minutes.",
      },
      {
        status: 503,
        headers: { "Cache-Control": "private, no-store" },
      },
    );
  }
}
