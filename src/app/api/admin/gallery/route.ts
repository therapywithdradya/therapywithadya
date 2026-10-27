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
    const image_path = (body.image_path || "").trim();
    if (!image_path) {
      return NextResponse.json({ error: "Image URL or path is required." }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
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
