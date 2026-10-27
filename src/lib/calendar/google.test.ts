import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { Interval } from "@/lib/availability/types";

// ---------------------------------------------------------------------------
// Mock setup — must be before the module import
// ---------------------------------------------------------------------------

// Mock "server-only" to allow tests to run outside Next.js
vi.mock("server-only", () => ({}));

// Mock getGoogleEnv so we don't need real env vars
const mockGoogleEnv = {
  GOOGLE_CLIENT_ID: "test-client-id.apps.googleusercontent.com",
  GOOGLE_CLIENT_SECRET: "test-client-secret",
  GOOGLE_REFRESH_TOKEN: "test-refresh-token",
  GOOGLE_CALENDAR_ID: "primary",
};

vi.mock("@/lib/env.server", () => ({
  getGoogleEnv: () => mockGoogleEnv,
}));

import {
  createGoogleBusyProvider,
  createCalendarBookingEvent,
  _resetCachesForTesting,
  type CalendarBookingEvent,
} from "./google";
import { AvailabilityUnavailableError } from "@/lib/availability/types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const TOKEN_RESPONSE = {
  access_token: "ya29.test-access-token",
  expires_in: 3600,
  token_type: "Bearer",
};

function mockFetchSequence(responses: Array<{ status: number; body: unknown }>) {
  const fetchMock = vi.fn();
  for (const r of responses) {
    fetchMock.mockResolvedValueOnce({
      ok: r.status >= 200 && r.status < 300,
      status: r.status,
      json: () => Promise.resolve(r.body),
      text: () => Promise.resolve(JSON.stringify(r.body)),
    } as Response);
  }
  return fetchMock;
}

function makeRange(startIso: string, endIso: string) {
  return { start: new Date(startIso), end: new Date(endIso) };
}

