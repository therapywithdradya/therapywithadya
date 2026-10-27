import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getCronEnv } from "@/lib/env.server";

function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) {
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

export async function POST(request: Request): Promise<Response> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "unauthorized", message: "Missing or malformed Authorization header" },
      { status: 401, headers: { "Cache-Control": "private, no-store" } },
    );
  }

  const providedSecret = authHeader.slice(7).trim();
  const { CRON_SECRET } = getCronEnv();

  if (!safeCompare(providedSecret, CRON_SECRET)) {
    return NextResponse.json(
      { error: "unauthorized", message: "Invalid cron secret" },
      { status: 401, headers: { "Cache-Control": "private, no-store" } },
    );
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data: expiredCount, error } = await supabase.rpc(
      "expire_stale_pending_bookings",
    );

    if (error) {
      return NextResponse.json(
        { error: "database_error", message: error.message },
        { status: 500, headers: { "Cache-Control": "private, no-store" } },
      );
    }

    return NextResponse.json(
      {
        ok: true,
        expiredCount: typeof expiredCount === "number" ? expiredCount : 0,
      },
      { status: 200, headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (err) {
    return NextResponse.json(
      {
        error: "internal_error",
        message: err instanceof Error ? err.message : String(err),
      },
      { status: 500, headers: { "Cache-Control": "private, no-store" } },
    );
  }
}
