import { describe, expect, it } from "vitest";
import {
  clipTo,
  mergeIntervals,
  overlaps,
  padEnd,
  parseIntervals,
} from "@/lib/availability/intervals";
import type { Interval } from "@/lib/availability/types";
import { AvailabilityUnavailableError } from "@/lib/availability/types";

// Test 0 helper: Sanity check that TZ env variable took effect
it("TZ sanity: new Date(2026, 0, 15, 12).getTimezoneOffset() === 480 (America/Los_Angeles)", () => {
  const offset = new Date(2026, 0, 15, 12).getTimezoneOffset();
  expect(offset).toBe(480);
});

// ---- parseIntervals ----

describe("parseIntervals", () => {
  it("parses ISO Z strings", () => {
    const result = parseIntervals([
      { start: "2026-01-01T10:00:00Z", end: "2026-01-01T11:00:00Z" },
    ]);
    expect(result).toHaveLength(1);
    expect(result[0]!.start.toISOString()).toBe("2026-01-01T10:00:00.000Z");
  });

  it("parses ISO strings with numeric offset (+05:30) and treats same instant as Z", () => {
    const result1 = parseIntervals([
      { start: "2026-01-01T10:00:00Z", end: "2026-01-01T11:00:00Z" },
    ]);
    const result2 = parseIntervals([
      { start: "2026-01-01T15:30:00+05:30", end: "2026-01-01T16:30:00+05:30" },
    ]);
    expect(result1[0]!.start.getTime()).toBe(result2[0]!.start.getTime());
    expect(result1[0]!.end.getTime()).toBe(result2[0]!.end.getTime());
  });

  it("accepts Date objects", () => {
    const start = new Date("2026-01-01T10:00:00Z");
    const end = new Date("2026-01-01T11:00:00Z");
    const result = parseIntervals([{ start, end }]);
    expect(result[0]!.start.getTime()).toBe(start.getTime());
  });

  it("drops zero-length intervals silently", () => {
    const result = parseIntervals([
      { start: "2026-01-01T10:00:00Z", end: "2026-01-01T10:00:00Z" },
    ]);
    expect(result).toHaveLength(0);
  });

  it("throws AvailabilityUnavailableError for invalid date string", () => {
    expect(() =>
      parseIntervals([{ start: "not-a-date", end: "2026-01-01T11:00:00Z" }]),
    ).toThrow(AvailabilityUnavailableError);
  });

  it("throws AvailabilityUnavailableError for end before start", () => {
    expect(() =>
      parseIntervals([
        { start: "2026-01-01T11:00:00Z", end: "2026-01-01T10:00:00Z" },
      ]),
    ).toThrow(AvailabilityUnavailableError);
  });

  it("throws for invalid Date object", () => {
    expect(() =>
      parseIntervals([{ start: new Date("invalid"), end: new Date("2026-01-01T11:00:00Z") }]),
    ).toThrow(AvailabilityUnavailableError);
  });

  it("throws for non-object entries", () => {
    expect(() => parseIntervals(["2026-01-01T10:00:00Z"])).toThrow(AvailabilityUnavailableError);
  });

  it("uses start_at/blocked_until keys for booked range objects", () => {
    const result = parseIntervals([
      { start_at: "2026-01-01T10:00:00Z", blocked_until: "2026-01-01T11:00:00Z" },
    ]);
    expect(result).toHaveLength(1);
  });
});

// ---- mergeIntervals ----

describe("mergeIntervals", () => {
  it("merges overlapping intervals", () => {
    const intervals: Interval[] = [
      { start: new Date("2026-01-01T10:00:00Z"), end: new Date("2026-01-01T12:00:00Z") },
      { start: new Date("2026-01-01T11:00:00Z"), end: new Date("2026-01-01T13:00:00Z") },
    ];
    const merged = mergeIntervals(intervals);
    expect(merged).toHaveLength(1);
    expect(merged[0]!.end.toISOString()).toBe("2026-01-01T13:00:00.000Z");
  });

  it("merges unsorted intervals (test 8 - overlapping and unsorted)", () => {
    const intervals: Interval[] = [
      { start: new Date("2026-01-01T13:00:00Z"), end: new Date("2026-01-01T14:00:00Z") },
      { start: new Date("2026-01-01T10:00:00Z"), end: new Date("2026-01-01T12:00:00Z") },
      { start: new Date("2026-01-01T11:00:00Z"), end: new Date("2026-01-01T13:00:00Z") },
    ];
    const merged = mergeIntervals(intervals);
    expect(merged).toHaveLength(1);
    expect(merged[0]!.start.toISOString()).toBe("2026-01-01T10:00:00.000Z");
    expect(merged[0]!.end.toISOString()).toBe("2026-01-01T14:00:00.000Z");
  });

  it("keeps separate non-overlapping intervals", () => {
    const intervals: Interval[] = [
      { start: new Date("2026-01-01T10:00:00Z"), end: new Date("2026-01-01T11:00:00Z") },
      { start: new Date("2026-01-01T12:00:00Z"), end: new Date("2026-01-01T13:00:00Z") },
    ];
    const merged = mergeIntervals(intervals);
    expect(merged).toHaveLength(2);
  });

  it("handles touching intervals (merges them)", () => {
    const intervals: Interval[] = [
      { start: new Date("2026-01-01T10:00:00Z"), end: new Date("2026-01-01T11:00:00Z") },
      { start: new Date("2026-01-01T11:00:00Z"), end: new Date("2026-01-01T12:00:00Z") },
    ];
    const merged = mergeIntervals(intervals);
    expect(merged).toHaveLength(1);
  });

  it("handles a busy interval spanning several days (test 8)", () => {
    const intervals: Interval[] = [
      { start: new Date("2026-01-01T00:00:00Z"), end: new Date("2026-01-05T00:00:00Z") },
    ];
    const merged = mergeIntervals(intervals);
    expect(merged).toHaveLength(1);
    expect(merged[0]!.end.toISOString()).toBe("2026-01-05T00:00:00.000Z");
  });

  it("returns empty array for empty input", () => {
    expect(mergeIntervals([])).toHaveLength(0);
  });
});

