export type Interval = {
  start: Date;
  end: Date;
};

export type SessionTiming = {
  durationMinutes: number;
  bufferMinutes: number;
};

export type Slot = {
  start: string; // UTC ISO string
  end: string; // UTC ISO string
  localDate: string; // "YYYY-MM-DD"
  localTime: string; // "HH:mm"
};

export interface BusyProvider {
  getBusyIntervals(range: Interval): Promise<unknown[]>;
}

export interface BookedRangesProvider {
  getBookedRanges(range: Interval): Promise<unknown[]>;
}

export class AvailabilityUnavailableError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "AvailabilityUnavailableError";
  }
}

export class AvailabilityInputError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "AvailabilityInputError";
  }
}
