import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SiteImage } from "@/components/ui/SiteImage";
import { site, wordmark } from "@/content/site";

export function Hero({ heading }: { heading: ReactNode }) {
  const image = site.home.heroImage;

  return (
    <Section aria-labelledby="home-hero-title">
      <Container className="grid min-w-0 items-center gap-10 lg:grid-cols-2">
        <div className="min-w-0">
          <p className="max-w-full font-heading text-sm font-semibold tracking-[0.18em] text-primary uppercase [overflow-wrap:anywhere]">
            {wordmark()}
          </p>
          <div className="mt-4 min-w-0">{heading}</div>
          <p className="mt-4 max-w-xl text-lead text-muted [overflow-wrap:anywhere]">
            {site.home.support}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button href={site.bookHref} className="w-full sm:w-auto">
              {site.bookLabel}
            </Button>
            <Button href="#sessions" variant="secondary" className="w-full sm:w-auto">
              View session options
            </Button>
          </div>
        </div>
        <SiteImage
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes="(min-width: 1024px) 36rem, 100vw"
          priority
          className="aspect-video w-full rounded-[1.25rem] object-cover shadow-card"
        />
      </Container>
    </Section>
  );
}
