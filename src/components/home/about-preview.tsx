import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { SiteImage } from "@/components/ui/SiteImage";
import { site } from "@/content/site";

const textLinkClass =
  "inline-flex min-h-11 max-w-full items-center rounded-sm font-semibold text-primary underline-offset-4 [overflow-wrap:anywhere] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";

export function AboutPreview() {
  const portrait = site.home.portrait;

  return (
    <Section aria-labelledby="home-about-title" background="surface">
      <Container>
        <SectionHeading
          id="home-about-title"
          eyebrow="About"
          title={site.home.aboutTitle}
          className="mx-auto text-center"
        />
        <div className="mx-auto mt-8 grid max-w-4xl items-center gap-8 md:grid-cols-[minmax(0,16rem)_minmax(0,1fr)]">
          <SiteImage
            src={portrait.src}
            alt={portrait.alt}
            width={portrait.width}
            height={portrait.height}
            sizes="(min-width: 768px) 16rem, 100vw"
            className="aspect-[4/5] w-full rounded-[1.25rem] object-cover shadow-card"
          />
          <div className="min-w-0 border-l-2 border-primary pl-5">
            <p className="text-muted [overflow-wrap:anywhere]">{site.home.aboutIntro}</p>
            <Link href="/about" className={`mt-4 ${textLinkClass}`}>
              Read more about me
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
