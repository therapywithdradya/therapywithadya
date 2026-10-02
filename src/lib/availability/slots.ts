import { DateTime } from "luxon";
import { type BookingRules, validateRules } from "@/lib/booking/booking-rules";
import {
  mergeIntervals,
  overlaps,
  padEnd,
  parseIntervals,
} from "./intervals";
import {
  AvailabilityInputError,
  type Interval,
  type SessionTiming,
  type Slot,
} from "./types";

export function validateSessionTiming(session: SessionTiming): void {
  if (
    typeof session.durationMinutes !== "number" ||
    !Number.isInteger(session.durationMinutes) ||
    session.durationMinutes <= 0
  ) {
    throw new AvailabilityInputError(
      `durationMinutes must be a positive integer, got: ${session.durationMinutes}`,
    );
  }

  if (
    typeof session.bufferMinutes !== "number" ||
    !Number.isInteger(session.bufferMinutes) ||
    session.bufferMinutes < 0
  ) {
    throw new AvailabilityInputError(
      `bufferMinutes must be a non-negative integer, got: ${session.bufferMinutes}`,
    );
  }
}

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export function validateDateRange(
  fromDate: string,
  toDate: string,
  rules: BookingRules,
): { fromDt: DateTime; toDt: DateTime } {
  if (!DATE_REGEX.test(fromDate)) {
    throw new AvailabilityInputError(
      `Invalid fromDate format: "${fromDate}", expected YYYY-MM-DD`,
    );
  }
  if (!DATE_REGEX.test(toDate)) {
    throw new AvailabilityInputError(
      `Invalid toDate format: "${toDate}", expected YYYY-MM-DD`,
    );
  }

  const fromDt = DateTime.fromISO(fromDate, { zone: rules.timezone }).startOf("day");
  const toDt = DateTime.fromISO(toDate, { zone: rules.timezone }).startOf("day");

  if (!fromDt.isValid || fromDt.toFormat("yyyy-MM-dd") !== fromDate) {
    throw new AvailabilityInputError(`Invalid calendar date for fromDate: "${fromDate}"`);
  }
  if (!toDt.isValid || toDt.toFormat("yyyy-MM-dd") !== toDate) {
    throw new AvailabilityInputError(`Invalid calendar date for toDate: "${toDate}"`);
  }

  if (toDt < fromDt) {
    throw new AvailabilityInputError(
      `toDate (${toDate}) cannot be before fromDate (${fromDate})`,
    );
  }

  const diffDays = Math.round(toDt.diff(fromDt, "days").days);
  if (diffDays > rules.maxRangeDays) {
    throw new AvailabilityInputError(
      `Requested date span (${diffDays} days) exceeds maximum allowed range of ${rules.maxRangeDays} days`,
    );
  }

  return { fromDt, toDt };
}

export type GenerateCandidateSlotsParams = {
  fromDate: string;
  toDate: string;
  session: SessionTiming;
  rules: BookingRules;
  now: Date;
};

