import type { Metadata, Viewport } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/content/site";
import { fontBody, fontHeading } from "@/app/fonts";
import { getMetadataBase } from "@/lib/env.public";
import { getSiteContent } from "@/lib/site-content.server";
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
        url: "/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Therapy with Dr. Adya Vats - Psychologist and Counselor",
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
  themeColor: "#0f1410",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const content = await getSiteContent();

  return (
    <html
      lang="en-IN"
      data-scroll-behavior="smooth"
      className={`${fontBody.variable} ${fontHeading.variable} h-full antialiased`}
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
        <SiteHeader
          siteName={content.brand.siteName}
          bookHref={content.brand.bookHref}
          bookLabel={content.brand.bookLabel}
        />
        <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <SiteFooter content={content} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": ["MedicalBusiness", "Physician", "ProfessionalService"],
              name: content.brand.siteName,
              legalName: `${content.brand.practitionerName} Clinical Psychology Practice`,
              url: "https://www.therapywithdradya.com",
              logo: "https://www.therapywithdradya.com/images/portrait-hero.jpg",
              image: "https://www.therapywithdradya.com/images/portrait-hero.jpg",
              description: content.hero.tagline,
              medicalSpecialty: ["Psychology", "Psychotherapy"],
              email: content.contact.email,
              telephone: content.contact.phone || undefined,
              address: {
                "@type": "PostalAddress",
                addressLocality: "Gurugram",
                addressRegion: "Haryana",
                addressCountry: "IN",
              },
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                  ],
                  opens: "10:00",
                  closes: "18:00",
                },
              ],
              priceRange: `₹${Math.min(...content.sessions.map((s) => Math.round(s.pricePaise / 100)))} - ₹${Math.max(...content.sessions.map((s) => Math.round(s.pricePaise / 100)))}`,
              availableService: content.sessions.map((session) => ({
                "@type": "MedicalTherapy",
                name: session.name,
                description: session.description,
              })),
            }),
          }}
        />
      </body>
    </html>
  );
}
