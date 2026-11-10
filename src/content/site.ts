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
  clientCount: 1000,
  clientCountMarker: undefined as string | undefined,
  home: {
    description:
      "Therapy with Dr. Adya Vats — Trauma-informed psychologist, certified CBT & REBT practitioner, hypnotherapist, and graphologist. Individual psychotherapy, couples therapy, workshops, and clinical supervision.",
    support:
      "Supporting adolescents and adults through anxiety, stress, depression, self-doubt, trauma, relationship concerns, life transitions, and emotional wellbeing.",
    heroImage: {
      src: "/images/hero-space.jpg",
      alt: "Tranquil and welcoming therapy space for Dr. Adya Vats practice",
      width: 1600,
      height: 900,
    } satisfies SiteImageSource,
    aboutTitle: "About Dr. Adya Vats",
    aboutIntro:
      "Hi, I’m Dr. Adya Vats.\nA space where you can come as you are.\n\nWith 5 years of experience, I believe therapy begins with acknowledging what you’re going through, understanding yourself with greater compassion, and finding a way forward with clarity and self-awareness.\n\nMy work is trauma-informed, compassionate, and tailored to you — helping you navigate life’s challenges, understand your patterns, and create meaningful change.\n\nYou don’t have to figure it out alone. Together, we’ll take it one step at a time.",
    portrait: {
      src: "/images/dr-adya-portrait.jpg",
      alt: "Portrait of Dr. Adya Vats, Psychologist and Trauma-Informed Therapist",
      width: 400,
      height: 400,
    } satisfies SiteImageSource,
    servicesTitle: "Services",
    servicesIntro:
      "Tailored, compassionate care blending evidence-based psychology with holistic healing tools, workshops, and clinical mentorship.",
    sessionsTitle: "Session Options",
    sessionsIntro:
      "Choose a focused 30-minute session, an in-depth 60-minute therapy space, or couples counseling tailored to your immediate needs.",
    bookingTitle: "Book a session",
    bookingText:
      "Take the first step toward self-compassion and mental clarity. Choose a session and reserve your time.",
    reviewsTitle: "Client Reviews",
    reviewsIntro:
      "Real experiences and heartfelt feedback from individuals Dr. Adya has supported on their healing journeys.",
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
      slug: "individual-psychotherapy",
      title: "Individual Psychotherapy",
      shortDescription:
        "Personalized, trauma-informed therapy to help you understand what you’re experiencing, work through challenges, and move forward with clarity and self-compassion.",
      longDescription:
        "Feeling overwhelmed, stuck, or unsure where to begin? You’re in the right place. Personalized, trauma-informed therapy to help you understand what you’re experiencing, work through challenges, and move forward with greater clarity and self-compassion. Therapy can offer a space to pause, reflect, understand your patterns, and work towards meaningful change at your own pace.\n\nApproaches may include: CBT • REBT • Gestalt • Mindfulness • Hypnotherapy • Art Therapy • Graphology • Trauma-informed approaches.\n\nSession Options: 30-minute session (₹1,000) • 60-minute session (₹2,000).",
      href: "/sessions",
      linkLabel: "View Session Options",
    },
    {
      slug: "couples-therapy",
      title: "Couples Therapy",
      shortDescription:
        "A supportive space for couples to communicate openly, understand each other better, work through recurring conflict, and build a connected relationship.",
      longDescription:
        "Finding it difficult to communicate, understand each other, or feel connected again? Couples therapy offers a supportive space to communicate openly, understand each other better, work through recurring challenges, and build a healthier, more connected relationship.\n\nThe approach is tailored to the needs of each couple and may include: CBT • REBT • Gestalt • Mindfulness • Hypnotherapy • Art Therapy • Graphology • Trauma-informed approaches.\n\nSession Details: Duration 60–75 minutes • Fee: ₹3,000.",
      href: "/sessions",
      linkLabel: "Book a Couples Session",
    },
    {
      slug: "tarot-card-reading",
      title: "Tarot Card Reading",
      shortDescription:
        "A reflective space to explore your thoughts, emotions, life questions, and possibilities with openness and without judgment.",
      longDescription:
        "Looking for a little clarity, reflection, or a different perspective? Tarot readings can offer a reflective space to explore your thoughts, emotions, questions, and the possibilities you may be considering. Each reading is approached with openness and without judgment, helping you reflect on your present situation and gain a different perspective on what may be unfolding in your life.\n\nAreas explored include: Love & relationships, Career & professional life, Personal growth, Life transitions, Decision-making, Emotional clarity, and General guidance. A space to pause, reflect, and see things from a different perspective.",
      href: "/contact",
      linkLabel: "Book a Tarot Reading",
    },
    {
      slug: "workshops",
      title: "Workshops, Seminars & Institutional Programs",
      shortDescription:
        "Interactive mental health workshops, seminars, and wellbeing programs customized for schools, colleges, educational institutions, and corporate teams.",
      longDescription:
        "Looking to create a healthier, more resilient, and better-functioning environment? I conduct interactive mental health workshops, seminars, and institutional programs for schools, colleges, educational institutions, and corporate teams. Each program is customized according to the needs, concerns, and goals of the institution, making the sessions practical, engaging, and relevant.\n\nFor Schools & Institutions: Mental health awareness, stress and exam anxiety, emotional regulation, building resilience, self-esteem, peer relationships, bullying & healthy boundaries, digital wellbeing, teacher burnout, and supporting student mental health.\n\nFor Corporates: Workplace stress and burnout, work-life balance, emotional wellbeing at work, effective communication, team building, managing difficult emotions, and creating a psychologically healthier workplace.",
      href: "/events",
      linkLabel: "Enquire About a Workshop",
    },
    {
      slug: "supervision",
      title: "Supervision for Budding Psychologists",
      shortDescription:
        "Supportive clinical supervision and practical mentorship for practicing psychologists navigating difficult sessions and therapy room dynamics.",
      longDescription:
        "Starting your practice but unsure how to navigate the therapy room? You may have studied the theories, but starting your own practice brings a completely different set of questions: What do I do when I feel stuck with a client? How do I navigate a difficult session? What if I’m not sure what to do next? How do I feel more confident while taking sessions?\n\nSupervision offers a supportive space where you can bring these concerns and receive practical guidance: navigating difficult sessions, case discussions & therapeutic planning, applying therapeutic approaches in practice, building confidence, structuring therapy sessions, and ethical guidance. You don’t have to navigate your practice alone.",
      href: "/contact",
      linkLabel: "Enquire About Supervision",
    },
    {
      slug: "internships-courses",
      title: "Internships & Courses",
      shortDescription:
        "Hands-on learning, therapeutic approaches, and simulated clinical training for psychology students moving from theory to practice.",
      longDescription:
        "Want to move beyond learning theories and actually understand how to use them in practice? Psychology is more than knowing the theories—it's about understanding how to translate what you learn into the therapy room. Upcoming internships and courses will focus on practical learning, therapeutic approaches, and developing the confidence to apply what you learn in real-world settings.\n\nComing Soon: Internships • Therapy Courses • Practical Training Programs. Learn. Practice. Apply. Grow. Stay tuned for upcoming programs.",
      href: "/contact",
      linkLabel: "Stay Tuned for Programs",
    },
  ] satisfies ServiceListing[],
  about: {
    aboutIntro:
      "Hi, I’m Dr. Adya Vats.\nA space where you can come as you are.\n\nWith 5 years of experience, I believe therapy begins with acknowledging what you’re going through, understanding yourself with greater compassion, and finding a way forward with clarity and self-awareness.\n\nMy work is trauma-informed, compassionate, and tailored to you — helping you navigate life’s challenges, understand your patterns, and create meaningful change.\n\nYou don’t have to figure it out alone. Together, we’ll take it one step at a time.",
    bioParagraphs: [
      "I’m a psychologist who believes that therapy should feel human.",
      "My journey into psychology began from a deeply personal place. At one point in my own life, I struggled with my mental health and did not have the support or guidance I needed. I found myself wanting to understand what I was feeling, why I was feeling it, and how I could better manage my emotions. I also became curious about understanding people around me — their emotions, experiences, and the ways they navigate life.",
      "That curiosity became the beginning of my journey into psychology. I chose psychology after Class 10, wanting to understand the human mind not just academically, but in a way that could eventually help people feel understood and supported.",
      "Over the years, that personal curiosity grew into a professional commitment, supported by over 5 years of professional experience and years of dedicated academic study and research.",
      "I have completed my Ph.D. in Psychology and have worked with 1000+ clients, supporting adolescents and adults through a wide range of emotional, psychological, and personal challenges.",
      "My approach is compassionate, trauma-informed, and tailored to the individual sitting across from me. I work towards creating a space where you can slow down, reflect, understand your experiences, and make sense of the patterns that may be affecting your present.",
      "I believe therapy is not about having all the answers. Sometimes, it begins with having a space where you can finally ask the questions.",
    ],
    professionalWork: [
      "Alongside my private practice, I also work as a School Counsellor, supporting students with their emotional wellbeing, mental health, personal concerns, relationships, academic stress, and overall development. This experience has deepened my understanding of the emotional and psychological needs of adolescents.",
      "I also conduct mental health workshops, seminars, and institutional programs for schools, colleges, educational institutions, and corporate teams, and provide supervision for budding psychologists and practical internships and courses for those looking to develop their skills.",
    ],
    researchIntro:
      "My academic and research work focuses on psychological strengths and wellbeing, with particular interest in resilience, hope, optimism, and attitude towards the future.",
    researchPapers: [
      "“Impact of COVID-19 on Resilience and Attitude towards Future”",
      "“Gender-Based Differences in Resilience and Attitude towards Future among Adolescents”",
      "“Resilience, Hope, and Optimism and Their Role in Shaping Future Orientation Post-Pandemic”",
    ],
    certificationsSummary:
      "I am certified as a CBT & REBT Practitioner, Trauma-Informed Therapist, Hypnotherapist, Art Therapist, Career Counselor, Graphologist, and Tarot Card Reader.",
    certificationsPhilosophy:
      "I believe therapy should never be one-size-fits-all. My work draws from an integrative and flexible approach, adapting to the individual’s needs, concerns, comfort, and goals.",
    concernsSupported: [
      "Anxiety, Stress & Panic",
      "Depression & Low Mood",
      "Self-Doubt & Low Self-Esteem",
      "Emotional Difficulties & Dysregulation",
      "Trauma, Grief & Abuse",
      "Relationship & Communication Challenges",
      "Career Concerns & Life Transitions",
      "Burnout & Workplace Stress",
      "Disordered Eating",
      "Sleep Difficulties",
      "OCD, Overthinking & Anger",
      "Confidence & Adjustment Difficulties",
    ],
    concernsOutro:
      "At the heart of my work is something I learned through my own journey: understanding yourself can be the beginning of changing how you experience your life.\nAnd sometimes, you don’t have to figure it all out alone.",
    approaches: [
      { name: "Cognitive Behavioural Therapy (CBT)", desc: "Identifying and reframing unhelpful thought patterns and behaviors." },
      { name: "Rational Emotive Behaviour Therapy (REBT)", desc: "Transforming irrational beliefs into resilient, self-accepting perspectives." },
      { name: "Gestalt Therapy", desc: "Focusing on present-moment awareness and resolving unfinished emotional experiences." },
      { name: "Mindfulness-Based Approaches", desc: "Cultivating calm, grounding, and non-judgmental awareness of emotions." },
      { name: "Hypnotherapy", desc: "Accessing subconscious pathways for deep emotional release and reprogramming." },
      { name: "Art Therapy", desc: "Using creative expressive mediums to process complex, non-verbal feelings." },
      { name: "Graphology", desc: "Handwriting analysis to reveal subconscious personality patterns and emotional blocks." },
      { name: "Trauma-Informed Approaches", desc: "Creating absolute safety, agency, and paced healing for past emotional wounds." },
      { name: "Emotion-Focused Therapy", desc: "Understanding, accepting, and transforming core emotional experiences." },
    ],
    background:
      "Ph.D. in Psychology. Over 5 years of professional clinical experience and dedicated academic study. School Counsellor, trauma-informed therapist, certified CBT & REBT practitioner, hypnotherapist, and researcher on resilience, hope, and optimism.",
    qualifications: [
      { title: "Ph.D. in Psychology", issuer: "Doctor of Philosophy" },
      { title: "Certified CBT Practitioner", issuer: "Cognitive Behavioral Therapy" },
      { title: "Certified REBT Practitioner", issuer: "Rational Emotive Behavior Therapy" },
      { title: "Trauma-Informed Psychologist & Therapist" },
      { title: "Certified Hypnotherapist" },
      { title: "Certified Art Therapist" },
      { title: "Certified Graphologist", issuer: "Handwriting Analyst" },
      { title: "Career Counselor" },
      { title: "Tarot Card Reader" },
    ] as Qualification[],
    approach:
      "My therapeutic approach is grounded in empathy, safety, and non-judgment. I view every client as the author of their own story, providing the tools, perspective, and compassionate containment needed to navigate emotional distress. Drawing from an integrative and flexible approach, the tools we use are selected and adapted according to your needs, concerns, comfort, and goals.",
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
