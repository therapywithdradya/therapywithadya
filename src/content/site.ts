export type NavItem = {
  href: string;
  label: string;
};

export type SocialLinks = {
  instagram?: string;
  facebook?: string;
  youtube?: string;
  linkedin?: string;
};

/**
 * Public site copy. Dummy values are marked in the strings.
 * Policies are DEFAULTS, not final legal text. Confirm them before publishing.
 */
export const site = {
  siteName: "Practice [DUMMY]",
  tagline:
    "[DUMMY] Placeholder tagline. Real wording is not set, and this is not a claim about services.",
  practitionerName: "Dr. Asha Verma [DUMMY]",
  email: "hello@example.com",
  phone: "+91 00000 00000",
  whatsapp: undefined as string | undefined,
  location: undefined as string | undefined,
  socials: {
    instagram: "https://example.com/dummy",
    linkedin: "https://example.com/dummy",
  } satisfies SocialLinks,
  nav: [
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/sessions", label: "Sessions" },
    { href: "/events", label: "Events" },
    { href: "/gallery", label: "Gallery" },
    { href: "/reviews", label: "Reviews" },
    { href: "/contact", label: "Contact" },
  ] satisfies NavItem[],
  bookHref: "/book",
  bookLabel: "Book a session",
  businessTimezone: "Asia/Kolkata",
  /**
   * [DUMMY] Not a real client count. Do not show this number as a statistic.
   */
  clientCount: 0,
  policies: {
    paymentTerms:
      "[DEFAULT] Full payment is taken up front. This sentence is a default, not final legal text.",
    cancellationNoticeHours: 24,
    selfServeCancel: false,
    selfServeReschedule: false,
  },
} as const;

export function filled(value: string | undefined): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
