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
    <Section aria-labelledby="home-hero-title">
      <Container className="grid min-w-0 items-center gap-10 lg:grid-cols-2">
        <div className="min-w-0">
          <p className="max-w-full font-heading text-sm font-semibold tracking-[0.18em] text-primary uppercase [overflow-wrap:anywhere]">
            {resolvedBrand}
          </p>
          <div className="mt-4 min-w-0">{heading}</div>
          <p className="mt-4 max-w-xl text-lead text-muted [overflow-wrap:anywhere]">
            {resolvedSupport}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button href={resolvedBookHref} className="w-full sm:w-auto">
              {resolvedPrimaryLabel}
            </Button>
            <Button href="#sessions" variant="secondary" className="w-full sm:w-auto">
              {resolvedSecondaryLabel}
            </Button>
          </div>
        </div>
        <SiteImage
          src={resolvedImageUrl}
          alt={resolvedImageAlt}
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
