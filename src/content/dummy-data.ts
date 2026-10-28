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
      id: "11111111-1111-4111-8111-111111111111",
      display_name: "Priya S.",
      quote:
        "Dr. Adya created such a safe and warm space where I never felt judged. Her CBT techniques helped me break out of overthinking spirals and regain trust in myself.",
      rating: 5,
      is_approved: true,
      sort_order: 1,
      created_at: createdAt,
    },
    {
      id: "11111111-1111-4111-8111-111111111112",
      display_name: "Rohan M.",
      quote:
        "I reached out during a period of acute anxiety and work burnout. Dr. Adya's trauma-informed approach and practical coping tools helped me establish clear emotional boundaries.",
      rating: 5,
      is_approved: true,
      sort_order: 2,
      created_at: createdAt,
    },
    {
      id: "11111111-1111-4111-8111-111111111113",
      display_name: "Ananya K.",
      quote:
        "Her empathy and non-judgmental guidance made all the difference. Dr. Adya helped me navigate self-doubt and grief at my own pace. I finally feel aligned with who I am.",
      rating: 5,
      is_approved: true,
      sort_order: 3,
      created_at: createdAt,
    },
    {
      id: "11111111-1111-4111-8111-111111111114",
      display_name: "Kavita D. (School Coordinator)",
      quote:
        "The mental health and resilience workshop Dr. Adya delivered for our educators and students was deeply engaging, compassionate, and full of actionable coping tools.",
      rating: 5,
      is_approved: true,
      sort_order: 4,
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
