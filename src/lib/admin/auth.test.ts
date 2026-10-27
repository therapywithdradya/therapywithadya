import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { createSignedToken, verifySignedToken, getAdminPassword } from "./auth";

describe("Admin Authentication Service", () => {
  it("generates a signed session token that verifies successfully", () => {
    const token = createSignedToken();
    expect(token).toBeDefined();
    expect(token).toContain(".");

    const isValid = verifySignedToken(token);
    expect(isValid).toBe(true);
  });

  it("rejects tampered session tokens", () => {
    const token = createSignedToken();
    const parts = token.split(".");
    expect(parts.length).toBe(2);
    const payload = parts[0]!;
    const hmac = parts[1]!;
    const tamperedToken = `${payload}.${hmac.slice(0, -2)}xx`;

    const isValid = verifySignedToken(tamperedToken);
    expect(isValid).toBe(false);
  });


  it("rejects malformed session tokens without delimiters", () => {
    expect(verifySignedToken("malformed-token")).toBe(false);
    expect(verifySignedToken("")).toBe(false);
  });

  it("returns configured admin password or default fallback", () => {
    const password = getAdminPassword();
    expect(typeof password).toBe("string");
    expect(password.length).toBeGreaterThan(0);
  });
});
