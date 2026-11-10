import "server-only";

import type {
  EventWorkshopRow,
  GalleryItemRow,
  TestimonialRow,
} from "@/types/database";

function isoFromNow(days: number, extraHours = 0): string {
  const date = new Date(
    Date.now() + days * 24 * 60 * 60 * 1000 + extraHours * 60 * 60 * 1000,
  );
  return date.toISOString();
}

export function getDummyTestimonials(): TestimonialRow[] {
  const createdAt = new Date().toISOString();

  return [
    {
      id: "11111111-1111-4111-8111-111111111101",
      display_name: "Anonymous",
      quote:
        "Regarding the feedback, I must say I was in the right place when I needed it the most. All your efforts are clearly reflected in my progress, and your ability to deeply understand and listen to someone in need is remarkable. Every session I had with you was very calming at that time, and it helped me a lot in overcoming that phase. I would rate every session 10 on 10. Thank you for helping me and making me believe that I could do it. In short, I would recommend you to anyone without a second thought 💫",
      rating: 5,
      is_approved: true,
      sort_order: 1,
      created_at: createdAt,
    },
    {
      id: "11111111-1111-4111-8111-111111111102",
      display_name: "Anonymous",
      quote:
        "Therapy sessions bahut helpful rahe. Therapist ne meri baat patience aur understanding ke saath suni. Unki guidance se mujhe anxiety aur fear ko better handle karne mein help mili. Sessions comfortable aur supportive feel hote hain. Main emotionally kaafi better feel kar rahi hoon. Highly recommended.",
      rating: 5,
      is_approved: true,
      sort_order: 2,
      created_at: createdAt,
    },
    {
      id: "11111111-1111-4111-8111-111111111103",
      display_name: "Anonymous",
      quote:
        "Adya Vats is an amazing psychologist. She is sensitive, caring and judgement free. She is a good listener. She has great understanding of one’s feelings, she can understand whatever you are feeling. I will strongly recommend her therapy sessions, if you ever feel lonely and unworthy of your life. Please reach out to her. As a patient I have experienced that.",
      rating: 5,
      is_approved: true,
      sort_order: 3,
      created_at: createdAt,
    },
    {
      id: "11111111-1111-4111-8111-111111111104",
      display_name: "Anonymous",
      quote:
        "My experience with Adya Vats has been truly wonderful. I started my sessions with her during one of the most difficult phases of my life, when I was dealing with a lot of emotional pain and personal challenges. She listened to me patiently, understood my feelings without judgment, and helped me feel lighter, calmer, and emotionally stronger. I am especially grateful for her kindness and support when I was facing financial difficulties. She even reduced her fees by half so I could continue my sessions. Thank you, Adya, for your empathy, kindness, and support. You made a real difference in my life.",
      rating: 5,
      is_approved: true,
      sort_order: 4,
      created_at: createdAt,
    },
    {
      id: "11111111-1111-4111-8111-111111111105",
      display_name: "Anonymous",
      quote:
        "I've been seeing Adya for a long time and I can honestly say it's been a life-changing experience. She created a safe, non-judgmental space for me to explore my thoughts, emotions, and concerns. Adya is an exceptional listener, empathetic, and insightful. She helped me identify emotional patterns, gain new perspectives, and develop coping strategies to manage stress, anxiety, and relationships. What I appreciate most is her warm, compassionate, and genuine approach. She is knowledgeable, experienced, and up-to-date with the latest techniques. If you're struggling with mental health issues or simply seeking personal growth, I highly recommend Adya.",
      rating: 5,
      is_approved: true,
      sort_order: 5,
      created_at: createdAt,
    },
    {
      id: "11111111-1111-4111-8111-111111111106",
      display_name: "Anonymous",
      quote:
        "I had an incredible experience with Adya Vats, a highly skilled psychologist and tarot reader. She provided exceptional guidance during a pivotal career decision, helping me weigh the pros and cons of choosing between a high-paying role and one offering better growth opportunities. Her insights were thoughtful, accurate, and deeply resonated with my situation. Adya's empathetic and professional approach made me feel confident and clear-headed about my choice. I highly recommend her to anyone seeking clarity and guidance in life's important decisions.",
      rating: 5,
      is_approved: true,
      sort_order: 6,
      created_at: createdAt,
    },
    {
      id: "11111111-1111-4111-8111-111111111107",
      display_name: "Anonymous",
      quote:
        "It's been a truly transformative experience. I want to express my heartfelt gratitude for your time and unwavering support. Through this journey, I learned to love myself more deeply, forgive others for their shortcomings, and embrace life's challenges with resilience and grace. Thank you once again for being a guiding light on this incredible path of self-discovery. Your support has made all the difference!",
      rating: 5,
      is_approved: true,
      sort_order: 7,
      created_at: createdAt,
    },
    {
      id: "11111111-1111-4111-8111-111111111108",
      display_name: "Anonymous",
      quote:
        "I wanted to take a moment to express my deepest appreciation for the incredible support and guidance you've provided me during our time together. Your unwavering dedication to my well-being has made an immeasurable difference in my life. Your compassionate listening, insightful feedback, and gentle encouragement have helped me navigate through some of the most challenging moments I've faced. Your expertise and professionalism shine through in every session, creating a safe and nurturing space for me to explore and grow. Your commitment to my mental health journey has been truly inspiring, and I am profoundly grateful for your presence in my life. Thank you for being the beacon of light during times of darkness and for empowering me to cultivate resilience and self-understanding. Please know that your work is immensely valued and appreciated. I am forever grateful for your kindness, empathy, and expertise.",
      rating: 5,
      is_approved: true,
      sort_order: 8,
      created_at: createdAt,
    },
  ];
}

