import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("server-only", () => ({}));

const mockRpc = vi.fn();

vi.mock("@/lib/supabase/admin", () => ({
  getSupabaseAdmin: () => ({
    rpc: mockRpc,
  }),
}));

import { createSupabaseBookedProvider } from "./supabase";
import { AvailabilityUnavailableError } from "./types";

describe("createSupabaseBookedProvider", () => {
  beforeEach(() => {
    mockRpc.mockReset();
  });

  it("calls get_booked_ranges with ISO strings and returns ranges", async () => {
    const fakeData = [
      {
        start_at: "2026-11-01T04:30:00.000Z",
        blocked_until: "2026-11-01T05:45:00.000Z",
      },
    ];
    mockRpc.mockResolvedValue({ data: fakeData, error: null });

    const provider = createSupabaseBookedProvider();
    const start = new Date("2026-11-01T00:00:00.000Z");
    const end = new Date("2026-11-02T00:00:00.000Z");

    const result = await provider.getBookedRanges({ start, end });

    expect(mockRpc).toHaveBeenCalledTimes(1);
    const [rpcName, params] = mockRpc.mock.calls[0]!;
    expect(rpcName).toBe("get_booked_ranges");
    expect(params).toEqual({
      p_from: start.toISOString(),
      p_to: end.toISOString(),
    });
    expect(result).toEqual(fakeData);
  });

  it("throws AvailabilityUnavailableError when database returns an error", async () => {
    mockRpc.mockResolvedValue({
      data: null,
      error: { message: "connection timeout" },
    });

    const provider = createSupabaseBookedProvider();
    const start = new Date("2026-11-01T00:00:00.000Z");
    const end = new Date("2026-11-02T00:00:00.000Z");

    await expect(provider.getBookedRanges({ start, end })).rejects.toThrow(
      AvailabilityUnavailableError,
    );
  });

  it("returns empty array if data is null but no error", async () => {
    mockRpc.mockResolvedValue({ data: null, error: null });

    const provider = createSupabaseBookedProvider();
    const start = new Date("2026-11-01T00:00:00.000Z");
    const end = new Date("2026-11-02T00:00:00.000Z");

    const result = await provider.getBookedRanges({ start, end });
    expect(result).toEqual([]);
  });
});
