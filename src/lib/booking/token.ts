import "server-only";

import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

/** 32 random bytes, base64url. Shown to the customer once. Never store this value. */
export function generateConfirmationToken(): string {
  return randomBytes(32).toString("base64url");
}

/** Lowercase hex SHA-256. This is the only form that may be written to the database. */
export function hashConfirmationToken(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

/**
 * Compare two hex hashes. Length is checked first because timingSafeEqual throws
 * when the buffers differ in length.
 */
export function confirmationTokenHashesEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left, "utf8");
  const rightBuffer = Buffer.from(right, "utf8");
  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }
  return timingSafeEqual(leftBuffer, rightBuffer);
}