export function generateCandidateSlots({
  fromDate,
  toDate,
  session,
  rules,
  now,
}: GenerateCandidateSlotsParams): Slot[] {
  validateRules(rules);
  validateSessionTiming(session);
  const { fromDt, toDt } = validateDateRange(fromDate, toDate, rules);

  if (Number.isNaN(now.getTime())) {
    throw new AvailabilityInputError("Invalid now date");
  }

  const minNoticeMs = now.getTime() + rules.minNoticeHours * 60 * 60 * 1000;
  const maxAdvanceMs = now.getTime() + rules.maxAdvanceDays * 24 * 60 * 60 * 1000;

  // If the entire requested fromDate starts after the maximum booking horizon, return []
  if (fromDt.toMillis() > maxAdvanceMs) {
    return [];
  }

  const slots: Slot[] = [];
  const seenSlotKeys = new Set<string>();

  let currentDay = fromDt;
  while (currentDay <= toDt) {
    const weekday = currentDay.weekday; // 1 (Mon) .. 7 (Sun)
    const windows = rules.weeklyHours[weekday] ?? [];
    const localDateStr = currentDay.toFormat("yyyy-MM-dd");

    for (const win of windows) {
      const [startH, startM] = win.start.split(":").map(Number);
      const [endH, endM] = win.end.split(":").map(Number);
      const winStartMin = (startH ?? 0) * 60 + (startM ?? 0);
      const winEndMin = (endH ?? 0) * 60 + (endM ?? 0);

      for (
        let startMin = winStartMin;
        startMin + session.durationMinutes <= winEndMin;
        startMin += rules.slotIntervalMinutes
      ) {
        const hour = Math.floor(startMin / 60);
        const minute = startMin % 60;

        // DST safety: build local time with Luxon in the business zone
        const candDt = DateTime.fromObject(
          {
            year: currentDay.year,
            month: currentDay.month,
            day: currentDay.day,
            hour,
            minute,
          },
          { zone: rules.timezone },
        );

        if (!candDt.isValid) {
          continue;
        }

        // Spring-forward gap: if local time does not exist, Luxon shifts the hour/minute
        if (candDt.hour !== hour || candDt.minute !== minute) {
          continue;
        }

        const candStartMs = candDt.toMillis();

        // Minimum notice boundary: start >= now + minNoticeHours
        if (candStartMs < minNoticeMs) {
          continue;
        }

        // Horizon boundary: start <= now + maxAdvanceDays
        if (candStartMs > maxAdvanceMs) {
          continue;
        }

        const localTimeStr = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
        const dedupKey = `${localDateStr}T${localTimeStr}`;

        // Fall-back overlap: use the first occurrence only, never produce duplicate local labels
        if (seenSlotKeys.has(dedupKey)) {
          continue;
        }
        seenSlotKeys.add(dedupKey);

        // Slot length is elapsed time
        const candEndMs = candStartMs + session.durationMinutes * 60 * 1000;

        slots.push({
          start: new Date(candStartMs).toISOString(),
          end: new Date(candEndMs).toISOString(),
          localDate: localDateStr,
          localTime: localTimeStr,
        });
      }
    }

    currentDay = currentDay.plus({ days: 1 });
  }

  return slots;
}

export function filterConflicts(
  candidates: Slot[],
  paddedBusy: Interval[],
  bookedRanges: Interval[],
  session: SessionTiming,
): Slot[] {
  const result: Slot[] = [];

  for (const candidate of candidates) {
    const candStart = new Date(candidate.start).getTime();
    // A candidate occupies [start, start + duration + buffer)
    const candEnd = candStart + (session.durationMinutes + session.bufferMinutes) * 60 * 1000;
    const candInterval: Interval = {
      start: new Date(candStart),
      end: new Date(candEnd),
    };

    let hasConflict = false;

    for (const busy of paddedBusy) {
      if (overlaps(candInterval, busy)) {
        hasConflict = true;
        break;
      }
    }

    if (hasConflict) {
      continue;
    }

    for (const booked of bookedRanges) {
      if (overlaps(candInterval, booked)) {
        hasConflict = true;
        break;
      }
    }

    if (!hasConflict) {
      // Returned slot objects contain only start, end, localDate, localTime
      result.push({
        start: candidate.start,
        end: candidate.end,
        localDate: candidate.localDate,
        localTime: candidate.localTime,
      });
    }
  }

  return result;
}

export type GetAvailableSlotsParams = {
  fromDate: string;
  toDate: string;
  session: SessionTiming;
  busy: unknown[];
  booked: unknown[];
  now: Date;
  rules: BookingRules;
};

export function getAvailableSlots({
  fromDate,
  toDate,
  session,
  busy,
  booked,
  now,
  rules,
}: GetAvailableSlotsParams): Slot[] {
  validateRules(rules);
  validateSessionTiming(session);

  // Parse and validate busy and booked intervals (fail closed if corrupt)
  const rawBusyIntervals = parseIntervals(busy);
  const rawBookedIntervals = parseIntervals(booked);

  // Google busy intervals are padded at the END by session.bufferMinutes
  const paddedBusy = padEnd(rawBusyIntervals, session.bufferMinutes);
  const mergedPaddedBusy = mergeIntervals(paddedBusy);

  // Database booked ranges ALREADY include their own buffer, so they are NOT padded again
  const mergedBooked = mergeIntervals(rawBookedIntervals);

  // Generate candidates
  const candidates = generateCandidateSlots({
    fromDate,
    toDate,
    session,
    rules,
    now,
  });

  // Filter conflicts
  return filterConflicts(candidates, mergedPaddedBusy, mergedBooked, session);
}

export type IsRequestedSlotAvailableParams = {
  start: Date;
  session: SessionTiming;
  busy: unknown[];
  booked: unknown[];
  now: Date;
  rules: BookingRules;
};

export type SlotAvailabilityReason =
  | "invalid_time"
  | "not_on_grid"
  | "outside_hours"
  | "too_soon"
  | "too_far"
  | "conflict";

