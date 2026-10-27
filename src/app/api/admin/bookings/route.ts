import { NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/admin/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function GET(): Promise<Response> {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("bookings")
      .select(
        "id, customer_name, customer_email, customer_phone, session_name, starts_at, ends_at, timezone, booking_status, payment_status, amount_paise, customer_note, admin_note, created_at, google_event_id",
      )
      .order("starts_at", { ascending: false })
      .limit(100);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ bookings: data ?? [] });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
