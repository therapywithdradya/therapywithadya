import { BookingCta } from "@/components/home/booking-cta";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { SiteImage } from "@/components/ui/SiteImage";
import { filled, site } from "@/content/site";
import { marketingMetadata } from "@/lib/page-metadata";
import { getSiteContent } from "@/lib/site-content.server";

const pageCopy = site.pages.about;

export const revalidate = 60;

export const metadata = marketingMetadata({
  title: pageCopy.title,
  description: pageCopy.description,
  path: "/about",
});

export default async function AboutPage() {
  const content = await getSiteContent();
  const about = content.aboutPage;
  const paragraphs = about.bioParagraphs.filter((paragraph) => filled(paragraph));
  const portraitSrc = content.homeSections.portraitUrl || site.home.portrait.src;
  const portraitAlt = content.homeSections.portraitAlt || site.home.portrait.alt;
  const qualifications = about.qualifications.filter((item) => filled(item.title));
  const approach = filled(about.approach) ? about.approach.trim() : undefined;
  const intro = content.homeSections.aboutIntro?.trim();
  const professionalWork = about.professionalWork;
  const researchPapers = about.researchPapers;
  const concernsSupported = about.concernsSupported;
  const approaches = about.approaches;
  const clientCount = content.brand.clientCount;

  return (
    <>
      <Section aria-labelledby="about-page-title">
        <Container className="grid min-w-0 items-center gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
          <div className="min-w-0">
            <p className="font-heading text-xs font-semibold tracking-[0.18em] text-primary uppercase">
              {content.brand.siteName}
            </p>
            <h1
              id="about-page-title"
              className="mt-3 max-w-[70ch] font-heading text-display text-ink [overflow-wrap:anywhere]"
            >
              {content.brand.practitionerName}
            </h1>
            {intro ? (
              <div className="mt-6 border-l-2 border-primary pl-5 space-y-3 text-lead text-muted [overflow-wrap:anywhere]">
                {intro.split(/\n\n+/).map((para, i) => (
                  <p key={i}>{para.trim()}</p>
                ))}
              </div>
            ) : null}
            <div className="mt-6 flex flex-wrap gap-2.5">
              {about.heroBadges.map((badge) => (
                <Badge key={badge}>{badge}</Badge>
              ))}
              {clientCount > 0 ? (
                <Badge tone="accent">{clientCount.toLocaleString("en-IN")}+ Clients Supported</Badge>
              ) : null}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button href={content.brand.bookHref} className="w-full sm:w-auto">
                {content.brand.bookLabel}
              </Button>
              <Button href="/services" variant="secondary" className="w-full sm:w-auto">
                Explore Services
              </Button>
            </div>
          </div>

          <div className="mx-auto w-full max-w-sm">
            <SiteImage
              src={portraitSrc}
              alt={portraitAlt}
              width={site.home.portrait.width}
              height={site.home.portrait.height}
              sizes="(min-width: 1024px) 22rem, 100vw"
              priority
              className="aspect-[4/5] w-full rounded-[1.25rem] object-cover shadow-card"
            />
          </div>
        </Container>
      </Section>

      {paragraphs.length > 0 ? (
        <Section aria-labelledby="about-biography-title" background="surface">
          <Container>
            <SectionHeading
              id="about-biography-title"
              eyebrow={about.biographyEyebrow}
              title={about.biographyTitle}
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
                  if (index === paragraphs.length - 1 && paragraphs.length > 2) {
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

      {professionalWork.length > 0 ? (
        <Section aria-labelledby="about-work-title">
          <Container>
            <SectionHeading
              id="about-work-title"
              eyebrow={about.workEyebrow}
              title={about.workTitle}
              intro={about.workIntro}
            />
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {professionalWork.map((item, i) => (
                <Card key={i} className="flex h-full flex-col p-6 sm:p-7">
                  <p className="font-heading text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                    {item.eyebrow}
                  </p>
                  <p className="mt-3 leading-relaxed text-muted [overflow-wrap:anywhere]">
                    {item.description}
                  </p>
                </Card>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      {researchPapers.length > 0 ? (
        <Section aria-labelledby="about-research-title" background="surface">
          <Container>
            <SectionHeading
              id="about-research-title"
              eyebrow={about.researchEyebrow}
              title={about.researchTitle}
              intro={about.researchIntro}
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

      {concernsSupported.length > 0 || filled(about.certificationsSummary) ? (
        <Section aria-labelledby="about-certifications-title">
          <Container>
            <SectionHeading
              id="about-certifications-title"
              eyebrow={about.certificationsEyebrow}
              title={about.certificationsTitle}
            />
            <Card className="mt-8 p-6 sm:p-8">
              <p className="text-lead font-medium text-ink [overflow-wrap:anywhere]">
                {about.certificationsSummary}
              </p>
              <p className="mt-3 max-w-[75ch] text-muted [overflow-wrap:anywhere]">
                {about.certificationsPhilosophy}
              </p>
              {concernsSupported.length > 0 ? (
                <div className="mt-8 border-t border-border/60 pt-6">
                  <h3 className="font-heading text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                    {about.concernsHeading}
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
              ) : null}
              {filled(about.concernsOutro) ? (
                <div className="mt-8 border-l-2 border-primary pl-4 text-sm italic text-muted space-y-1.5 [overflow-wrap:anywhere]">
                  {about.concernsOutro.split(/\n+/).map((line, i) => (
                    <p key={i}>{line.trim()}</p>
                  ))}
                </div>
              ) : null}
            </Card>
          </Container>
        </Section>
      ) : null}

      {approaches.length > 0 ? (
        <Section aria-labelledby="about-approaches-title" background="surface">
          <Container>
            <SectionHeading
              id="about-approaches-title"
              eyebrow={about.approachesEyebrow}
              title={about.approachesTitle}
              intro={about.approachesIntro}
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
                    eyebrow={about.qualificationsEyebrow}
                    title={about.qualificationsTitle}
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
                    eyebrow={about.philosophyEyebrow}
                    title={about.philosophyTitle}
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

      <BookingCta
        headingId="about-booking-title"
        title={content.homeSections.bookingTitle}
        text={content.homeSections.bookingText}
        bookHref={content.brand.bookHref}
        bookLabel={content.brand.bookLabel}
      />
    </>
  );
}
