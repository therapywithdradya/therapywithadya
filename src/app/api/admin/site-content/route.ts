import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/admin/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import {
  getSiteContent,
  SITE_CONTENT_ROW_ID,
} from "@/lib/site-content.server";
import {
  DEFAULT_SITE_CONTENT,
  mergeSiteContent,
  type EditableSiteContent,
} from "@/lib/site-content-types";

const REVALIDATE_PATHS = [
  "/",
  "/about",
  "/services",
  "/sessions",
  "/events",
  "/gallery",
  "/reviews",
  "/contact",
  "/book",
  "/privacy",
  "/terms-and-cancellation",
] as const;

export async function GET(): Promise<Response> {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const content = await getSiteContent();
    return NextResponse.json({ content });
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
    const body = (await request.json()) as { content?: Partial<EditableSiteContent> };
    if (!body || typeof body !== "object" || !body.content) {
      return NextResponse.json({ error: "Missing site content payload." }, { status: 400 });
    }

    // Merge over defaults + sanitize session pricing/durations
    const merged = mergeSiteContent(DEFAULT_SITE_CONTENT, body.content);
    merged.brand.clientCount = Math.max(0, Math.round(Number(merged.brand.clientCount) || 0));
    merged.legalAndSafety.policies.cancellationNoticeHours = Math.max(
      0,
      Math.round(Number(merged.legalAndSafety.policies.cancellationNoticeHours) || 24),
    );
    merged.sessions = merged.sessions
      .filter((s) => s.slug.trim() && s.name.trim())
      .map((s) => ({
        ...s,
        slug: s.slug
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9-]+/g, "-")
          .replace(/(^-|-$)+/g, ""),
        name: s.name.trim(),
        description: s.description.trim(),
        approaches: s.approaches?.trim() || undefined,
        whoItFor: s.whoItFor.trim(),
        durationLabel: s.durationLabel?.trim() || undefined,
        durationMinutes: Math.max(15, Math.min(240, Math.round(Number(s.durationMinutes) || 60))),
        bufferMinutes: Math.max(0, Math.min(60, Math.round(Number(s.bufferMinutes) || 15))),
        pricePaise: Math.max(100, Math.round(Number(s.pricePaise) || 100000)),
      }));

    if (merged.sessions.length === 0) {
      return NextResponse.json(
        { error: "At least one booking session must remain configured." },
        { status: 400 },
      );
    }

    const session60 = merged.sessions.find((s) => s.slug === "individual-therapy-60");
    const sessionCouples = merged.sessions.find((s) => s.slug === "couples-therapy");

    const nowIso = new Date().toISOString();
    const supabase = getSupabaseAdmin();

    // 1. Save full JSON configuration in 'site_content' sentinel row
    const { error: contentError } = await supabase.from("practitioner_profile").upsert({
      id: SITE_CONTENT_ROW_ID,
      name: "__system_site_content__",
      tagline: "system",
      about_title: "Site Content Configuration",
      about_intro: JSON.stringify(merged),
      profile_image_url: merged.homeSections.portraitUrl,
      hero_image_url: merged.hero.imageUrl,
      email: merged.contact.email,
      phone: merged.contact.phone || null,
      location: merged.contact.location,
      fee_60_min: session60 ? Math.round(session60.pricePaise / 100) : 2000,
      fee_90_min: sessionCouples ? Math.round(sessionCouples.pricePaise / 100) : 3000,
      updated_at: nowIso,
    });

    if (contentError) {
      return NextResponse.json({ error: contentError.message }, { status: 500 });
    }

    // 2. Keep 'primary' row synchronized for legacy profile consumers
    const { error: primaryError } = await supabase.from("practitioner_profile").upsert({
      id: "primary",
      name: merged.brand.practitionerName,
      tagline: merged.hero.tagline,
      about_title: merged.homeSections.aboutTitle,
      about_intro: merged.homeSections.aboutIntro,
      profile_image_url: merged.homeSections.portraitUrl,
      hero_image_url: merged.hero.imageUrl,
      email: merged.contact.email,
      phone: merged.contact.phone || null,
      location: merged.contact.location,
      fee_60_min: session60 ? Math.round(session60.pricePaise / 100) : 2000,
      fee_90_min: sessionCouples ? Math.round(sessionCouples.pricePaise / 100) : 3000,
      updated_at: nowIso,
    });

    if (primaryError) {
      return NextResponse.json({ error: primaryError.message }, { status: 500 });
    }

    revalidatePath("/", "layout");
    for (const path of REVALIDATE_PATHS) {
      revalidatePath(path);
    }

    return NextResponse.json({ success: true, content: merged });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}

