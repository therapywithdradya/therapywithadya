import type { Metadata } from "next";
import { wordmark } from "@/content/site";
import { getMetadataBase } from "@/lib/env.public";

const ogImage = {
  url: "/images/og-default.jpg",
  width: 1200,
  height: 630,
  alt: "Therapy with Dr. Adya Vats - Psychologist and Counselor",
} as const;

export function marketingMetadata(input: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const branded = `${input.title} | ${wordmark()}`;
  const absolute = branded.length <= 60 ? branded : input.title;

  return {
    metadataBase: getMetadataBase(),
    title: { absolute },
    description: input.description,
    alternates: { canonical: input.path },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: input.path,
      siteName: wordmark(),
      title: absolute,
      description: input.description,
      images: [ogImage],
    },
  };
}
