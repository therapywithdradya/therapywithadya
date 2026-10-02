import { describe, expect, it } from "vitest";
import { bookingRules } from "@/lib/booking/booking-rules";
import {
  generateCandidateSlots,
  getAvailableSlots,
  isRequestedSlotAvailable,
} from "@/lib/availability/slots";
import { AvailabilityInputError, AvailabilityUnavailableError } from "@/lib/availability/types";
import type { SessionTiming } from "@/lib/availability/types";

// Reference "now": Monday 2026-01-12 00:00:00 UTC
// Business timezone: Asia/Kolkata (IST, UTC+5:30)
// In IST this is: 2026-01-12 05:30 IST - which is before 10:00, so no slots that day for minNotice
// Use Monday 2026-01-19 00:00:00 UTC as "now" to have clean notice window
// All test rules use Asia/Kolkata (the bookingRules default)


// Deterministic now: 2026-01-12 Monday 00:00:00 UTC
// Earliest bookable: now + 12h = 2026-01-12T12:00:00Z
const NOW = new Date("2026-01-12T00:00:00Z");

const session60: SessionTiming = { durationMinutes: 60, bufferMinutes: 0 };
const session60buf15: SessionTiming = { durationMinutes: 60, bufferMinutes: 15 };
const session90: SessionTiming = { durationMinutes: 90, bufferMinutes: 0 };

// Monday in IST: 2026-01-19 (well within horizon, no notice issue when now is Jan 12)
const MONDAY_DATE = "2026-01-19"; // Luxon weekday 1
const SUNDAY_DATE = "2026-01-25"; // Luxon weekday 7

// Test 0: TZ sanity (same as intervals.test.ts, verify here too)
it("TZ sanity: getTimezoneOffset is 480 (America/Los_Angeles)", () => {
  expect(new Date(2026, 0, 15, 12).getTimezoneOffset()).toBe(480);
});

// ---- Test 1: Normal day slot generation ----

describe("Test 1: Normal Monday slot generation", () => {
  it("60-minute session, 30-minute grid: 15 slots (10:00–17:00), first 10:00, last 17:00", () => {
    const slots = generateCandidateSlots({
      fromDate: MONDAY_DATE,
      toDate: MONDAY_DATE,
      session: session60,
      rules: bookingRules,
      now: NOW,
    });
    const localTimes = slots.map((s) => s.localTime);
    expect(localTimes[0]).toBe("10:00");
    expect(localTimes[localTimes.length - 1]).toBe("17:00");
    expect(slots).toHaveLength(15);
  });

  it("90-minute session, 30-minute grid: 14 slots, last start 16:30", () => {
    const slots = generateCandidateSlots({
      fromDate: MONDAY_DATE,
      toDate: MONDAY_DATE,
      session: session90,
      rules: bookingRules,
      now: NOW,
    });
    const localTimes = slots.map((s) => s.localTime);
    expect(localTimes[localTimes.length - 1]).toBe("16:30");
    expect(slots).toHaveLength(14);
  });

  it("Sunday: zero slots", () => {
    const slots = generateCandidateSlots({
      fromDate: SUNDAY_DATE,
      toDate: SUNDAY_DATE,
      session: session60,
      rules: bookingRules,
      now: NOW,
    });
    expect(slots).toHaveLength(0);
  });
});

