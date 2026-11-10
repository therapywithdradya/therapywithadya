import "server-only";

export type SessionConfig = {
  slug: string;
  name: string;
  description: string;
  whoItFor: string;
  approaches?: string;
  durationMinutes: number;
  durationLabel?: string;
  bufferMinutes: number;
  pricePaise: number;
};

/**
 * Verified session offerings for Dr. Adya Vats practice.
 * Checkout calls assertPayable before creating an order.
 */
export const sessions: readonly SessionConfig[] = [
  {
    slug: "individual-therapy-30",
    name: "Individual Therapy (30 min)",
    description:
      "A focused, compassionate session tailored to your immediate concerns — helping you understand what you’re experiencing, gain clarity, and take meaningful steps forward.",
    approaches: "CBT • REBT • Mindfulness • Gestalt",
    whoItFor:
      "Adolescents and adults seeking support with anxiety, stress, self-doubt, emotional concerns, relationships, and life challenges.",
    durationMinutes: 30,
    bufferMinutes: 15,
    pricePaise: 100000,
  },
  {
    slug: "individual-therapy-60",
    name: "Individual Therapy (60 min)",
    description:
      "A deeper therapeutic space to explore your emotions, experiences, patterns, and challenges at your own pace.",
    approaches: "CBT • REBT • Gestalt • Mindfulness • Hypnotherapy • Art Therapy",
    whoItFor:
      "Adolescents and adults navigating anxiety, depression, stress, self-doubt, trauma, relationship concerns, or major life transitions.",
    durationMinutes: 60,
    bufferMinutes: 15,
    pricePaise: 200000,
  },
  {
    slug: "couples-therapy",
    name: "Couples Therapy (60–75 min)",
    description:
      "A supportive space for couples to communicate openly, understand each other better, work through recurring challenges, and build a healthier, more connected relationship.",
    approaches: "CBT • REBT • Gestalt • Mindfulness • Hypnotherapy • Art Therapy • Graphology",
    whoItFor:
      "Couples experiencing communication difficulties, recurring conflict, emotional disconnection, relationship challenges, or navigating important life transitions together.",
    durationMinutes: 75,
    durationLabel: "60–75 minutes",
    bufferMinutes: 15,
    pricePaise: 300000,
  },
];

export function getSessionBySlug(slug: string): SessionConfig | undefined {
  if (slug === "session-a-60") {
    return sessions.find((s) => s.slug === "individual-therapy-60");
  }
  if (slug === "session-b-90") {
    return sessions.find((s) => s.slug === "couples-therapy");
  }
  return sessions.find((session) => session.slug === slug);
}

export function assertPayable(session: SessionConfig): void {
  if (!Number.isInteger(session.pricePaise) || session.pricePaise <= 0) {
    throw new Error(
      `Session "${session.slug}" is not payable. pricePaise must be a positive integer.`,
    );
  }
}
