import Image from "next/image";
import { cn } from "@/lib/utils";

type SiteImageProps = {
  src?: string | null;
  alt: string;
  width: number;
  height: number;
  sizes: string;
  priority?: boolean;
  className?: string;
};

function isSvgSource(src: string): boolean {
  const path = src.split(/[?#]/)[0] ?? "";
  return path.toLowerCase().endsWith(".svg");
}

export function SiteImage({
  src,
  alt,
  width,
  height,
  sizes,
  priority = false,
  className,
}: SiteImageProps) {
  const safeSrc = typeof src === "string" ? src.trim() : "";
  const safeAlt = alt.trim();
  const frameWidth = Number.isFinite(width) && width > 0 ? width : 1;
  const frameHeight = Number.isFinite(height) && height > 0 ? height : 1;

  if (!safeSrc) {
    return (
      <span
        className={cn("block w-full max-w-full bg-border", className)}
        style={{ aspectRatio: `${frameWidth} / ${frameHeight}` }}
        role={safeAlt ? "img" : undefined}
        aria-label={safeAlt || undefined}
      />
    );
  }

  if (isSvgSource(safeSrc)) {
    return (
      // Plain img: next/image does not optimize SVG while dangerouslyAllowSVG stays off.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={safeSrc}
        alt={alt}
        width={frameWidth}
        height={frameHeight}
        decoding="async"
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        className={className}
      />
    );
  }

  return (
    <Image
      src={safeSrc}
      alt={alt}
      width={frameWidth}
      height={frameHeight}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}
