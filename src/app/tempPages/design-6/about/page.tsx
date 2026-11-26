import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { SiteImage } from "@/components/ui/SiteImage";
import { filled, site } from "@/content/site";
import { getSiteContent } from "@/lib/site-content.server";
import { Design6BookingCta } from "../components/design6-booking-cta";

export const revalidate = 60;

const BASE = "/tempPages/design-6";

export default async function Design6AboutPage() {
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
      {/* 1. Hero — Soft Yellowish-White to Light Indigo */}
      <section
        aria-labelledby="about-page-title"
        className="bg-gradient-to-b from-[#FFFDF2] via-[#F4F2FF] to-[#EEF6FF] py-section"
      >
        <Container className="grid min-w-0 items-center gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
          <div className="min-w-0">
            <p className="font-heading text-xs font-semibold tracking-[0.18em] text-indigo-600 uppercase">
              {content.brand.siteName}
            </p>
            <h1
              id="about-page-title"
              className="mt-3 max-w-[70ch] font-heading text-display text-slate-900 [overflow-wrap:anywhere]"
            >
              {content.brand.practitionerName}
            </h1>
            {intro ? (
              <div className="mt-6 border-l-2 border-indigo-400 pl-5 space-y-3 text-lead text-slate-600 [overflow-wrap:anywhere]">
                {intro.split(/\n\n+/).map((para, i) => (
                  <p key={i}>{para.trim()}</p>
                ))}
              </div>
            ) : null}
            <div className="mt-6 flex flex-wrap gap-2.5">
              {about.heroBadges.map((badge) => (
                <Badge key={badge} className="bg-white/90 border-indigo-200 text-indigo-700">
                  {badge}
                </Badge>
              ))}
              {clientCount > 0 ? (
                <Badge className="bg-emerald-50 border-emerald-200 text-emerald-700">
                  {clientCount.toLocaleString("en-IN")}+ Clients Supported
                </Badge>
              ) : null}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href={`${BASE}/book`}
                className="inline-flex min-h-11 items-center justify-center rounded-button bg-indigo-500 px-6 font-semibold text-white shadow-xs hover:bg-indigo-600 transition w-full sm:w-auto"
              >
                {content.brand.bookLabel}
              </Link>
              <Link
                href={`${BASE}/services`}
                className="inline-flex min-h-11 items-center justify-center rounded-button border border-indigo-200 bg-white px-6 font-semibold text-indigo-700 shadow-xs hover:bg-indigo-50 transition w-full sm:w-auto"
              >
                Explore Services
              </Link>
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
              className="aspect-[4/5] w-full rounded-[1.25rem] border-4 border-white object-cover shadow-card"
            />
          </div>
        </Container>
      </section>

      {/* 2. Biography — Warm Beige */}
      {paragraphs.length > 0 ? (
        <section
          aria-labelledby="about-biography-title"
          className="bg-gradient-to-b from-[#FBF7EE] to-[#F5EDE0] py-section border-y border-amber-200/60"
        >
          <Container>
            <SectionHeading
              id="about-biography-title"
              eyebrow={about.biographyEyebrow}
              title={about.biographyTitle}
              className="mx-auto text-center"
            />
            <Card className="mx-auto mt-8 max-w-4xl border-amber-200/80 bg-[#FFFDF9] p-6 sm:p-10">
              <div className="space-y-4 leading-relaxed text-slate-600">
                {paragraphs.map((paragraph, index) => {
                  if (index === 0) {
                    return (
                      <p
                        key={index}
                        className="font-heading text-lg font-semibold text-slate-900 [overflow-wrap:anywhere]"
                      >
                        {paragraph}
                      </p>
                    );
                  }
                  if (index === paragraphs.length - 1 && paragraphs.length > 2) {
                    return (
                      <p
                        key={index}
                        className="border-l-2 border-indigo-400 pl-4 pt-1 italic text-slate-800 [overflow-wrap:anywhere]"
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
        </section>
      ) : null}

      {/* 3. Professional Work — Light Sky Blue */}
      {professionalWork.length > 0 ? (
        <section
          aria-labelledby="about-work-title"
          className="bg-gradient-to-b from-[#EFF7FF] to-[#E5F2FC] py-section"
        >
          <Container>
            <SectionHeading
              id="about-work-title"
              eyebrow={about.workEyebrow}
              title={about.workTitle}
              intro={about.workIntro}
            />
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {professionalWork.map((item, i) => (
                <Card key={i} className="flex h-full flex-col border-sky-200/80 bg-white/90 p-6 sm:p-7">
                  <p className="font-heading text-xs font-semibold tracking-[0.16em] text-indigo-600 uppercase">
                    {item.eyebrow}
                  </p>
                  <p className="mt-3 leading-relaxed text-slate-600 [overflow-wrap:anywhere]">
                    {item.description}
                  </p>
                </Card>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {/* 4. Research Papers — Soft Sage Green */}
      {researchPapers.length > 0 ? (
        <section
          aria-labelledby="about-research-title"
          className="bg-gradient-to-b from-[#EFF8F2] to-[#E3F2E8] py-section border-y border-emerald-200/60"
        >
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
                  <Card className="flex h-full flex-col justify-between border-emerald-200/80 bg-white/90 p-6">
                    <span className="font-heading text-xs font-semibold tracking-[0.16em] text-emerald-700 uppercase">
                      Published Study 0{i + 1}
                    </span>
                    <p className="mt-3 font-heading text-base font-semibold leading-snug text-slate-900 [overflow-wrap:anywhere]">
                      {paper}
                    </p>
                  </Card>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      {/* 5. Certifications & Concerns Supported — Blush Pink */}
      {concernsSupported.length > 0 || filled(about.certificationsSummary) ? (
        <section
          aria-labelledby="about-certifications-title"
          className="bg-gradient-to-b from-[#FFF5F7] to-[#FCEAF0] py-section"
        >
          <Container>
            <SectionHeading
              id="about-certifications-title"
              eyebrow={about.certificationsEyebrow}
              title={about.certificationsTitle}
            />
            <Card className="mt-8 border-pink-200/80 bg-white/90 p-6 sm:p-8">
              <p className="text-lead font-medium text-slate-900 [overflow-wrap:anywhere]">
                {about.certificationsSummary}
              </p>
              <p className="mt-3 max-w-[75ch] text-slate-600 [overflow-wrap:anywhere]">
                {about.certificationsPhilosophy}
              </p>
              {concernsSupported.length > 0 ? (
                <div className="mt-8 border-t border-pink-100 pt-6">
                  <h3 className="font-heading text-xs font-semibold tracking-[0.16em] text-pink-700 uppercase">
                    {about.concernsHeading}
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    {concernsSupported.map((concern, i) => (
                      <span
                        key={i}
                        className="rounded-full border border-pink-200 bg-[#FFFDF9] px-3.5 py-1.5 text-xs font-medium text-slate-800 shadow-xs"
                      >
                        {concern}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
              {filled(about.concernsOutro) ? (
                <div className="mt-8 border-l-2 border-indigo-400 pl-4 text-sm italic text-slate-600 space-y-1.5 [overflow-wrap:anywhere]">
                  {about.concernsOutro.split(/\n+/).map((line, i) => (
                    <p key={i}>{line.trim()}</p>
                  ))}
                </div>
              ) : null}
            </Card>
          </Container>
        </section>
      ) : null}

      {/* 6. Approaches — Soft Lavender */}
      {approaches.length > 0 ? (
        <section
          aria-labelledby="about-approaches-title"
          className="bg-gradient-to-b from-[#F5F2FF] to-[#ECE7FF] py-section border-y border-indigo-100"
        >
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
                <Card key={i} className="border-indigo-200/80 bg-white/90 p-5">
                  <h3 className="font-heading text-base font-semibold text-slate-900 [overflow-wrap:anywhere]">
                    {app.name}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 [overflow-wrap:anywhere]">{app.desc}</p>
                </Card>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {/* 7. Qualifications & Philosophy — Light Yellowish-White */}
      {qualifications.length > 0 || approach ? (
        <section
          aria-labelledby="about-qualifications-title"
          className="bg-gradient-to-b from-[#FFFDF2] to-[#FAF3DF] py-section"
        >
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
                        className="rounded-card border border-amber-200/80 bg-white/90 p-4 shadow-soft [overflow-wrap:anywhere]"
                      >
                        <p className="font-heading text-sm font-semibold text-slate-900">{item.title}</p>
                        {filled(item.subtitle) ? (
                          <p className="mt-1 text-xs font-medium text-indigo-600">
                            {item.subtitle.trim()}
                          </p>
                        ) : filled(item.issuer) && item.issuer !== item.title ? (
                          <p className="mt-1 text-xs font-medium text-indigo-600">{item.issuer.trim()}</p>
                        ) : null}
                        {filled(item.description) ? (
                          <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                            {item.description.trim()}
                          </p>
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
                  <Card className="mt-6 border-amber-200/80 bg-white/90 p-6 sm:p-8">
                    <p className="border-l-2 border-indigo-400 pl-5 leading-relaxed text-slate-600 [overflow-wrap:anywhere]">
                      {approach}
                    </p>
                  </Card>
                </div>
              ) : null}
            </div>
          </Container>
        </section>
      ) : null}

      <Design6BookingCta
        headingId="about-booking-title"
        title={content.homeSections.bookingTitle}
        text={content.homeSections.bookingText}
        bookLabel={content.brand.bookLabel}
      />
    </>
  );
}
