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
 * Public site copy for Dr. Adya Vats practice.
 * Accurately synthesized from client reference documentation, academic background, and official Instagram profile.
 */
export const site = {
  siteName: "Therapy with Dr. Adya",
  tagline:
    "A safe, compassionate, and trauma-informed space to heal, feel empowered, and connect with your truest self.",
  practitionerName: "Dr. Adya Vats",
  email: "adyavats13@gmail.com",
  phone: "" as string,
  whatsapp: undefined as string | undefined,
  location: "Online Sessions (Worldwide) & In-Person by Appointment",
  socials: {
    instagram: "https://www.instagram.com/dr.adya_vats?stkn=MXJ3eXRkZ2tqbjVnMQ%3D%3D&utm_source=qr",
  } as SocialLinks,
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
  clientCountMarker: undefined as string | undefined,
  home: {
    description:
      "Therapy with Dr. Adya Vats — Trauma-informed psychologist, certified CBT & REBT practitioner, hypnotherapist, and graphologist. Individual counseling, workshops, and student supervision.",
    support:
      "Supporting individuals aged 16 to 50 through anxiety, stress, depression, self-doubt, trauma, relationship hurdles, disordered eating, and life transitions.",
    heroImage: {
      src: "/images/hero-space.jpg",
      alt: "Tranquil and welcoming therapy space for Dr. Adya Vats practice",
      width: 1600,
      height: 900,
    } satisfies SiteImageSource,
    aboutTitle: "About Dr. Adya Vats",
    aboutIntro:
      "I am a trauma-informed psychologist with over 3+ years of clinical practice and 5+ years of dedicated academic study and research. My goal is to provide a safe, compassionate, and non-judgmental space where you can begin your healing journey and work towards lasting personal growth.",
    portrait: {
      src: "/images/dr-adya-portrait.jpg",
      alt: "Portrait of Dr. Adya Vats, Psychologist and Trauma-Informed Therapist",
      width: 400,
      height: 400,
    } satisfies SiteImageSource,
    servicesTitle: "Services & Therapeutic Modalities",
    servicesIntro:
      "Tailored, compassionate care blending evidence-based psychology with holistic healing tools.",
    sessionsTitle: "1-on-1 Sessions",
    sessionsIntro:
      "Confidential 60-minute and 90-minute therapy sessions designed around your unique personal and emotional journey.",
    bookingTitle: "Book a session",
    bookingText:
      "Take the first step toward self-compassion and mental clarity. Choose a session and reserve your time.",
    reviewsTitle: "Client Reflections",
    reviewsIntro:
      "Reflections from individuals and workshop attendees who have worked with Dr. Adya.",
    eventsTitle: "Events and workshops",
    eventsEmpty:
      "No upcoming public events right now. Inquire directly for school or corporate bookings.",
    galleryTitle: "Gallery",
    galleryEmpty: "Moments from wellness sessions, seminars, and learning workshops.",
    contactTitle: "Contact Dr. Adya",
    contactIntro:
      "Reach out directly for therapy inquiries, institutional workshops, corporate wellness, or clinical supervision.",
  },
  services: [
    {
      slug: "individual-therapy",
      title: "Individual Psychotherapy",
      shortDescription:
        "1-on-1 trauma-informed counseling for anxiety, depression, OCD, relationship challenges, grief, and stress management.",
      longDescription:
        "Personalized psychotherapy sessions utilizing CBT, REBT, and trauma-informed methodologies to help you identify emotional root causes, overcome self-doubt, reframe negative thinking, and build sustainable emotional resilience.",
      href: "/sessions",
      linkLabel: "View bookable sessions",
    },
    {
      slug: "integrative-modalities",
      title: "Hypnotherapy & Expressive Arts",
      shortDescription:
        "Certified Hypnotherapy, Art Therapy, Graphology (handwriting analysis), and Chakra Healing.",
      longDescription:
        "Deep subconscious and expressive modalities that complement cognitive therapy. Explore emotional blocks through handwriting analysis, subconscious reprogramming with hypnotherapy, and emotional release through creative art therapy.",
      href: "/sessions",
      linkLabel: "View sessions",
    },
    {
      slug: "workshops",
      title: "Workshops & Institutional Seminars",
      shortDescription:
        "Interactive mental health sessions for schools, universities, educators, and organizations.",
      longDescription:
        "Practical workshops covering emotional well-being, stress regulation, interpersonal communication, and building psychological resilience. Designed specifically for students, educators, and corporate teams.",
      href: "/events",
      linkLabel: "View workshops",
    },
    {
      slug: "supervision",
      title: "Supervision & Internships",
      shortDescription:
        "Clinical mentorship, supervision, and training for psychology students and budding practitioners.",
      longDescription:
        "Structured guidance and training programs designed to support the learning, ethical practice, and professional development of budding psychologists and mental health interns.",
      href: "/contact",
      linkLabel: "Inquire about supervision",
    },
  ] satisfies ServiceListing[],
  about: {
    aboutIntro:
      "I am a trauma-informed psychologist with over 3+ years of clinical practice and 5+ years of dedicated academic study and research, supporting individuals to heal, feel empowered, and connect with their truest self.",
    bioParagraphs: [
      "I bring a deep passion for psychology and holistic healing to my practice, backed by over 3+ years of professional clinical experience and 5+ years of dedicated academic study and research. As a Ph.D. research scholar in the Department of Psychology at Sikkim Skill University, my academic work delves into how core psychological strengths—resilience, hope, and optimism—shape our attitude toward the future and drive goal-directed growth.",
      "As a certified CBT & REBT practitioner, trauma-informed therapist, certified hypnotherapist, art therapist, career counselor, graphologist, and Tarot card reader, I believe therapy should never be one-size-fits-all. I provide an integrative, flexible approach that honors each individual's uniqueness, tailoring evidence-based psychological tools and intuitive healing practices to meet your emotional needs.",
      "I specialize in working with adolescents and adults aged 16 to 50, supporting individuals navigating anxiety, stress, depression, self-doubt, trauma, grief, abuse, relationship challenges, career transitions, disordered eating, sleep difficulties, and OCD. Beyond individual therapy, I actively conduct mental health workshops in schools and corporate settings, train educators on student emotional well-being, and provide supervision and internships for budding psychologists.",
    ],
    background:
      "Ph.D. Research Scholar in Psychology at Sikkim Skill University. Co-author of published research on 'Resilience, Hope, and Optimism and Their Role in Shaping Attitude towards Future' (Journal of Advance Research in Science and Social Science, Nov 2025). Certified in Cognitive Behavioral Therapy (CBT), Rational Emotive Behavior Therapy (REBT), Hypnotherapy, Art Therapy, and Graphology.",
    qualifications: [
      {
        title: "Ph.D. Research Scholar in Psychology",
        issuer: "Department of Psychology, Sikkim Skill University",
      },
      { title: "Certified CBT Practitioner (Cognitive Behavioral Therapy)" },
      { title: "Certified REBT Practitioner (Rational Emotive Behavior Therapy)" },
      { title: "Trauma-Informed Psychologist & Therapist" },
      { title: "Certified Hypnotherapist" },
      { title: "Certified Art Therapist" },
      { title: "Certified Graphologist (Handwriting Analyst)" },
      { title: "Career Counselor" },
      { title: "Tarot Card Reader & Chakra Healer" },
    ] as Qualification[],
    approach:
      "My therapeutic approach is grounded in empathy, safety, and non-judgment. I view every client as the author of their own story, providing the tools, perspective, and compassionate containment needed to navigate emotional distress. By combining the structured clarity of CBT and REBT with the subconscious depth of hypnotherapy, handwriting analysis (graphology), and expressive arts, we co-create a personalized pathway toward sustainable healing, emotional regulation, and self-empowerment.",
    aboutPhotos: [
      {
        src: "/images/dr-adya-portrait.jpg",
        alt: "Dr. Adya Vats - Psychologist, Hypnotherapist and Trauma-Informed Therapist",
        width: 400,
        height: 400,
      },
    ] satisfies SiteImageSource[],
  },
  pages: {
    about: {
      title: "About Dr. Adya Vats",
      description:
        "Learn about Dr. Adya Vats, trauma-informed psychologist, certified CBT & REBT practitioner, hypnotherapist, and Ph.D. research scholar dedicated to compassionate mental health support.",
    },
    services: {
      title: "Services",
      description:
        "Explore psychotherapy services, CBT & REBT counseling, hypnotherapy, art therapy, graphology, workshops, and clinical supervision.",
      intro:
        "A comprehensive range of evidence-based psychological services and specialized modalities designed to support your personal growth and well-being.",
    },
    sessions: {
      title: "Sessions",
      description:
        "Book confidential 60-minute and 90-minute online therapy sessions with Dr. Adya Vats. Safe, compassionate, and personalized care.",
      intro:
        "Confidential 1-on-1 consultations tailored to your individual needs. Select a session below to book an appointment.",
    },
    events: {
      title: "Events and workshops",
      description:
        "Educational workshops on emotional resilience, school mental health seminars, teacher training, and psychologist supervision.",
      intro:
        "Interactive mental health workshops, institutional seminars, and training programs conducted by Dr. Adya Vats.",
    },
    gallery: {
      title: "Gallery",
      description:
        "Moments from workshops, training sessions, and the healing practice of Dr. Adya Vats.",
      intro:
        "Visual impressions from institutional workshops, student seminars, and wellness spaces.",
    },
    reviews: {
      title: "Reviews",
      description:
        "Read reflections from clients and workshop attendees who have experienced compassionate guidance and healing with Dr. Adya Vats.",
      intro:
        "Real experiences and heartfelt feedback from individuals and organizations Dr. Adya has supported.",
    },
    contact: {
      title: "Contact",
      description:
        "Reach out to Dr. Adya Vats for therapy bookings, corporate seminars, school workshops, or supervision inquiries.",
      intro:
        "Have questions or want to inquire about sessions, workshops, or training? Connect directly via email or Instagram.",
    },
    privacy: {
      title: "Privacy policy",
      description:
        "How your personal details and booking data are collected, used, and protected by this practice. Read our complete privacy policy here.",
      intro:
        "How your personal information is handled when you visit this website or book a session.",
    },
    termsAndCancellation: {
      title: "Terms and cancellation",
      description:
        "Booking terms, payment, cancellation notice, and refund guidelines for sessions and workshops. Review practice policies before booking.",
      intro:
        "Guidelines on booking, payment, cancellation, and rescheduling for sessions with this practice.",
    },
  },
  bookingSteps: [
    "Choose a session.",
    "Pick an available time.",
    "Enter your details.",
    "Pay securely to confirm.",
  ],
  legalLastUpdated: "12 October 2026",
  safetyNotice: {
    heading: "Emergency and crisis support",
    text: "This practice does not provide crisis or emergency support. If you or someone else is in immediate danger, contact your local emergency number.",
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
      "Full payment is taken up front to confirm and reserve your session slot.",
    cancellationNoticeHours: 24,
    refundSummary:
      "Cancellations made at least 24 hours prior to the session time are eligible for rescheduling or refund.",
    reschedulingSummary:
      "You may reschedule your session up to 24 hours before your scheduled appointment time.",
    minorsSummary:
      "Clients under 18 years of age require parental or guardian consent before commencing therapy sessions.",
    selfServeCancel: false,
    selfServeReschedule: false,
    confirmed: true,
  },
} as const;

export function filled(value: string | undefined): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

const unnamedPractice = "Dr. Adya Vats";
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
  return "A safe, compassionate, and trauma-informed space to heal and connect with your truest self.";
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