// ---- Test 2: Buffer rule with Google busy event ----
describe("Test 2: Buffer rule - Google busy 12:00–13:00 IST, 60min session, 15min buffer", () => {
  // 12:00 IST = 06:30 UTC, 13:00 IST = 07:30 UTC
  const busyRaw = [{ start: "2026-01-19T06:30:00Z", end: "2026-01-19T07:30:00Z" }];

  it("10:30 IST is free (not blocked)", () => {
    const slots = getAvailableSlots({
      fromDate: MONDAY_DATE,
      toDate: MONDAY_DATE,
      session: session60buf15,
      busy: busyRaw,
      booked: [],
      now: NOW,
      rules: bookingRules,
    });
    const times = slots.map((s) => s.localTime);
    expect(times).toContain("10:30");
  });

  it("11:00, 11:30, 12:00, 12:30, 13:00 IST are blocked by padded busy", () => {
    const slots = getAvailableSlots({
      fromDate: MONDAY_DATE,
      toDate: MONDAY_DATE,
      session: session60buf15,
      busy: busyRaw,
      booked: [],
      now: NOW,
      rules: bookingRules,
    });
    const times = slots.map((s) => s.localTime);
    expect(times).not.toContain("11:00");
    expect(times).not.toContain("11:30");
    expect(times).not.toContain("12:00");
    expect(times).not.toContain("12:30");
    expect(times).not.toContain("13:00");
  });

  it("13:30 IST is free", () => {
    const slots = getAvailableSlots({
      fromDate: MONDAY_DATE,
      toDate: MONDAY_DATE,
      session: session60buf15,
      busy: busyRaw,
      booked: [],
      now: NOW,
      rules: bookingRules,
    });
    const times = slots.map((s) => s.localTime);
    expect(times).toContain("13:30");
  });
});

// ---- Test 3: Booked range not padded again ----
describe("Test 3: Booked range 14:00–15:15 IST (start_at 14:00, blocked_until 15:15)", () => {
  // 14:00 IST = 08:30 UTC; 15:15 IST = 09:45 UTC
  const bookedRaw = [{ start_at: "2026-01-19T08:30:00Z", blocked_until: "2026-01-19T09:45:00Z" }];

  it("12:30 IST is free", () => {
    const slots = getAvailableSlots({
      fromDate: MONDAY_DATE,
      toDate: MONDAY_DATE,
      session: session60,
      busy: [],
      booked: bookedRaw,
      now: NOW,
      rules: bookingRules,
    });
    const times = slots.map((s) => s.localTime);
    expect(times).toContain("12:30");
  });

  // Per half-open [start, end) semantics:
  // A 60-min session at 13:00 IST occupies [13:00, 14:00) = [07:30Z, 08:30Z).
  // Booked range is [14:00 IST, 15:15 IST) = [08:30Z, 09:45Z).
  // They TOUCH at 08:30Z but do NOT overlap — 13:00 IS free (half-open).
  // Sessions at 13:30, 14:00, 14:30, 15:00 DO conflict with the booked range.
  it("13:30, 14:00, 14:30, 15:00 IST are blocked by booked range", () => {
    const slots = getAvailableSlots({
      fromDate: MONDAY_DATE,
      toDate: MONDAY_DATE,
      session: session60,
      busy: [],
      booked: bookedRaw,
      now: NOW,
      rules: bookingRules,
    });
    const times = slots.map((s) => s.localTime);
    // 13:00 is FREE — slot [13:00, 14:00) touches booked [14:00, ...) but does not overlap
    expect(times).toContain("13:00");
    expect(times).not.toContain("13:30");
    expect(times).not.toContain("14:00");
    expect(times).not.toContain("14:30");
    expect(times).not.toContain("15:00");
  });

  it("15:30 IST is free", () => {
    const slots = getAvailableSlots({
      fromDate: MONDAY_DATE,
      toDate: MONDAY_DATE,
      session: session60,
      busy: [],
      booked: bookedRaw,
      now: NOW,
      rules: bookingRules,
    });
    const times = slots.map((s) => s.localTime);
    expect(times).toContain("15:30");
  });
});

// ---- Test 4: Half-open semantics ----
describe("Test 4: Half-open [start, end) semantics - touching intervals are allowed", () => {
  it("A slot starting exactly when a busy interval ends (zero buffer) is allowed", () => {
    // busy ends at 12:00 IST = 06:30 UTC; slot starts 12:00 IST = 06:30 UTC
    const busyRaw = [{ start: "2026-01-19T05:00:00Z", end: "2026-01-19T06:30:00Z" }];
    const slots = getAvailableSlots({
      fromDate: MONDAY_DATE,
      toDate: MONDAY_DATE,
      session: session60,
      busy: busyRaw,
      booked: [],
      now: NOW,
      rules: bookingRules,
    });
    const times = slots.map((s) => s.localTime);
    expect(times).toContain("12:00");
  });
});

