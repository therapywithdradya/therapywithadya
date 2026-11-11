import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { SiteImage } from "@/components/ui/SiteImage";
import { site } from "@/content/site";

const textLinkClass =
  "inline-flex min-h-11 max-w-full items-center rounded-sm font-semibold text-primary underline-offset-4 [overflow-wrap:anywhere] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";

export function AboutPreview({
  eyebrow,
  intro,
  portraitSrc,
  portraitAlt,
  title,
  linkLabel,
}: {
  eyebrow?: string;
  intro?: string;
  portraitSrc?: string;
  portraitAlt?: string;
  title?: string;
  linkLabel?: string;
} = {}) {
  const portrait = site.home.portrait;
  const displaySrc = portraitSrc || portrait.src;
  const displayAlt = portraitAlt || portrait.alt;
  const displayEyebrow = eyebrow || "About";
  const displayTitle = title || site.home.aboutTitle;
  const displayIntro = intro || site.home.aboutIntro;
  const displayLinkLabel = linkLabel || "Read more about me";

  return (
    <Section aria-labelledby="home-about-title" background="surface">
      <Container>
        <SectionHeading
          id="home-about-title"
          eyebrow={displayEyebrow}
          title={displayTitle}
          className="mx-auto text-center"
        />
        <div className="mx-auto mt-8 grid max-w-4xl items-center gap-8 md:grid-cols-[minmax(0,16rem)_minmax(0,1fr)]">
          <SiteImage
            src={displaySrc}
            alt={displayAlt}
            width={portrait.width}
            height={portrait.height}
            sizes="(min-width: 768px) 16rem, 100vw"
            className="aspect-[4/5] w-full rounded-[1.25rem] object-cover shadow-card"
          />
          <div className="min-w-0 border-l-2 border-primary pl-5">
            <div className="space-y-3 text-muted [overflow-wrap:anywhere]">
              {displayIntro.split(/\n\n+/).map((para, i) => (
                <p key={i}>{para.trim()}</p>
              ))}
            </div>
            <Link href="/about" className={`mt-4 ${textLinkClass}`}>
              {displayLinkLabel}
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}

