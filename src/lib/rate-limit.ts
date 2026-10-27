import "server-only";

import { createHash } from "node:crypto";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { CheckRateLimitResult } from "@/types/database";

export type RateLimitParams = {
  key: string;
  limit: number;
  windowSeconds: number;
};

/**
 * Checks rate limits via the PostgreSQL `check_rate_limit` stored procedure.
 * Automatically hashes `key` with SHA-256 so it conforms to the DB length constraint.
 */
export async function checkRateLimit({
  key,
  limit,
  windowSeconds,
}: RateLimitParams): Promise<CheckRateLimitResult> {
  const keyHash = createHash("sha256").update(key).digest("hex");
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase.rpc("check_rate_limit", {
    p_key_hash: keyHash,
    p_limit: limit,
    p_window_seconds: windowSeconds,
  });

  if (error || !data) {
    throw new Error(
      `Rate limit check failed: ${error?.message ?? "no data returned"}`,
      { cause: error },
    );
  }

  return data;
}

/**
 * Extracts client IP from standard HTTP forwarding headers.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) {
      return first;
    }
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp?.trim()) {
    return realIp.trim();
  }

  return "127.0.0.1";
}
