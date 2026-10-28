import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export interface GalleryCategoryRecord {
  slug: string;
  label: string;
  sort_order: number;
}

export const DEFAULT_GALLERY_CATEGORIES: GalleryCategoryRecord[] = [
  { slug: "credentials", label: "Credentials & Certifications", sort_order: 1 },
  { slug: "space", label: "Therapy Space & Sanctuary", sort_order: 2 },
  { slug: "workshop", label: "Workshops & Speaking", sort_order: 3 },
  { slug: "modalities", label: "Therapeutic Modalities & Tools", sort_order: 4 },
  { slug: "practice", label: "Clinical Practice", sort_order: 5 },
];

export const CONFIG_ROW_ID = "00000000-0000-0000-0000-000000000099";

/**
 * Fetch ordered categories from database.
 * 1. Tries gallery_categories table
 * 2. If table doesn't exist, reads from the persistent category_config row in gallery_items
 * 3. Falls back to default categories
 */
export async function getPersistedCategories(
  supabase: SupabaseClient<Database>,
): Promise<GalleryCategoryRecord[]> {
  // 1. Try public.gallery_categories
  try {
    const { data: dbData, error } = await supabase
      .from("gallery_categories")
      .select("*")
      .order("sort_order", { ascending: true });

    if (!error && dbData && dbData.length > 0) {
      return dbData.map((c) => ({
        slug: c.slug,
        label: c.label,
        sort_order: c.sort_order,
      }));
    }
  } catch {
    // Continue to fallback
  }

  // 2. Read from category_config row in gallery_items
  try {
    const { data: configRow } = await supabase
      .from("gallery_items")
      .select("caption")
      .eq("id", CONFIG_ROW_ID)
      .maybeSingle();

    if (configRow?.caption) {
      const parsed = JSON.parse(configRow.caption) as GalleryCategoryRecord[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.sort((a, b) => a.sort_order - b.sort_order);
      }
    }
  } catch {
    // Continue to default
  }

  return [...DEFAULT_GALLERY_CATEGORIES];
}

/**
 * Save ordered categories to database.
 * Always saves to category_config row in gallery_items AND tries gallery_categories table.
 */
export async function savePersistedCategories(
  supabase: SupabaseClient<Database>,
  categories: GalleryCategoryRecord[],
): Promise<GalleryCategoryRecord[]> {
  const normalized = categories.map((cat, index) => ({
    slug: cat.slug.toLowerCase().trim(),
    label: cat.label.trim(),
    sort_order: index + 1,
  }));

  // 1. Always save to config row in gallery_items (guaranteed to succeed without migrations)
  try {
    await supabase.from("gallery_items").upsert({
      id: CONFIG_ROW_ID,
      image_path: "config://gallery_categories",
      alt_text: "Gallery categories sequence configuration",
      caption: JSON.stringify(normalized),
      category: "category_config",
      sort_order: 0,
      is_published: false,
    });
  } catch (err) {
    console.error("Failed to write category config row:", err);
  }

  // 2. Also try upserting to gallery_categories table if it exists
  try {
    await supabase.from("gallery_categories").upsert(normalized);
  } catch {
    // Ignore if table not created
  }

  return normalized;
}
