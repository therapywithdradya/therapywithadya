import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "adya_admin_session";
const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days

function getSecretKey(): string {
  return process.env.CRON_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "adya_internal_secret_fallback_2026";
}

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "adya_admin_2026";
}

/**
 * Creates a cryptographically signed session token.
 */
export function createSignedToken(): string {
  const payload = `admin:${Date.now()}`;
  const hmac = createHmac("sha256", getSecretKey()).update(payload).digest("hex");
  return `${Buffer.from(payload).toString("base64url")}.${hmac}`;
}

/**
 * Verifies a signed session token.
 */
export function verifySignedToken(token: string): boolean {
  if (!token || !token.includes(".")) {
    return false;
  }

  const [encodedPayload, receivedHmac] = token.split(".");
  if (!encodedPayload || !receivedHmac) {
    return false;
  }

  try {
    const payload = Buffer.from(encodedPayload, "base64url").toString("utf8");
    const [role, timestampStr] = payload.split(":");
    if (role !== "admin" || !timestampStr) {
      return false;
    }

    const timestamp = parseInt(timestampStr, 10);
    if (isNaN(timestamp)) {
      return false;
    }

    // Check expiration (7 days)
    const ageSeconds = (Date.now() - timestamp) / 1000;
    if (ageSeconds < 0 || ageSeconds > SESSION_MAX_AGE_SECONDS) {
      return false;
    }

    const expectedHmac = createHmac("sha256", getSecretKey()).update(payload).digest("hex");
    const bufA = Buffer.from(receivedHmac, "hex");
    const bufB = Buffer.from(expectedHmac, "hex");

    if (bufA.length !== bufB.length) {
      return false;
    }

    return timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

/**
 * Checks if current request has a valid admin session.
 */
export async function isAuthenticatedAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME);
  if (!sessionCookie || !sessionCookie.value) {
    return false;
  }
  return verifySignedToken(sessionCookie.value);
}

export { COOKIE_NAME, SESSION_MAX_AGE_SECONDS };
