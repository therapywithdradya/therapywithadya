import { GalleryLightbox } from "@/components/gallery/gallery-lightbox";
import { SiteImage } from "@/components/ui/SiteImage";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { site } from "@/content/site";
import { getGalleryItems } from "@/lib/content";
import { marketingMetadata } from "@/lib/page-metadata";
import type { GalleryItemRow } from "@/types/database";

export const dynamic = "force-dynamic";

export const metadata = marketingMetadata({
  title: site.pages.gallery.title,
  description: site.pages.gallery.description,
  path: "/gallery",
});


/** Group gallery items by category. Items without a category go under "More photos". */
function groupByCategory(
  items: GalleryItemRow[],
): { category: string; items: GalleryItemRow[] }[] {
  const hasAnyCategory = items.some((item) => item.category);

  if (!hasAnyCategory) {
    return [{ category: "", items }];
  }

  const groups = new Map<string, GalleryItemRow[]>();
  const uncategorised: GalleryItemRow[] = [];

  for (const item of items) {
    if (item.category) {
      const existing = groups.get(item.category) ?? [];
      existing.push(item);
      groups.set(item.category, existing);
    } else {
      uncategorised.push(item);
    }
  }

  const result: { category: string; items: GalleryItemRow[] }[] = [];
  for (const [cat, catItems] of groups.entries()) {
    result.push({ category: cat, items: catItems });
  }
  if (uncategorised.length > 0) {
    result.push({ category: "More photos", items: uncategorised });
  }

  return result;
}

export default async function GalleryPage() {
  const raw = await getGalleryItems();
  // Sort by sort_order (same as home page).
  const items = [...raw].sort((a, b) => a.sort_order - b.sort_order);

  if (items.length === 0) {
    return (
      <>
        <Section aria-labelledby="gallery-page-title">
          <Container>
            <h1
              id="gallery-page-title"
              className="font-heading text-display text-ink [overflow-wrap:anywhere]"
            >
              {site.pages.gallery.title}
            </h1>
            <p className="mt-4 max-w-[70ch] text-lead text-muted [overflow-wrap:anywhere]">
              {site.pages.gallery.intro}
            </p>
          </Container>
        </Section>
        <Section aria-labelledby="gallery-empty-title" background="surface">
          <Container>
            <h2
              id="gallery-empty-title"
              className="font-heading text-heading text-ink [overflow-wrap:anywhere]"
            >
              Photos
            </h2>
            <p className="mt-6 text-muted">No gallery images right now.</p>
          </Container>
        </Section>
      </>
    );
  }

  const groups = groupByCategory(items);
  const hasAnyCategory = items.some((item) => item.category);

  return (
    <>
      {/* Hero / intro section — one h1 per page */}
      <Section aria-labelledby="gallery-page-title">
        <Container>
          <h1
            id="gallery-page-title"
            className="font-heading text-display text-ink [overflow-wrap:anywhere]"
          >
            {site.pages.gallery.title}
          </h1>
          <p className="mt-4 max-w-[70ch] text-lead text-muted [overflow-wrap:anywhere]">
            {site.pages.gallery.intro}
          </p>
        </Container>
      </Section>

      {groups.map((group, groupIndex) => {
        const sectionId = `gallery-group-${groupIndex}`;
        // When no item has a category, render a single grid with a visually hidden h2.
        const isVisuallyHidden = !hasAnyCategory;

        return (
          <Section
            key={group.category || "uncategorised"}
            aria-labelledby={sectionId}
            background={groupIndex % 2 === 1 ? "surface" : "default"}
          >
            <Container>
              <h2
                id={sectionId}
                className={
                  isVisuallyHidden
                    ? "sr-only"
                    : "font-heading text-heading text-ink [overflow-wrap:anywhere]"
                }
              >
                {group.category || "Photos"}
              </h2>
              <ul
                className="mt-8 grid list-none grid-cols-2 gap-3 p-0 sm:gap-4 lg:grid-cols-3"
                role="list"
              >
                {group.items.map((item) => (
                  <li key={item.id} className="min-w-0">
                    {/*
                     * The thumbnail is wrapped in a link to the full-size image so it works
                     * without JS (progressive enhancement).
                     * The data-lightbox-id attribute lets the GalleryLightbox client component
                     * intercept the click without prop drilling.
                     */}
                    <a
                      href={item.image_path}
                      data-lightbox-id={item.id}
                      className="block rounded-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                      aria-label={item.caption ? `${item.alt_text} — ${item.caption}` : item.alt_text}
                    >
                      <SiteImage
                        src={item.image_path}
                        alt={item.alt_text}
                        width={1200}
                        height={800}
                        priority={false}
                        sizes="(min-width: 1024px) 22rem, (min-width: 640px) 44vw, 100vw"
                        className="aspect-[3/2] w-full rounded-card object-cover shadow-soft"
                      />
                    </a>
                    {item.caption ? (
                      <p className="mt-2 text-sm text-muted [overflow-wrap:anywhere]">
                        {item.caption}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </Container>
          </Section>
        );
      })}

      {/*
       * Client component: upgrades thumbnail links to open the lightbox.
       * Rendered once; it attaches a delegated click listener to the whole document.
       * No JS = links navigate to the full-size file instead.
       */}
      <GalleryLightbox items={items} />
    </>
  );
}
