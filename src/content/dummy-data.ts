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
      display_name: "Dummy Client A",
      quote:
        "[PLACEHOLDER] This is dummy review text for layout only. It is not a real client testimonial.",
      rating: 5,
      is_approved: true,
      sort_order: 1,
      created_at: createdAt,
    },
    {
      id: "11111111-1111-4111-8111-111111111112",
      display_name: "Dummy Client B",
      quote:
        "[PLACEHOLDER] This is dummy review text for layout only. It is not a real client testimonial.",
      rating: 4,
      is_approved: true,
      sort_order: 2,
      created_at: createdAt,
    },
    {
      id: "11111111-1111-4111-8111-111111111113",
      display_name: "Dummy Client C",
      quote:
        "[PLACEHOLDER] This is dummy review text for layout only. It is not a real client testimonial.",
      rating: null,
      is_approved: true,
      sort_order: 3,
      created_at: createdAt,
    },
  ];
}

export function getDummyEventsAndWorkshops(): EventWorkshopRow[] {
  const createdAt = new Date().toISOString();

  return [
    {
      id: "22222222-2222-4222-8222-222222222221",
      slug: "dummy-upcoming-event",
      kind: "event",
      title: "[DUMMY] Upcoming event",
      description: "[DUMMY] Placeholder description. This is not a real event.",
      starts_at: isoFromNow(21),
      ends_at: isoFromNow(21, 2),
      location: null,
      image_path: null,
      is_published: false,
      created_at: createdAt,
    },
    {
      id: "22222222-2222-4222-8222-222222222222",
      slug: "dummy-upcoming-workshop",
      kind: "workshop",
      title: "[DUMMY] Upcoming workshop",
      description: "[DUMMY] Placeholder description. This is not a real workshop.",
      starts_at: isoFromNow(35),
      ends_at: isoFromNow(35, 3),
      location: null,
      image_path: null,
      is_published: false,
      created_at: createdAt,
    },
    {
      id: "22222222-2222-4222-8222-222222222223",
      slug: "dummy-past-event",
      kind: "event",
      title: "[DUMMY] Past event",
      description: "[DUMMY] Placeholder description. This is not a real event.",
      starts_at: isoFromNow(-21),
      ends_at: isoFromNow(-21, 2),
      location: null,
      image_path: null,
      is_published: false,
      created_at: createdAt,
    },
    {
      id: "22222222-2222-4222-8222-222222222224",
      slug: "dummy-past-workshop",
      kind: "workshop",
      title: "[DUMMY] Past workshop",
      description: "[DUMMY] Placeholder description. This is not a real workshop.",
      starts_at: isoFromNow(-40),
      ends_at: isoFromNow(-40, 2),
      location: null,
      image_path: null,
      is_published: false,
      created_at: createdAt,
    },
  ];
}

const galleryAlt = [
  "Placeholder line drawing of an empty chair beside a bright window, dummy gallery image 1.",
  "Placeholder line drawing of an open notebook on a wooden table, dummy gallery image 2.",
  "Placeholder line drawing of a potted plant on a shelf, dummy gallery image 3.",
  "Placeholder line drawing of two ceramic cups on a tray, dummy gallery image 4.",
  "Placeholder line drawing of a quiet hallway with a closed door, dummy gallery image 5.",
  "Placeholder line drawing of folded fabric on a bench, dummy gallery image 6.",
] as const;

export function getDummyGalleryItems(): GalleryItemRow[] {
  const createdAt = new Date().toISOString();

  return galleryAlt.map((altText, index) => {
    const number = index + 1;
    return {
      id: `33333333-3333-4333-8333-33333333333${number}`,
      image_path: `/placeholders/gallery-${number}.svg`,
      alt_text: altText,
      caption: "[DUMMY] Not a real photograph.",
      category: "placeholder",
      sort_order: number,
      is_published: false,
      created_at: createdAt,
    };
  });
}
