"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { site } from "@/content/site";
import { isCurrentPath } from "@/lib/nav";
import { cn } from "@/lib/utils";

const desktopQuery = "(min-width: 48rem)";

export function SiteHeader() {
  const pathname = usePathname();
  const menuId = "site-navigation";
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const returnFocusRef = useRef(false);
  const previousPathRef = useRef(pathname);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const bookCurrent = isCurrentPath(pathname, site.bookHref);
  const homeCurrent = pathname === "/";

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 4);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (previousPathRef.current === pathname) {
      return;
    }

    previousPathRef.current = pathname;
    returnFocusRef.current = true;
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const media = window.matchMedia(desktopQuery);
    const onChange = () => {
      if (media.matches) {
        returnFocusRef.current = false;
        setOpen(false);
      }
    };

    media.addEventListener("change", onChange);
    return () => {
      media.removeEventListener("change", onChange);
    };
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        returnFocusRef.current = true;
        setOpen(false);
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }
      if (headerRef.current?.contains(target)) {
        return;
      }
      returnFocusRef.current = true;
      setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      const firstLink = menuRef.current?.querySelector("a");
      if (firstLink instanceof HTMLElement) {
        firstLink.focus();
      }
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [open]);

  useEffect(() => {
    if (open || !returnFocusRef.current) {
      return;
    }

    returnFocusRef.current = false;
    const button = menuButtonRef.current;
    if (!button || button.offsetParent === null) {
      return;
    }
    button.focus();
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const { body, documentElement } = document;
    const previousBody = body.style.overflow;
    const previousRoot = documentElement.style.overflow;
    body.style.overflow = "hidden";
    documentElement.style.overflow = "hidden";

    return () => {
      body.style.overflow = previousBody;
      documentElement.style.overflow = previousRoot;
    };
  }, [open]);

  return (
    <header
      ref={headerRef}
      className={cn(
        "sticky top-0 z-40 border-b",
        scrolled
          ? "border-border bg-surface shadow-sm"
          : "border-transparent bg-background",
      )}
    >
      <Container className="flex flex-wrap items-center gap-x-3 gap-y-2 py-3">
        <Link
          href="/"
          aria-current={homeCurrent ? "page" : undefined}
          className="order-1 min-w-0 flex-1 rounded-sm font-serif text-heading text-ink [overflow-wrap:anywhere] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          {site.siteName}
        </Link>
        <div className="order-2 flex items-center gap-2 md:order-3">
          <Button
            href={site.bookHref}
            size="sm"
            aria-current={bookCurrent ? "page" : undefined}
          >
            {site.bookLabel}
          </Button>
          <button
            ref={menuButtonRef}
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-lg text-ink md:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => {
              setOpen((current) => {
                const next = !current;
                returnFocusRef.current = !next;
                return next;
              });
            }}
          >
            {open ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </button>
        </div>
        <nav
          ref={menuRef}
          id={menuId}
          aria-label="Primary"
          className={cn(
            "order-3 w-full flex-col gap-1 md:order-2 md:flex md:w-auto md:flex-row md:flex-wrap md:items-center md:gap-x-4 md:gap-y-2",
            open ? "flex" : "max-md:hidden",
          )}
        >
          {site.nav.map((item) => {
            const current = isCurrentPath(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={current ? "page" : undefined}
                className={cn(
                  "rounded-sm px-1 py-2 text-ink [overflow-wrap:anywhere] underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
                  current ? "font-semibold underline" : "hover:underline",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </Container>
    </header>
  );
}
