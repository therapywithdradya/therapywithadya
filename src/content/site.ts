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

export const internalPaths = [
  "/about",
  "/services",
  "/sessions",
  "/events",
  "/gallery",
  "/reviews",
  "/contact",
  "/book",
  "/privacy",
  "/terms-and-cancellation",
] as const;

export type InternalPath = (typeof internalPaths)[number];

export type ServiceListing = {
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  href?: InternalPath;
  linkLabel?: string;
};

export type Qualification = {
  title: string;
  issuer?: string;
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
  services: [
    {
      slug: "supervision",
      title: "Supervision",
      shortDescription:
        "[DUMMY] Placeholder description for supervision. This is not a published offer.",
      longDescription:
        "[DUMMY] A longer note about supervision will go here. This is not a published offer, and it is not a claim about training or results.",
      href: "/sessions",
      linkLabel: "View bookable sessions",
    },
    {
      slug: "events",
      title: "Events",
      shortDescription:
        "[DUMMY] Placeholder description for events. This is not a published offer.",
      longDescription:
        "[DUMMY] A longer note about events will go here. This is not a published listing, and no dates are claimed on this card.",
      href: "/events",
      linkLabel: "View events",
    },
    {
      slug: "workshops",
      title: "Workshops",
      shortDescription:
        "[DUMMY] Placeholder description for workshops. This is not a published offer.",
      longDescription:
        "[DUMMY] A longer note about workshops will go here. This is not a published listing, and no topics are claimed on this card.",
      href: "/events",
      linkLabel: "View workshops",
    },
  ] satisfies ServiceListing[],
  about: {
    aboutIntro:
      "[DUMMY] A short introduction will go here. A full biography is not published yet.",
    bioParagraphs: [
      "[DUMMY] A biography paragraph will go here. This is not a statement of experience, credentials, or results.",
      "[DUMMY] A second paragraph will go here. Background details are not published yet.",
      "[DUMMY] A third paragraph will go here. It leaves room for a longer biography without adding a claim.",
    ],
    background: undefined as string | undefined,
    qualifications: [] as Qualification[],
    approach:
      "[DUMMY] A description of the approach will go here. This is not a published philosophy.",
    aboutPhotos: [
      {
        src: "/placeholders/portrait.svg",
        alt: "[DUMMY] Placeholder illustration of an empty frame labelled Portrait. This is not a photograph.",
        width: 800,
        height: 1000,
      },
    ] satisfies SiteImageSource[],
  },
  pages: {
    about: {
      title: "About",
      description:
        "[DUMMY] A short introduction to this practice. Biography, background, and qualifications are not published yet. Read what is available here.",
    },
    services: {
      title: "Services",
      description:
        "[DUMMY] Supervision, events, and workshops are outlined here as placeholders. They are not a published list of offers or results.",
      intro:
        "[DUMMY] Each item below is a placeholder outline. It is not a published offer.",
    },
    sessions: {
      title: "Sessions",
      description:
        "[DUMMY] Placeholder session lengths are listed on this page. Fees stay unpublished until a real price is set, and booking happens on this site.",
      intro:
        "[DUMMY] The sessions below are placeholders. Duration and the fee line come from the session list.",
    },
    events: {
      title: "Events",
      description:
        "[DUMMY] Upcoming and past events and workshops are listed here. No dates or topics are confirmed until published.",
      intro:
        "[DUMMY] Events and workshops listed below are placeholders. They are not confirmed offers.",
    },
    gallery: {
      title: "Gallery",
      description:
        "[DUMMY] A collection of images from this practice. Photos are not published until they are reviewed and approved.",
      intro:
        "[DUMMY] The photographs below are placeholder images. They are not real photographs of this practice.",
    },
    reviews: {
      title: "Reviews",
      description:
        "[DUMMY] Client testimonials from this practice. Reviews are not published until they are approved and confirmed.",
      intro:
        "[DUMMY] The reviews below are placeholder notes for layout only. They are not real client testimonials.",
    },
    contact: {
      title: "Contact",
      description:
        "[DUMMY] Get in touch by email, phone, or WhatsApp to enquire about sessions, workshops, or questions. Direct message details are listed here.",
      intro:
        "[DUMMY] Get in touch by email, phone, or WhatsApp. Enquiries and booking questions are welcome.",
    },
    privacy: {
      title: "Privacy",
      description:
        "[DUMMY] How your personal details and booking data are collected, used, and protected by this practice. Read our complete privacy policy here.",
      intro:
        "[DUMMY] How your personal information is handled when you visit this website or book a session.",
    },
    termsAndCancellation: {
      title: "Terms and cancellation",
      description:
        "[DUMMY] Booking terms, payment, cancellation notice, and refund guidelines for sessions and workshops. Review practice policies before booking.",
      intro:
        "[DUMMY] Guidelines on booking, payment, cancellation, and rescheduling for sessions with this practice.",
    },
    terms: {
      title: "Terms and cancellation",
      description:
        "[DUMMY] Booking terms, payment, cancellation notice, and refund guidelines for sessions and workshops. Review practice policies before booking.",
      intro:
        "[DUMMY] Guidelines on booking, payment, cancellation, and rescheduling for sessions with this practice.",
    },
  },
  bookingSteps: [
    "Choose a session.",
    "Pick an available time.",
    "Enter your details.",
    "Pay securely to confirm.",
  ],
  legalLastUpdated: "[DUMMY] 2 October 2026",
  safetyNotice: {
    heading: "Emergency and crisis support",
    text: "This practice does not provide crisis or emergency support. If you or someone else is in immediate danger, contact your local emergency number.",
    // VERIFY-BEFORE-LAUNCH: helpline numbers need client confirmation
    resources: [
      {
        label: "Emergency services (India): 112",
        tel: "112",
      },
      {
        label: "Tele-MANAS, national mental health helpline (India): 14416",
        tel: "14416",
      },
    ],
  },
  policies: {
    paymentTerms:
      "[DEFAULT] Full payment is taken up front. This sentence is a default, not final legal text.",
    cancellationNoticeHours: 24,
    refundSummary: "" as string,
    reschedulingSummary: "" as string,
    minorsSummary: "" as string,
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
