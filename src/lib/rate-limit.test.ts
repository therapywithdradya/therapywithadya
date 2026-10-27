import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("server-only", () => ({}));

const mockRpc = vi.fn();

vi.mock("@/lib/supabase/admin", () => ({
  getSupabaseAdmin: () => ({
    rpc: mockRpc,
  }),
}));

import { checkRateLimit, getClientIp } from "./rate-limit";

describe("rate-limit", () => {
  beforeEach(() => {
    mockRpc.mockReset();
  });

  describe("checkRateLimit", () => {
    it("calls supabase.rpc with hashed key and parameters", async () => {
      mockRpc.mockResolvedValue({
        data: { allowed: true, remaining: 29, retry_after_seconds: 0 },
        error: null,
      });

      const result = await checkRateLimit({
        key: "avail:192.168.1.1",
        limit: 30,
        windowSeconds: 300,
      });

      expect(mockRpc).toHaveBeenCalledTimes(1);
      const [rpcName, rpcParams] = mockRpc.mock.calls[0]!;
      expect(rpcName).toBe("check_rate_limit");
      expect(rpcParams.p_limit).toBe(30);
      expect(rpcParams.p_window_seconds).toBe(300);
      expect(rpcParams.p_key_hash).toMatch(/^[0-9a-f]{64}$/);
      expect(result).toEqual({ allowed: true, remaining: 29, retry_after_seconds: 0 });
    });

    it("throws when Supabase returns an error", async () => {
      mockRpc.mockResolvedValue({
        data: null,
        error: { message: "database error" },
      });

      await expect(
        checkRateLimit({ key: "test-key", limit: 10, windowSeconds: 60 }),
      ).rejects.toThrow(/Rate limit check failed/);
    });

    it("throws when Supabase returns null data", async () => {
      mockRpc.mockResolvedValue({
        data: null,
        error: null,
      });

      await expect(
        checkRateLimit({ key: "test-key", limit: 10, windowSeconds: 60 }),
      ).rejects.toThrow(/Rate limit check failed/);
    });
  });

  describe("getClientIp", () => {
    it("prefers x-forwarded-for first IP", () => {
      const req = new Request("https://example.com", {
        headers: {
          "x-forwarded-for": "203.0.113.195, 70.41.3.18, 150.172.238.178",
        },
      });
      expect(getClientIp(req)).toBe("203.0.113.195");
    });

    it("uses x-real-ip if x-forwarded-for is missing", () => {
      const req = new Request("https://example.com", {
        headers: {
          "x-real-ip": "198.51.100.1",
        },
      });
      expect(getClientIp(req)).toBe("198.51.100.1");
    });

    it("falls back to 127.0.0.1 if no IP headers are present", () => {
      const req = new Request("https://example.com");
      expect(getClientIp(req)).toBe("127.0.0.1");
    });
  });
});
