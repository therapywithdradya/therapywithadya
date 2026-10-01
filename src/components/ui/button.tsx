"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const variantClass: Record<Variant, string> = {
  primary:
    "bg-primary text-on-primary font-semibold shadow-soft hover:bg-primary-hover hover:shadow-card",
  secondary:
    "border border-border bg-transparent text-ink hover:border-primary hover:text-primary",
  ghost: "bg-transparent text-ink hover:bg-surface hover:text-primary",
};

const sizeClass: Record<Size, string> = {
  sm: "min-h-11 px-3 text-sm",
  md: "min-h-11 px-4 text-base",
  lg: "min-h-12 px-5 text-lead",
};

const baseClass =
  "inline-flex max-w-full items-center justify-center gap-2 rounded-button text-center font-sans font-medium [overflow-wrap:anywhere] transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-70 aria-disabled:cursor-not-allowed aria-disabled:opacity-70";

type Common = {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = Common &
  Omit<ComponentProps<"button">, "className" | "children"> & {
    href?: undefined;
  };

type ButtonAsLink = Common &
  Omit<ComponentProps<typeof Link>, "className" | "children" | "href"> & {
    href: string;
    disabled?: boolean;
  };

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className,
  children,
  ...props
}: ButtonAsButton | ButtonAsLink) {
  const classes = cn(baseClass, variantClass[variant], sizeClass[size], className);
  const content = (
    <>
      {loading ? (
        <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden="true" />
      ) : null}
      {children}
    </>
  );

  if ("href" in props && props.href !== undefined) {
    const { href, disabled, onClick, ...linkProps } = props;
    const inactive = Boolean(disabled || loading);

    return (
      <Link
        {...linkProps}
        href={href}
        className={classes}
        aria-disabled={inactive || undefined}
        aria-busy={loading || undefined}
        tabIndex={inactive ? -1 : linkProps.tabIndex}
        onClick={(event) => {
          if (inactive) {
            event.preventDefault();
          }
          onClick?.(event);
        }}
      >
        {content}
      </Link>
    );
  }

  const { disabled, type, ...buttonProps } = props;

  return (
    <button
      {...buttonProps}
      type={type ?? "button"}
      className={classes}
      disabled={Boolean(disabled) || loading}
      aria-busy={loading || undefined}
    >
      {content}
    </button>
  );
}
