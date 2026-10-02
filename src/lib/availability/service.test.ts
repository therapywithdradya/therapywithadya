import { describe, expect, it } from "vitest";
import { bookingRules } from "@/lib/booking/booking-rules";
import { getAvailability } from "@/lib/availability/service";
import {
  AvailabilityInputError,
  AvailabilityUnavailableError,
  type BookedRangesProvider,
  type BusyProvider,
} from "@/lib/availability/types";

const NOW = new Date("2026-01-12T00:00:00Z");
const FROM = "2026-01-19";
const TO = "2026-01-19";
const SESSION = { durationMinutes: 60, bufferMinutes: 0 };

function makeProviders(
  busy: unknown[] = [],
  booked: unknown[] = [],
): { busyProvider: BusyProvider; bookedProvider: BookedRangesProvider } {
  return {
    busyProvider: { getBusyIntervals: async () => busy },
    bookedProvider: { getBookedRanges: async () => booked },
  };
}

// ---- Test 10: Fail closed - provider rejection and timeout ----

describe("Test 10: Fail closed - provider rejection and timeout", () => {
  it("throws AvailabilityUnavailableError when busyProvider rejects", async () => {
    const { bookedProvider } = makeProviders();
    const failBusy: BusyProvider = {
      getBusyIntervals: async () => {
        throw new Error("Google API error");
      },
    };

    await expect(
      getAvailability({
        fromDate: FROM,
        toDate: TO,
        session: SESSION,
        now: NOW,
        busyProvider: failBusy,
        bookedProvider,
        rules: bookingRules,
      }),
    ).rejects.toThrow(AvailabilityUnavailableError);
  });

  it("throws AvailabilityUnavailableError when bookedProvider rejects", async () => {
    const { busyProvider } = makeProviders();
    const failBooked: BookedRangesProvider = {
      getBookedRanges: async () => {
        throw new Error("DB error");
      },
    };

    await expect(
      getAvailability({
        fromDate: FROM,
        toDate: TO,
        session: SESSION,
        now: NOW,
        busyProvider,
        bookedProvider: failBooked,
        rules: bookingRules,
      }),
    ).rejects.toThrow(AvailabilityUnavailableError);
  });

  it("throws AvailabilityUnavailableError on timeout (tiny timeoutMs)", async () => {
    // Provider that takes 200ms - but timeout is only 5ms
    const slowBusy: BusyProvider = {
      getBusyIntervals: () =>
        new Promise((resolve) => setTimeout(() => resolve([]), 200)),
    };
    const { bookedProvider } = makeProviders();

    await expect(
      getAvailability({
        fromDate: FROM,
        toDate: TO,
        session: SESSION,
        now: NOW,
        busyProvider: slowBusy,
        bookedProvider,
        rules: bookingRules,
        timeoutMs: 5,
      }),
    ).rejects.toThrow(AvailabilityUnavailableError);
  });

  it("result is never an empty array on provider failure - always an error", async () => {
    const { bookedProvider } = makeProviders();
    const failBusy: BusyProvider = {
      getBusyIntervals: async () => {
        throw new Error("error");
      },
    };

    let threw = false;
    try {
      await getAvailability({
        fromDate: FROM,
        toDate: TO,
        session: SESSION,
        now: NOW,
        busyProvider: failBusy,
        bookedProvider,
        rules: bookingRules,
      });
    } catch {
      threw = true;
    }
    expect(threw).toBe(true);
  });
});

// ---- Test for provider returning invalid data (test 9 at service level) ----

describe("Provider invalid data at service level", () => {
  it("provider returning invalid date string causes AvailabilityUnavailableError", async () => {
    const badBusy: BusyProvider = {
      getBusyIntervals: async () => [
        { start: "INVALID", end: "2026-01-19T10:00:00Z" },
      ],
    };
    const { bookedProvider } = makeProviders();

    await expect(
      getAvailability({
        fromDate: FROM,
        toDate: TO,
        session: SESSION,
        now: NOW,
        busyProvider: badBusy,
        bookedProvider,
        rules: bookingRules,
      }),
    ).rejects.toThrow(AvailabilityUnavailableError);
  });

  it("provider returning end before start causes AvailabilityUnavailableError", async () => {
    const badBooked: BookedRangesProvider = {
      getBookedRanges: async () => [
        { start_at: "2026-01-19T11:00:00Z", blocked_until: "2026-01-19T10:00:00Z" },
      ],
    };
    const { busyProvider } = makeProviders();

    await expect(
      getAvailability({
        fromDate: FROM,
        toDate: TO,
        session: SESSION,
        now: NOW,
        busyProvider,
        bookedProvider: badBooked,
        rules: bookingRules,
      }),
    ).rejects.toThrow(AvailabilityUnavailableError);
  });
});

// ---- Successful getAvailability call ----

describe("getAvailability happy path", () => {
  it("returns slots on a clear Monday", async () => {
    const { busyProvider, bookedProvider } = makeProviders();

    const slots = await getAvailability({
      fromDate: FROM,
      toDate: TO,
      session: SESSION,
      now: NOW,
      busyProvider,
      bookedProvider,
      rules: bookingRules,
    });

    expect(slots.length).toBeGreaterThan(0);
    expect(slots[0]).toHaveProperty("start");
    expect(slots[0]).toHaveProperty("localDate");
  });

  it("timer is cleared and no timer leaks after successful call", async () => {
    // This test just verifies the function resolves without hanging
    const { busyProvider, bookedProvider } = makeProviders();

    await expect(
      getAvailability({
        fromDate: FROM,
        toDate: TO,
        session: SESSION,
        now: NOW,
        busyProvider,
        bookedProvider,
        rules: bookingRules,
        timeoutMs: 8000,
      }),
    ).resolves.toBeDefined();
  });
});

// ---- Input validation at service level ----

describe("getAvailability input validation", () => {
  it("throws AvailabilityInputError for invalid date range", async () => {
    const { busyProvider, bookedProvider } = makeProviders();

    await expect(
      getAvailability({
        fromDate: "2026-01-25",
        toDate: "2026-01-19", // to before from
        session: SESSION,
        now: NOW,
        busyProvider,
        bookedProvider,
        rules: bookingRules,
      }),
    ).rejects.toThrow(AvailabilityInputError);
  });
});