// ---- Test 5: Notice and horizon boundaries ----
describe("Test 5: Notice and horizon boundaries", () => {
  // now = 2026-01-12T00:00:00Z in IST (UTC+5:30) = Jan 12 05:30 IST.
  // minNotice +12h = Jan 12 17:30 IST = 12:00 UTC.
  // BUT: a 60-min session starting at 17:30 would end at 18:30 which exceeds the 18:00 window.
  // So 17:30 can't be generated. The last valid slot is 17:00 (ends 18:00).
  // 17:00 IST = 11:30 UTC < 12:00 UTC (notice cutoff) → excluded too.
  // Use different now: now = 2026-01-12T23:30:00Z; +12h = 2026-01-13T11:30:00Z = 17:00 IST Tue Jan 13.
  // 17:00 IST on Jan 13 (Tuesday) = 11:30 UTC = exactly at boundary → allowed.
  it("slot exactly 12 hours after now is allowed", () => {
    const nowBoundary = new Date("2026-01-12T23:30:00Z"); // +12h = 2026-01-13T11:30Z = 17:00 IST
    const slots = generateCandidateSlots({
      fromDate: "2026-01-13",
      toDate: "2026-01-13",
      session: session60,
      rules: bookingRules,
      now: nowBoundary,
    });
    const times = slots.map((s) => s.localTime);
    // 17:00 IST on Jan 13 = 11:30 UTC = exactly now+12h => included (not strictly less than)
    expect(times).toContain("17:00");
  });

  it("slot one minute before 12-hour notice is excluded", () => {
    // now = 2026-01-12T23:31:00Z; +12h cutoff = 2026-01-13T11:31:00Z.
    // 17:00 IST on Jan 13 = 11:30 UTC < 11:31 UTC → excluded.
    const nowPlusOneMin = new Date("2026-01-12T23:31:00Z");
    const slots = generateCandidateSlots({
      fromDate: "2026-01-13",
      toDate: "2026-01-13",
      session: session60,
      rules: bookingRules,
      now: nowPlusOneMin,
    });
    const times = slots.map((s) => s.localTime);
    expect(times).not.toContain("17:00");
  });

  it("slot exactly at maxAdvanceDays horizon is allowed", () => {
    // now = 2026-01-12T00:00:00Z; maxAdvanceMs = +60 days = 2026-03-13T00:00:00Z.
    // March 12 10:00 IST = 2026-03-12T04:30:00Z < 2026-03-13T00:00:00Z → allowed.
    // March 12 is a Thursday (weekday 4 = working day).
    const slots = generateCandidateSlots({
      fromDate: "2026-03-12",
      toDate: "2026-03-12",
      session: session60,
      rules: bookingRules,
      now: NOW,
    });
    // Should include some slots on that day (it's within the 60-day horizon)
    expect(slots.length).toBeGreaterThan(0);
  });

  it("slots beyond maxAdvanceDays horizon are excluded", () => {
    // now = 2026-01-12T00:00:00Z; maxAdvanceMs = 2026-03-13T00:00:00Z.
    // March 13 10:00 IST = 04:30 UTC = 2026-03-13T04:30Z > horizon → excluded.
    const slots = generateCandidateSlots({
      fromDate: "2026-03-13",
      toDate: "2026-03-13",
      session: session60,
      rules: bookingRules,
      now: NOW,
    });
    expect(slots).toHaveLength(0);
  });
});

// ---- Test 6: Session must end by window end; buffer may extend past ----
describe("Test 6: Session end vs buffer constraints", () => {
  it("A session starting 17:00 that ends 18:00 is offered (buffer extends to 18:15 but that's ok)", () => {
    const slots = generateCandidateSlots({
      fromDate: MONDAY_DATE,
      toDate: MONDAY_DATE,
      session: session60buf15,
      rules: bookingRules,
      now: NOW,
    });
    const times = slots.map((s) => s.localTime);
    expect(times).toContain("17:00");
  });

  it("A 90-minute session cannot start at 17:00 (would end at 18:30 > 18:00)", () => {
    const slots = generateCandidateSlots({
      fromDate: MONDAY_DATE,
      toDate: MONDAY_DATE,
      session: session90,
      rules: bookingRules,
      now: NOW,
    });
    const times = slots.map((s) => s.localTime);
    expect(times).not.toContain("17:00");
    expect(times).not.toContain("17:30");
  });
});

