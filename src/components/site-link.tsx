"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import { isCurrentPath } from "@/lib/nav";
import { cn } from "@/lib/utils";

type SiteLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
};

export function SiteLink({ href, className, children, ...props }: SiteLinkProps) {
  const pathname = usePathname();
  const current = isCurrentPath(pathname, href);

  return (
    <Link
      {...props}
      href={href}
      aria-current={current ? "page" : undefined}
      className={cn(
        "rounded-sm text-ink underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
        current ? "font-semibold underline" : "hover:underline",
        className,
      )}
    >
      {children}
    </Link>
  );
}
