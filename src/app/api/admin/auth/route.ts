import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  getAdminPassword,
  createSignedToken,
  isAuthenticatedAdmin,
  COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/admin/auth";

export async function GET(): Promise<Response> {
  const isAuth = await isAuthenticatedAdmin();
  return NextResponse.json({ authenticated: isAuth });
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      password?: string;
      action?: "login" | "logout";
    };

    if (body.action === "logout") {
      const cookieStore = await cookies();
      cookieStore.delete(COOKIE_NAME);
      return NextResponse.json({ success: true, message: "Logged out" });
    }

    const expectedPassword = getAdminPassword();
    if (!body.password || body.password.trim() !== expectedPassword.trim()) {
      return NextResponse.json(
        { error: "invalid_password", message: "Incorrect password. Please try again." },
        { status: 401 },
      );
    }

    const token = createSignedToken();
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: SESSION_MAX_AGE_SECONDS,
    });

    return NextResponse.json({ success: true, message: "Authentication successful" });
  } catch (err) {
    return NextResponse.json(
      { error: "server_error", message: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
