/**
 * Public environment. This file must not import server-only.
 * Next.js inlines NEXT_PUBLIC_ variables only when the reference is a static
 * property access, so this reads process.env.NEXT_PUBLIC_SITE_URL directly.
 * Nothing here runs at import time. The build stays valid when the variable
 * is missing; callers fail only when they ask for the URL.
 */

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export function getSiteUrl(): string {
  if (!siteUrl) {
    throw new Error("NEXT_PUBLIC_SITE_URL is not set.");
  }

  let parsed: URL;
  try {
    parsed = new URL(siteUrl);
  } catch {
    throw new Error("NEXT_PUBLIC_SITE_URL is not a valid URL.");
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("NEXT_PUBLIC_SITE_URL must use http or https.");
  }

  return parsed.origin;
}

const localMetadataBase = new URL("http://localhost:3000");

/**
 * Base URL for metadata. Never throws, so a missing variable cannot fail the build.
 * Development falls back to localhost. Production logs a warning and uses the same fallback.
 */
export function getMetadataBase(): URL {
  if (!siteUrl || siteUrl.trim() === "") {
    warnIfProductionSiteUrlUnusable();
    return localMetadataBase;
  }

  try {
    const parsed = new URL(siteUrl);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      warnIfProductionSiteUrlUnusable();
      return localMetadataBase;
    }
    return new URL(parsed.origin);
  } catch {
    warnIfProductionSiteUrlUnusable();
    return localMetadataBase;
  }
}

function warnIfProductionSiteUrlUnusable(): void {
  if (process.env.NODE_ENV !== "production") {
    return;
  }

  console.warn(
    "WARNING: NEXT_PUBLIC_SITE_URL is missing or invalid during a production build or server start. metadataBase is falling back to http://localhost:3000. Set NEXT_PUBLIC_SITE_URL before deploying.",
  );
}