export type SlotAvailabilityResult =
  | { ok: true }
  | { ok: false; reason: SlotAvailabilityReason };

export function isRequestedSlotAvailable({
  start,
  session,
  busy,
  booked,
  now,
  rules,
}: IsRequestedSlotAvailableParams): SlotAvailabilityResult {
  validateRules(rules);
  validateSessionTiming(session);

  if (!(start instanceof Date) || Number.isNaN(start.getTime())) {
    return { ok: false, reason: "invalid_time" };
  }

  if (Number.isNaN(now.getTime())) {
    return { ok: false, reason: "invalid_time" };
  }

  const startDt = DateTime.fromJSDate(start, { zone: rules.timezone });
  if (!startDt.isValid) {
    return { ok: false, reason: "invalid_time" };
  }

  // Check if seconds or milliseconds are non-zero (must be on a round minute)
  if (startDt.second !== 0 || startDt.millisecond !== 0) {
    return { ok: false, reason: "not_on_grid" };
  }

  // DST spring-forward gap check
  const constructedDt = DateTime.fromObject(
    {
      year: startDt.year,
      month: startDt.month,
      day: startDt.day,
      hour: startDt.hour,
      minute: startDt.minute,
    },
    { zone: rules.timezone },
  );

  if (
    !constructedDt.isValid ||
    constructedDt.hour !== startDt.hour ||
    constructedDt.minute !== startDt.minute
  ) {
    return { ok: false, reason: "invalid_time" };
  }

  // Instant notice and horizon comparisons
  const startMs = start.getTime();
  const minNoticeMs = now.getTime() + rules.minNoticeHours * 60 * 60 * 1000;
  if (startMs < minNoticeMs) {
    return { ok: false, reason: "too_soon" };
  }

  const maxAdvanceMs = now.getTime() + rules.maxAdvanceDays * 24 * 60 * 60 * 1000;
  if (startMs > maxAdvanceMs) {
    return { ok: false, reason: "too_far" };
  }

  // Working window checks
  const windows = rules.weeklyHours[startDt.weekday] ?? [];
  if (windows.length === 0) {
    return { ok: false, reason: "outside_hours" };
  }

  const slotMinuteOfDay = startDt.hour * 60 + startDt.minute;

  // Find if slot starts within any working window
  let matchingWindow: { startMin: number; endMin: number } | null = null;
  for (const win of windows) {
    const [sH, sM] = win.start.split(":").map(Number);
    const [eH, eM] = win.end.split(":").map(Number);
    const winStartMin = (sH ?? 0) * 60 + (sM ?? 0);
    const winEndMin = (eH ?? 0) * 60 + (eM ?? 0);

    if (slotMinuteOfDay >= winStartMin && slotMinuteOfDay < winEndMin) {
      matchingWindow = { startMin: winStartMin, endMin: winEndMin };
      break;
    }
  }

  if (!matchingWindow) {
    return { ok: false, reason: "outside_hours" };
  }

  // Session must end by the window end
  if (slotMinuteOfDay + session.durationMinutes > matchingWindow.endMin) {
    return { ok: false, reason: "outside_hours" };
  }

  // Slot grid check
  if ((slotMinuteOfDay - matchingWindow.startMin) % rules.slotIntervalMinutes !== 0) {
    return { ok: false, reason: "not_on_grid" };
  }

  // Candidate is structurally valid; now reuse conflict checking
  const dateStr = startDt.toFormat("yyyy-MM-dd");
  const candidates = generateCandidateSlots({
    fromDate: dateStr,
    toDate: dateStr,
    session,
    rules,
    now,
  });

  const matchingCandidate = candidates.find(
    (c) => c.start === start.toISOString(),
  );

  if (!matchingCandidate) {
    // If somehow not generated as candidate (e.g. edge condition), conflict/outside
    return { ok: false, reason: "outside_hours" };
  }

  // Parse and pad intervals
  const rawBusyIntervals = parseIntervals(busy);
  const rawBookedIntervals = parseIntervals(booked);
  const paddedBusy = padEnd(rawBusyIntervals, session.bufferMinutes);
  const mergedPaddedBusy = mergeIntervals(paddedBusy);
  const mergedBooked = mergeIntervals(rawBookedIntervals);

  const available = filterConflicts(
    [matchingCandidate],
    mergedPaddedBusy,
    mergedBooked,
    session,
  );

  if (available.length === 0) {
    return { ok: false, reason: "conflict" };
  }

  return { ok: true };
}
