import { site } from "@/content/site";
import { AvailabilityInputError } from "@/lib/availability/types";

export type TimeWindow = {
  start: string; // "HH:mm"
  end: string; // "HH:mm"
};

export type BookingRules = {
  timezone: string;
  weeklyHours: Record<number, TimeWindow[]>;
  slotIntervalMinutes: number;
  minNoticeHours: number;
  maxAdvanceDays: number;
  maxRangeDays: number;
  holdMinutes: number;
};

function parseTimeToMinutes(timeStr: string): number {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(timeStr);
  if (!match || !match[1] || !match[2]) {
    throw new AvailabilityInputError(`Invalid time format: "${timeStr}", expected HH:mm`);
  }
  return Number.parseInt(match[1], 10) * 60 + Number.parseInt(match[2], 10);
}

export function validateRules(rules: BookingRules): void {
  // Validate slotIntervalMinutes: must be a positive integer dividing 60
  if (
    typeof rules.slotIntervalMinutes !== "number" ||
    !Number.isInteger(rules.slotIntervalMinutes) ||
    rules.slotIntervalMinutes <= 0 ||
    60 % rules.slotIntervalMinutes !== 0
  ) {
    throw new AvailabilityInputError(
      `slotIntervalMinutes must be a positive integer dividing 60, got: ${rules.slotIntervalMinutes}`,
    );
  }

  // Validate non-integer or negative notice/horizon/hold values
  const integerFields = [
    { name: "minNoticeHours", val: rules.minNoticeHours },
    { name: "maxAdvanceDays", val: rules.maxAdvanceDays },
    { name: "maxRangeDays", val: rules.maxRangeDays },
    { name: "holdMinutes", val: rules.holdMinutes },
  ];

  for (const { name, val } of integerFields) {
    if (typeof val !== "number" || !Number.isInteger(val) || val < 0) {
      throw new AvailabilityInputError(
        `${name} must be a non-negative integer, got: ${val}`,
      );
    }
  }

  // Validate timezone is present
  if (!rules.timezone || typeof rules.timezone !== "string") {
    throw new AvailabilityInputError("Timezone must be a non-empty string");
  }

  // Validate weeklyHours (1 = Monday ... 7 = Sunday)
  for (let weekday = 1; weekday <= 7; weekday++) {
    const windows = rules.weeklyHours[weekday] ?? [];

    const parsedWindows: { start: number; end: number }[] = [];
    for (const win of windows) {
      const startMin = parseTimeToMinutes(win.start);
      const endMin = parseTimeToMinutes(win.end);

      if (startMin >= endMin) {
        throw new AvailabilityInputError(
          `Window start must be before end in weekday ${weekday}: ${win.start} >= ${win.end}`,
        );
      }
      parsedWindows.push({ start: startMin, end: endMin });
    }

    // Check for overlapping windows in the same day
    parsedWindows.sort((a, b) => a.start - b.start);
    for (let i = 1; i < parsedWindows.length; i++) {
      const prev = parsedWindows[i - 1]!;
      const curr = parsedWindows[i]!;
      if (curr.start < prev.end) {
        throw new AvailabilityInputError(
          `Overlapping windows detected in weekday ${weekday}: [${prev.start}, ${prev.end}) and [${curr.start}, ${curr.end})`,
        );
      }
    }
  }
}

export const bookingRules: BookingRules = {
  // DEFAULT: Asia/Kolkata timezone from site config, awaiting client confirmation
  timezone: site.businessTimezone,

  // DEFAULT: Mon–Sat 10:00–18:00, Sun closed, awaiting client confirmation
  weeklyHours: {
    1: [{ start: "10:00", end: "18:00" }], // Monday
    2: [{ start: "10:00", end: "18:00" }], // Tuesday
    3: [{ start: "10:00", end: "18:00" }], // Wednesday
    4: [{ start: "10:00", end: "18:00" }], // Thursday
    5: [{ start: "10:00", end: "18:00" }], // Friday
    6: [{ start: "10:00", end: "18:00" }], // Saturday
    7: [], // Sunday
  },

  // DEFAULT: 30-minute slot interval, awaiting client confirmation
  slotIntervalMinutes: 30,

  // DEFAULT: 12 hours minimum notice, awaiting client confirmation
  minNoticeHours: 12,

  // DEFAULT: 60 days maximum advance booking window, awaiting client confirmation
  maxAdvanceDays: 60,

  // DEFAULT: 62 days maximum query range span, awaiting client confirmation
  maxRangeDays: 62,

  // DEFAULT: 15 minutes hold window.
  // must equal the 15 minutes hard-coded in the database function create_pending_booking;
  // changing one requires changing the other.
  holdMinutes: 15,
};
