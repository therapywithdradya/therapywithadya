import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("server-only", () => ({}));

const mockRpc = vi.fn();
vi.mock("@/lib/supabase/admin", () => ({
  getSupabaseAdmin: () => ({
    rpc: mockRpc,
  }),
}));

vi.mock("@/lib/env.server", () => ({
  getCronEnv: () => ({
    CRON_SECRET: "super_secret_cron_key_12345",
  }),
}));

import { POST } from "./route";

describe("POST /api/cron/expire-holds", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("successfully expires holds with valid Bearer secret", async () => {
    mockRpc.mockResolvedValueOnce({
      data: 3,
      error: null,
    });

    const req = new Request("https://example.com/api/cron/expire-holds", {
      method: "POST",
      headers: {
        Authorization: "Bearer super_secret_cron_key_12345",
      },
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.expiredCount).toBe(3);
    expect(mockRpc).toHaveBeenCalledWith("expire_stale_pending_bookings");
  });

  it("returns 401 when Authorization header is missing", async () => {
    const req = new Request("https://example.com/api/cron/expire-holds", {
      method: "POST",
    });

    const res = await POST(req);
    expect(res.status).toBe(401);

    const body = await res.json();
    expect(body.error).toBe("unauthorized");
    expect(mockRpc).not.toHaveBeenCalled();
  });

  it("returns 401 when Authorization secret is incorrect", async () => {
    const req = new Request("https://example.com/api/cron/expire-holds", {
      method: "POST",
      headers: {
        Authorization: "Bearer wrong_secret",
      },
    });

    const res = await POST(req);
    expect(res.status).toBe(401);

    const body = await res.json();
    expect(body.error).toBe("unauthorized");
    expect(mockRpc).not.toHaveBeenCalled();
  });
});
