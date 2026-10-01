import "server-only";

export type SessionConfig = {
  slug: string;
  name: string;
  description: string;
  whoItFor: string;
  durationMinutes: number;
  bufferMinutes: number;
  pricePaise: number;
};

/**
 * Placeholder sessions only. Real names and fees are not set.
 * Checkout must call assertPayable before creating an order.
 */
export const sessions: readonly SessionConfig[] = [
  {
    slug: "session-a-60",
    name: "[DUMMY] Session A (60 min)",
    description:
      "[DUMMY] Placeholder description for a 60-minute session. Real session details are not set yet.",
    whoItFor:
      "[DUMMY] Placeholder audience. This is not a real claim about who the session is for.",
    durationMinutes: 60,
    bufferMinutes: 15,
    // Real fee not set. Checkout refuses non-positive prices. Set a real fee (or a temporary test fee) before enabling booking.
    pricePaise: 0,
  },
  {
    slug: "session-b-90",
    name: "[DUMMY] Session B (90 min)",
    description:
      "[DUMMY] Placeholder description for a 90-minute session. Real session details are not set yet.",
    whoItFor:
      "[DUMMY] Placeholder audience. This is not a real claim about who the session is for.",
    durationMinutes: 90,
    bufferMinutes: 15,
    // Real fee not set. Checkout refuses non-positive prices. Set a real fee (or a temporary test fee) before enabling booking.
    pricePaise: 0,
  },
];

export function getSessionBySlug(slug: string): SessionConfig | undefined {
  return sessions.find((session) => session.slug === slug);
}

export function assertPayable(session: SessionConfig): void {
  if (!Number.isInteger(session.pricePaise) || session.pricePaise <= 0) {
    throw new Error(
      `Session "${session.slug}" is not payable. pricePaise must be a positive integer.`,
    );
  }
}
