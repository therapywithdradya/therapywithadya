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
 * Verified session offerings for Dr. Adya Vats practice.
 * Checkout calls assertPayable before creating an order.
 */
export const sessions: readonly SessionConfig[] = [
  {
    slug: "session-a-60",
    name: "Individual Therapy Session (60 min)",
    description:
      "A compassionate, trauma-informed 1-on-1 therapy session tailored to your emotional and psychological needs. Focuses on anxiety, depression, stress, self-doubt, relationship challenges, and coping strategies.",
    whoItFor:
      "Adolescents and adults (ages 16–50) seeking dedicated emotional support, self-discovery, and evidence-based healing tools.",
    durationMinutes: 60,
    bufferMinutes: 15,
    pricePaise: 150000,
  },
  {
    slug: "session-b-90",
    name: "Integrative Therapy & Modality Deep-Dive (90 min)",
    description:
      "An intensive extended session combining psychotherapy with specialized modalities such as Hypnotherapy, Art Therapy, or Graphology (handwriting analysis).",
    whoItFor:
      "Individuals seeking deep exploration of subconscious patterns, acute distress, trauma processing, or expressive emotional breakthroughs.",
    durationMinutes: 90,
    bufferMinutes: 15,
    pricePaise: 220000,
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