export function getDummyEventsAndWorkshops(): EventWorkshopRow[] {
  const createdAt = new Date().toISOString();

  return [
    {
      id: "22222222-2222-4222-8222-222222222221",
      slug: "building-emotional-resilience",
      kind: "workshop",
      title: "Building Emotional Resilience & Conquering Self-Doubt",
      description:
        "An interactive workshop focusing on cognitive reframing, emotional regulation, and nurturing self-compassion for young adults and students.",
      starts_at: isoFromNow(14),
      ends_at: isoFromNow(14, 2),
      location: "Live Interactive via Google Meet / Zoom",
      image_path: "/images/event-workshop.jpg",
      is_published: true,
      created_at: createdAt,
    },
    {
      id: "22222222-2222-4222-8222-222222222222",
      slug: "workplace-stress-regulation",
      kind: "event",
      title: "Workplace Well-Being & Stress Regulation",
      description:
        "A seminar designed for corporate and institutional teams on preventing burnout, interpersonal empathy, and sustainable stress mitigation.",
      starts_at: isoFromNow(28),
      ends_at: isoFromNow(28, 2),
      location: "Online & Institutional Venues",
      image_path: "/images/event-workshop.jpg",
      is_published: true,
      created_at: createdAt,
    },
    {
      id: "22222222-2222-4222-8222-222222222223",
      slug: "educator-mental-health-training",
      kind: "workshop",
      title: "Fostering Student Mental Health: Educator Training",
      description:
        "Specialized training workshop for teachers and school counselors on early emotional support, active listening, and supporting student mental health.",
      starts_at: isoFromNow(-20),
      ends_at: isoFromNow(-20, 2),
      location: "Educational Conference Hall",
      image_path: "/images/event-workshop.jpg",
      is_published: true,
      created_at: createdAt,
    },
    {
      id: "22222222-2222-4222-8222-222222222224",
      slug: "trauma-informed-practice-supervision",
      kind: "workshop",
      title: "Foundations of Trauma-Informed Counseling & Supervision",
      description:
        "Clinical training and supervision seminar for psychology students and budding therapists on ethical therapeutic alliance and client safety.",
      starts_at: isoFromNow(-45),
      ends_at: isoFromNow(-45, 2),
      location: "Department of Psychology Seminar Room",
      image_path: "/images/event-workshop.jpg",
      is_published: true,
      created_at: createdAt,
    },
  ];
}

export function getDummyGalleryItems(): GalleryItemRow[] {
  const createdAt = new Date().toISOString();

  const galleryItemsData = [
    {
      image_path: "/images/dr-adya-portrait.jpg",
      alt_text: "Dr. Adya Vats - Psychologist, Hypnotherapist and Trauma-Informed Counselor.",
      caption: "Dr. Adya Vats, Psychologist & Counselor.",
      category: "practice",
    },
    {
      image_path: "/images/hero-space.jpg",
      alt_text: "Comfortable and calming therapy space designed for safe, non-judgmental counseling sessions.",
      caption: "A safe, tranquil, and non-judgmental healing space.",
      category: "space",
    },
    {
      image_path: "/images/event-workshop.jpg",
      alt_text: "Interactive mental health and emotional well-being workshop session.",
      caption: "Student and community emotional well-being workshop.",
      category: "workshop",
    },
    {
      image_path: "/images/gallery-art-therapy.jpg",
      alt_text: "Art therapy sketch journal with pastels and graphology handwriting analysis sample.",
      caption: "Expressive art therapy & handwriting analysis tools.",
      category: "modalities",
    },
    {
      image_path: "/images/gallery-workshop.jpg",
      alt_text: "Workshop participants engaged in resilience and communication skills exercises.",
      caption: "Interactive learning and resilience building circle.",
      category: "workshop",
    },
    {
      image_path: "/images/hero-space.jpg",
      alt_text: "Mindful consultation room with warm natural light and greenery.",
      caption: "Dedicated environment for self-reflection and healing.",
      category: "space",
    },
  ];

  return galleryItemsData.map((item, index) => {
    const number = index + 1;
    return {
      id: `33333333-3333-4333-8333-33333333333${number}`,
      image_path: item.image_path,
      alt_text: item.alt_text,
      caption: item.caption,
      category: item.category,
      sort_order: number,
      is_published: true,
      created_at: createdAt,
    };
  });
}
