import { DateTime } from "luxon";
import { AvailabilityUnavailableError, type Interval } from "./types";

function parseDateValue(val: unknown): Date {
  if (val instanceof Date) {
    if (Number.isNaN(val.getTime())) {
      throw new AvailabilityUnavailableError("Invalid Date object in interval");
    }
    return new Date(val.getTime());
  }

  if (typeof val === "string") {
    // Try Luxon fromISO first (handles Z and numeric offsets)
    const dt = DateTime.fromISO(val);
    if (dt.isValid) {
      return dt.toJSDate();
    }
    const ms = Date.parse(val);
    if (Number.isNaN(ms)) {
      throw new AvailabilityUnavailableError(`Invalid date string in interval: "${val}"`);
    }
    return new Date(ms);
  }

  throw new AvailabilityUnavailableError(
    `Expected Date or ISO string for interval timestamp, got: ${typeof val}`,
  );
}

export function parseIntervals(raw: unknown[]): Interval[] {
  if (!Array.isArray(raw)) {
    throw new AvailabilityUnavailableError("Provider raw intervals must be an array");
  }

  const result: Interval[] = [];

  for (const item of raw) {
    if (!item || typeof item !== "object") {
      throw new AvailabilityUnavailableError("Interval entry must be an object");
    }

    const obj = item as Record<string, unknown>;
    const rawStart = obj["start"] ?? obj["start_at"];
    const rawEnd = obj["end"] ?? obj["blocked_until"];

    if (rawStart === undefined || rawEnd === undefined) {
      throw new AvailabilityUnavailableError("Interval missing start or end property");
    }

    const start = parseDateValue(rawStart);
    const end = parseDateValue(rawEnd);

    if (end.getTime() < start.getTime()) {
      throw new AvailabilityUnavailableError(
        `Interval end (${end.toISOString()}) cannot be before start (${start.toISOString()})`,
      );
    }

    // Zero-length intervals are dropped
    if (start.getTime() === end.getTime()) {
      continue;
    }

    result.push({ start, end });
  }

  return result;
}

export function mergeIntervals(intervals: Interval[]): Interval[] {
  if (intervals.length <= 1) {
    return intervals.map((i) => ({ start: new Date(i.start), end: new Date(i.end) }));
  }

  const sorted = [...intervals].sort((a, b) => a.start.getTime() - b.start.getTime());
  const merged: Interval[] = [];
  let current: Interval = {
    start: new Date(sorted[0]!.start),
    end: new Date(sorted[0]!.end),
  };

  for (let i = 1; i < sorted.length; i++) {
    const next = sorted[i]!;
    // Touching intervals [start1, end1) and [end1, end2) merge into [start1, end2)
    if (next.start.getTime() <= current.end.getTime()) {
      if (next.end.getTime() > current.end.getTime()) {
        current.end = new Date(next.end);
      }
    } else {
      merged.push(current);
      current = { start: new Date(next.start), end: new Date(next.end) };
    }
  }

  merged.push(current);
  return merged;
}

export function padEnd(intervals: Interval[], minutes: number): Interval[] {
  if (minutes <= 0) {
    return intervals.map((i) => ({ start: new Date(i.start), end: new Date(i.end) }));
  }

  const padMs = minutes * 60 * 1000;
  return intervals.map((i) => ({
    start: new Date(i.start),
    end: new Date(i.end.getTime() + padMs),
  }));
}

export function overlaps(a: Interval, b: Interval): boolean {
  // Half-open interval semantics [start, end)
  // Touching intervals where a.end === b.start or b.end === a.start do not overlap
  return a.start.getTime() < b.end.getTime() && b.start.getTime() < a.end.getTime();
}

export function clipTo(intervals: Interval[], range: Interval): Interval[] {
  const rangeStart = range.start.getTime();
  const rangeEnd = range.end.getTime();
  const result: Interval[] = [];

  for (const interval of intervals) {
    const s = Math.max(interval.start.getTime(), rangeStart);
    const e = Math.min(interval.end.getTime(), rangeEnd);
    if (s < e) {
      result.push({ start: new Date(s), end: new Date(e) });
    }
  }

  return result;
}
