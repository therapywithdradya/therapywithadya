import { NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/admin/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function GET(): Promise<Response> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("events_workshops")
      .select("*")
      .order("starts_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ events: data ?? [] });
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
    const title = (body.title || "").trim();
    if (!title || !body.starts_at) {
      return NextResponse.json(
        { error: "Title and start date/time are required." },
        { status: 400 },
      );
    }

    const slug =
      (body.slug || "")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") || `event-${Date.now()}`;

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("events_workshops")
      .insert({
        slug,
        title,
        kind: body.kind === "workshop" ? "workshop" : "event",
        description: body.description || "",
        starts_at: new Date(body.starts_at).toISOString(),
        ends_at: body.ends_at ? new Date(body.ends_at).toISOString() : null,
        location: body.location || "Online (Google Meet)",
        image_path: body.image_path || null,
        is_published: body.is_published ?? true,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, event: data });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
