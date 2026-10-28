import { NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/admin/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import {
  getPersistedCategories,
  savePersistedCategories,
  type GalleryCategoryRecord,
} from "@/lib/gallery-categories";

export async function GET(): Promise<Response> {
  try {
    const supabase = getSupabaseAdmin();
    const categories = await getPersistedCategories(supabase);

    // Discover any extra categories currently used in gallery_items
    try {
      const { data: items } = await supabase.from("gallery_items").select("category");
      if (items) {
        const existingSlugs = new Set(categories.map((c) => c.slug.toLowerCase()));
        let nextOrder = categories.reduce((max, c) => Math.max(max, c.sort_order), 0) + 1;

        for (const item of items) {
          const rawCat = (item.category || "").trim().toLowerCase();
          if (
            rawCat &&
            !existingSlugs.has(rawCat) &&
            rawCat !== "placeholder" &&
            rawCat !== "category_config"
          ) {
            const prettyLabel = rawCat
              .replace(/[-_]+/g, " ")
              .replace(/\b\w/g, (char) => char.toUpperCase());

            categories.push({
              slug: rawCat,
              label: prettyLabel,
              sort_order: nextOrder++,
            });
            existingSlugs.add(rawCat);
          }
        }
      }
    } catch {
      // Continue with current categories
    }

    // Sort by sort_order ascending
    categories.sort((a, b) => a.sort_order - b.sort_order);

    return NextResponse.json({ categories });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}

export async function POST(request: Request): Promise<Response> {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const rawLabel = (body.label || "").trim();
    if (!rawLabel) {
      return NextResponse.json({ error: "Category name is required." }, { status: 400 });
    }

    const slug =
      (body.slug || "")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9_-]+/g, "-") ||
      rawLabel.toLowerCase().replace(/[^a-z0-9_-]+/g, "-");

    const supabase = getSupabaseAdmin();
    const current = await getPersistedCategories(supabase);

    // Determine next sort_order (placed at bottom)
    const nextOrder = current.reduce((max, c) => Math.max(max, c.sort_order), 0) + 1;
    const newCategory: GalleryCategoryRecord = {
      slug,
      label: rawLabel,
      sort_order: nextOrder,
    };

    const withoutExisting = current.filter((c) => c.slug !== slug);
    const updated = [...withoutExisting, newCategory];

    await savePersistedCategories(supabase, updated);

    return NextResponse.json({ success: true, category: newCategory, categories: updated });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}

// PUT: Save reordered categories ("Save Format")
export async function PUT(request: Request): Promise<Response> {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const categories = (body.categories || []) as GalleryCategoryRecord[];

    if (!Array.isArray(categories) || categories.length === 0) {
      return NextResponse.json({ error: "Invalid categories list." }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const saved = await savePersistedCategories(supabase, categories);

    return NextResponse.json({ success: true, categories: saved });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}

// PATCH: Rename / Edit Category
export async function PATCH(request: Request): Promise<Response> {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const oldSlug = (body.oldSlug || "").trim().toLowerCase();
    const newLabel = (body.newLabel || "").trim();
    const newSlug =
      (body.newSlug || "")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9_-]+/g, "-") || oldSlug;

    if (!oldSlug || !newLabel) {
      return NextResponse.json(
        { error: "Original category slug and new label are required." },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdmin();
    const current = await getPersistedCategories(supabase);

    const updated = current.map((c) => {
      if (c.slug === oldSlug) {
        return { ...c, slug: newSlug, label: newLabel };
      }
      return c;
    });

    await savePersistedCategories(supabase, updated);

    // Also update all gallery_items in that category to the new slug if slug changed
    if (oldSlug !== newSlug) {
      await supabase
        .from("gallery_items")
        .update({ category: newSlug })
        .eq("category", oldSlug);
    }

    return NextResponse.json({ success: true, slug: newSlug, label: newLabel, categories: updated });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}

// DELETE: Delete category
export async function DELETE(request: Request): Promise<Response> {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const slug = (searchParams.get("slug") || "").trim().toLowerCase();

    if (!slug) {
      return NextResponse.json({ error: "Category slug is required." }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const current = await getPersistedCategories(supabase);
    const updated = current.filter((c) => c.slug !== slug);

    await savePersistedCategories(supabase, updated);

    // Also delete photos belonging to this deleted category
    await supabase.from("gallery_items").delete().eq("category", slug);

    return NextResponse.json({ success: true, deletedSlug: slug, categories: updated });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
