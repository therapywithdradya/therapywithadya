const CACHE_TTL_MS = 30_000;

export type AvailabilityCacheEntry = {
  slots: string[];
  expiresAt: number;
};

const availabilityCache = new Map<string, AvailabilityCacheEntry>();

export function getCachedAvailability(key: string, nowMs = Date.now()): string[] | null {
  const cached = availabilityCache.get(key);
  if (cached && cached.expiresAt > nowMs) {
    return cached.slots;
  }
  return null;
}

export function setCachedAvailability(
  key: string,
  slots: string[],
  nowMs = Date.now(),
): void {
  availabilityCache.set(key, {
    slots,
    expiresAt: nowMs + CACHE_TTL_MS,
  });
}

/** @internal Reset cache — for testing only */
export function _resetAvailabilityCacheForTesting(): void {
  availabilityCache.clear();
}