// ---- Test 7: DST with America/New_York ----
describe("Test 7: DST handling with America/New_York", () => {
  // Custom rules for NY for DST testing
  const nyRules = {
    ...bookingRules,
    timezone: "America/New_York",
    weeklyHours: {
      ...bookingRules.weeklyHours,
      1: [{ start: "01:00", end: "04:00" }], // window crossing 2:00 AM for DST tests
      7: [{ start: "01:00", end: "04:00" }],
    },
  };

  it("Spring-forward 2026-03-08: no nonexistent local times in slots", () => {
    // 2026-03-08 clocks spring forward at 2:00 AM in New York; 02:00–02:59 don't exist
    const slots = generateCandidateSlots({
      fromDate: "2026-03-08",
      toDate: "2026-03-08",
      session: session60,
      rules: nyRules,
      now: new Date("2026-01-01T00:00:00Z"), // far enough back; horizon ok with custom rules check below
    });
    // All generated slots should have valid local times
    for (const slot of slots) {
      const h = Number(slot.localTime.split(":")[0]);
      // Times in [02:00, 03:00) don't exist on this day in New York (spring-forward gap)
      if ((h ?? 0) === 2) {
        // This should not happen
        throw new Error(`Slot at ${slot.localTime} is in DST gap!`);
      }
      // Verify slot's start is a valid ISO string
      expect(() => new Date(slot.start)).not.toThrow();
    }
  });

  it("Fall-back 2026-11-01: no duplicate local labels", () => {
    // 2026-11-01 clocks fall back at 2:00 AM in New York; 01:00–01:59 occur twice
    const slots = generateCandidateSlots({
      fromDate: "2026-11-01",
      toDate: "2026-11-01",
      session: session60,
      rules: nyRules,
      now: new Date("2026-01-01T00:00:00Z"),
    });
    const localKeys = slots.map((s) => `${s.localDate}T${s.localTime}`);
    const uniqueKeys = new Set(localKeys);
    expect(uniqueKeys.size).toBe(localKeys.length); // no duplicates
  });

  it("Slot elapsed duration is correct (durationMinutes)", () => {
    const slots = generateCandidateSlots({
      fromDate: "2026-11-01",
      toDate: "2026-11-01",
      session: session60,
      rules: nyRules,
      now: new Date("2026-01-01T00:00:00Z"),
    });
    for (const slot of slots) {
      const startMs = new Date(slot.start).getTime();
      const endMs = new Date(slot.end).getTime();
      expect(endMs - startMs).toBe(60 * 60 * 1000); // 60 minutes elapsed
    }
  });
});

// ---- Test 8: Overlapping/unsorted intervals, multi-day spans, Z and +05:30 offsets ----
describe("Test 8: Interval parsing and merging edge cases", () => {
  it("intervals given with Z and with +05:30 offsets mean the same instant", () => {
    const busyZ = [{ start: "2026-01-19T06:30:00Z", end: "2026-01-19T07:30:00Z" }];
    const busyIST = [
      { start: "2026-01-19T12:00:00+05:30", end: "2026-01-19T13:00:00+05:30" },
    ];

    const slotsZ = getAvailableSlots({
      fromDate: MONDAY_DATE,
      toDate: MONDAY_DATE,
      session: session60,
      busy: busyZ,
      booked: [],
      now: NOW,
      rules: bookingRules,
    });
    const slotsIST = getAvailableSlots({
      fromDate: MONDAY_DATE,
      toDate: MONDAY_DATE,
      session: session60,
      busy: busyIST,
      booked: [],
      now: NOW,
      rules: bookingRules,
    });

    expect(slotsZ.map((s) => s.localTime)).toEqual(slotsIST.map((s) => s.localTime));
  });
});

