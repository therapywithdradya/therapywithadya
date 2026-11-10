import { BookingCta } from "@/components/home/booking-cta";
import { Container } from "@/components/ui/container";
import { Prose } from "@/components/ui/prose";
import { Section } from "@/components/ui/section";
import { SiteImage } from "@/components/ui/SiteImage";
import { filled, site, wordmark } from "@/content/site";
import { marketingMetadata } from "@/lib/page-metadata";

import { getPractitionerProfile } from "@/lib/content";

const pageCopy = site.pages.about;

export const dynamic = "force-dynamic";

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
  const approach = filled(site.about.approach) ? site.about.approach.trim() : undefined;
  const intro = profile.about_intro || (filled(site.about.aboutIntro) ? site.about.aboutIntro.trim() : undefined);
  const professionalWork = site.about.professionalWork;
  const researchPapers = site.about.researchPapers;
  const concernsSupported = site.about.concernsSupported;
  const approaches = site.about.approaches;


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
            <div className="mt-4 max-w-[70ch] space-y-4 text-lead text-muted [overflow-wrap:anywhere]">
              {intro.split(/\n\n+/).map((para, i) => (
                <p key={i}>{para.trim()}</p>
              ))}
            </div>
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
      {professionalWork && professionalWork.length > 0 ? (
        <Section aria-labelledby="about-work-title" background="surface">
          <Container>
            <h2
              id="about-work-title"
              className="font-heading text-heading text-ink [overflow-wrap:anywhere]"
            >
              My Professional Work
            </h2>
            <Prose className="mt-6 max-w-[70ch]">
              <div className="space-y-4">
                {professionalWork.map((para, i) => (
                  <p key={i} className="[overflow-wrap:anywhere]">
                    {para}
                  </p>
                ))}
              </div>
            </Prose>
          </Container>
        </Section>
      ) : null}

      {researchPapers && researchPapers.length > 0 ? (
        <Section aria-labelledby="about-research-title">
          <Container>
            <h2
              id="about-research-title"
              className="font-heading text-heading text-ink [overflow-wrap:anywhere]"
            >
              My Research
            </h2>
            <p className="mt-4 max-w-[70ch] text-muted [overflow-wrap:anywhere]">
              {site.about.researchIntro}
            </p>
            <ul className="mt-6 max-w-[70ch] list-disc space-y-2.5 pl-6 text-muted">
              {researchPapers.map((paper, i) => (
                <li key={i} className="[overflow-wrap:anywhere]">
                  <span className="font-medium text-ink">{paper}</span>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      {concernsSupported && concernsSupported.length > 0 ? (
        <Section aria-labelledby="about-certifications-title" background="surface">
          <Container>
            <h2
              id="about-certifications-title"
              className="font-heading text-heading text-ink [overflow-wrap:anywhere]"
            >
              My Certifications &amp; Approaches
            </h2>
            <p className="mt-4 max-w-[70ch] text-lead text-ink font-medium [overflow-wrap:anywhere]">
              {site.about.certificationsSummary}
            </p>
            <p className="mt-2 max-w-[70ch] text-muted [overflow-wrap:anywhere]">
              {site.about.certificationsPhilosophy}
            </p>
            <div className="mt-8">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
                Concerns &amp; Challenges I Work With
              </h3>
              <div className="mt-4 flex max-w-3xl flex-wrap gap-2.5">
                {concernsSupported.map((concern, i) => (
                  <span
                    key={i}
                    className="rounded-full border border-border bg-background px-3.5 py-1.5 text-xs font-medium text-ink shadow-xs"
                  >
                    {concern}
                  </span>
                ))}
              </div>
            </div>
            <p className="mt-8 max-w-[70ch] text-sm italic text-muted [overflow-wrap:anywhere]">
              {site.about.concernsOutro}
            </p>
          </Container>
        </Section>
      ) : null}

      {approaches && approaches.length > 0 ? (
        <Section aria-labelledby="about-approaches-title">
          <Container>
            <h2
              id="about-approaches-title"
              className="font-heading text-heading text-ink [overflow-wrap:anywhere]"
            >
              My Approaches
            </h2>
            <p className="mt-2 max-w-[70ch] text-muted [overflow-wrap:anywhere]">
              My work draws from an integrative and flexible approach, adapted according to your needs, concerns, comfort, and goals:
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {approaches.map((app, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border bg-surface p-4 shadow-soft"
                >
                  <h3 className="font-heading text-base font-semibold text-ink">
                    {app.name}
                  </h3>
                  <p className="mt-1.5 text-xs text-muted [overflow-wrap:anywhere]">
                    {app.desc}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      {qualifications.length > 0 ? (
        <Section aria-labelledby="about-qualifications-title" background="surface">
          <Container>
            <h2
              id="about-qualifications-title"
              className="font-heading text-heading text-ink [overflow-wrap:anywhere]"
            >
              Qualifications &amp; Credentials
            </h2>
            <ul className="mt-6 max-w-[70ch] list-disc space-y-3 pl-6">
              {qualifications.map((item) => (
                <li key={`${item.title}-${item.issuer ?? ""}`} className="[overflow-wrap:anywhere]">
                  <span className="text-ink font-medium">{item.title}</span>
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
        <Section aria-labelledby="about-approach-title">
          <Container>
            <h2
              id="about-approach-title"
              className="font-heading text-heading text-ink [overflow-wrap:anywhere]"
            >
              Philosophy of Care
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
