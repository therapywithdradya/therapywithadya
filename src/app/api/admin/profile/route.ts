import { NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/admin/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function GET(): Promise<Response> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("practitioner_profile")
      .select("*")
      .eq("id", "primary")
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ profile: data });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request): Promise<Response> {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const supabase = getSupabaseAdmin();

    const updatePayload = {
      name: body.name,
      tagline: body.tagline,
      about_title: body.about_title,
      about_intro: body.about_intro,
      profile_image_url: body.profile_image_url,
      hero_image_url: body.hero_image_url,
      email: body.email,
      phone: body.phone ?? null,
      location: body.location,
      fee_60_min: Number(body.fee_60_min) || 1500,
      fee_90_min: Number(body.fee_90_min) || 2500,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("practitioner_profile")
      .upsert({ id: "primary", ...updatePayload })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, profile: data });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