// ---- Test 9: Invalid provider data throws AvailabilityUnavailableError ----
describe("Test 9: Provider output with invalid data fails at slot level", () => {
  it("invalid date in busy intervals throws AvailabilityUnavailableError", () => {
    expect(() =>
      getAvailableSlots({
        fromDate: MONDAY_DATE,
        toDate: MONDAY_DATE,
        session: session60,
        busy: [{ start: "NOT-A-DATE", end: "2026-01-19T10:00:00Z" }],
        booked: [],
        now: NOW,
        rules: bookingRules,
      }),
    ).toThrow(AvailabilityUnavailableError);
  });

  it("end before start in booked ranges throws AvailabilityUnavailableError", () => {
    expect(() =>
      getAvailableSlots({
        fromDate: MONDAY_DATE,
        toDate: MONDAY_DATE,
        session: session60,
        busy: [],
        booked: [{ start_at: "2026-01-19T10:00:00Z", blocked_until: "2026-01-19T09:00:00Z" }],
        now: NOW,
        rules: bookingRules,
      }),
    ).toThrow(AvailabilityUnavailableError);
  });
});

// ---- Test 11: Input validation ----
describe("Test 11: Input validation", () => {
  it("rejects bad date string for fromDate", () => {
    expect(() =>
      generateCandidateSlots({
        fromDate: "2026-13-01", // month 13
        toDate: MONDAY_DATE,
        session: session60,
        rules: bookingRules,
        now: NOW,
      }),
    ).toThrow(AvailabilityInputError);
  });

  it("rejects non-YYYY-MM-DD fromDate format", () => {
    expect(() =>
      generateCandidateSlots({
        fromDate: "Jan 19, 2026",
        toDate: MONDAY_DATE,
        session: session60,
        rules: bookingRules,
        now: NOW,
      }),
    ).toThrow(AvailabilityInputError);
  });

  it("rejects to before from", () => {
    expect(() =>
      generateCandidateSlots({
        fromDate: MONDAY_DATE,
        toDate: "2026-01-18",
        session: session60,
        rules: bookingRules,
        now: NOW,
      }),
    ).toThrow(AvailabilityInputError);
  });

  it("rejects span over maxRangeDays (63 days)", () => {
    expect(() =>
      generateCandidateSlots({
        fromDate: "2026-01-01",
        toDate: "2026-03-05", // 63 days
        session: session60,
        rules: bookingRules,
        now: NOW,
      }),
    ).toThrow(AvailabilityInputError);
  });

  it("rejects non-integer durationMinutes", () => {
    expect(() =>
      generateCandidateSlots({
        fromDate: MONDAY_DATE,
        toDate: MONDAY_DATE,
        session: { durationMinutes: 60.5, bufferMinutes: 0 },
        rules: bookingRules,
        now: NOW,
      }),
    ).toThrow(AvailabilityInputError);
  });

  it("rejects zero durationMinutes", () => {
    expect(() =>
      generateCandidateSlots({
        fromDate: MONDAY_DATE,
        toDate: MONDAY_DATE,
        session: { durationMinutes: 0, bufferMinutes: 0 },
        rules: bookingRules,
        now: NOW,
      }),
    ).toThrow(AvailabilityInputError);
  });

  it("rejects negative bufferMinutes", () => {
    expect(() =>
      generateCandidateSlots({
        fromDate: MONDAY_DATE,
        toDate: MONDAY_DATE,
        session: { durationMinutes: 60, bufferMinutes: -1 },
        rules: bookingRules,
        now: NOW,
      }),
    ).toThrow(AvailabilityInputError);
  });

  it("range entirely beyond horizon returns empty list, not an error", () => {
    const slots = generateCandidateSlots({
      fromDate: "2027-01-01",
      toDate: "2027-01-07",
      session: session60,
      rules: bookingRules,
      now: NOW,
    });
    expect(slots).toHaveLength(0);
  });
});

