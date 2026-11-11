export type EditableServiceItem = {
  slug: string;
  eyebrow: string;
  title: string;
  hook: string;
  shortDescription: string;
  longDescription: string;
  highlightsTitle?: string;
  highlights?: string[];
  secondaryHighlightsTitle?: string;
  secondaryHighlights?: string[];
  metaNote?: string;
  href?: string;
  linkLabel?: string;
};

export type EditableSessionItem = {
  slug: string;
  name: string;
  description: string;
  approaches?: string;
  whoItFor: string;
  durationMinutes: number;
  durationLabel?: string;
  bufferMinutes: number;
  pricePaise: number;
};

export type EditableApproachItem = {
  name: string;
  desc: string;
};

export type EditableQualificationItem = {
  title: string;
  issuer?: string;
};

export type EditableWorkCard = {
  eyebrow: string;
  description: string;
};

export type EditableCrisisResource = {
  label: string;
  tel: string;
};

export type EditableSiteContent = {
  brand: {
    siteName: string;
    practitionerName: string;
    bookHref: string;
    bookLabel: string;
    clientCount: number;
  };
  contact: {
    email: string;
    phone: string;
    whatsapp: string;
    location: string;
    socials: {
      instagram: string;
      facebook: string;
      youtube: string;
      linkedin: string;
    };
    availabilityHours: string;
  };
  hero: {
    tagline: string;
    support: string;
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
    imageUrl: string;
    imageAlt: string;
  };
  homeSections: {
    aboutEyebrow: string;
    aboutTitle: string;
    aboutIntro: string;
    portraitUrl: string;
    portraitAlt: string;
    aboutLinkLabel: string;
    servicesEyebrow: string;
    servicesTitle: string;
    servicesIntro: string;
    sessionsEyebrow: string;
    sessionsTitle: string;
    sessionsIntro: string;
    sessionsLinkLabel: string;
    bookingTitle: string;
    bookingText: string;
    reviewsEyebrow: string;
    reviewsTitle: string;
    reviewsIntro: string;
    reviewsLinkLabel: string;
    eventsEyebrow: string;
    eventsTitle: string;
    eventsEmpty: string;
    eventsLinkLabel: string;
    galleryEyebrow: string;
    galleryTitle: string;
    galleryEmpty: string;
    galleryLinkLabel: string;
    contactEyebrow: string;
    contactTitle: string;
    contactIntro: string;
  };
  aboutPage: {
    heroBadges: string[];
    biographyEyebrow: string;
    biographyTitle: string;
    bioParagraphs: string[];
    workEyebrow: string;
    workTitle: string;
    workIntro: string;
    professionalWork: EditableWorkCard[];
    researchEyebrow: string;
    researchTitle: string;
    researchIntro: string;
    researchPapers: string[];
    certificationsEyebrow: string;
    certificationsTitle: string;
    certificationsSummary: string;
    certificationsPhilosophy: string;
    concernsHeading: string;
    concernsSupported: string[];
    concernsOutro: string;
    approachesEyebrow: string;
    approachesTitle: string;
    approachesIntro: string;
    approaches: EditableApproachItem[];
    qualificationsEyebrow: string;
    qualificationsTitle: string;
    qualifications: EditableQualificationItem[];
    philosophyEyebrow: string;
    philosophyTitle: string;
    approach: string;
  };
  servicesPage: {
    eyebrow: string;
    title: string;
    description: string;
    intro: string;
    offeringsEyebrow: string;
    offeringsTitle: string;
    offeringsIntro: string;
  };
  services: EditableServiceItem[];
  sessionsPage: {
    eyebrow: string;
    title: string;
    description: string;
    intro: string;
    bookingStepsEyebrow: string;
    bookingStepsTitle: string;
    bookingStepsIntro: string;
    bookingSteps: string[];
    bookPageEyebrow: string;
    bookPageTitle: string;
    bookPageIntro: string;
  };
  sessions: EditableSessionItem[];
  pagesCopy: {
    events: {
      eyebrow: string;
      title: string;
      description: string;
      intro: string;
      upcomingEyebrow: string;
      upcomingTitle: string;
      pastEyebrow: string;
      pastTitle: string;
      ctaEyebrow: string;
      ctaTitle: string;
      ctaText: string;
    };
    gallery: {
      eyebrow: string;
      title: string;
      description: string;
      intro: string;
    };
    reviews: {
      eyebrow: string;
      title: string;
      description: string;
      intro: string;
      listEyebrow: string;
      listTitle: string;
      ctaTitle: string;
      ctaText: string;
    };
    contact: {
      eyebrow: string;
      title: string;
      description: string;
      intro: string;
      cardEyebrow: string;
      cardTitle: string;
      appointmentsEyebrow: string;
      appointmentsTitle: string;
      appointmentsText: string;
      changesEyebrow: string;
      changesTitle: string;
    };
    privacy: {
      title: string;
      description: string;
      intro: string;
    };
    termsAndCancellation: {
      title: string;
      description: string;
      intro: string;
    };
  };
  legalAndSafety: {
    legalLastUpdated: string;
    safetyHeading: string;
    safetyText: string;
    safetyResources: EditableCrisisResource[];
    policies: {
      paymentTerms: string;
      cancellationNoticeHours: number;
      refundSummary: string;
      reschedulingSummary: string;
      minorsSummary: string;
      selfServeCancel: boolean;
      selfServeReschedule: boolean;
      confirmed: boolean;
    };
  };
};

