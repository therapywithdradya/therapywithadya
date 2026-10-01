import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Prose({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl text-body text-ink", className)}>{children}</div>
  );
}
