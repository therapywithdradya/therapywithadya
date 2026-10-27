import "server-only";

import { getGoogleEnv, type GoogleEnv } from "@/lib/env.server";
import {
  AvailabilityUnavailableError,
  type BusyProvider,
  type Interval,
} from "@/lib/availability/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type TokenResponse = {
  access_token: string;
  expires_in: number;
  token_type: string;
};

type FreeBusyCalendar = {
  busy?: { start: string; end: string }[];
  errors?: { domain: string; reason: string }[];
};

type FreeBusyResponse = {
  calendars?: Record<string, FreeBusyCalendar>;
};

/**
 * Minimal shape for creating a Google Calendar event.
 * Only fields this application uses are included.
 */
export type CalendarBookingEvent = {
  bookingId: string;
  sessionName: string;
  customerName: string;
  customerEmail: string;
  customerNote: string | null;
  startsAt: Date;
  endsAt: Date;
  timezone: string;
  razorpayOrderId: string | null;
};

type InsertedEvent = {
  googleEventId: string;
};

// ---------------------------------------------------------------------------
// Module-level token cache
// ---------------------------------------------------------------------------

let cachedAccessToken: string | null = null;
let tokenExpiresAt = 0; // Unix ms

/**
 * Buffer in ms subtracted from `expires_in` to refresh before real expiry.
 * 120 seconds avoids clock-skew and in-flight races.
 */
const TOKEN_EXPIRY_BUFFER_MS = 120_000;

// ---------------------------------------------------------------------------
// Module-level free/busy cache (TTL 60 s)
// ---------------------------------------------------------------------------

const FREEBUSY_TTL_MS = 60_000;

type FreeBusyCacheEntry = {
  intervals: Interval[];
  expiresAt: number; // Unix ms
};

/** Key: `${timeMinIso}|${timeMaxIso}` */
const freeBusyCache = new Map<string, FreeBusyCacheEntry>();

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Refresh the OAuth 2.0 access token using the stored refresh token.
 * Throws AvailabilityUnavailableError on failure (fail-closed).
 */
async function getAccessToken(env: GoogleEnv): Promise<string> {
  const now = Date.now();

  if (cachedAccessToken && now < tokenExpiresAt) {
    return cachedAccessToken;
  }

  const body = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    client_secret: env.GOOGLE_CLIENT_SECRET,
    refresh_token: env.GOOGLE_REFRESH_TOKEN,
    grant_type: "refresh_token",
  });

  let res: Response;
  try {
    res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
      signal: AbortSignal.timeout(10_000),
    });
  } catch (err) {
    throw new AvailabilityUnavailableError(
      "Google OAuth token request failed (network)",
      { cause: err },
    );
  }

  if (!res.ok) {
    // Do NOT include the response body — it may contain sensitive data
    throw new AvailabilityUnavailableError(
      `Google OAuth token request returned HTTP ${res.status}`,
    );
  }

  let data: TokenResponse;
  try {
    data = (await res.json()) as TokenResponse;
  } catch {
    throw new AvailabilityUnavailableError(
      "Google OAuth token response was not valid JSON",
    );
  }

  if (!data.access_token || typeof data.expires_in !== "number") {
    throw new AvailabilityUnavailableError(
      "Google OAuth token response missing access_token or expires_in",
    );
  }

  cachedAccessToken = data.access_token;
  tokenExpiresAt = now + data.expires_in * 1000 - TOKEN_EXPIRY_BUFFER_MS;

  return cachedAccessToken;
}

/**
 * Convert a booking UUID to a Google Calendar–compatible event ID.
 *
 * Google requires event IDs to use only lowercase letters a–v and digits 0–9
 * (base32hex alphabet), with length between 5 and 1024 characters.
 *
 * Strategy: prefix + lowercase hex of the UUID (hyphens stripped).
 * Hex chars 0-9a-f are a valid subset of the allowed alphabet.
 */
function bookingIdToGoogleEventId(bookingId: string): string {
  const hexOnly = bookingId.replace(/-/g, "").toLowerCase();
  return `adyas${hexOnly}`;
}

// ---------------------------------------------------------------------------
// Free/Busy Provider
// ---------------------------------------------------------------------------

/**
 * Returns a `BusyProvider` implementation backed by Google Calendar's
 * freeBusy.query endpoint.
 *
 * The provider uses an in-memory TTL cache (60 s) keyed by query range to
 * avoid hammering Google's API when multiple availability requests arrive
 * within the same window.
 *
 * **Fail-closed**: any Google API error throws `AvailabilityUnavailableError`.
 */
