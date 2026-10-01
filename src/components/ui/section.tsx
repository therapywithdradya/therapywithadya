import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const backgrounds = {
  default: "bg-background text-ink",
  surface: "border-y border-border bg-surface text-ink",
  accent: "border-y border-border bg-surface text-ink",
} as const;

export function Section({
  id,
  "aria-labelledby": ariaLabelledBy,
  background = "default",
  children,
  className,
}: {
  id?: string;
  "aria-labelledby"?: string;
  background?: keyof typeof backgrounds;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={cn(
        "scroll-mt-48 py-section",
        backgrounds[background],
        className,
      )}
    >
      {children}
    </section>
  );
}
