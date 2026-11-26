"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const BASE = "/tempPages/design-6";

const navItems = [
  { href: `${BASE}/about`, label: "About" },
  { href: `${BASE}/services`, label: "Services" },
  { href: `${BASE}/sessions`, label: "Sessions" },
  { href: `${BASE}/events`, label: "Events" },
  { href: `${BASE}/gallery`, label: "Gallery" },
  { href: `${BASE}/reviews`, label: "Reviews" },
  { href: `${BASE}/contact`, label: "Contact" },
];

export function Design6Header({
  siteName = "Therapy with Dr. Adya",
  bookLabel = "Book a session",
}: {
  siteName?: string;
  bookLabel?: string;
}) {
  const pathname = usePathname();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;

  const isHome = pathname === BASE;

  return (
    <>
      {/* Slim Demo Review Banner */}
      <div className="bg-gradient-to-r from-[#FFF8DC] via-[#EAE7FF] to-[#E3F4EE] px-4 py-2 text-xs text-slate-700 border-b border-indigo-200/70">
        <div className="mx-auto flex max-w-[75rem] flex-wrap items-center justify-between gap-2">
          <span className="flex items-center gap-2 font-medium">
            <span className="inline-block size-2 rounded-full bg-indigo-400 animate-pulse" />
            <span>
              <strong>Demo 6 (Bloom &amp; Hope)</strong> · Multi-Pastel Theme Preview
            </span>
          </span>
          <Link
            href="/tempPages"
            className="font-semibold text-indigo-700 underline underline-offset-4 hover:text-indigo-900"
          >
            ← Back to All Demos Hub
          </Link>
        </div>
      </div>

      {/* Main Site Header (Pastel Light Indigo / Yellowish-White) */}
      <header className="sticky top-0 z-40 border-b border-indigo-100/80 bg-[#FFFDF7]/92 backdrop-blur-md shadow-[0_2px_14px_rgba(99,102,241,0.06)]">
        <div className="mx-auto flex max-w-[75rem] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 h-16 sm:h-[4.5rem]">
          <Link
            href={BASE}
            aria-current={isHome ? "page" : undefined}
            className="font-heading text-base sm:text-lg font-bold tracking-tight text-slate-800 hover:text-indigo-600 transition shrink-0"
          >
            {siteName}
          </Link>

          {/* Desktop Navigation */}
          <nav aria-label="Primary" className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-[#EAE8FF] text-indigo-700 font-semibold"
                      : "text-slate-600 hover:bg-[#F5F3FF] hover:text-indigo-700"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href={`${BASE}/book`}
              className="ml-2 inline-flex items-center justify-center rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600 transition"
            >
              {bookLabel}
            </Link>
          </nav>

          {/* Mobile Controls */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              href={`${BASE}/book`}
              className="inline-flex items-center justify-center rounded-xl bg-indigo-500 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-600 transition"
            >
              {bookLabel}
            </Link>
            <button
              type="button"
              onClick={() => setOpenPath(open ? null : pathname)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="inline-flex size-10 items-center justify-center rounded-xl border border-indigo-100 bg-white text-slate-700 hover:bg-indigo-50"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {open ? (
          <nav
            aria-label="Mobile Primary"
            className="border-t border-indigo-100 bg-[#FFFDF7] px-4 py-4 md:hidden"
          >
            <ul className="space-y-1">
              <li>
                <Link
                  href={BASE}
                  className={`block rounded-xl px-4 py-2.5 text-sm font-medium ${
                    isHome ? "bg-[#EAE8FF] text-indigo-700 font-semibold" : "text-slate-700"
                  }`}
                >
                  Home
                </Link>
              </li>
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`block rounded-xl px-4 py-2.5 text-sm font-medium ${
                        active ? "bg-[#EAE8FF] text-indigo-700 font-semibold" : "text-slate-700 hover:bg-indigo-50/70"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        ) : null}
      </header>
    </>
  );
}