export function createGoogleBusyProvider(): BusyProvider {
  const env = getGoogleEnv();

  return {
    async getBusyIntervals(range: Interval): Promise<Interval[]> {
      const timeMin = range.start.toISOString();
      const timeMax = range.end.toISOString();
      const cacheKey = `${timeMin}|${timeMax}`;

      // Check cache
      const cached = freeBusyCache.get(cacheKey);
      if (cached && Date.now() < cached.expiresAt) {
        return cached.intervals.map((i) => ({
          start: new Date(i.start),
          end: new Date(i.end),
        }));
      }

      const accessToken = await getAccessToken(env);

      const requestBody = {
        timeMin,
        timeMax,
        timeZone: "UTC",
        items: [{ id: env.GOOGLE_CALENDAR_ID }],
      };

      let res: Response;
      try {
        res = await fetch(
          "https://www.googleapis.com/calendar/v3/freeBusy",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
            signal: AbortSignal.timeout(8_000),
          },
        );
      } catch (err) {
        throw new AvailabilityUnavailableError(
          "Google Calendar freeBusy request failed (network)",
          { cause: err },
        );
      }

      if (!res.ok) {
        throw new AvailabilityUnavailableError(
          `Google Calendar freeBusy returned HTTP ${res.status}`,
        );
      }

      let data: FreeBusyResponse;
      try {
        data = (await res.json()) as FreeBusyResponse;
      } catch {
        throw new AvailabilityUnavailableError(
          "Google Calendar freeBusy response was not valid JSON",
        );
      }

      const calendarData = data.calendars?.[env.GOOGLE_CALENDAR_ID];

      // Per-calendar errors (e.g. notFound) → fail closed
      if (calendarData?.errors && calendarData.errors.length > 0) {
        const reasons = calendarData.errors
          .map((e) => e.reason)
          .join(", ");
        throw new AvailabilityUnavailableError(
          `Google Calendar freeBusy calendar error: ${reasons}`,
        );
      }

      const busyBlocks = calendarData?.busy ?? [];

      const intervals: Interval[] = busyBlocks.map((block) => {
        const start = new Date(block.start);
        const end = new Date(block.end);

        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
          throw new AvailabilityUnavailableError(
            "Google Calendar returned an invalid busy interval timestamp",
          );
        }

        return { start, end };
      });

      // Store in cache
      freeBusyCache.set(cacheKey, {
        intervals: intervals.map((i) => ({
          start: new Date(i.start),
          end: new Date(i.end),
        })),
        expiresAt: Date.now() + FREEBUSY_TTL_MS,
      });

      // Evict stale entries opportunistically (max 100 entries)
      if (freeBusyCache.size > 100) {
        const now = Date.now();
        for (const [key, entry] of freeBusyCache) {
          if (now >= entry.expiresAt) {
            freeBusyCache.delete(key);
          }
        }
      }

      return intervals;
    },
  };
}

// ---------------------------------------------------------------------------
// Event Writer
// ---------------------------------------------------------------------------

/**
 * Create a Google Calendar event for a confirmed booking.
 *
 * Uses a deterministic event ID derived from the booking UUID so that
 * retries are idempotent — if the event already exists, Google returns 409
 * and this function treats that as success and returns the existing event ID.
 *
 * **This function must only be called after payment is confirmed.**
 * Calendar insert failure does NOT affect the booking status; the caller
 * sets `calendar_sync_status = failed` and retries later.
 */
export async function createCalendarBookingEvent(
  event: CalendarBookingEvent,
): Promise<InsertedEvent> {
  const env = getGoogleEnv();
  const accessToken = await getAccessToken(env);

  const googleEventId = bookingIdToGoogleEventId(event.bookingId);

  // Build event description — sanitized, no sensitive data beyond what
  // the practitioner already knows from the booking.
  const descriptionLines = [
    `Booking ID: ${event.bookingId}`,
  ];
  if (event.razorpayOrderId) {
    descriptionLines.push(`Payment ref: ${event.razorpayOrderId}`);
  }
  if (event.customerNote) {
    // Truncate to 500 chars as a safety measure
    const note = event.customerNote.slice(0, 500);
    descriptionLines.push(`\nClient note:\n${note}`);
  }

  const calendarEvent = {
    id: googleEventId,
    summary: `Session: ${event.sessionName} - ${event.customerName}`,
    description: descriptionLines.join("\n"),
    start: {
      dateTime: event.startsAt.toISOString(),
      timeZone: event.timezone,
    },
    end: {
      dateTime: event.endsAt.toISOString(),
      timeZone: event.timezone,
    },
    attendees: [
      { email: event.customerEmail, responseStatus: "needsAction" },
    ],
    reminders: {
      useDefault: false,
      overrides: [
        { method: "popup", minutes: 60 },
        { method: "popup", minutes: 15 },
      ],
    },
    extendedProperties: {
      private: {
        bookingId: event.bookingId,
        source: "therapywithadya",
      },
    },
  };

  const calendarId = encodeURIComponent(env.GOOGLE_CALENDAR_ID);
  const insertUrl =
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events` +
    `?sendUpdates=all`;

  let res: Response;
  try {
    res = await fetch(insertUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(calendarEvent),
      signal: AbortSignal.timeout(10_000),
    });
  } catch (err) {
    throw new Error("Google Calendar event insert failed (network)", {
      cause: err,
    });
  }

  // 409 Conflict: event with this ID already exists → idempotent success
  if (res.status === 409) {
    return { googleEventId };
  }

  if (!res.ok) {
    let errorDetail = "";
    try {
      const errorBody = await res.text();
      // Extract just the error message, not dump the whole response
      const parsed = JSON.parse(errorBody) as {
        error?: { message?: string };
      };
      errorDetail = parsed.error?.message ?? `HTTP ${res.status}`;
    } catch {
      errorDetail = `HTTP ${res.status}`;
    }
    throw new Error(`Google Calendar event insert failed: ${errorDetail}`);
  }

  // Successful insert — the response contains the event, but we only need
  // to confirm the ID.
  let responseData: { id?: string };
  try {
    responseData = (await res.json()) as { id?: string };
  } catch {
    // Event was created (200/201) but response parsing failed.
    // Use the deterministic ID we set.
    return { googleEventId };
  }

  return { googleEventId: responseData.id ?? googleEventId };
}

// ---------------------------------------------------------------------------
// Testing helpers (not exported from package, used by tests)
// ---------------------------------------------------------------------------

/** @internal Reset module caches — for testing only. */
export function _resetCachesForTesting(): void {
  cachedAccessToken = null;
  tokenExpiresAt = 0;
  freeBusyCache.clear();
}
