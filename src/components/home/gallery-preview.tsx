import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { SiteImage } from "@/components/ui/SiteImage";
import { site } from "@/content/site";
import type { GalleryItemRow } from "@/types/database";

const textLinkClass =
  "inline-flex min-h-11 max-w-full items-center rounded-sm font-semibold text-primary underline-offset-4 [overflow-wrap:anywhere] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";

export function GalleryPreview({ items }: { items: GalleryItemRow[] }) {
  const preview = [...items].sort((left, right) => left.sort_order - right.sort_order).slice(0, 6);

  return (
    <Section aria-labelledby="home-gallery-title">
      <Container>
        <SectionHeading id="home-gallery-title" eyebrow="Gallery" title={site.home.galleryTitle} />
        {preview.length === 0 ? (
          <p className="mt-6 text-muted">{site.home.galleryEmpty}</p>
        ) : (
          <ul className="mt-8 grid list-none grid-cols-2 gap-3 p-0 sm:gap-4 lg:grid-cols-3">
            {preview.map((item) => (
              <li key={item.id} className="min-w-0">
                <Link
                  href="/gallery"
                  className="block rounded-[1.25rem] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                >
                  <SiteImage
                    src={item.image_path}
                    alt={item.alt_text}
                    width={1200}
                    height={800}
                    sizes="(min-width: 1024px) 22rem, 50vw"
                    className="aspect-[3/2] w-full rounded-[1.25rem] object-cover shadow-soft"
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}
        <Link href="/gallery" className={`mt-8 ${textLinkClass}`}>
          View the gallery
        </Link>
      </Container>
    </Section>
  );
}
