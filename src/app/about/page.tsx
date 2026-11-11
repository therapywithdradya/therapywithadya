import { BookingCta } from "@/components/home/booking-cta";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { SiteImage } from "@/components/ui/SiteImage";
import { filled, site, visibleClientCount, wordmark } from "@/content/site";
import { getPractitionerProfile } from "@/lib/content";
import { marketingMetadata } from "@/lib/page-metadata";

const pageCopy = site.pages.about;

export const revalidate = 60;

export const metadata = marketingMetadata({
  title: pageCopy.title,
  description: pageCopy.description,
  path: "/about",
});

export default async function AboutPage() {
  const profile = await getPractitionerProfile();
  const paragraphs = site.about.bioParagraphs.filter((paragraph) => filled(paragraph));
  const portraitPhoto = site.about.aboutPhotos[0];
  const portraitSrc = profile.profile_image_url || portraitPhoto?.src || site.home.portrait.src;
  const extraPhotos = site.about.aboutPhotos.slice(1);
  const qualifications = site.about.qualifications.filter((item) => filled(item.title));
  const approach = filled(site.about.approach) ? site.about.approach.trim() : undefined;
  const intro = profile.about_intro || (filled(site.about.aboutIntro) ? site.about.aboutIntro.trim() : undefined);
  const professionalWork = site.about.professionalWork;
  const researchPapers = site.about.researchPapers;
  const concernsSupported = site.about.concernsSupported;
  const approaches = site.about.approaches;
  const clientCount = visibleClientCount();

  return (
    <>
      <Section aria-labelledby="about-page-title">
        <Container className="grid min-w-0 items-center gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
          <div className="min-w-0">
            <p className="font-heading text-xs font-semibold tracking-[0.18em] text-primary uppercase">
              {wordmark()}
            </p>
            <h1
              id="about-page-title"
              className="mt-3 max-w-[70ch] font-heading text-display text-ink [overflow-wrap:anywhere]"
            >
              {site.practitionerName}
            </h1>
            {intro ? (
              <div className="mt-6 border-l-2 border-primary pl-5 space-y-3 text-lead text-muted [overflow-wrap:anywhere]">
                {intro.split(/\n\n+/).map((para, i) => (
                  <p key={i}>{para.trim()}</p>
                ))}
              </div>
            ) : null}
            <div className="mt-6 flex flex-wrap gap-2.5">
              <Badge>5+ Years Experience</Badge>
              <Badge>Ph.D. in Psychology</Badge>
              {clientCount ? (
                <Badge tone="accent">{clientCount.toLocaleString("en-IN")}+ Clients Supported</Badge>
              ) : null}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button href={site.bookHref} className="w-full sm:w-auto">
                {site.bookLabel}
              </Button>
              <Button href="/services" variant="secondary" className="w-full sm:w-auto">
                Explore Services
              </Button>
            </div>
          </div>

          <div className="mx-auto w-full max-w-sm">
            <SiteImage
              src={portraitSrc}
              alt={portraitPhoto?.alt ?? site.home.portrait.alt}
              width={portraitPhoto?.width ?? site.home.portrait.width}
              height={portraitPhoto?.height ?? site.home.portrait.height}
              sizes="(min-width: 1024px) 22rem, 100vw"
              priority
              className="aspect-[4/5] w-full rounded-[1.25rem] object-cover shadow-card"
            />
          </div>
        </Container>
      </Section>

      {extraPhotos.length > 0 ? (
        <Section aria-labelledby="about-photos-title" background="surface">
          <Container>
            <SectionHeading id="about-photos-title" eyebrow="Gallery" title="Photographs" />
            <ul className="mt-8 grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
              {extraPhotos.map((photo, index) => (
                <li key={`${photo.src}-${index}`} className="min-w-0">
                  <SiteImage
                    src={photo.src}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    sizes="(min-width: 640px) 20rem, 100vw"
                    className="aspect-[4/5] w-full rounded-[1.25rem] object-cover shadow-card"
                  />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      {paragraphs.length > 0 ? (
        <Section aria-labelledby="about-biography-title" background="surface">
          <Container>
            <SectionHeading
              id="about-biography-title"
              eyebrow="My Journey"
              title="Biography"
              className="mx-auto text-center"
            />
            <Card className="mx-auto mt-8 max-w-4xl bg-background/70 p-6 sm:p-10">
              <div className="space-y-4 leading-relaxed text-muted">
                {paragraphs.map((paragraph, index) => {
                  if (index === 0) {
                    return (
                      <p
                        key={index}
                        className="font-heading text-lg font-semibold text-ink [overflow-wrap:anywhere]"
                      >
                        {paragraph}
                      </p>
                    );
                  }
                  if (index === paragraphs.length - 1) {
                    return (
                      <p
                        key={index}
                        className="border-l-2 border-primary pl-4 pt-1 italic text-ink [overflow-wrap:anywhere]"
                      >
                        {paragraph}
                      </p>
                    );
                  }
                  return (
                    <p key={index} className="[overflow-wrap:anywhere]">
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            </Card>
          </Container>
        </Section>
      ) : null}

      {professionalWork && professionalWork.length > 0 ? (
        <Section aria-labelledby="about-work-title">
          <Container>
            <SectionHeading
              id="about-work-title"
              eyebrow="Experience"
              title="My Professional Work"
              intro="Supporting students, adults, institutions, and emerging psychologists across clinical and educational settings."
            />
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {professionalWork.map((para, i) => (
                <Card key={i} className="flex h-full flex-col p-6 sm:p-7">
                  <p className="font-heading text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                    {i === 0 ? "School Counseling & Adolescents" : "Workshops & Supervision"}
                  </p>
                  <p className="mt-3 leading-relaxed text-muted [overflow-wrap:anywhere]">{para}</p>
                </Card>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      {researchPapers && researchPapers.length > 0 ? (
        <Section aria-labelledby="about-research-title" background="surface">
          <Container>
            <SectionHeading
              id="about-research-title"
              eyebrow="Academic Work"
              title="My Research"
              intro={site.about.researchIntro}
            />
            <ul className="mt-8 grid list-none gap-6 p-0 md:grid-cols-3">
              {researchPapers.map((paper, i) => (
                <li key={i} className="min-w-0">
                  <Card className="flex h-full flex-col justify-between bg-background/70 p-6">
                    <span className="font-heading text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                      Published Study 0{i + 1}
                    </span>
                    <p className="mt-3 font-heading text-base font-semibold leading-snug text-ink [overflow-wrap:anywhere]">
                      {paper}
                    </p>
                  </Card>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      {concernsSupported && concernsSupported.length > 0 ? (
        <Section aria-labelledby="about-certifications-title">
          <Container>
            <SectionHeading
              id="about-certifications-title"
              eyebrow="Credentials & Focus"
              title="My Certifications & Areas of Support"
            />
            <Card className="mt-8 p-6 sm:p-8">
              <p className="text-lead font-medium text-ink [overflow-wrap:anywhere]">
                {site.about.certificationsSummary}
              </p>
              <p className="mt-3 max-w-[75ch] text-muted [overflow-wrap:anywhere]">
                {site.about.certificationsPhilosophy}
              </p>
              <div className="mt-8 border-t border-border/60 pt-6">
                <h3 className="font-heading text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                  Concerns &amp; Challenges I Work With
                </h3>
                <div className="mt-4 flex flex-wrap gap-2.5">
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
              <div className="mt-8 border-l-2 border-primary pl-4 text-sm italic text-muted space-y-1.5 [overflow-wrap:anywhere]">
                {site.about.concernsOutro.split(/\n+/).map((line, i) => (
                  <p key={i}>{line.trim()}</p>
                ))}
              </div>
            </Card>
          </Container>
        </Section>
      ) : null}

      {approaches && approaches.length > 0 ? (
        <Section aria-labelledby="about-approaches-title" background="surface">
          <Container>
            <SectionHeading
              id="about-approaches-title"
              eyebrow="Modalities"
              title="My Approaches"
              intro="My work draws from an integrative and flexible approach, adapted according to your needs, concerns, comfort, and goals:"
              className="mx-auto text-center"
            />
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {approaches.map((app, i) => (
                <Card key={i} className="bg-background/70 p-5">
                  <h3 className="font-heading text-base font-semibold text-ink [overflow-wrap:anywhere]">
                    {app.name}
                  </h3>
                  <p className="mt-2 text-sm text-muted [overflow-wrap:anywhere]">{app.desc}</p>
                </Card>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      {qualifications.length > 0 || approach ? (
        <Section aria-labelledby="about-qualifications-title">
          <Container>
            <div className="grid gap-8 lg:grid-cols-2">
              {qualifications.length > 0 ? (
                <div>
                  <SectionHeading
                    id="about-qualifications-title"
                    eyebrow="Training"
                    title="Qualifications & Credentials"
                  />
                  <ul className="mt-6 grid list-none gap-3 p-0 sm:grid-cols-2">
                    {qualifications.map((item) => (
                      <li
                        key={`${item.title}-${item.issuer ?? ""}`}
                        className="rounded-card border border-border bg-surface p-4 shadow-soft [overflow-wrap:anywhere]"
                      >
                        <p className="font-heading text-sm font-semibold text-ink">{item.title}</p>
                        {filled(item.issuer) ? (
                          <p className="mt-1 text-xs text-muted">{item.issuer.trim()}</p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {approach ? (
                <div>
                  <SectionHeading
                    id="about-approach-title"
                    eyebrow="Care Ethos"
                    title="Philosophy of Care"
                  />
                  <Card className="mt-6 p-6 sm:p-8">
                    <p className="border-l-2 border-primary pl-5 leading-relaxed text-muted [overflow-wrap:anywhere]">
                      {approach}
                    </p>
                  </Card>
                </div>
              ) : null}
            </div>
          </Container>
        </Section>
      ) : null}

      <BookingCta headingId="about-booking-title" />
    </>
  );
}
