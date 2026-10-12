import "server-only";

import {
  getDummyEventsAndWorkshops,
  getDummyGalleryItems,
  getDummyTestimonials,
} from "@/content/dummy-data";
import { sessions } from "@/lib/booking/session-config";
import type {
  EventWorkshopRow,
  GalleryItemRow,
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

export async function getTestimonials(): Promise<TestimonialRow[]> {
  // TODO(content-db): Replace this dummy return with a server read of
  // public.testimonials through getSupabaseAdmin() (service role).
  // Never query Supabase from the browser.
  // TODO(approved-filter): approved filtering belongs in this getter —
  // add `.eq('is_approved', true)` when the database read replaces the dummy data.
  return getDummyTestimonials();
}

export async function getEventsAndWorkshops(): Promise<EventWorkshopRow[]> {
  // TODO(content-db): Replace this dummy return with a server read of
  // public.events_workshops through getSupabaseAdmin() (service role).
  // Never query Supabase from the browser.
  // TODO(published-filter): published/approved filtering belongs in this getter —
  // add `.eq('is_published', true)` when the database read replaces the dummy data.
  return getDummyEventsAndWorkshops();
}

export async function getGalleryItems(): Promise<GalleryItemRow[]> {
  // TODO(content-db): Replace this dummy return with a server read of
  // public.gallery_items through getSupabaseAdmin() (service role).
  // Never query Supabase from the browser.
  // TODO(published-filter): published/approved filtering belongs in this getter —
  // add `.eq('is_published', true)` when the database read replaces the dummy data.
  return getDummyGalleryItems();
}
