"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function DemoHeader() {
  const pathname = usePathname();

  return (
    <>
      {/* Top Demo Notification Bar */}
      <div className="bg-slate-950 text-slate-300 text-xs py-2 px-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Sample Design 1 Demo • Mindhouse Aesthetic (Dr. Adya Practice)</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/tempPages"
            className="text-purple-300 hover:text-white underline font-medium flex items-center gap-1"
          >
            <ArrowLeft className="w-3 h-3" />
            All Designs Hub
          </Link>
          <Link href="/" className="text-slate-400 hover:text-white">
            Current Live Site
          </Link>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/tempPages/design-1" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-purple-600 flex items-center justify-center p-1 bg-purple-50">
              <svg viewBox="0 0 100 100" className="w-full h-full text-purple-600 stroke-current fill-none stroke-[6]">
                <circle cx="50" cy="50" r="40" strokeDasharray="180" strokeLinecap="round" />
                <circle cx="50" cy="50" r="26" strokeDasharray="120" strokeLinecap="round" />
                <circle cx="50" cy="50" r="12" strokeDasharray="60" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <span className="font-bold text-lg sm:text-xl tracking-tight text-slate-900 block leading-tight">
                Therapy with Dr. Adya
              </span>
              <span className="text-[10px] tracking-wider uppercase text-slate-500 font-medium block">
                Psychologist &amp; Counselor
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-700">
            <Link
              href="/tempPages/design-1#about"
              className="hover:text-purple-600 transition"
            >
              About
            </Link>
            <Link
              href="/tempPages/design-1#services"
              className="hover:text-purple-600 transition"
            >
              Services
            </Link>
            <Link
              href="/tempPages/design-1/book"
              className={`hover:text-purple-600 transition ${
                pathname === "/tempPages/design-1/book" ? "text-purple-600 font-semibold" : ""
              }`}
            >
              Sessions &amp; Booking
            </Link>
            <Link
              href="/tempPages/design-1#approaches"
              className="hover:text-purple-600 transition"
            >
              Approaches
            </Link>
            <Link
              href="/tempPages/design-1#reviews"
              className="hover:text-purple-600 transition"
            >
              Reviews
            </Link>
            <Link
              href="/tempPages/design-1/contact"
              className={`hover:text-purple-600 transition ${
                pathname === "/tempPages/design-1/contact" ? "text-purple-600 font-semibold" : ""
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link
              href="/tempPages/design-1/book"
              className="px-5 py-2.5 rounded-full bg-[#7a5af8] hover:bg-[#6847f2] text-white text-sm font-medium transition shadow-md shadow-purple-500/20"
            >
              Book a session
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
