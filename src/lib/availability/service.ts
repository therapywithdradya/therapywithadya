import { type BookingRules, validateRules } from "@/lib/booking/booking-rules";
import { validateDateRange, validateSessionTiming, getAvailableSlots } from "./slots";
import {
  AvailabilityInputError,
  AvailabilityUnavailableError,
  type BookedRangesProvider,
  type BusyProvider,
  type Interval,
  type SessionTiming,
  type Slot,
} from "./types";

export type GetAvailabilityParams = {
  fromDate: string;
  toDate: string;
  session: SessionTiming;
  now: Date;
  busyProvider: BusyProvider;
  bookedProvider: BookedRangesProvider;
  rules: BookingRules;
  timeoutMs?: number;
};

export async function getAvailability({
  fromDate,
  toDate,
  session,
  now,
  busyProvider,
  bookedProvider,
  rules,
  timeoutMs = 8000,
}: GetAvailabilityParams): Promise<Slot[]> {
  // Validate rules first; throws AvailabilityInputError on invalid config
  validateRules(rules);
  validateSessionTiming(session);

  // Validate date range; clips range, throws AvailabilityInputError on bad input
  const { fromDt, toDt } = validateDateRange(fromDate, toDate, rules);

  // Widen query range to providers by 24 hours on each side
  const queryStart = fromDt.minus({ hours: 24 }).toJSDate();
  const queryEnd = toDt.plus({ hours: 24 }).endOf("day").toJSDate();
  const queryRange: Interval = { start: queryStart, end: queryEnd };

  // Helper: race provider call against timeout (fail closed)
  let timeoutHandle: ReturnType<typeof setTimeout> | null = null;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutHandle = setTimeout(() => {
      reject(new AvailabilityUnavailableError("Provider query timed out"));
    }, timeoutMs);
  });

  let busy: unknown[];
  let booked: unknown[];

  try {
    const [busyRaw, bookedRaw] = await Promise.race([
      Promise.all([
        busyProvider.getBusyIntervals(queryRange),
        bookedProvider.getBookedRanges(queryRange),
      ]),
      timeoutPromise,
    ]);

    busy = busyRaw;
    booked = bookedRaw;
  } catch (err) {
    if (err instanceof AvailabilityInputError) {
      // Input errors propagate as-is (they came from validation before providers ran)
      throw err;
    }
    // Any provider error or timeout: fail closed
    throw new AvailabilityUnavailableError(
      `Availability providers failed: ${err instanceof Error ? err.message : String(err)}`,
      { cause: err },
    );
  } finally {
    if (timeoutHandle !== null) {
      clearTimeout(timeoutHandle);
      timeoutHandle = null;
    }
  }

  // Provider output is validated inside getAvailableSlots -> parseIntervals (fail closed)
  // If invalid data is returned by provider, parseIntervals throws AvailabilityUnavailableError
  try {
    return getAvailableSlots({
      fromDate,
      toDate,
      session,
      busy,
      booked,
      now,
      rules,
    });
  } catch (err) {
    if (err instanceof AvailabilityInputError) {
      throw err;
    }
    // Corrupt provider data is treated as unavailable, fail closed
    throw new AvailabilityUnavailableError(
      `Availability computation failed: ${err instanceof Error ? err.message : String(err)}`,
      { cause: err },
    );
  }
}
