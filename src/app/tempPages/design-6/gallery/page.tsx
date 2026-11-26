import { GalleryLightbox } from "@/components/gallery/gallery-lightbox";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { SiteImage } from "@/components/ui/SiteImage";
import { getGalleryCategories, getGalleryItems, type PublicGalleryCategory } from "@/lib/content";
import { getSiteContent } from "@/lib/site-content.server";
import type { GalleryItemRow } from "@/types/database";

export const revalidate = 60;

const sectionPastels = [
  "bg-gradient-to-b from-[#EFF7FF] to-[#E6F2FC]",
  "bg-gradient-to-b from-[#FBF7EE] to-[#F5EDE0]",
  "bg-gradient-to-b from-[#EFF8F2] to-[#E3F2E8]",
  "bg-gradient-to-b from-[#FFF5F7] to-[#FCEAF0]",
  "bg-gradient-to-b from-[#F5F2FF] to-[#ECE7FF]",
];

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

  for (const [key, itemsInCat] of categoryMap.entries()) {
    if (!processedKeys.has(key) && itemsInCat.length > 0) {
      result.push({
        category: key,
        label: formatCategoryTitle(key),
        items: itemsInCat,
      });
    }
  }

  if (uncategorised.length > 0) {
    result.push({
      category: "more",
      label: "More photos",
      items: uncategorised,
    });
  }

  return result;
}

export default async function Design6GalleryPage() {
  const [items, categories, content] = await Promise.all([
    getGalleryItems(),
    getGalleryCategories(),
    getSiteContent(),
  ]);
  const copy = content.pagesCopy.gallery;

  if (items.length === 0 && categories.length === 0) {
    return (
      <>
        <section
          aria-labelledby="gallery-page-title"
          className="bg-gradient-to-b from-[#FFFDF2] to-[#F3F1FF] py-section"
        >
          <Container>
            <p className="font-heading text-xs font-semibold tracking-[0.18em] text-indigo-600 uppercase">
              {copy.eyebrow}
            </p>
            <h1
              id="gallery-page-title"
              className="mt-3 font-heading text-display text-slate-900 [overflow-wrap:anywhere]"
            >
              {copy.title}
            </h1>
            <p className="mt-4 max-w-[70ch] text-lead text-slate-600 [overflow-wrap:anywhere]">
              {copy.intro}
            </p>
          </Container>
        </section>
        <section aria-labelledby="gallery-empty-title" className="bg-[#FBF7EE] py-section">
          <Container>
            <h2 id="gallery-empty-title" className="font-heading text-heading text-slate-900">
              Photos
            </h2>
            <p className="mt-6 text-slate-600">No gallery images right now.</p>
          </Container>
        </section>
      </>
    );
  }

  const groups = groupByCategory(items, categories);
  const hasAnyCategory = categories.length > 0 || items.some((item) => item.category);

  return (
    <>
      <section
        aria-labelledby="gallery-page-title"
        className="bg-gradient-to-b from-[#FFFDF2] to-[#F3F1FF] py-section"
      >
        <Container>
          <p className="font-heading text-xs font-semibold tracking-[0.18em] text-indigo-600 uppercase">
            {copy.eyebrow}
          </p>
          <h1
            id="gallery-page-title"
            className="mt-3 font-heading text-display text-slate-900 [overflow-wrap:anywhere]"
          >
            {copy.title}
          </h1>
          <p className="mt-4 max-w-[70ch] text-lead text-slate-600 [overflow-wrap:anywhere]">
            {copy.intro}
          </p>
        </Container>
      </section>

      {groups.map((group, groupIndex) => {
        const sectionId = `gallery-group-${groupIndex}`;
        const isVisuallyHidden = !hasAnyCategory;

        return (
          <section
            key={group.category || "uncategorised"}
            aria-labelledby={sectionId}
            className={`${sectionPastels[groupIndex % sectionPastels.length]} py-section border-t border-indigo-100/70`}
          >
            <Container>
              {isVisuallyHidden ? (
                <h2 id={sectionId} className="sr-only">
                  {group.label}
                </h2>
              ) : (
                <SectionHeading id={sectionId} eyebrow="Collection" title={group.label} />
              )}

              {group.items.length === 0 ? (
                <div className="mt-6 rounded-card border border-dashed border-indigo-200 bg-white/70 p-8 text-center">
                  <p className="text-xs sm:text-sm text-slate-600">
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
                        className="block rounded-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                        aria-label={item.caption ? `${item.alt_text} — ${item.caption}` : item.alt_text}
                      >
                        <SiteImage
                          src={item.image_path}
                          alt={item.alt_text}
                          width={1200}
                          height={800}
                          priority={false}
                          sizes="(min-width: 1024px) 22rem, (min-width: 640px) 44vw, 100vw"
                          className="aspect-[3/2] w-full rounded-card border-2 border-white object-cover shadow-soft"
                        />
                      </a>
                      {item.caption ? (
                        <p className="mt-2 text-sm text-slate-600 [overflow-wrap:anywhere]">
                          {item.caption}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
            </Container>
          </section>
        );
      })}

      <GalleryLightbox items={items} />
    </>
  );
}
