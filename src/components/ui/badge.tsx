import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const tones = {
  neutral: "border border-border bg-background text-ink",
  accent: "bg-accent text-ink",
  success: "bg-success text-on-primary",
  error: "bg-error text-on-primary",
} as const;

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: keyof typeof tones;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center rounded-full px-3 py-1 text-sm font-medium [overflow-wrap:anywhere]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