const sampleBookingEvent: CalendarBookingEvent = {
  bookingId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  sessionName: "Individual Therapy Session (60 min)",
  customerName: "Test Client",
  customerEmail: "client@example.com",
  customerNote: "Feeling anxious lately",
  startsAt: new Date("2026-11-01T04:30:00.000Z"),
  endsAt: new Date("2026-11-01T05:30:00.000Z"),
  timezone: "Asia/Kolkata",
  razorpayOrderId: "order_test123",
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("Google Calendar Integration", () => {
  beforeEach(() => {
    _resetCachesForTesting();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // =========================================================================
  // Free/Busy Provider
  // =========================================================================

  describe("createGoogleBusyProvider", () => {
    it("fetches busy intervals from Google Calendar", async () => {
      const busyBlocks = [
        { start: "2026-11-01T04:30:00Z", end: "2026-11-01T05:30:00Z" },
        { start: "2026-11-01T08:00:00Z", end: "2026-11-01T09:00:00Z" },
      ];

      const fetchMock = mockFetchSequence([
        // Token response
        { status: 200, body: TOKEN_RESPONSE },
        // FreeBusy response
        {
          status: 200,
          body: {
            calendars: {
              primary: { busy: busyBlocks },
            },
          },
        },
      ]);
      vi.stubGlobal("fetch", fetchMock);

      const provider = createGoogleBusyProvider();
      const range = makeRange("2026-11-01T00:00:00Z", "2026-11-02T00:00:00Z");
      const intervals = (await provider.getBusyIntervals(range)) as Interval[];

      expect(intervals).toHaveLength(2);
      expect(intervals[0]!.start.toISOString()).toBe("2026-11-01T04:30:00.000Z");
      expect(intervals[0]!.end.toISOString()).toBe("2026-11-01T05:30:00.000Z");
      expect(intervals[1]!.start.toISOString()).toBe("2026-11-01T08:00:00.000Z");
      expect(intervals[1]!.end.toISOString()).toBe("2026-11-01T09:00:00.000Z");

      // Token request + freeBusy request = 2 calls
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it("returns empty array when no busy blocks exist", async () => {
      const fetchMock = mockFetchSequence([
        { status: 200, body: TOKEN_RESPONSE },
        {
          status: 200,
          body: {
            calendars: {
              primary: { busy: [] },
            },
          },
        },
      ]);
      vi.stubGlobal("fetch", fetchMock);

      const provider = createGoogleBusyProvider();
      const range = makeRange("2026-11-01T00:00:00Z", "2026-11-02T00:00:00Z");
      const intervals = await provider.getBusyIntervals(range);

      expect(intervals).toHaveLength(0);
    });

    it("returns empty array when calendar has no busy field", async () => {
      const fetchMock = mockFetchSequence([
        { status: 200, body: TOKEN_RESPONSE },
        {
          status: 200,
          body: {
            calendars: {
              primary: {},
            },
          },
        },
      ]);
      vi.stubGlobal("fetch", fetchMock);

      const provider = createGoogleBusyProvider();
      const range = makeRange("2026-11-01T00:00:00Z", "2026-11-02T00:00:00Z");
      const intervals = await provider.getBusyIntervals(range);

      expect(intervals).toHaveLength(0);
    });

    it("uses cached access token on subsequent requests", async () => {
      const fetchMock = mockFetchSequence([
        // First request: token + freeBusy
        { status: 200, body: TOKEN_RESPONSE },
        { status: 200, body: { calendars: { primary: { busy: [] } } } },
        // Second request: only freeBusy (token cached)
        { status: 200, body: { calendars: { primary: { busy: [] } } } },
      ]);
      vi.stubGlobal("fetch", fetchMock);

      const provider = createGoogleBusyProvider();

      // Different ranges to bypass the freeBusy cache
      await provider.getBusyIntervals(
        makeRange("2026-11-01T00:00:00Z", "2026-11-02T00:00:00Z"),
      );
      await provider.getBusyIntervals(
        makeRange("2026-11-03T00:00:00Z", "2026-11-04T00:00:00Z"),
      );

      // 1 token + 2 freeBusy = 3 total (not 4)
      expect(fetchMock).toHaveBeenCalledTimes(3);
    });

    it("uses cached freeBusy result for same range within TTL", async () => {
      const fetchMock = mockFetchSequence([
        { status: 200, body: TOKEN_RESPONSE },
        {
          status: 200,
          body: {
            calendars: {
              primary: {
                busy: [
                  { start: "2026-11-01T04:30:00Z", end: "2026-11-01T05:30:00Z" },
                ],
              },
            },
          },
        },
      ]);
      vi.stubGlobal("fetch", fetchMock);

      const provider = createGoogleBusyProvider();
      const range = makeRange("2026-11-01T00:00:00Z", "2026-11-02T00:00:00Z");

      const first = await provider.getBusyIntervals(range);
      const second = await provider.getBusyIntervals(range);

      expect(first).toHaveLength(1);
      expect(second).toHaveLength(1);

      // Only 2 fetch calls total (token + freeBusy), the second call is cached
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it("returns independent copies from cache (no mutation leaking)", async () => {
      const fetchMock = mockFetchSequence([
        { status: 200, body: TOKEN_RESPONSE },
        {
          status: 200,
          body: {
            calendars: {
              primary: {
                busy: [
                  { start: "2026-11-01T04:30:00Z", end: "2026-11-01T05:30:00Z" },
                ],
              },
            },
          },
        },
      ]);
      vi.stubGlobal("fetch", fetchMock);

      const provider = createGoogleBusyProvider();
      const range = makeRange("2026-11-01T00:00:00Z", "2026-11-02T00:00:00Z");

      const first = (await provider.getBusyIntervals(range)) as Interval[];
      const second = (await provider.getBusyIntervals(range)) as Interval[];

      // Mutate first result
      first[0]!.start = new Date(0);

      // Second result should be unaffected
      expect(second[0]!.start.toISOString()).toBe("2026-11-01T04:30:00.000Z");
    });

    // -----------------------------------------------------------------------
    // Fail-closed scenarios
    // -----------------------------------------------------------------------

    it("throws AvailabilityUnavailableError when token request fails", async () => {
      const fetchMock = mockFetchSequence([
        { status: 401, body: { error: "invalid_grant" } },
      ]);
      vi.stubGlobal("fetch", fetchMock);

      const provider = createGoogleBusyProvider();
      const range = makeRange("2026-11-01T00:00:00Z", "2026-11-02T00:00:00Z");

      await expect(provider.getBusyIntervals(range)).rejects.toThrow(
        AvailabilityUnavailableError,
      );
    });

    it("throws AvailabilityUnavailableError when freeBusy returns non-OK", async () => {
      const fetchMock = mockFetchSequence([
        { status: 200, body: TOKEN_RESPONSE },
        { status: 403, body: { error: { message: "Forbidden" } } },
      ]);
      vi.stubGlobal("fetch", fetchMock);

      const provider = createGoogleBusyProvider();
      const range = makeRange("2026-11-01T00:00:00Z", "2026-11-02T00:00:00Z");

      await expect(provider.getBusyIntervals(range)).rejects.toThrow(
        AvailabilityUnavailableError,
      );
    });

    it("throws AvailabilityUnavailableError when per-calendar errors exist", async () => {
      const fetchMock = mockFetchSequence([
        { status: 200, body: TOKEN_RESPONSE },
        {
          status: 200,
          body: {
            calendars: {
              primary: {
                errors: [{ domain: "calendar", reason: "notFound" }],
              },
            },
          },
        },
      ]);
      vi.stubGlobal("fetch", fetchMock);

      const provider = createGoogleBusyProvider();
      const range = makeRange("2026-11-01T00:00:00Z", "2026-11-02T00:00:00Z");

      await expect(provider.getBusyIntervals(range)).rejects.toThrow(
        /notFound/,
      );
    });

    it("throws AvailabilityUnavailableError on network failure", async () => {
      const fetchMock = vi.fn().mockRejectedValueOnce(new Error("ECONNREFUSED"));
      vi.stubGlobal("fetch", fetchMock);

      const provider = createGoogleBusyProvider();
      const range = makeRange("2026-11-01T00:00:00Z", "2026-11-02T00:00:00Z");

      await expect(provider.getBusyIntervals(range)).rejects.toThrow(
        AvailabilityUnavailableError,
      );
    });

    it("throws AvailabilityUnavailableError on invalid busy timestamp", async () => {
      const fetchMock = mockFetchSequence([
        { status: 200, body: TOKEN_RESPONSE },
        {
          status: 200,
          body: {
            calendars: {
              primary: {
                busy: [{ start: "not-a-date", end: "also-not-a-date" }],
              },
            },
          },
        },
      ]);
      vi.stubGlobal("fetch", fetchMock);

      const provider = createGoogleBusyProvider();
      const range = makeRange("2026-11-01T00:00:00Z", "2026-11-02T00:00:00Z");

      await expect(provider.getBusyIntervals(range)).rejects.toThrow(
        AvailabilityUnavailableError,
      );
    });

    it("throws AvailabilityUnavailableError when token response is invalid JSON structure", async () => {
      const fetchMock = mockFetchSequence([
        // Missing access_token
        { status: 200, body: { token_type: "Bearer", expires_in: 3600 } },
      ]);
      vi.stubGlobal("fetch", fetchMock);

      const provider = createGoogleBusyProvider();
      const range = makeRange("2026-11-01T00:00:00Z", "2026-11-02T00:00:00Z");

      await expect(provider.getBusyIntervals(range)).rejects.toThrow(
        AvailabilityUnavailableError,
      );
    });
  });

  // =========================================================================
  // Event Writer
  // =========================================================================

  describe("createCalendarBookingEvent", () => {
    it("creates a calendar event with deterministic ID", async () => {
      const fetchMock = mockFetchSequence([
        { status: 200, body: TOKEN_RESPONSE },
        {
          status: 200,
          body: { id: "adyasa1b2c3d4e5f67890abcdef1234567890" },
        },
      ]);
      vi.stubGlobal("fetch", fetchMock);

      const result = await createCalendarBookingEvent(sampleBookingEvent);

      expect(result.googleEventId).toBe("adyasa1b2c3d4e5f67890abcdef1234567890");

      // Verify the event insert request
      const insertCall = fetchMock.mock.calls[1]!;
      expect(insertCall[0]).toContain("/calendars/primary/events");
      expect(insertCall[0]).toContain("sendUpdates=all");

      const body = JSON.parse(insertCall[1].body as string);
      expect(body.id).toBe("adyasa1b2c3d4e5f67890abcdef1234567890");
      expect(body.summary).toBe(
        "Session: Individual Therapy Session (60 min) - Test Client",
      );
      expect(body.description).toContain("Booking ID:");
      expect(body.description).toContain("Payment ref: order_test123");
      expect(body.description).toContain("Feeling anxious lately");
      expect(body.attendees[0].email).toBe("client@example.com");
      expect(body.start.timeZone).toBe("Asia/Kolkata");
      expect(body.extendedProperties.private.bookingId).toBe(
        sampleBookingEvent.bookingId,
      );
    });

    it("returns success on 409 Conflict (idempotent retry)", async () => {
      const fetchMock = mockFetchSequence([
        { status: 200, body: TOKEN_RESPONSE },
        { status: 409, body: { error: { message: "Event already exists" } } },
      ]);
      vi.stubGlobal("fetch", fetchMock);

      const result = await createCalendarBookingEvent(sampleBookingEvent);

      // Should succeed with the deterministic event ID
      expect(result.googleEventId).toBe("adyasa1b2c3d4e5f67890abcdef1234567890");
    });

    it("omits payment ref when razorpayOrderId is null", async () => {
      const fetchMock = mockFetchSequence([
        { status: 200, body: TOKEN_RESPONSE },
        { status: 200, body: { id: "adyasa1b2c3d4e5f67890abcdef1234567890" } },
      ]);
      vi.stubGlobal("fetch", fetchMock);

      await createCalendarBookingEvent({
        ...sampleBookingEvent,
        razorpayOrderId: null,
      });

      const body = JSON.parse(fetchMock.mock.calls[1]![1].body as string);
      expect(body.description).not.toContain("Payment ref");
    });

    it("omits client note when customerNote is null", async () => {
      const fetchMock = mockFetchSequence([
        { status: 200, body: TOKEN_RESPONSE },
        { status: 200, body: { id: "adyasa1b2c3d4e5f67890abcdef1234567890" } },
      ]);
      vi.stubGlobal("fetch", fetchMock);

      await createCalendarBookingEvent({
        ...sampleBookingEvent,
        customerNote: null,
      });

      const body = JSON.parse(fetchMock.mock.calls[1]![1].body as string);
      expect(body.description).not.toContain("Client note");
    });

    it("truncates very long customer notes to 500 characters", async () => {
      const longNote = "A".repeat(1000);
      const fetchMock = mockFetchSequence([
        { status: 200, body: TOKEN_RESPONSE },
        { status: 200, body: { id: "adyasa1b2c3d4e5f67890abcdef1234567890" } },
      ]);
      vi.stubGlobal("fetch", fetchMock);

      await createCalendarBookingEvent({
        ...sampleBookingEvent,
        customerNote: longNote,
      });

      const body = JSON.parse(fetchMock.mock.calls[1]![1].body as string);
      // The note in description should be at most 500 chars
      const noteMatch = body.description.match(/Client note:\n([\s\S]+)/);
      expect(noteMatch).not.toBeNull();
      expect(noteMatch![1].length).toBe(500);
    });

    it("throws Error when insert returns non-OK non-409 status", async () => {
      const fetchMock = mockFetchSequence([
        { status: 200, body: TOKEN_RESPONSE },
        {
          status: 500,
          body: { error: { message: "Internal Server Error" } },
        },
      ]);
      vi.stubGlobal("fetch", fetchMock);

      await expect(
        createCalendarBookingEvent(sampleBookingEvent),
      ).rejects.toThrow(/Internal Server Error/);
    });

    it("throws Error on network failure during event insert", async () => {
      const fetchMock = vi.fn();
      // Token succeeds
      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(TOKEN_RESPONSE),
      } as Response);
      // Event insert fails with network error
      fetchMock.mockRejectedValueOnce(new Error("ETIMEDOUT"));
      vi.stubGlobal("fetch", fetchMock);

      await expect(
        createCalendarBookingEvent(sampleBookingEvent),
      ).rejects.toThrow(/network/i);
    });

    it("generates correct Google event ID from booking UUID", async () => {
      const fetchMock = mockFetchSequence([
        { status: 200, body: TOKEN_RESPONSE },
        { status: 200, body: { id: "adyas00000000000000000000000000000000" } },
      ]);
      vi.stubGlobal("fetch", fetchMock);

      await createCalendarBookingEvent({
        ...sampleBookingEvent,
        bookingId: "00000000-0000-0000-0000-000000000000",
      });

      const body = JSON.parse(fetchMock.mock.calls[1]![1].body as string);
      expect(body.id).toBe("adyas00000000000000000000000000000000");
    });
  });
});