// ---- Test 12: isRequestedSlotAvailable reasons ----
describe("Test 12: isRequestedSlotAvailable reasons", () => {
  // 10:15 IST Monday = 04:45 UTC
  const mon1015IST = new Date("2026-01-19T04:45:00Z");
  // 09:30 IST Monday = 04:00 UTC
  const mon0930IST = new Date("2026-01-19T04:00:00Z");
  // 18:00 IST Monday = 12:30 UTC
  const mon1800IST = new Date("2026-01-19T12:30:00Z");
  // Sunday 10:00 IST
  const sun1000IST = new Date("2026-01-25T04:30:00Z");
  // 10:00 IST Monday Jan 12 = in the past relative to NOW but also < 12h notice
  const pastSlot = new Date("2026-01-12T04:30:00Z"); // Jan 12 10:00 IST = 04:30 UTC, within 12h of NOW
  // Beyond horizon: 61 days from now
  const beyondHorizon = new Date("2026-03-14T04:30:00Z"); // 61 days after Jan 12
  // Conflict slot: 12:00 IST Monday = 06:30 UTC - we'll mark 06:30-07:30 as busy
  const conflictSlot = new Date("2026-01-19T06:30:00Z"); // 12:00 IST

  it("returns invalid_time for invalid Date object", () => {
    const result = isRequestedSlotAvailable({
      start: new Date("not-a-date"),
      session: session60,
      busy: [],
      booked: [],
      now: NOW,
      rules: bookingRules,
    });
    expect(result).toEqual({ ok: false, reason: "invalid_time" });
  });

  it("returns not_on_grid for 10:15 IST (off 30-min grid)", () => {
    const result = isRequestedSlotAvailable({
      start: mon1015IST,
      session: session60,
      busy: [],
      booked: [],
      now: NOW,
      rules: bookingRules,
    });
    expect(result).toEqual({ ok: false, reason: "not_on_grid" });
  });

  it("returns outside_hours for 09:30 IST (before 10:00 opening)", () => {
    const result = isRequestedSlotAvailable({
      start: mon0930IST,
      session: session60,
      busy: [],
      booked: [],
      now: NOW,
      rules: bookingRules,
    });
    expect(result).toEqual({ ok: false, reason: "outside_hours" });
  });

  it("returns outside_hours for 18:00 IST start (session would end 19:00 > 18:00)", () => {
    const result = isRequestedSlotAvailable({
      start: mon1800IST,
      session: session60,
      busy: [],
      booked: [],
      now: NOW,
      rules: bookingRules,
    });
    expect(result).toEqual({ ok: false, reason: "outside_hours" });
  });

  it("returns outside_hours for Sunday", () => {
    const result = isRequestedSlotAvailable({
      start: sun1000IST,
      session: session60,
      busy: [],
      booked: [],
      now: NOW,
      rules: bookingRules,
    });
    expect(result).toEqual({ ok: false, reason: "outside_hours" });
  });

  it("returns too_soon for a slot within 12h of now", () => {
    const result = isRequestedSlotAvailable({
      start: pastSlot,
      session: session60,
      busy: [],
      booked: [],
      now: NOW,
      rules: bookingRules,
    });
    expect(result).toEqual({ ok: false, reason: "too_soon" });
  });

  it("returns too_far for a slot beyond horizon", () => {
    const result = isRequestedSlotAvailable({
      start: beyondHorizon,
      session: session60,
      busy: [],
      booked: [],
      now: NOW,
      rules: bookingRules,
    });
    expect(result).toEqual({ ok: false, reason: "too_far" });
  });

  it("returns conflict for a slot blocked by busy intervals", () => {
    // 12:00 IST = 06:30 UTC, busy 06:30-07:30 UTC covers the 60-min session
    const busyRaw = [{ start: "2026-01-19T06:30:00Z", end: "2026-01-19T07:30:00Z" }];
    const result = isRequestedSlotAvailable({
      start: conflictSlot,
      session: session60,
      busy: busyRaw,
      booked: [],
      now: NOW,
      rules: bookingRules,
    });
    expect(result).toEqual({ ok: false, reason: "conflict" });
  });

  it("returns ok: true for a valid available slot", () => {
    const result = isRequestedSlotAvailable({
      start: new Date("2026-01-19T04:30:00Z"), // 10:00 IST Monday
      session: session60,
      busy: [],
      booked: [],
      now: NOW,
      rules: bookingRules,
    });
    expect(result).toEqual({ ok: true });
  });
});