// ---- padEnd ----

describe("padEnd", () => {
  it("pads interval end by given minutes", () => {
    const intervals: Interval[] = [
      { start: new Date("2026-01-01T10:00:00Z"), end: new Date("2026-01-01T11:00:00Z") },
    ];
    const padded = padEnd(intervals, 15);
    expect(padded[0]!.end.toISOString()).toBe("2026-01-01T11:15:00.000Z");
  });

  it("returns copy of intervals when minutes <= 0", () => {
    const intervals: Interval[] = [
      { start: new Date("2026-01-01T10:00:00Z"), end: new Date("2026-01-01T11:00:00Z") },
    ];
    const padded = padEnd(intervals, 0);
    expect(padded[0]!.end.toISOString()).toBe("2026-01-01T11:00:00.000Z");
  });

  it("does not mutate original", () => {
    const original: Interval[] = [
      { start: new Date("2026-01-01T10:00:00Z"), end: new Date("2026-01-01T11:00:00Z") },
    ];
    padEnd(original, 30);
    expect(original[0]!.end.toISOString()).toBe("2026-01-01T11:00:00.000Z");
  });
});

// ---- overlaps ----

describe("overlaps - half-open [start, end) semantics", () => {
  it("returns true for overlapping intervals", () => {
    const a: Interval = {
      start: new Date("2026-01-01T10:00:00Z"),
      end: new Date("2026-01-01T12:00:00Z"),
    };
    const b: Interval = {
      start: new Date("2026-01-01T11:00:00Z"),
      end: new Date("2026-01-01T13:00:00Z"),
    };
    expect(overlaps(a, b)).toBe(true);
  });

  it("test 4 - slot starting exactly when busy ends, zero buffer, is allowed (no overlap)", () => {
    // A starts exactly when B ends
    const busyEnd = new Date("2026-01-01T12:00:00Z");
    const a: Interval = { start: busyEnd, end: new Date("2026-01-01T13:00:00Z") };
    const b: Interval = {
      start: new Date("2026-01-01T10:00:00Z"),
      end: busyEnd,
    };
    expect(overlaps(a, b)).toBe(false);
  });

  it("returns false for intervals that do not touch", () => {
    const a: Interval = {
      start: new Date("2026-01-01T10:00:00Z"),
      end: new Date("2026-01-01T11:00:00Z"),
    };
    const b: Interval = {
      start: new Date("2026-01-01T12:00:00Z"),
      end: new Date("2026-01-01T13:00:00Z"),
    };
    expect(overlaps(a, b)).toBe(false);
  });
});

// ---- clipTo ----

describe("clipTo", () => {
  it("clips intervals to range", () => {
    const intervals: Interval[] = [
      { start: new Date("2026-01-01T09:00:00Z"), end: new Date("2026-01-01T11:00:00Z") },
    ];
    const range: Interval = {
      start: new Date("2026-01-01T10:00:00Z"),
      end: new Date("2026-01-01T12:00:00Z"),
    };
    const clipped = clipTo(intervals, range);
    expect(clipped[0]!.start.toISOString()).toBe("2026-01-01T10:00:00.000Z");
  });

  it("excludes intervals fully outside range", () => {
    const intervals: Interval[] = [
      { start: new Date("2026-01-01T08:00:00Z"), end: new Date("2026-01-01T09:00:00Z") },
    ];
    const range: Interval = {
      start: new Date("2026-01-01T10:00:00Z"),
      end: new Date("2026-01-01T12:00:00Z"),
    };
    expect(clipTo(intervals, range)).toHaveLength(0);
  });
});
