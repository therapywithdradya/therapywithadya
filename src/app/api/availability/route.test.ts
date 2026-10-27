import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock "server-only" to allow tests to run outside Next.js
vi.mock("server-only", () => ({}));

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockCheckRateLimit = vi.fn();
const mockGetAvailability = vi.fn();

vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: (args: unknown) => mockCheckRateLimit(args),
  getClientIp: () => "127.0.0.1",
}));

vi.mock("@/lib/availability/service", () => ({
  getAvailability: (args: unknown) => mockGetAvailability(args),
}));

vi.mock("@/lib/calendar/google", () => ({
  createGoogleBusyProvider: () => ({ getBusyIntervals: vi.fn() }),
}));

vi.mock("@/lib/availability/supabase", () => ({
  createSupabaseBookedProvider: () => ({ getBookedRanges: vi.fn() }),
}));

import { GET, _resetAvailabilityCacheForTesting } from "./route";
import { AvailabilityInputError, AvailabilityUnavailableError } from "@/lib/availability/types";

describe("GET /api/availability", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    _resetAvailabilityCacheForTesting();
    mockCheckRateLimit.mockResolvedValue({
      allowed: true,
      remaining: 29,
      retry_after_seconds: 0,
    });
  });

  it("returns 400 invalid_input if required params are missing", async () => {
    const req = new Request("https://example.com/api/availability?session=session-a-60");
    const res = await GET(req);
    expect(res.status).toBe(400);

    const body = await res.json();
    expect(body.error).toBe("invalid_input");
    expect(res.headers.get("Cache-Control")).toBe("private, no-store");
  });

  it("returns 400 invalid_session if session slug is unknown", async () => {
    const req = new Request(
      "https://example.com/api/availability?session=unknown-slug&fromDate=2026-11-01&toDate=2026-11-05",
    );
    const res = await GET(req);
    expect(res.status).toBe(400);

    const body = await res.json();
    expect(body.error).toBe("invalid_session");
  });

  it("returns 429 rate_limited if rate limit is exceeded", async () => {
    mockCheckRateLimit.mockResolvedValue({
      allowed: false,
      remaining: 0,
      retry_after_seconds: 120,
    });

    const req = new Request(
      "https://example.com/api/availability?session=session-a-60&fromDate=2026-11-01&toDate=2026-11-05",
    );
    const res = await GET(req);
    expect(res.status).toBe(429);
    expect(res.headers.get("Retry-After")).toBe("120");

    const body = await res.json();
    expect(body.error).toBe("rate_limited");
  });

  it("returns 503 availability_unavailable if rate limiter check throws", async () => {
    mockCheckRateLimit.mockRejectedValue(new Error("Supabase connection error"));

    const req = new Request(
      "https://example.com/api/availability?session=session-a-60&fromDate=2026-11-01&toDate=2026-11-05",
    );
    const res = await GET(req);
    expect(res.status).toBe(503);

    const body = await res.json();
    expect(body.error).toBe("availability_unavailable");
  });

  it("returns 200 with available slot starts on success", async () => {
    const fakeSlots = [
      {
        start: "2026-11-02T04:30:00.000Z",
        end: "2026-11-02T05:30:00.000Z",
        localDate: "2026-11-02",
        localTime: "10:00",
      },
      {
        start: "2026-11-02T05:30:00.000Z",
        end: "2026-11-02T06:30:00.000Z",
        localDate: "2026-11-02",
        localTime: "11:00",
      },
    ];
    mockGetAvailability.mockResolvedValue(fakeSlots);

    const req = new Request(
      "https://example.com/api/availability?session=session-a-60&fromDate=2026-11-01&toDate=2026-11-05",
    );
    const res = await GET(req);
    expect(res.status).toBe(200);
    expect(res.headers.get("Cache-Control")).toBe("private, no-store");

    const body = await res.json();
    expect(body.sessionTypeId).toBe("session-a-60");
    expect(body.timezone).toBe("Asia/Kolkata");
    expect(body.slots).toEqual([
      "2026-11-02T04:30:00.000Z",
      "2026-11-02T05:30:00.000Z",
    ]);
  });

  it("caches successful availability responses in-memory for TTL", async () => {
    mockGetAvailability.mockResolvedValue([
      {
        start: "2026-11-02T04:30:00.000Z",
        end: "2026-11-02T05:30:00.000Z",
        localDate: "2026-11-02",
        localTime: "10:00",
      },
    ]);

    const req1 = new Request(
      "https://example.com/api/availability?session=session-a-60&fromDate=2026-11-01&toDate=2026-11-05",
    );
    const res1 = await GET(req1);
    expect(res1.status).toBe(200);
    expect(mockGetAvailability).toHaveBeenCalledTimes(1);

    // Second request with exact same params should hit cache
    const req2 = new Request(
      "https://example.com/api/availability?session=session-a-60&fromDate=2026-11-01&toDate=2026-11-05",
    );
    const res2 = await GET(req2);
    expect(res2.status).toBe(200);
    expect(mockGetAvailability).toHaveBeenCalledTimes(1); // Not called again!
  });

  it("supports alternative query param names: sessionTypeId, from, to", async () => {
    mockGetAvailability.mockResolvedValue([]);

    const req = new Request(
      "https://example.com/api/availability?sessionTypeId=session-b-90&from=2026-11-01&to=2026-11-05",
    );
    const res = await GET(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.sessionTypeId).toBe("session-b-90");
    expect(body.slots).toEqual([]);
  });

  it("returns 400 invalid_input if date range exceeds 42 days", async () => {
    mockGetAvailability.mockRejectedValue(
      new AvailabilityInputError("Requested date span (45 days) exceeds maximum allowed range of 42 days"),
    );

    const req = new Request(
      "https://example.com/api/availability?session=session-a-60&fromDate=2026-11-01&toDate=2026-12-16",
    );
    const res = await GET(req);
    expect(res.status).toBe(400);

    const body = await res.json();
    expect(body.error).toBe("invalid_input");
  });

  it("returns 503 availability_unavailable when providers fail (fail closed)", async () => {
    mockGetAvailability.mockRejectedValue(
      new AvailabilityUnavailableError("Google Calendar freeBusy returned HTTP 500"),
    );

    const req = new Request(
      "https://example.com/api/availability?session=session-a-60&fromDate=2026-11-01&toDate=2026-11-05",
    );
    const res = await GET(req);
    expect(res.status).toBe(503);

    const body = await res.json();
    expect(body.error).toBe("availability_unavailable");
  });
});
