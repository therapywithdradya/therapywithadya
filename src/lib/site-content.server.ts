import "server-only";

import { cache } from "react";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getSessionBySlug } from "@/lib/booking/session-config";
import {
  DEFAULT_SITE_CONTENT,
  mergeSiteContent,
  type EditableSessionItem,
  type EditableSiteContent,
} from "@/lib/site-content-types";

export const SITE_CONTENT_ROW_ID = "site_content";

const withRequestCache =
  typeof cache === "function"
    ? cache
    : <T extends (...args: never[]) => unknown>(fn: T) => fn;

/**
 * Fetches unified website content from Supabase (`practitioner_profile` rows `'primary'` and `'site_content'`)
 * merged over DEFAULT_SITE_CONTENT. Deduplicated per request with React `cache()`.
 */
export const getSiteContent = withRequestCache(async (): Promise<EditableSiteContent> => {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("practitioner_profile")
      .select("*")
      .in("id", ["primary", SITE_CONTENT_ROW_ID]);

    if (error || !data || data.length === 0) {
      return structuredClone(DEFAULT_SITE_CONTENT);
    }

    const primaryRow = data.find((r) => r.id === "primary");
    const contentRow = data.find((r) => r.id === SITE_CONTENT_ROW_ID);

    let parsedOverride: unknown = undefined;
    if (contentRow?.about_intro) {
      try {
        parsedOverride = JSON.parse(contentRow.about_intro);
      } catch {
        parsedOverride = undefined;
      }
    }

    const merged = mergeSiteContent(DEFAULT_SITE_CONTENT, parsedOverride);

    if (primaryRow) {
      if (primaryRow.name?.trim()) merged.brand.practitionerName = primaryRow.name.trim();
      if (primaryRow.tagline?.trim()) merged.hero.tagline = primaryRow.tagline.trim();
      if (primaryRow.about_title?.trim()) merged.homeSections.aboutTitle = primaryRow.about_title.trim();
      if (primaryRow.about_intro?.trim()) merged.homeSections.aboutIntro = primaryRow.about_intro.trim();
      if (primaryRow.profile_image_url?.trim()) {
        merged.homeSections.portraitUrl = primaryRow.profile_image_url.trim();
      }
      if (primaryRow.hero_image_url?.trim()) {
        merged.hero.imageUrl = primaryRow.hero_image_url.trim();
      }
      if (primaryRow.email !== undefined && primaryRow.email !== null) {
        merged.contact.email = primaryRow.email.trim();
      }
      if (primaryRow.phone !== undefined) {
        merged.contact.phone = primaryRow.phone?.trim() ?? "";
      }
      if (primaryRow.location !== undefined && primaryRow.location !== null) {
        merged.contact.location = primaryRow.location.trim();
      }
    }

    return merged;
  } catch {
    return structuredClone(DEFAULT_SITE_CONTENT);
  }
});

/**
 * Resolves a dynamic session configuration by slug (supporting legacy aliases)
 * for checkout and availability checks, falling back to static session defaults.
 */
export async function resolveDynamicSessionBySlug(
  slug: string,
): Promise<EditableSessionItem | undefined> {
  const normalizedSlug =
    slug === "session-a-60"
      ? "individual-therapy-60"
      : slug === "session-b-90"
        ? "couples-therapy"
        : slug;

  try {
    const content = await getSiteContent();
    const match = content.sessions.find((s) => s.slug === normalizedSlug);
    if (match) {
      return match;
    }
  } catch {
    // Fallback to static session defaults below
  }

  return getSessionBySlug(slug);
}
