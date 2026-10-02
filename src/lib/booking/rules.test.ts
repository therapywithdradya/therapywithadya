import { describe, expect, it } from "vitest";
import { validateRules, bookingRules, type BookingRules } from "@/lib/booking/booking-rules";
import { AvailabilityInputError } from "@/lib/availability/types";
import { getAvailableSlots } from "@/lib/availability/slots";

// ---- Test 16: validateRules ----

describe("Test 16: validateRules", () => {
  const validBase: BookingRules = {
    timezone: "Asia/Kolkata",
    weeklyHours: {
      1: [{ start: "10:00", end: "18:00" }],
      2: [{ start: "10:00", end: "18:00" }],
      3: [{ start: "10:00", end: "18:00" }],
      4: [{ start: "10:00", end: "18:00" }],
      5: [{ start: "10:00", end: "18:00" }],
      6: [{ start: "10:00", end: "18:00" }],
      7: [],
    },
    slotIntervalMinutes: 30,
    minNoticeHours: 12,
    maxAdvanceDays: 60,
    maxRangeDays: 62,
    holdMinutes: 15,
  };

  it("accepts valid rules without throwing", () => {
    expect(() => validateRules(validBase)).not.toThrow();
  });

  it("rejects window with start >= end", () => {
    expect(() =>
      validateRules({
        ...validBase,
        weeklyHours: {
          ...validBase.weeklyHours,
          1: [{ start: "18:00", end: "10:00" }],
        },
      }),
    ).toThrow(AvailabilityInputError);
  });

  it("rejects window with start == end", () => {
    expect(() =>
      validateRules({
        ...validBase,
        weeklyHours: {
          ...validBase.weeklyHours,
          1: [{ start: "10:00", end: "10:00" }],
        },
      }),
    ).toThrow(AvailabilityInputError);
  });

  it("rejects overlapping windows in one day", () => {
    expect(() =>
      validateRules({
        ...validBase,
        weeklyHours: {
          ...validBase.weeklyHours,
          1: [
            { start: "10:00", end: "14:00" },
            { start: "13:00", end: "18:00" }, // overlaps
          ],
        },
      }),
    ).toThrow(AvailabilityInputError);
  });

  it("rejects slotIntervalMinutes of 0", () => {
    expect(() => validateRules({ ...validBase, slotIntervalMinutes: 0 })).toThrow(
      AvailabilityInputError,
    );
  });

  it("rejects slotIntervalMinutes of 7 (does not divide 60)", () => {
    expect(() => validateRules({ ...validBase, slotIntervalMinutes: 7 })).toThrow(
      AvailabilityInputError,
    );
  });

  it("rejects slotIntervalMinutes of 45 (does not divide 60)", () => {
    expect(() => validateRules({ ...validBase, slotIntervalMinutes: 45 })).toThrow(
      AvailabilityInputError,
    );
  });

  it("rejects slotIntervalMinutes of 1.5 (not an integer)", () => {
    expect(() => validateRules({ ...validBase, slotIntervalMinutes: 1.5 })).toThrow(
      AvailabilityInputError,
    );
  });

  it("accepts slotIntervalMinutes of 10", () => {
    expect(() => validateRules({ ...validBase, slotIntervalMinutes: 10 })).not.toThrow();
  });

  it("accepts slotIntervalMinutes of 15", () => {
    expect(() => validateRules({ ...validBase, slotIntervalMinutes: 15 })).not.toThrow();
  });

  it("accepts slotIntervalMinutes of 20", () => {
    expect(() => validateRules({ ...validBase, slotIntervalMinutes: 20 })).not.toThrow();
  });

  it("accepts slotIntervalMinutes of 30", () => {
    expect(() => validateRules({ ...validBase, slotIntervalMinutes: 30 })).not.toThrow();
  });

  it("accepts slotIntervalMinutes of 60", () => {
    expect(() => validateRules({ ...validBase, slotIntervalMinutes: 60 })).not.toThrow();
  });

  it("rejects negative minNoticeHours", () => {
    expect(() => validateRules({ ...validBase, minNoticeHours: -1 })).toThrow(
      AvailabilityInputError,
    );
  });

  it("rejects non-integer maxAdvanceDays", () => {
    expect(() => validateRules({ ...validBase, maxAdvanceDays: 60.5 })).toThrow(
      AvailabilityInputError,
    );
  });
});

// ---- Test 16 extra: Two windows in one day (lunch break) work end to end ----

describe("Test 16 extra: Two windows in one day (lunch break)", () => {
  const lunchBreakRules: BookingRules = {
    timezone: "Asia/Kolkata",
    weeklyHours: {
      1: [
        { start: "10:00", end: "13:00" },
        { start: "14:00", end: "18:00" },
      ],
      2: [{ start: "10:00", end: "18:00" }],
      3: [{ start: "10:00", end: "18:00" }],
      4: [{ start: "10:00", end: "18:00" }],
      5: [{ start: "10:00", end: "18:00" }],
      6: [{ start: "10:00", end: "18:00" }],
      7: [],
    },
    slotIntervalMinutes: 30,
    minNoticeHours: 12,
    maxAdvanceDays: 60,
    maxRangeDays: 62,
    holdMinutes: 15,
  };

  it("validateRules accepts two non-overlapping windows", () => {
    expect(() => validateRules(lunchBreakRules)).not.toThrow();
  });

  it("generateCandidateSlots with lunch break excludes 13:00 to 13:30", () => {
    const slots = getAvailableSlots({
      fromDate: "2026-01-19",
      toDate: "2026-01-19",
      session: { durationMinutes: 60, bufferMinutes: 0 },
      busy: [],
      booked: [],
      now: new Date("2026-01-12T00:00:00Z"),
      rules: lunchBreakRules,
    });
    const times = slots.map((s) => s.localTime);
    // 13:00 would end at 14:00 (not in first window 10-13, but in second 14-18 starts at 14:00)
    // Actually 13:00 is NOT in either window as a start (first window ends at 13:00, second starts at 14:00)
    expect(times).not.toContain("13:00");
    expect(times).not.toContain("13:30");
    // 12:00 is in first window (ends at 13:00, session is 60 min, 12:00+60=13:00 <= 13:00 ok)
    expect(times).toContain("12:00");
    // 14:00 is in second window
    expect(times).toContain("14:00");
  });
});

// ---- Verify bookingRules itself passes validation ----

describe("bookingRules passes validateRules", () => {
  it("the exported bookingRules object is valid", () => {
    expect(() => validateRules(bookingRules)).not.toThrow();
  });
});