export const DEFAULT_ABOUT_INTRO =
  "Hi, I’m Dr. Adya Vats.\nA space where you can come as you are.\n\nWith 5 years of experience, I believe therapy begins with acknowledging what you’re going through, understanding yourself with greater compassion, and finding a way forward with clarity and self-awareness.\n\nMy work is trauma-informed, compassionate, and tailored to you — helping you navigate life’s challenges, understand your patterns, and create meaningful change.\n\nYou don’t have to figure it out alone. Together, we’ll take it one step at a time.";

export const DEFAULT_SITE_CONTENT: EditableSiteContent = {
  brand: {
    siteName: "Therapy with Dr. Adya",
    practitionerName: "Dr. Adya Vats",
    bookHref: "/book",
    bookLabel: "Book a session",
    clientCount: 1000,
  },
  contact: {
    email: "adyavats13@gmail.com",
    phone: "",
    whatsapp: "",
    location: "Online Sessions (Worldwide) & In-Person by Appointment",
    socials: {
      instagram: "https://www.instagram.com/dr.adya_vats?stkn=MXJ3eXRkZ2tqbjVnMQ%3D%3D&utm_source=qr",
      facebook: "",
      youtube: "",
      linkedin: "",
    },
    availabilityHours: "Monday – Saturday, 10:00 AM – 6:00 PM IST",
  },
  hero: {
    tagline:
      "A safe, compassionate, and trauma-informed space to heal, feel empowered, and connect with your truest self.",
    support:
      "Supporting adolescents and adults through anxiety, stress, depression, self-doubt, trauma, relationship concerns, life transitions, and emotional wellbeing.",
    primaryCtaLabel: "Book a session",
    secondaryCtaLabel: "View session options",
    imageUrl: "/images/hero-space.jpg",
    imageAlt: "Tranquil and welcoming therapy space for Dr. Adya Vats practice",
  },
  homeSections: {
    aboutEyebrow: "About",
    aboutTitle: "About Dr. Adya Vats",
    aboutIntro: DEFAULT_ABOUT_INTRO,
    portraitUrl: "/images/dr-adya-portrait.jpg",
    portraitAlt: "Portrait of Dr. Adya Vats, Psychologist and Trauma-Informed Therapist",
    aboutLinkLabel: "Read more about me",
    servicesEyebrow: "Services",
    servicesTitle: "Services",
    servicesIntro:
      "Tailored, compassionate care blending evidence-based psychology with holistic healing tools, workshops, and clinical mentorship.",
    sessionsEyebrow: "Sessions",
    sessionsTitle: "Session Options",
    sessionsIntro:
      "Choose a focused 30-minute session, an in-depth 60-minute therapy space, or couples counseling tailored to your immediate needs.",
    sessionsLinkLabel: "View full session details",
    bookingTitle: "Book a session",
    bookingText:
      "Take the first step toward self-compassion and mental clarity. Choose a session and reserve your time.",
    reviewsEyebrow: "Reviews",
    reviewsTitle: "Client Reviews",
    reviewsIntro:
      "Real experiences and heartfelt feedback from individuals Dr. Adya has supported on their healing journeys.",
    reviewsLinkLabel: "Read reviews",
    eventsEyebrow: "Events",
    eventsTitle: "Events and workshops",
    eventsEmpty:
      "No upcoming public events right now. Inquire directly for school or corporate bookings.",
    eventsLinkLabel: "View events and workshops",
    galleryEyebrow: "Gallery",
    galleryTitle: "Gallery",
    galleryEmpty: "Moments from wellness sessions, seminars, and learning workshops.",
    galleryLinkLabel: "View the gallery",
    contactEyebrow: "Contact",
    contactTitle: "Contact Dr. Adya",
    contactIntro:
      "Reach out directly for therapy inquiries, institutional workshops, corporate wellness, or clinical supervision.",
  },
  aboutPage: {
    heroBadges: ["5+ Years Experience", "Ph.D. in Psychology"],
    biographyEyebrow: "My Journey",
    biographyTitle: "Biography",
    bioParagraphs: [
      "I’m a psychologist who believes that therapy should feel human.",
      "My journey into psychology began from a deeply personal place. At one point in my own life, I struggled with my mental health and did not have the support or guidance I needed. I found myself wanting to understand what I was feeling, why I was feeling it, and how I could better manage my emotions. I also became curious about understanding people around me — their emotions, experiences, and the ways they navigate life.",
      "That curiosity became the beginning of my journey into psychology. I chose psychology after Class 10, wanting to understand the human mind not just academically, but in a way that could eventually help people feel understood and supported.",
      "Over the years, that personal curiosity grew into a professional commitment, supported by over 5 years of professional experience and years of dedicated academic study and research.",
      "I have completed my Ph.D. in Psychology and have worked with 1000+ clients, supporting adolescents and adults through a wide range of emotional, psychological, and personal challenges.",
      "My approach is compassionate, trauma-informed, and tailored to the individual sitting across from me. I work towards creating a space where you can slow down, reflect, understand your experiences, and make sense of the patterns that may be affecting your present.",
      "I believe therapy is not about having all the answers. Sometimes, it begins with having a space where you can finally ask the questions.",
    ],
    workEyebrow: "Experience",
    workTitle: "My Professional Work",
    workIntro:
      "Supporting students, adults, institutions, and emerging psychologists across clinical and educational settings.",
    professionalWork: [
      {
        eyebrow: "School Counseling & Adolescents",
        description:
          "Alongside my private practice, I also work as a School Counsellor, supporting students with their emotional wellbeing, mental health, personal concerns, relationships, academic stress, and overall development. This experience has deepened my understanding of the emotional and psychological needs of adolescents.",
      },
      {
        eyebrow: "Workshops & Supervision",
        description:
          "I also conduct mental health workshops, seminars, and institutional programs for schools, colleges, educational institutions, and corporate teams, and provide supervision for budding psychologists and practical internships and courses for those looking to develop their skills.",
      },
    ],
    researchEyebrow: "Academic Work",
    researchTitle: "My Research",
    researchIntro:
      "My academic and research work focuses on psychological strengths and wellbeing, with particular interest in resilience, hope, optimism, and attitude towards the future.",
    researchPapers: [
      "“Impact of COVID-19 on Resilience and Attitude towards Future”",
      "“Gender-Based Differences in Resilience and Attitude towards Future among Adolescents”",
      "“Resilience, Hope, and Optimism and Their Role in Shaping Future Orientation Post-Pandemic”",
    ],
    certificationsEyebrow: "Credentials & Focus",
    certificationsTitle: "My Certifications & Areas of Support",
    certificationsSummary:
      "I am certified as a CBT & REBT Practitioner, Trauma-Informed Therapist, Hypnotherapist, Art Therapist, Career Counselor, Graphologist, and Tarot Card Reader.",
    certificationsPhilosophy:
      "I believe therapy should never be one-size-fits-all. My work draws from an integrative and flexible approach, adapting to the individual’s needs, concerns, comfort, and goals.",
    concernsHeading: "Concerns & Challenges I Work With",
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
    approachesEyebrow: "Modalities",
    approachesTitle: "My Approaches",
    approachesIntro:
      "My work draws from an integrative and flexible approach, adapted according to your needs, concerns, comfort, and goals:",
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
    qualificationsEyebrow: "Training",
    qualificationsTitle: "Qualifications & Credentials",
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
    ],
    philosophyEyebrow: "Care Ethos",
    philosophyTitle: "Philosophy of Care",
    approach:
      "My therapeutic approach is grounded in empathy, safety, and non-judgment. I view every client as the author of their own story, providing the tools, perspective, and compassionate containment needed to navigate emotional distress. Drawing from an integrative and flexible approach, the tools we use are selected and adapted according to your needs, concerns, comfort, and goals.",
  },
  servicesPage: {
    eyebrow: "Services & Modalities",
    title: "Services",
    description:
      "Explore psychotherapy services, CBT & REBT counseling, hypnotherapy, art therapy, graphology, workshops, and clinical supervision.",
    intro:
      "A comprehensive range of evidence-based psychological services and specialized modalities designed to support your personal growth and well-being.",
    offeringsEyebrow: "Offerings",
    offeringsTitle: "Tailored psychological support & programs",
    offeringsIntro:
      "Explore one-on-one therapy, couples sessions, intuitive reflection, institutional workshops, and mentorship for practitioners.",
  },
  services: [
    {
      slug: "individual-psychotherapy",
      eyebrow: "01 • Individual Care",
      title: "Individual Psychotherapy",
      hook: "Feeling overwhelmed, stuck, or unsure where to begin? You’re in the right place.",
      shortDescription:
        "Personalized, trauma-informed therapy to help you understand what you’re experiencing, work through challenges, and move forward with clarity and self-compassion.",
      longDescription:
        "Personalized, trauma-informed therapy to help you understand what you’re experiencing, work through challenges, and move forward with greater clarity and self-compassion. Therapy can offer a space to pause, reflect, understand your patterns, and work towards meaningful change at your own pace.",
      highlightsTitle: "Approaches may include",
      highlights: [
        "CBT & REBT",
        "Gestalt Therapy",
        "Mindfulness",
        "Hypnotherapy",
        "Art Therapy",
        "Graphology",
        "Trauma-informed approaches",
      ],
      metaNote: "Session Options: 30-minute session — ₹1,000  •  60-minute session — ₹2,000",
      href: "/sessions",
      linkLabel: "View Session Options",
    },
    {
      slug: "couples-therapy",
      eyebrow: "02 • Relationships",
      title: "Couples Therapy",
      hook: "Finding it difficult to communicate, understand each other, or feel connected again?",
      shortDescription:
        "A supportive space for couples to communicate openly, understand each other better, work through recurring conflict, and build a connected relationship.",
      longDescription:
        "Couples therapy offers a supportive space to communicate openly, understand each other better, work through recurring challenges, and build a healthier, more connected relationship.",
      highlightsTitle: "Tailored approaches may include",
      highlights: [
        "CBT & REBT",
        "Gestalt Therapy",
        "Mindfulness",
        "Hypnotherapy",
        "Art Therapy",
        "Graphology",
        "Trauma-informed approaches",
      ],
      metaNote: "Session Details: Duration 60–75 minutes  •  Fee: ₹3,000",
      href: "/sessions",
      linkLabel: "Book a Couples Session",
    },
    {
      slug: "tarot-card-reading",
      eyebrow: "03 • Intuitive Clarity",
      title: "Tarot Card Reading",
      hook: "Looking for a little clarity, reflection, or a different perspective?",
      shortDescription:
        "A reflective space to explore your thoughts, emotions, life questions, and possibilities with openness and without judgment.",
      longDescription:
        "Tarot readings can offer a reflective space to explore your thoughts, emotions, questions, and the possibilities you may be considering. Each reading is approached with openness and without judgment, helping you reflect on your present situation and gain a different perspective on what may be unfolding in your life.",
      highlightsTitle: "Areas explored include",
      highlights: [
        "Love & relationships",
        "Career & professional life",
        "Personal growth",
        "Life transitions",
        "Decision-making",
        "Emotional clarity",
        "General guidance",
      ],
      metaNote: "A space to pause, reflect, and see things from a different perspective.",
      href: "/contact",
      linkLabel: "Book a Tarot Reading",
    },
    {
      slug: "workshops",
      eyebrow: "04 • Institutional Programs",
      title: "Workshops, Seminars & Institutional Programs",
      hook: "Looking to create a healthier, more resilient, and better-functioning environment?",
      shortDescription:
        "Interactive mental health workshops, seminars, and wellbeing programs customized for schools, colleges, educational institutions, and corporate teams.",
      longDescription:
        "I conduct interactive mental health workshops, seminars, and institutional programs for schools, colleges, educational institutions, and corporate teams. Each program is customized according to the needs, concerns, and goals of the institution, making the sessions practical, engaging, and relevant.",
      highlightsTitle: "For Schools & Educational Institutions",
      highlights: [
        "Mental health awareness",
        "Stress & exam anxiety",
        "Emotional regulation & coping",
        "Building resilience",
        "Self-esteem & confidence",
        "Peer relationships & bullying",
        "Digital wellbeing & screen habits",
        "Teacher wellbeing & burnout",
      ],
      secondaryHighlightsTitle: "For Corporates & Professional Teams",
      secondaryHighlights: [
        "Workplace stress & burnout",
        "Work-life balance & boundaries",
        "Emotional wellbeing at work",
        "Effective communication",
        "Team building & relationships",
        "Focus, productivity & efficiency",
      ],
      metaNote: "Practical awareness. Meaningful conversations. Skills carried beyond the session.",
      href: "/events",
      linkLabel: "Enquire About a Workshop",
    },
    {
      slug: "supervision",
      eyebrow: "05 • Clinical Mentorship",
      title: "Supervision for Budding Psychologists",
      hook: "Starting your practice but unsure how to navigate the therapy room?",
      shortDescription:
        "Supportive clinical supervision and practical mentorship for practicing psychologists navigating difficult sessions and therapy room dynamics.",
      longDescription:
        "You may have studied the theories, but starting your own practice can bring a completely different set of questions. Supervision offers a supportive space where you can bring these concerns and receive practical guidance to navigate your work as a practicing psychologist with clarity and confidence.",
      highlightsTitle: "Supervision supports you with",
      highlights: [
        "Navigating challenging sessions",
        "Moving forward when feeling stuck",
        "Case discussions & planning",
        "Applying approaches in practice",
        "Building therapy room confidence",
        "Structuring client sessions",
        "Professional & ethical guidance",
      ],
      metaNote: "You don’t have to navigate your practice alone.",
      href: "/contact",
      linkLabel: "Enquire About Supervision",
    },
    {
      slug: "internships-courses",
      eyebrow: "06 • Practical Training",
      title: "Internships & Courses",
      hook: "Want to move beyond learning theories and actually understand how to use them in practice?",
      shortDescription:
        "Hands-on learning, therapeutic approaches, and simulated clinical training for psychology students moving from theory to practice.",
      longDescription:
        "Psychology is more than knowing the theories—it’s about understanding how to translate what you learn into the therapy room. Upcoming internships and courses focus on practical learning, therapeutic approaches, and developing the confidence to apply what you learn in real-world settings.",
      highlightsTitle: "Courses may include",
      highlights: [
        "Different therapeutic approaches",
        "Principles behind each therapy",
        "Practical application techniques",
        "Case-based learning",
        "Role plays & simulated sessions",
        "Structuring therapy sessions",
        "Bridging theory & practice",
      ],
      metaNote: "Coming Soon: Internships • Therapy Courses • Practical Training Programs",
      href: "/contact",
      linkLabel: "Stay Tuned for Programs",
    },
  ],
  sessionsPage: {
    eyebrow: "Online Counseling & Therapy",
    title: "Sessions",
    description:
      "Book confidential 30-minute, 60-minute, and couples online therapy sessions with Dr. Adya Vats. Safe, compassionate, and personalized care.",
    intro:
      "Confidential 1-on-1 and couples consultations tailored to your individual needs. Select a session below to book an appointment.",
    bookingStepsEyebrow: "Booking Flow",
    bookingStepsTitle: "How booking works",
    bookingStepsIntro:
      "Reserving a confidential online consultation takes four simple steps.",
    bookingSteps: [
      "Choose a session.",
      "Pick an available time.",
      "Enter your details.",
      "Pay securely to confirm.",
    ],
    bookPageEyebrow: "Appointments & Scheduling",
    bookPageTitle: "Book Your Consultation",
    bookPageIntro:
      "Choose a session format, select a date and time that suits your routine, and confirm your reservation securely.",
  },
  sessions: [
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
  ],
  pagesCopy: {
    events: {
      eyebrow: "Workshops & Programs",
      title: "Events and workshops",
      description:
        "Educational workshops on emotional resilience, school mental health seminars, teacher training, and psychologist supervision.",
      intro:
        "Interactive mental health workshops, institutional seminars, and training programs conducted by Dr. Adya Vats.",
      upcomingEyebrow: "Schedule",
      upcomingTitle: "Upcoming",
      pastEyebrow: "Archive",
      pastTitle: "Past",
      ctaEyebrow: "Institutional Inquiries",
      ctaTitle: "Get in touch",
      ctaText:
        "Interested in organizing a workshop for your school, college, or organization? Reach out to coordinate custom topics and dates.",
    },
    gallery: {
      eyebrow: "Visual Journal",
      title: "Gallery",
      description:
        "Moments from workshops, training sessions, and the healing practice of Dr. Adya Vats.",
      intro:
        "Visual impressions from institutional workshops, student seminars, and wellness spaces.",
    },
    reviews: {
      eyebrow: "Client Reflections",
      title: "Reviews",
      description:
        "Read reflections from clients and workshop attendees who have experienced compassionate guidance and healing with Dr. Adya Vats.",
      intro:
        "Real experiences and heartfelt feedback from individuals and organizations Dr. Adya has supported.",
      listEyebrow: "Testimonials",
      listTitle: "What clients say",
      ctaTitle: "Ready to book?",
      ctaText:
        "Take the first step towards emotional well-being and personal growth. Book your confidential session today.",
    },
    contact: {
      eyebrow: "Get in Touch",
      title: "Contact",
      description:
        "Reach out to Dr. Adya Vats for therapy bookings, corporate seminars, school workshops, or supervision inquiries.",
      intro:
        "Have questions or want to inquire about sessions, workshops, or training? Connect directly via email or social channels.",
      cardEyebrow: "Direct Channels",
      cardTitle: "Reach out to Dr. Adya Vats",
      appointmentsEyebrow: "Appointments & Programs",
      appointmentsTitle: "Ready to schedule a session?",
      appointmentsText:
        "You can reserve 30-minute individual therapy, 60-minute individual therapy, or 60–75 minute couples therapy directly online. For school workshops, corporate seminars, tarot readings, or supervision, write in directly.",
      changesEyebrow: "Booking Support",
      changesTitle: "Cancel or change a booking",
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
  legalAndSafety: {
    legalLastUpdated: "12 October 2026",
    safetyHeading: "Emergency and crisis support",
    safetyText:
      "This practice does not provide crisis or emergency support. If you or someone else is in immediate danger, contact your local emergency number.",
    safetyResources: [
      { label: "Emergency services (India): 112", tel: "112" },
      { label: "Tele-MANAS, national mental health helpline (India): 14416", tel: "14416" },
    ],
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
  },
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Recursively merges partial stored JSON config over DEFAULT_SITE_CONTENT.
 * Arrays are replaced wholesale when non-empty/valid in override so deletions persist.
 */
export function mergeSiteContent(
  base: EditableSiteContent,
  override: unknown,
): EditableSiteContent {
  if (!isPlainObject(override)) {
    return structuredClone(base);
  }

  function mergeObjects(target: unknown, source: unknown): unknown {
    if (Array.isArray(source)) {
      return source;
    }
    if (!isPlainObject(target) || !isPlainObject(source)) {
      return source !== undefined ? source : target;
    }
    const output: Record<string, unknown> = { ...target };
    for (const [key, val] of Object.entries(source)) {
      if (val === undefined) continue;
      if (isPlainObject(val) && isPlainObject(target[key])) {
        output[key] = mergeObjects(target[key], val);
      } else {
        output[key] = val;
      }
    }
    return output;
  }

  return mergeObjects(structuredClone(base), override) as EditableSiteContent;
}