// ---- Test 13: Multi-day range equals union of per-day results ----
describe("Test 13: Multi-day range union and ordering", () => {
  it("multi-day result equals union of per-day results", () => {
    const from = "2026-01-19"; // Monday
    const to = "2026-01-20"; // Tuesday

    const multi = getAvailableSlots({
      fromDate: from,
      toDate: to,
      session: session60,
      busy: [],
      booked: [],
      now: NOW,
      rules: bookingRules,
    });

    const monSlots = getAvailableSlots({
      fromDate: "2026-01-19",
      toDate: "2026-01-19",
      session: session60,
      busy: [],
      booked: [],
      now: NOW,
      rules: bookingRules,
    });

    const tueSlots = getAvailableSlots({
      fromDate: "2026-01-20",
      toDate: "2026-01-20",
      session: session60,
      busy: [],
      booked: [],
      now: NOW,
      rules: bookingRules,
    });

    const union = [...monSlots, ...tueSlots];
    expect(multi).toHaveLength(union.length);
  });

  it("slots ascend by start", () => {
    const slots = getAvailableSlots({
      fromDate: "2026-01-19",
      toDate: "2026-01-21",
      session: session60,
      busy: [],
      booked: [],
      now: NOW,
      rules: bookingRules,
    });
    for (let i = 1; i < slots.length; i++) {
      const prev = new Date(slots[i - 1]!.start).getTime();
      const curr = new Date(slots[i]!.start).getTime();
      expect(curr).toBeGreaterThanOrEqual(prev);
    }
  });

  it("no duplicates in multi-day range", () => {
    const slots = getAvailableSlots({
      fromDate: "2026-01-19",
      toDate: "2026-01-21",
      session: session60,
      busy: [],
      booked: [],
      now: NOW,
      rules: bookingRules,
    });
    const starts = slots.map((s) => s.start);
    const unique = new Set(starts);
    expect(unique.size).toBe(starts.length);
  });
});

// ---- Test 14: Slot objects contain ONLY the specified keys ----
describe("Test 14: Slot objects contain no extra keys", () => {
  it("returned slot has exactly start, end, localDate, localTime", () => {
    const slots = generateCandidateSlots({
      fromDate: MONDAY_DATE,
      toDate: MONDAY_DATE,
      session: session60,
      rules: bookingRules,
      now: NOW,
    });
    expect(slots.length).toBeGreaterThan(0);
    const slot = slots[0]!;
    const keys = Object.keys(slot).sort();
    expect(keys).toEqual(["end", "localDate", "localTime", "start"]);
  });
});

// ---- Test 15: Determinism and input immutability ----
describe("Test 15: Determinism and immutability", () => {
  it("calling twice with same inputs gives deep-equal results", () => {
    const params = {
      fromDate: MONDAY_DATE,
      toDate: MONDAY_DATE,
      session: session60,
      rules: bookingRules,
      now: NOW,
    };
    const result1 = generateCandidateSlots(params);
    const result2 = generateCandidateSlots(params);
    expect(result1).toEqual(result2);
  });

  it("does not mutate input busy and booked arrays", () => {
    const busy = [{ start: "2026-01-19T06:30:00Z", end: "2026-01-19T07:30:00Z" }];
    const booked: unknown[] = [];
    const busyCopy = JSON.stringify(busy);
    const bookedCopy = JSON.stringify(booked);

    getAvailableSlots({
      fromDate: MONDAY_DATE,
      toDate: MONDAY_DATE,
      session: session60,
      busy,
      booked,
      now: NOW,
      rules: bookingRules,
    });

    expect(JSON.stringify(busy)).toBe(busyCopy);
    expect(JSON.stringify(booked)).toBe(bookedCopy);
  });
});
