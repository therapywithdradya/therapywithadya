import "server-only";

import {
  getDummyEventsAndWorkshops,
  getDummyGalleryItems,
  getDummyTestimonials,
} from "@/content/dummy-data";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { sessions } from "@/lib/booking/session-config";
import { site } from "@/content/site";

import type {
  EventWorkshopRow,
  GalleryItemRow,
  PractitionerProfileRow,
  TestimonialRow,
} from "@/types/database";

export type PublicSession = {
  slug: string;
  name: string;
  description: string;
  whoItFor: string;
  durationMinutes: number;
  mode: "online";
  priceLabel: string | null;
};

const unsetFeeLabel = "Fee confirmed at booking";

function formatInrFromPaise(pricePaise: number): string {
  const sign = pricePaise < 0 ? "-" : "";
  const absolute = Math.abs(pricePaise);
  const rupees = Math.trunc(absolute / 100);
  const paise = absolute % 100;
  const grouped = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(rupees);

  return `${sign}₹${grouped}.${String(paise).padStart(2, "0")}`;
}

function priceLabelFor(pricePaise: number): string | null {
  if (!Number.isInteger(pricePaise) || pricePaise <= 0) {
    return unsetFeeLabel;
  }

  return formatInrFromPaise(pricePaise);
}

export async function getSessions(): Promise<PublicSession[]> {
  return sessions.map((session) => ({
    slug: session.slug,
    name: session.name,
    description: session.description,
    whoItFor: session.whoItFor,
    durationMinutes: session.durationMinutes,
    mode: "online",
    priceLabel: priceLabelFor(session.pricePaise),
  }));
}

export async function getPractitionerProfile(): Promise<PractitionerProfileRow> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("practitioner_profile")
      .select("*")
      .eq("id", "primary")
      .maybeSingle();

    if (!error && data) {
      return data;
    }
  } catch {
    // fallback below
  }

  return {
    id: "primary",
    name: site.practitionerName,
    tagline: site.tagline,
    about_title: site.home.aboutTitle,
    about_intro: site.home.aboutIntro,
    profile_image_url: site.home.portrait.src,
    hero_image_url: site.home.heroImage.src,
    email: site.email,
    phone: site.phone || null,
    location: site.location,
    fee_60_min: 1500,
    fee_90_min: 2500,
    updated_at: new Date().toISOString(),
  };
}

export async function getTestimonials(): Promise<TestimonialRow[]> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("is_approved", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      return data;
    }
  } catch {
    // fallback
  }

  return getDummyTestimonials();
}

export async function getEventsAndWorkshops(): Promise<EventWorkshopRow[]> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("events_workshops")
      .select("*")
      .eq("is_published", true)
      .order("starts_at", { ascending: false });

    if (!error && data && data.length > 0) {
      return data;
    }
  } catch {
    // fallback
  }

  return getDummyEventsAndWorkshops();
}

export interface PublicGalleryCategory {
  slug: string;
  label: string;
  sort_order: number;
}

export const DEFAULT_GALLERY_CATEGORIES: PublicGalleryCategory[] = [
  { slug: "space", label: "Therapy Space & Sanctuary", sort_order: 1 },
  { slug: "workshop", label: "Workshops & Speaking", sort_order: 2 },
  { slug: "modalities", label: "Therapeutic Modalities & Tools", sort_order: 3 },
  { slug: "practice", label: "Clinical Practice", sort_order: 4 },
  { slug: "credentials", label: "Credentials & Certifications", sort_order: 5 },
];

export async function getGalleryCategories(): Promise<PublicGalleryCategory[]> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("gallery_categories")
      .select("*")
      .order("sort_order", { ascending: true });

    if (!error && data && data.length > 0) {
      return data.map((c) => ({
        slug: c.slug,
        label: c.label,
        sort_order: c.sort_order,
      }));
    }
  } catch {
    // fallback
  }

  return DEFAULT_GALLERY_CATEGORIES;
}

export async function getGalleryItems(): Promise<GalleryItemRow[]> {
  const defaultItems = getDummyGalleryItems();

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("gallery_items")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (!error && data && data.length > 0) {
      // If database items already contain /images/ practice photos, use them directly
      const hasPracticePhotos = data.some((item) => item.image_path.startsWith("/images/"));
      if (hasPracticePhotos) {
        return data;
      }
      // Keep standard practice photos first, and append newly uploaded photos
      return [...defaultItems, ...data];
    }
  } catch {
    // fallback
  }

  return defaultItems;
}



