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

export type SiteImageSource = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type ServiceOverview = {
  id: string;
  title: string;
  description: string;
};

export const socialChannels = [
  { key: "instagram", label: "Instagram" },
  { key: "facebook", label: "Facebook" },
  { key: "youtube", label: "YouTube" },
  { key: "linkedin", label: "LinkedIn" },
] as const satisfies readonly { key: keyof SocialLinks; label: string }[];

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
  clientCountMarker: "[DUMMY]" as string | undefined,
  home: {
    description:
      "[DUMMY] An independent practice website. Biography, fees, and policies are not published yet. Open the booking page to choose a session.",
    support:
      "[DUMMY] A short note will go here. This is not a statement of experience, credentials, or results.",
    heroImage: {
      src: "/placeholders/hero.svg",
      alt: "Placeholder illustration of an empty frame labelled Hero. This is not a photograph.",
      width: 1600,
      height: 900,
    } satisfies SiteImageSource,
    aboutTitle: "About",
    aboutIntro:
      "[DUMMY] A short introduction will go here. A full biography is not published yet.",
    portrait: {
      src: "/placeholders/portrait.svg",
      alt: "Placeholder illustration of an empty frame labelled Portrait. This is not a photograph.",
      width: 800,
      height: 1000,
    } satisfies SiteImageSource,
    servicesTitle: "Services",
    servicesIntro:
      "[DUMMY] These cards are placeholders. They are not a published list of offers.",
    services: [
      {
        id: "supervision",
        title: "Supervision",
        description:
          "[DUMMY] Placeholder description for supervision. This is not a published offer.",
      },
      {
        id: "events",
        title: "Events",
        description:
          "[DUMMY] Placeholder description for events. This is not a published offer.",
      },
      {
        id: "workshops",
        title: "Workshops",
        description:
          "[DUMMY] Placeholder description for workshops. This is not a published offer.",
      },
    ] satisfies ServiceOverview[],
    sessionsTitle: "Sessions",
    sessionsIntro:
      "[DUMMY] Session names below are placeholders. A fee line appears only from the session list.",
    bookingTitle: "Book a session",
    bookingText: "[DUMMY] Choose a session and a time on the booking page.",
    reviewsTitle: "Reviews",
    reviewsIntro:
      "[DUMMY] These notes are layout placeholders, not client reviews.",
    eventsTitle: "Events and workshops",
    eventsEmpty: "No upcoming events right now.",
    galleryTitle: "Gallery",
    galleryEmpty: "No gallery images right now.",
    contactTitle: "Contact",
    contactIntro:
      "[DUMMY] Only contact details that have been supplied are shown here.",
  },
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

const unnamedPractice = "Practice [DUMMY]";
const dummyMarker = /\[(?:DUMMY|PLACEHOLDER)\]/;

export function wordmark(): string {
  if (filled(site.siteName)) {
    return site.siteName;
  }
  if (filled(site.practitionerName)) {
    return site.practitionerName;
  }
  return unnamedPractice;
}

export function positioningLine(): string {
  if (filled(site.tagline)) {
    return site.tagline;
  }
  return "[DUMMY] Positioning line. This is not a claim about the practice.";
}

export function visibleClientCount(): number | undefined {
  const marker = site.clientCountMarker;
  if (typeof marker === "string" && dummyMarker.test(marker)) {
    return undefined;
  }
  const count = site.clientCount;
  if (typeof count !== "number" || !Number.isInteger(count) || count <= 0) {
    return undefined;
  }
  return count;
}

export function listedSocials(): { key: string; label: string; href: string }[] {
  return socialChannels.flatMap((item) => {
    const href = site.socials[item.key];
    if (!filled(href)) {
      return [];
    }
    return [{ key: item.key, label: item.label, href: href.trim() }];
  });
}
