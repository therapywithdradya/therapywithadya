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
 * Public site copy.
 * Only values stated in the client reference docs are filled in.
 * Policies stay the project defaults until policies.confirmed is true.
 */
export const site = {
  siteName: "Practice [DUMMY]",
  tagline:
    "[DUMMY] Placeholder tagline. Real wording is not set, and this is not a claim about services.",
  practitionerName: "" as string,
  email: "adyavats13@gmail.com",
  phone: "" as string,
  whatsapp: undefined as string | undefined,
  location: undefined as string | undefined,
  socials: {} as SocialLinks,
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
  clientCount: undefined as number | undefined,
  policies: {
    paymentTerms:
      "[DEFAULT] Full payment is taken up front. This sentence is a default, not final legal text.",
    cancellationNoticeHours: 24,
    selfServeCancel: false,
    selfServeReschedule: false,
    confirmed: false,
  },
} as const;

export function filled(value: string | undefined): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
