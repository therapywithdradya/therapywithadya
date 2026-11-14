import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SiteImage } from "@/components/ui/SiteImage";
import { site, wordmark } from "@/content/site";

export function Hero({
  heading,
  siteName,
  support,
  primaryCtaLabel,
  secondaryCtaLabel,
  bookHref,
  imageUrl,
  imageAlt,
}: {
  heading: ReactNode;
  siteName?: string;
  support?: string;
  primaryCtaLabel?: string;
  secondaryCtaLabel?: string;
  bookHref?: string;
  imageUrl?: string;
  imageAlt?: string;
}) {
  const image = site.home.heroImage;
  const resolvedBrand = siteName?.trim() || wordmark();
  const resolvedSupport = support ?? site.home.support;
  const resolvedPrimaryLabel = primaryCtaLabel?.trim() || site.bookLabel;
  const resolvedSecondaryLabel = secondaryCtaLabel?.trim() || "View session options";
  const resolvedBookHref = bookHref?.trim() || site.bookHref;
  const resolvedImageUrl = imageUrl?.trim() || image.src;
  const resolvedImageAlt = imageAlt?.trim() || image.alt;

  return (
    <Section aria-labelledby="home-hero-title" className="pt-6 sm:pt-10 lg:pt-12">
      <Container className="grid min-w-0 items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12 xl:gap-16">
        <div className="min-w-0">
          <p className="max-w-full font-heading text-xs sm:text-sm font-semibold tracking-[0.18em] text-primary uppercase [overflow-wrap:anywhere]">
            {resolvedBrand}
          </p>
          <div className="mt-3.5 min-w-0">{heading}</div>
          <p className="mt-4 max-w-xl text-base sm:text-lg leading-relaxed text-muted [overflow-wrap:anywhere]">
            {resolvedSupport}
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button href={resolvedBookHref} className="w-full sm:w-auto">
              {resolvedPrimaryLabel}
            </Button>
            <Button href="#sessions" variant="secondary" className="w-full sm:w-auto">
              {resolvedSecondaryLabel}
            </Button>
          </div>
        </div>
        <div className="relative flex items-center justify-center lg:justify-end">
          <div className="relative w-full">
            <div
              className="absolute -inset-1.5 rounded-[1.75rem] bg-gradient-to-tr from-primary/15 via-primary/5 to-transparent blur-lg opacity-60 pointer-events-none"
              aria-hidden="true"
            />
            <SiteImage
              src={resolvedImageUrl}
              alt={resolvedImageAlt}
              width={image.width}
              height={image.height}
              sizes="(min-width: 1024px) 36rem, 100vw"
              priority
              className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] w-full rounded-[1.5rem] border border-border/60 object-cover shadow-2xl"
            />
          </div>
        </div>
      </Container>
    </Section>
  );
}
