import { NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/admin/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function GET(): Promise<Response> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("gallery_items")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ items: data ?? [] });
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
    const supabase = getSupabaseAdmin();

    // Action: Clean up dummy placeholder SVGs from seed.sql and load real practice photos
    if (body.action === "seed_real_photos") {
      // 1. Remove dummy placeholder items from seed.sql
      await supabase
        .from("gallery_items")
        .delete()
        .or("category.eq.placeholder,image_path.like.%placeholders%");

      // 2. Insert real practice photos
      const practicePhotos = [
        {
          image_path: "/images/hero-space.jpg",
          alt_text: "Comfortable and calming therapy space designed for safe, non-judgmental counseling sessions.",
          caption: "A safe, tranquil, and non-judgmental healing space.",
          category: "space",
          sort_order: 1,
          is_published: true,
        },
        {
          image_path: "/images/event-workshop.jpg",
          alt_text: "Interactive mental health and emotional well-being workshop session.",
          caption: "Student and community emotional well-being workshop.",
          category: "workshop",
          sort_order: 2,
          is_published: true,
        },
        {
          image_path: "/images/gallery-art-therapy.jpg",
          alt_text: "Art therapy sketch journal with pastels and graphology handwriting analysis sample.",
          caption: "Expressive art therapy & handwriting analysis tools.",
          category: "modalities",
          sort_order: 3,
          is_published: true,
        },
        {
          image_path: "/images/gallery-workshop.jpg",
          alt_text: "Workshop participants engaged in resilience and communication skills exercises.",
          caption: "Interactive learning and resilience building circle.",
          category: "workshop",
          sort_order: 4,
          is_published: true,
        },
      ];

      await supabase.from("gallery_items").insert(practicePhotos);

      const { data: updatedItems } = await supabase
        .from("gallery_items")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      return NextResponse.json({ success: true, items: updatedItems ?? [] });
    }

    // Action: Clean placeholders only
    if (body.action === "clean_placeholders") {
      await supabase
        .from("gallery_items")
        .delete()
        .or("category.eq.placeholder,image_path.like.%placeholders%");

      const { data: updatedItems } = await supabase
        .from("gallery_items")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      return NextResponse.json({ success: true, items: updatedItems ?? [] });
    }

    const image_path = (body.image_path || "").trim();
    if (!image_path) {
      return NextResponse.json({ error: "Image URL or path is required." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("gallery_items")
      .insert({
        image_path,
        alt_text: (body.alt_text || "Dr. Adya Vats gallery photo").trim(),
        caption: body.caption ? body.caption.trim() : null,
        category: body.category ? body.category.trim() : "practice",
        sort_order: Number(body.sort_order) || 0,
        is_published: body.is_published ?? true,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, item: data });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
