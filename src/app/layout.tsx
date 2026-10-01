import type { Metadata, Viewport } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/content/site";
import { fontSans, fontSerif } from "@/app/fonts";
import { getMetadataBase } from "@/lib/env.public";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: site.siteName,
    template: `%s | ${site.siteName}`,
  },
  description: site.tagline,
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: site.siteName,
    title: site.siteName,
    description: site.tagline,
    images: [
      {
        url: "/placeholders/og-default.svg",
        width: 1200,
        height: 630,
        alt: "Placeholder image",
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
  themeColor: "#f6f1e8",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-IN"
      data-scroll-behavior="smooth"
      className={`${fontSans.variable} ${fontSerif.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col overflow-x-clip bg-background font-sans text-ink">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-surface focus:px-4 focus:py-3 focus:text-ink focus:shadow-md focus:outline-2 focus:outline-offset-2 focus:outline-focus"
        >
          Skip to main content
        </a>
        <noscript>
          <style>{`#site-navigation{display:flex !important;flex-wrap:wrap;}`}</style>
        </noscript>
        <SiteHeader />
        <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
