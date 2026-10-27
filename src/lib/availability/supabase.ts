import "server-only";

import { getSupabaseAdmin } from "@/lib/supabase/admin";
import {
  AvailabilityUnavailableError,
  type BookedRangesProvider,
  type Interval,
} from "./types";

/**
 * Creates a BookedRangesProvider backed by the Supabase `get_booked_ranges` stored procedure.
 *
 * Calls `get_booked_ranges` which:
 * 1. Lazily expires stale pending bookings past hold_expires_at.
 * 2. Returns all active [starts_at, blocked_until) intervals for pending & confirmed bookings.
 *
 * Fail-closed: throws AvailabilityUnavailableError on any database or RPC error.
 */
export function createSupabaseBookedProvider(): BookedRangesProvider {
  return {
    async getBookedRanges(range: Interval): Promise<unknown[]> {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase.rpc("get_booked_ranges", {
        p_from: range.start.toISOString(),
        p_to: range.end.toISOString(),
      });

      if (error) {
        throw new AvailabilityUnavailableError(
          `Failed to fetch booked ranges from database: ${error.message}`,
          { cause: error },
        );
      }

      return data ?? [];
    },
  };
}
