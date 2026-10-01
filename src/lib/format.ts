/** Clock read for time-based pages. Kept out of components so render stays free of a direct Date.now call. */
export function clockMs(): number {
  return Date.now();
}

export type FormattedEventRange = {
  text: string;
  startIso: string | null;
  endIso: string | null;
  startLabel: string;
  endLabel: string | null;
};

const dateUnavailable: FormattedEventRange = {
  text: "Date unavailable",
  startIso: null,
  endIso: null,
  startLabel: "Date unavailable",
  endLabel: null,
};

function tidy(value: string): string {
  return value.replace(/[\u202f\u00a0]/g, " ").replace(/\s+/g, " ").trim();
}

function part(
  parts: Intl.DateTimeFormatPart[],
  type: Intl.DateTimeFormatPartTypes,
): string {
  return parts.find((item) => item.type === type)?.value ?? "";
}

function calendarKey(date: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-IN", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  return `${part(parts, "year")}-${part(parts, "month")}-${part(parts, "day")}`;
}

/**
 * Minutes under an hour, and exactly 60, use a minutes phrase.
 * Longer values use "hr" and "min". Non-integers round to the nearest minute.
 */
export function formatDuration(minutes: number): string {
  if (!Number.isFinite(minutes) || minutes <= 0) {
    return "0 minutes";
  }

  const total = Math.round(minutes);
  if (total <= 0) {
    return "0 minutes";
  }

  if (total < 60 || total === 60) {
    return total === 1 ? "1 minute" : `${total} minutes`;
  }

  const hours = Math.floor(total / 60);
  const remainder = total % 60;
  if (remainder === 0) {
    return `${hours} hr`;
  }

  const minuteLabel = remainder === 1 ? "1 min" : `${remainder} min`;
  return `${hours} hr ${minuteLabel}`;
}

export function formatEventDateRange(
  startsAt: string,
  endsAt: string | null,
  timeZone: string,
): FormattedEventRange {
  const start = new Date(startsAt);
  if (Number.isNaN(start.getTime())) {
    return dateUnavailable;
  }

  let end: Date | null = null;
  if (endsAt) {
    const parsed = new Date(endsAt);
    if (!Number.isNaN(parsed.getTime())) {
      end = parsed;
    }
  }

  try {
    const dateOptions: Intl.DateTimeFormatOptions = {
      timeZone,
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    const timeOptions: Intl.DateTimeFormatOptions = {
      timeZone,
      hour: "numeric",
      minute: "2-digit",
    };
    const startDate = tidy(new Intl.DateTimeFormat("en-IN", dateOptions).format(start));
    const startTime = tidy(new Intl.DateTimeFormat("en-IN", timeOptions).format(start));
    const startLabel = `${startDate}, ${startTime}`;

    if (!end) {
      return {
        text: startLabel,
        startIso: start.toISOString(),
        endIso: null,
        startLabel,
        endLabel: null,
      };
    }

    const endDate = tidy(new Intl.DateTimeFormat("en-IN", dateOptions).format(end));
    const endTime = tidy(new Intl.DateTimeFormat("en-IN", timeOptions).format(end));
    const sameDay = calendarKey(start, timeZone) === calendarKey(end, timeZone);
    const endLabel = sameDay ? endTime : `${endDate}, ${endTime}`;

    return {
      text: `${startLabel} - ${endLabel}`,
      startIso: start.toISOString(),
      endIso: end.toISOString(),
      startLabel,
      endLabel,
    };
  } catch {
    return dateUnavailable;
  }
}
