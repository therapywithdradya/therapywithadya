import { BookingCta } from "@/components/home/booking-cta";
import { Container } from "@/components/ui/container";
import { Prose } from "@/components/ui/prose";
import { Section } from "@/components/ui/section";
import { SiteImage } from "@/components/ui/SiteImage";
import { filled, site, wordmark } from "@/content/site";
import { marketingMetadata } from "@/lib/page-metadata";

import { getPractitionerProfile } from "@/lib/content";

const pageCopy = site.pages.about;

export const metadata = marketingMetadata({
  title: pageCopy.title,
  description: pageCopy.description,
  path: "/about",
});

export default async function AboutPage() {
  const profile = await getPractitionerProfile();
  const paragraphs = site.about.bioParagraphs.filter((paragraph) => filled(paragraph));
  const photos = site.about.aboutPhotos.map((photo, index) =>
    index === 0 && profile.profile_image_url ? { ...photo, src: profile.profile_image_url } : photo,
  );
  const qualifications = site.about.qualifications.filter((item) => filled(item.title));
  const background = filled(site.about.background) ? site.about.background.trim() : undefined;
  const approach = filled(site.about.approach) ? site.about.approach.trim() : undefined;
  const intro = profile.about_intro || (filled(site.about.aboutIntro) ? site.about.aboutIntro.trim() : undefined);


  return (
    <>
      <Section aria-labelledby="about-page-title">
        <Container>
          <h1
            id="about-page-title"
            className="max-w-[70ch] font-heading text-display text-ink [overflow-wrap:anywhere]"
          >
            {wordmark()}
          </h1>
          {intro ? (
            <p className="mt-4 max-w-[70ch] text-lead text-muted [overflow-wrap:anywhere]">{intro}</p>
          ) : null}
        </Container>
      </Section>
      {photos.length > 0 ? (
        <Section aria-labelledby="about-photos-title" background="surface">
          <Container>
            <h2
              id="about-photos-title"
              className="font-heading text-heading text-ink [overflow-wrap:anywhere]"
            >
              Photographs
            </h2>
            <ul className="mt-8 grid list-none gap-6 p-0 sm:grid-cols-2">
              {photos.map((photo, index) => (
                <li key={`${photo.src}-${index}`} className="min-w-0">
                  <SiteImage
                    src={photo.src}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    sizes="(min-width: 640px) 20rem, 100vw"
                    className="aspect-[4/5] w-full max-w-sm rounded-[1.25rem] object-cover shadow-card"
                  />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}
      {paragraphs.length > 0 ? (
        <Section aria-labelledby="about-biography-title">
          <Container>
            <h2
              id="about-biography-title"
              className="font-heading text-heading text-ink [overflow-wrap:anywhere]"
            >
              Biography
            </h2>
            <Prose className="mt-6 max-w-[70ch]">
              <div className="space-y-4">
                {paragraphs.map((paragraph, index) => (
                  <p key={index} className="[overflow-wrap:anywhere]">
                    {paragraph}
                  </p>
                ))}
              </div>
            </Prose>
          </Container>
        </Section>
      ) : null}
      {background ? (
        <Section aria-labelledby="about-background-title" background="surface">
          <Container>
            <h2
              id="about-background-title"
              className="font-heading text-heading text-ink [overflow-wrap:anywhere]"
            >
              Background
            </h2>
            <Prose className="mt-6 max-w-[70ch]">
              <p className="[overflow-wrap:anywhere]">{background}</p>
            </Prose>
          </Container>
        </Section>
      ) : null}
      {qualifications.length > 0 ? (
        <Section aria-labelledby="about-qualifications-title">
          <Container>
            <h2
              id="about-qualifications-title"
              className="font-heading text-heading text-ink [overflow-wrap:anywhere]"
            >
              Qualifications
            </h2>
            <ul className="mt-6 max-w-[70ch] list-disc space-y-3 pl-6">
              {qualifications.map((item) => (
                <li key={`${item.title}-${item.issuer ?? ""}`} className="[overflow-wrap:anywhere]">
                  {item.title}
                  {filled(item.issuer) ? (
                    <span className="text-muted">, {item.issuer.trim()}</span>
                  ) : null}
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}
      {approach ? (
        <Section aria-labelledby="about-approach-title" background="surface">
          <Container>
            <h2
              id="about-approach-title"
              className="font-heading text-heading text-ink [overflow-wrap:anywhere]"
            >
              Approach
            </h2>
            <Prose className="mt-6 max-w-[70ch]">
              <p className="[overflow-wrap:anywhere]">{approach}</p>
            </Prose>
          </Container>
        </Section>
      ) : null}
      <BookingCta headingId="about-booking-title" />
    </>
  );
}
