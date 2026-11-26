"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Check,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

export default function TempPagesIndex() {
  const [selectedDemo, setSelectedDemo] = useState<string>("design-3");
  const [feedbackNotes, setFeedbackNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const demos = [
    {
      id: "design-1",
      number: "Demo 1",
      name: "Mindhouse Wellness",
      tagline: "Modern Mental Health & Mindfulness App Style",
      palette: "Satin Indigo, Royal Violet, Amber accents & Soft Linen",
      paletteColors: ["#4F46E5", "#7C3AED", "#F59E0B", "#F8FAFC"],
      theme: "Modern Wellness Platform",
      idealFor: "Clients seeking a vibrant, friendly, tech-enabled wellness & meditation experience.",
      highlights: [
        "Interactive mindfulness audio player widget",
        "Horizontal concerns carousel",
        "Card-based transformation visual",
        "Includes dedicated Booking & Contact sub-pages",
      ],
      link: "/tempPages/design-1",
      badgeColor: "bg-purple-100 text-purple-700 border-purple-200",
      btnColor: "bg-purple-600 hover:bg-purple-700 text-white",
    },
    {
      id: "design-2",
      number: "Demo 2",
      name: "BetterHelp Clinical",
      tagline: "Warm Sage Matching & Intake Questionnaire Platform",
      palette: "Warm Cream (#FAF8F5), Deep Forest Green (#2E5B3F), Soft Sage (#85C98A)",
      paletteColors: ["#FAF8F5", "#2E5B3F", "#85C98A", "#EAF4EC"],
      theme: "Guided Clinical Intake",
      idealFor: "Visitors who want a guided, step-by-step questionnaire that matches them to the right therapy modality.",
      highlights: [
        "Multi-step interactive matching questionnaire",
        "Clinical outcome gauges (69% anxiety / 73% mood improvement)",
        "Dr. Adya Practice vs. Traditional clinic comparison table",
        "Dedicated Booking & Contact sub-pages",
      ],
      link: "/tempPages/design-2",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
      btnColor: "bg-[#2E5B3F] hover:bg-[#234731] text-white",
    },
    {
      id: "design-3",
      number: "Demo 3",
      name: "Atelier Serene",
      tagline: "Warm Earthy Linen & Editorial Boutique Practice",
      palette: "Warm Terracotta (#B85D38), Sand Linen (#FAF7F2), Deep Umber (#2C2420)",
      paletteColors: ["#FAF7F2", "#B85D38", "#2C2420", "#EADDCF"],
      theme: "High-End Editorial Boutique Clinic",
      idealFor: "Clients looking for a deeply warm, grounded, compassionate private practice with timeless aesthetics.",
      highlights: [
        "Bespoke arched photography framing of Dr. Adya",
        "Category tabs across Individual, Couples, Institutional & Tarot",
        "Client reflections & quote callouts in warm paper tones",
        "Inline appointment request with instant confirmation",
      ],
      link: "/tempPages/design-3",
      badgeColor: "bg-amber-100 text-amber-900 border-amber-200",
      btnColor: "bg-[#B85D38] hover:bg-[#9E4A28] text-white",
    },
    {
      id: "design-4",
      number: "Demo 4",
      name: "Calm Horizon",
      tagline: "Soft Nordic Serenity & Interactive Mindfulness",
      palette: "Soft Cloud White (#FFFFFF), Sky Blue (#0284C7), Slate Navy (#0F172A)",
      paletteColors: ["#F8FAFC", "#0284C7", "#0F172A", "#E0F2FE"],
      theme: "Nordic Serenity & Breathwork",
      idealFor: "Visitors feeling acute stress or anxiety who benefit from immediate calming tools and clear pricing.",
      highlights: [
        "Live interactive 1-minute Box Breathing relaxation widget",
        "Dynamic 'What are you feeling today?' recommendation engine",
        "Pill-card transparent pricing grid (₹1,000 / ₹2,000 / ₹3,000)",
        "Streamlined confidential schedule request form",
      ],
      link: "/tempPages/design-4",
      badgeColor: "bg-sky-100 text-sky-800 border-sky-200",
      btnColor: "bg-sky-600 hover:bg-sky-700 text-white",
    },
    {
      id: "design-5",
      number: "Demo 5",
      name: "Modern Sanctuary",
      tagline: "Deep Botanical Emerald & Contemporary Luxury Studio",
      palette: "Deep Emerald (#09110D), Rich Moss (#142A1E), Mint Accent (#52C485)",
      paletteColors: ["#09110D", "#142A1E", "#52C485", "#A3D9B5"],
      theme: "Contemporary Botanical Luxury",
      idealFor: "Clients and corporate partners who appreciate a bold, premium, elevated mental health studio presence.",
      highlights: [
        "Live client availability status badge",
        "Interactive 6-Service Clinical Suite matrix with instant switching",
        "Comprehensive transparent fee structures",
        "High-contrast luxury dark aesthetic with glowing borders",
      ],
      link: "/tempPages/design-5",
      badgeColor: "bg-emerald-950 text-emerald-300 border-emerald-800",
      btnColor: "bg-[#1E4330] hover:bg-[#285A41] text-[#A3D9B5] border border-[#3A7B59]",
    },
    {
      id: "design-6",
      number: "Demo 6",
      name: "Bloom & Hope (Full Multi-Page Mirror)",
      tagline: "Full Mirror of Main Site — Multi-Pastel Hopeful Theme Across All 9 Pages",
      palette: "Yellowish-White, Light Indigo, Sky Blue, Warm Beige, Sage Green, Blush Pink, Lavender",
      paletteColors: ["#FFFDF2", "#EAE8FF", "#EFF8FF", "#FBF7EE", "#EFF8F2", "#FFF5F7"],
      theme: "Full Site Redesign (Multi-Pastel)",
      idealFor: "Experiencing the exact main website (Home, About, Services, Sessions, Events, Gallery, Reviews, Contact, Book) re-themed with hopeful pastel colors.",
      highlights: [
        "All 9 separate pages matching the live website structure & copy",
        "Each section shifts gently: yellowish-white → beige → blue → sage → pink → lavender",
        "Live Booking Wizard, Gallery Lightbox, and full Services & About content",
        "Light pastel indigo accents replacing heavy dark colors",
      ],
      link: "/tempPages/design-6",
      badgeColor: "bg-gradient-to-r from-indigo-100 to-pink-100 text-indigo-700 border-indigo-200",
      btnColor: "bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white",
    },
  ];

  const handleSubmitFinalSelection = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans antialiased">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Hub Header */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Dr. Adya Vats • Client Design Review Suite
            </div>
            <span className="text-xs text-slate-500 font-medium">
              6 Live Frontend Concepts Available
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
            Explore &amp; Finalize Your Website Design
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
            We have crafted <strong className="text-slate-900">6 distinct design directions</strong> for Dr. Adya Vats’s practice.
            Each concept incorporates your authentic credentials, real pricing, and official services while exploring different emotional tones, color palettes, and client engagement flows.
          </p>

          <div className="mt-8 pt-8 border-t border-slate-100 flex flex-wrap gap-3">
            {demos.map((d) => (
              <Link
                key={d.id}
                href={d.link}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
                  d.id === "design-6"
                    ? "bg-indigo-600 text-white hover:bg-indigo-700 ring-2 ring-indigo-200"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <span>{d.number}: {d.name.split(" (")[0]}</span>
                {d.id === "design-6" ? (
                  <span className="ml-1 rounded-full bg-white/20 px-1.5 py-0.5 text-[10px]">New</span>
                ) : null}
              </Link>
            ))}
          </div>
        </div>

        {/* 5 DESIGN CARDS GRID */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">The 6 Design Options</h2>
            <span className="text-xs text-slate-500">Click any demo to experience live</span>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {demos.map((demo) => (
              <div
                key={demo.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 hover:border-slate-300 hover:shadow-md transition flex flex-col lg:flex-row lg:items-center justify-between gap-8"
              >
                <div className="space-y-4 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${demo.badgeColor}`}
                    >
                      {demo.number}
                    </span>
                    <h3 className="text-2xl font-bold text-slate-900">{demo.name}</h3>
                  </div>

                  <p className="text-sm font-semibold text-slate-700">{demo.tagline}</p>
                  <p className="text-xs text-slate-600 leading-relaxed">{demo.idealFor}</p>

                  {/* Palette dots */}
                  <div className="flex items-center gap-3 pt-1">
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Palette:</span>
                    <div className="flex items-center gap-1.5">
                      {demo.paletteColors.map((color, i) => (
                        <span
                          key={i}
                          className="w-5 h-5 rounded-full border border-slate-300 shadow-xs inline-block"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-slate-500 italic font-light truncate max-w-xs">
                      {demo.palette}
                    </span>
                  </div>

                  {/* Feature highlights */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                    {demo.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action button */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 lg:w-56">
                  <Link
                    href={demo.link}
                    className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition shadow-sm ${demo.btnColor}`}
                  >
                    <span>Launch {demo.number}</span>
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  {demo.id === "design-1" && (
                    <div className="flex gap-2">
                      <Link
                        href="/tempPages/design-1/book"
                        className="flex-1 text-center py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition"
                      >
                        Booking
                      </Link>
                      <Link
                        href="/tempPages/design-1/contact"
                        className="flex-1 text-center py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition"
                      >
                        Contact
                      </Link>
                    </div>
                  )}

                  {demo.id === "design-2" && (
                    <div className="flex gap-2">
                      <Link
                        href="/tempPages/design-2/book"
                        className="flex-1 text-center py-2 px-3 rounded-xl bg-[#eaf4ec] hover:bg-[#d6ebd9] text-[#2e5b3f] text-[11px] font-semibold transition"
                      >
                        Booking
                      </Link>
                      <Link
                        href="/tempPages/design-2/contact"
                        className="flex-1 text-center py-2 px-3 rounded-xl bg-[#eaf4ec] hover:bg-[#d6ebd9] text-[#2e5b3f] text-[11px] font-semibold transition"
                      >
                        Contact
                      </Link>
                    </div>
                  )}

                  {demo.id === "design-6" && (
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { label: "About", href: "/tempPages/design-6/about" },
                        { label: "Services", href: "/tempPages/design-6/services" },
                        { label: "Sessions", href: "/tempPages/design-6/sessions" },
                        { label: "Events", href: "/tempPages/design-6/events" },
                        { label: "Gallery", href: "/tempPages/design-6/gallery" },
                        { label: "Reviews", href: "/tempPages/design-6/reviews" },
                        { label: "Contact", href: "/tempPages/design-6/contact" },
                        { label: "Book", href: "/tempPages/design-6/book" },
                      ].map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className="py-1.5 px-2.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-semibold transition"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COMPARISON MATRIX */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 overflow-x-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Side-by-Side Comparison</h2>
            <p className="text-xs text-slate-500 mt-1">Quick summary of aesthetics, tone, and visitor psychology</p>
          </div>

          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Design</th>
                <th className="py-3 px-4">Emotional Tone</th>
                <th className="py-3 px-4">Primary Background</th>
                <th className="py-3 px-4">Standout Interactive Feature</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-4 px-4 font-bold text-purple-700">Demo 1 (Mindhouse)</td>
                <td className="py-4 px-4">Energetic, modern, wellness app vibe</td>
                <td className="py-4 px-4">Satin Dark Indigo &amp; Clean White</td>
                <td className="py-4 px-4">Mindfulness sound player &amp; concerns slider</td>
                <td className="py-4 px-4">
                  <Link href="/tempPages/design-1" className="text-purple-600 font-bold hover:underline">
                    View →
                  </Link>
                </td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-bold text-emerald-800">Demo 2 (BetterHelp)</td>
                <td className="py-4 px-4">Warm clinical, guided intake, accessible</td>
                <td className="py-4 px-4">Warm Cream (#FAF8F5)</td>
                <td className="py-4 px-4">Multi-step matching questionnaire &amp; outcome gauges</td>
                <td className="py-4 px-4">
                  <Link href="/tempPages/design-2" className="text-emerald-700 font-bold hover:underline">
                    View →
                  </Link>
                </td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-bold text-amber-900">Demo 3 (Atelier Serene)</td>
                <td className="py-4 px-4">Warm earthy linen, boutique editorial clinic</td>
                <td className="py-4 px-4">Natural Sand Linen (#FAF7F2)</td>
                <td className="py-4 px-4">Arched framing, quote callouts, category tabs</td>
                <td className="py-4 px-4">
                  <Link href="/tempPages/design-3" className="text-amber-800 font-bold hover:underline">
                    View →
                  </Link>
                </td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-bold text-sky-700">Demo 4 (Calm Horizon)</td>
                <td className="py-4 px-4">Soft Nordic serenity, tranquil, breathable</td>
                <td className="py-4 px-4">Cloud White &amp; Sky Mist</td>
                <td className="py-4 px-4">Interactive 1-min Box Breathing tool &amp; mood filters</td>
                <td className="py-4 px-4">
                  <Link href="/tempPages/design-4" className="text-sky-600 font-bold hover:underline">
                    View →
                  </Link>
                </td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-bold text-emerald-400 bg-slate-900/5">Demo 5 (Modern Sanctuary)</td>
                <td className="py-4 px-4">Contemporary botanical luxury, elevated studio</td>
                <td className="py-4 px-4">Deep Botanical Emerald (#09110D)</td>
                <td className="py-4 px-4">Interactive 6-Service Clinical Suite matrix</td>
                <td className="py-4 px-4">
                  <Link href="/tempPages/design-5" className="text-emerald-700 font-bold hover:underline">
                    View →
                  </Link>
                </td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-bold text-indigo-600">Demo 6 (Bloom &amp; Hope)</td>
                <td className="py-4 px-4">Hopeful, uplifting, multi-pastel color journey</td>
                <td className="py-4 px-4">Cream → Sky Blue → Beige → Sage → Pink → Lavender</td>
                <td className="py-4 px-4">Color-coded service pills &amp; pastel concern cards</td>
                <td className="py-4 px-4">
                  <Link href="/tempPages/design-6" className="text-indigo-600 font-bold hover:underline">
                    View →
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* CLIENT SELECTION & FEEDBACK FORM */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-md border border-slate-200">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              Client Finalization
            </span>
            <h2 className="text-3xl font-bold text-slate-900 mt-3 mb-2">
              Share Your Feedback or Pick a Favorite
            </h2>
            <p className="text-slate-600 text-sm">
              You can choose one definitive design, or request a hybrid (e.g. &ldquo;We love the warm linen colors of Demo 3, but want the questionnaire from Demo 2&rdquo;).
            </p>
          </div>

          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-emerald-950">Feedback Recorded</h3>
              <p className="text-xs text-emerald-800 max-w-md mx-auto">
                Thank you! Your preferred choice ({demos.find((d) => d.id === selectedDemo)?.name}) has been saved. We will review your notes and can easily apply it to your main website.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 px-5 py-2 rounded-xl bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 transition"
              >
                Modify Selection
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitFinalSelection} className="space-y-6 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-800 mb-2">
                  Which design do you prefer the most?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {demos.map((d) => (
                    <label
                      key={d.id}
                      className={`p-4 rounded-2xl border cursor-pointer transition flex items-center gap-3 ${
                        selectedDemo === d.id
                          ? "border-indigo-600 bg-indigo-50/60 shadow-xs"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="demoSelection"
                        value={d.id}
                        checked={selectedDemo === d.id}
                        onChange={() => setSelectedDemo(d.id)}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{d.number}: {d.name}</p>
                        <p className="text-[11px] text-slate-500">{d.theme}</p>
                      </div>
                    </label>
                  ))}
                  <label
                    className={`p-4 rounded-2xl border cursor-pointer transition flex items-center gap-3 ${
                      selectedDemo === "hybrid"
                        ? "border-indigo-600 bg-indigo-50/60 shadow-xs"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="demoSelection"
                      value="hybrid"
                      checked={selectedDemo === "hybrid"}
                      onChange={() => setSelectedDemo("hybrid")}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <p className="font-bold text-slate-900">Hybrid / Combination</p>
                      <p className="text-[11px] text-slate-500">Mix &amp; match specific elements</p>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Specific thoughts, tweaks or combinations you’d like:
                </label>
                <textarea
                  rows={4}
                  value={feedbackNotes}
                  onChange={(e) => setFeedbackNotes(e.target.value)}
                  placeholder="e.g. 'We really love the soothing colors of Demo 3, but we want the interactive breathing exercise from Demo 4 and the matching quiz from Demo 2...'"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-indigo-500 text-xs sm:text-sm"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-indigo-700 transition shadow-md shadow-indigo-600/20"
              >
                Submit Selection &amp; Feedback
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
