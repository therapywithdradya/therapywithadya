import { GalleryLightbox } from "@/components/gallery/gallery-lightbox";
import { SiteImage } from "@/components/ui/SiteImage";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { site } from "@/content/site";
import { getGalleryCategories, getGalleryItems, type PublicGalleryCategory } from "@/lib/content";
import { marketingMetadata } from "@/lib/page-metadata";
import type { GalleryItemRow } from "@/types/database";

export const dynamic = "force-dynamic";

export const metadata = marketingMetadata({
  title: site.pages.gallery.title,
  description: site.pages.gallery.description,
  path: "/gallery",
});

function formatCategoryTitle(category: string): string {
  if (!category) return "Photos";
  const normalized = category.trim().toLowerCase();
  const titleMap: Record<string, string> = {
    space: "Therapy Space & Sanctuary",
    workshop: "Workshops & Speaking",
    workshops: "Workshops & Speaking",
    modalities: "Therapeutic Modalities & Tools",
    practice: "Clinical Practice",
    credentials: "Credentials & Certifications",
  };
  return titleMap[normalized] || category.charAt(0).toUpperCase() + category.slice(1);
}

interface GalleryGroup {
  category: string;
  label: string;
  items: GalleryItemRow[];
}

/**
 * Group gallery items by category in the strict order specified by the customized categories list.
 * Items added to preexisting categories will not displace other categories or jump to top.
 */
function groupByCategory(
  items: GalleryItemRow[],
  categories: PublicGalleryCategory[],
): GalleryGroup[] {
  const categoryMap = new Map<string, GalleryItemRow[]>();
  const uncategorised: GalleryItemRow[] = [];

  for (const item of items) {
    if (item.category === "category_config" || item.category === "placeholder") continue;
    if (item.category) {
      const norm = item.category.trim().toLowerCase();
      const unifiedKey = norm === "workshops" ? "workshop" : norm === "practitioner" ? "practice" : norm;
      const existing = categoryMap.get(unifiedKey) ?? [];
      existing.push(item);
      categoryMap.set(unifiedKey, existing);
    } else {
      uncategorised.push(item);
    }
  }

  const result: GalleryGroup[] = [];
  const processedKeys = new Set<string>();

  // 1. Follow the saved category order from database / custom sequence
  for (const cat of categories) {
    const key = cat.slug.toLowerCase();
    const itemsInCat = categoryMap.get(key) ?? [];
    result.push({
      category: cat.slug,
      label: cat.label || formatCategoryTitle(cat.slug),
      items: itemsInCat,
    });
    processedKeys.add(key);
  }

  // 2. Any extra categories present in items not yet in categories list
  for (const [key, itemsInCat] of categoryMap.entries()) {
    if (!processedKeys.has(key) && itemsInCat.length > 0) {
      result.push({
        category: key,
        label: formatCategoryTitle(key),
        items: itemsInCat,
      });
    }
  }

  // 3. Uncategorised items go to "More photos" at the end
  if (uncategorised.length > 0) {
    result.push({
      category: "more",
      label: "More photos",
      items: uncategorised,
    });
  }

  return result;
}

export default async function GalleryPage() {
  const [items, categories] = await Promise.all([
    getGalleryItems(),
    getGalleryCategories(),
  ]);

  if (items.length === 0 && categories.length === 0) {
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

  const groups = groupByCategory(items, categories);
  const hasAnyCategory = categories.length > 0 || items.some((item) => item.category);

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
                {group.label}
              </h2>

              {group.items.length === 0 ? (
                <div className="mt-6 rounded-card border border-dashed border-border/70 bg-surface/40 p-8 text-center">
                  <p className="text-xs sm:text-sm text-muted">
                    Photos for &ldquo;{group.label}&rdquo; will be published soon.
                  </p>
                </div>
              ) : (
                <ul
                  className="mt-8 grid list-none grid-cols-2 gap-3 p-0 sm:gap-4 lg:grid-cols-3"
                  role="list"
                >
                  {group.items.map((item) => (
                    <li key={item.id} className="min-w-0">
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
              )}
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
