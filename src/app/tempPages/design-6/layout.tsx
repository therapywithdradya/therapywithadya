import type { CSSProperties } from "react";
import { getSiteContent } from "@/lib/site-content.server";
import { Design6Header } from "./components/design6-header";
import { Design6Footer } from "./components/design6-footer";

const design6Tokens = {
  "--background": "#FFFDF7",
  "--surface": "#F3F1FF",
  "--ink": "#1E293B",
  "--muted": "#475569",
  "--primary": "#6366F1",
  "--primary-hover": "#4F46E5",
  "--on-primary": "#FFFFFF",
  "--accent": "#2E8B6E",
  "--border": "#DCE2F2",
  "--focus-ring": "#6366F1",
  "--success": "#15803D",
  "--error": "#B91C1C",
  "--elevation-soft": "0 2px 14px rgb(99 102 241 / 0.07)",
  "--elevation-card": "0 8px 28px rgb(99 102 241 / 0.09)",
  "--elevation-nav": "0 2px 12px rgb(99 102 241 / 0.08)",
} as CSSProperties;

export default async function Design6Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = await getSiteContent();

  return (
    <div
      id="design-6-root"
      style={design6Tokens}
      className="flex min-h-screen flex-col bg-[#FFFDF7] text-[#1E293B] font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900"
    >
      <Design6Header
        siteName={content.brand.siteName}
        bookLabel={content.brand.bookLabel}
      />
      <div className="flex-1">{children}</div>
      <Design6Footer content={content} />
    </div>
  );
}
