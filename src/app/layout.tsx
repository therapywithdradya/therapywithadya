import type { Metadata, Viewport } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/content/site";
import { fontBody, fontHeading } from "@/app/fonts";
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

export default function RootLayout({ children }: LayoutProps<"/">) {
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
        <SiteHeader />
        <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <SiteFooter />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": ["MedicalBusiness", "Physician", "ProfessionalService"],
              name: site.siteName,
              legalName: "Dr. Adya Vats Clinical Psychology Practice",
              url: "https://www.therapywithdradya.com",
              logo: "https://www.therapywithdradya.com/images/portrait-hero.jpg",
              image: "https://www.therapywithdradya.com/images/portrait-hero.jpg",
              description: site.tagline,
              medicalSpecialty: ["Psychology", "Psychotherapy"],
              email: site.email,
              telephone: site.phone || undefined,
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
              priceRange: "₹1500 - ₹3500",
              availableService: [
                {
                  "@type": "MedicalTherapy",
                  name: "Individual Psychotherapy",
                  description:
                    "60-minute confidential counseling session addressing anxiety, mood, self-doubt, and life transitions.",
                },
                {
                  "@type": "MedicalTherapy",
                  name: "Integrative Counseling & Modality Session",
                  description:
                    "90-minute session combining CBT, REBT, hypnotherapy, and graphology insights.",
                },
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
