import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseEnv } from "@/lib/env.server";
import type { Database } from "@/types/database";

/**
 * Service-role client. Created inside the getter so importing this module
 * during `next build` does not require Supabase environment variables.
 * auth persistence is off: this client is not a browser session.
 */
export function getSupabaseAdmin(): SupabaseClient<Database> {
  const env = getSupabaseEnv();
  return createClient<Database>(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
