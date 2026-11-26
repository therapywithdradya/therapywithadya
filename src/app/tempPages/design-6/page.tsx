"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Sparkles,
  Heart,
  Shield,
  Compass,
  Sun,
  Flower2,
  Quote,
  Mail,
  MapPin,
  Users,
  Star,
  CheckCircle2,
  Feather,
  Palette,
  BookOpen,
} from "lucide-react";

/* ───────────────────────────────────────────────────────────
   DEMO 6 — "Bloom & Hope"
   A hopeful, uplifting multi-pastel design that shifts colors
   across sections: soft white → light blue → warm beige →
   sage green → blush pink → light lavender.
   Each section is a different gentle color to evoke warmth,
   variety, and emotional safety.
   ─────────────────────────────────────────────────────────── */

export default function DesignSixPage() {
  const [activeService, setActiveService] = useState(0);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [selectedSession, setSelectedSession] = useState("individual-60");

  const services = [
    {
      num: "01",
      tag: "INDIVIDUAL SUPPORT",
      title: "Individual Counselling & Therapy",
      desc: "Feeling overwhelmed, stuck, or unsure where to begin? You're in the right place. Personalised, trauma-informed therapy to help you understand what you're experiencing, work through challenges, and move forward with greater clarity, self-compassion, and self-awareness.",
      pricing: "₹1,000 (30 min) · ₹2,000 (60 min)",
      color: "bg-indigo-50 border-indigo-200 text-indigo-800",
      dotColor: "bg-indigo-400",
    },
    {
      num: "02",
      tag: "RELATIONSHIPS",
      title: "Couples Therapy",
      desc: "Finding it difficult to communicate, understand each other, or feel connected again? A supportive space for couples to communicate openly, understand each other better, work through recurring challenges, and build healthier, more connected relationship patterns.",
      pricing: "₹3,000 (60-75 min)",
      color: "bg-pink-50 border-pink-200 text-pink-800",
      dotColor: "bg-pink-400",
    },
    {
      num: "03",
      tag: "INSTITUTIONAL PROGRAMS",
      title: "Workshops, Seminars & Institutional Programs",
      desc: "Interactive mental health and wellbeing workshops, seminars, and institutional programs for schools, colleges, educational institutions, and corporate teams. Each program can be customised according to the needs, concerns, and goals of the institution.",
      pricing: "Custom Quote",
      color: "bg-green-50 border-green-200 text-green-800",
      dotColor: "bg-green-400",
    },
    {
      num: "04",
      tag: "PROFESSIONAL MENTORSHIP",
      title: "Supervision for Budding Psychologists",
      desc: "Starting your practice but unsure how to navigate the therapy room? Practical supervision and mentorship for budding psychologists and counsellors who may feel stuck with a client, need help carrying a session forward, or want greater confidence in their practice.",
      pricing: "Per Session",
      color: "bg-amber-50 border-amber-200 text-amber-800",
      dotColor: "bg-amber-400",
    },
    {
      num: "05",
      tag: "PRACTICAL TRAINING",
      title: "Internships & Courses",
      desc: "Want to move beyond learning theories and actually understand how to use them in practice? Practical learning programs designed to bridge the gap between psychological theory and real-world application.",
      pricing: "Coming Soon",
      color: "bg-blue-50 border-blue-200 text-blue-800",
      dotColor: "bg-blue-400",
    },
    {
      num: "06",
      tag: "INTUITIVE REFLECTION",
      title: "Tarot Card Reading",
      desc: "Looking for a little clarity, reflection, or a different perspective? Tarot readings offer a reflective space to explore your thoughts, questions, emotions, and possibilities — helping you pause, reflect, and look at your situation from a different perspective.",
      pricing: "On Request",
      color: "bg-violet-50 border-violet-200 text-violet-800",
      dotColor: "bg-violet-400",
    },
  ];

  const current = services[activeService] ?? services[0]!;

  return (
    <div className="min-h-screen font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top banner */}
      <div className="bg-gradient-to-r from-indigo-100 via-pink-50 to-green-50 text-slate-700 px-4 py-2.5 text-xs flex items-center justify-between border-b border-indigo-100/80">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
          <span className="flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse inline-block"></span>
            Sample Design 6: Bloom &amp; Hope • Multi-Pastel Hopeful Experience
          </span>
          <Link
            href="/tempPages"
            className="text-indigo-600 hover:text-indigo-800 transition underline underline-offset-4 font-semibold"
          >
            ← Back to Design Review Hub
          </Link>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          HEADER — Soft white with light indigo accent
          ═══════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-indigo-100/60 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Gradient logo mark */}
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-300 via-blue-200 to-green-200 flex items-center justify-center shadow-sm">
              <Flower2 className="w-5 h-5 text-indigo-700" />
            </div>
            <div>
              <Link href="/tempPages/design-6" className="text-xl font-bold tracking-tight text-slate-800 block leading-tight">
                Dr. Adya Vats
              </Link>
              <span className="text-[11px] font-medium text-indigo-500 tracking-wide">
                Psychologist &amp; Art Therapist
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <a href="#approach" className="hover:text-indigo-600 transition">Approach</a>
            <a href="#services" className="hover:text-indigo-600 transition">Services</a>
            <a href="#about" className="hover:text-indigo-600 transition">About</a>
            <a href="#voices" className="hover:text-indigo-600 transition">Voices</a>
            <a href="#connect" className="hover:text-indigo-600 transition">Connect</a>
          </nav>

          <a
            href="#connect"
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white text-xs font-semibold hover:from-indigo-600 hover:to-blue-600 transition shadow-md shadow-indigo-200"
          >
            Book a Session
          </a>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════
          HERO — Soft yellowish-white base → light pastel indigo → sky blue
          ═══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFFDF2] via-[#EFEFFF] to-[#EAF4FF] pt-16 pb-24 md:pt-24 md:pb-28 px-6">
        {/* Decorative soft blobs */}
        <div className="absolute top-12 left-10 w-72 h-72 bg-[#FEF7D6]/70 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute top-36 right-16 w-64 h-64 bg-indigo-200/40 rounded-full blur-[75px] pointer-events-none" />
        <div className="absolute bottom-10 left-1/3 w-64 h-64 bg-pink-100/35 rounded-full blur-[90px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-sm border border-indigo-100 text-indigo-700 text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              Gentle, trauma-informed psychological care
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight text-slate-800 leading-[1.15]">
              A safe, compassionate space to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-blue-500 to-green-500">
                heal, grow, and bloom.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
              Whether you&rsquo;re navigating anxiety, grief, self-doubt, or life transitions,
              Dr. Adya Vats offers a warm, judgement-free sanctuary to help you understand yourself more deeply
              and take meaningful steps forward.
            </p>

            <div className="pt-3 flex flex-wrap gap-4">
              <a
                href="#services"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold text-sm hover:from-indigo-600 hover:to-blue-600 transition shadow-lg shadow-indigo-200/50"
              >
                <span>Explore What I Offer</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#about"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-slate-700 font-semibold text-sm border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/50 transition shadow-xs"
              >
                <Heart className="w-4 h-4 text-pink-400" />
                <span>About Dr. Adya</span>
              </a>
            </div>

            {/* Trust badges */}
            <div className="pt-6 flex flex-wrap items-center gap-5 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                100% Confidential
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
                Online &amp; In-Person
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-pink-400" />
                Zero judgement
              </span>
            </div>
          </div>

          {/* Portrait card with multi-pastel frame */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-sm">
              {/* Pastel gradient ring behind portrait */}
              <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-indigo-200 via-pink-100 to-green-100 opacity-70 blur-sm pointer-events-none" />

              <div className="relative bg-white p-3 rounded-3xl shadow-xl border border-indigo-100/50">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/5]">
                  <Image
                    src="/images/dr-adya-portrait.jpg"
                    alt="Dr. Adya Vats"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                {/* Info strip below portrait */}
                <div className="pt-4 pb-2 px-2 text-center">
                  <h3 className="text-base font-bold text-slate-800">Dr. Adya Vats</h3>
                  <p className="text-xs text-indigo-500 font-medium mt-0.5">
                    MA Clinical Psychology • Art Therapist
                  </p>
                  <div className="flex items-center justify-center gap-1 mt-2 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                    <span className="text-[11px] text-slate-400 ml-1">1,000+ sessions</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          PATH FORWARD / HOPE BANNER — Light Pastel Indigo + Soft Yellowish-White
          ═══════════════════════════════════════════════════════ */}
      <section className="py-18 bg-gradient-to-br from-[#EAE8FF] via-[#E5E7FF] to-[#E6F1FF] px-6 border-y border-indigo-100/80">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFFDF2] text-indigo-700 border border-amber-200/70 text-xs font-bold uppercase tracking-widest shadow-xs">
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            A Hopeful Step Forward
          </span>

          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800">
            Discover your path forward with Dr. Adya Vats
          </h2>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            My therapeutic approach is grounded in empathy, safety, and non-judgment.
            Together, we move from feeling tangled and overwhelmed toward clarity, emotional lightness, and renewed hope.
          </p>

          <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="bg-[#FFFDF5]/95 border border-amber-100 rounded-2xl p-5 shadow-xs">
              <p className="text-lg font-bold text-indigo-600">Warmth &amp; Safety</p>
              <p className="text-xs text-slate-600 mt-1">Held gently at your own pace</p>
            </div>
            <div className="bg-[#FFFDF5]/95 border border-indigo-100 rounded-2xl p-5 shadow-xs">
              <p className="text-lg font-bold text-blue-600">Clarity &amp; Insight</p>
              <p className="text-xs text-slate-600 mt-1">Untangle recurring patterns</p>
            </div>
            <div className="bg-[#FFFDF5]/95 border border-green-100 rounded-2xl p-5 shadow-xs">
              <p className="text-lg font-bold text-emerald-600">Quiet Hope</p>
              <p className="text-xs text-slate-600 mt-1">Practical growth that lasts</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          APPROACH — Light Blue / Sky pastel section
          ═══════════════════════════════════════════════════════ */}
      <section id="approach" className="py-20 bg-gradient-to-b from-[#EFF8FF] to-[#E8F4FD] px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
              Therapeutic Approach
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mt-4 mb-3">
              Rooted in empathy, guided by care.
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Every person carries a unique emotional landscape. My integrative approach blends cognitive clarity with
              creative expression, helping you process, understand, and gently move forward.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-7 border border-blue-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 mb-5">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Trauma-Informed Care</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Creating safe, boundaried spaces where past wounds are held gently, respecting your pacing and emotional readiness.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-7 border border-green-100 shadow-sm hover:shadow-md hover:border-green-200 transition">
              <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center text-green-600 mb-5">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">CBT &amp; REBT Tools</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Actionable cognitive frameworks to examine belief systems, untangle anxious loops, and cultivate practical emotional resilience.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-7 border border-pink-100 shadow-sm hover:shadow-md hover:border-pink-200 transition">
              <div className="w-12 h-12 rounded-2xl bg-pink-100 flex items-center justify-center text-pink-600 mb-5">
                <Palette className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Art Therapy &amp; Mindfulness</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Expressive modalities that allow emotions beyond verbal vocabulary to emerge and gently process through somatic awareness.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SERVICES — Warm Beige / Cream section
          ═══════════════════════════════════════════════════════ */}
      <section id="services" className="py-24 bg-gradient-to-b from-[#FBF8F3] to-[#F7F1E8] px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
              What I Offer
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mt-4 mb-3">
              Services designed to meet you where you are.
            </h2>
            <p className="text-slate-600 text-sm">
              Explore one-on-one therapy, relationship support, institutional programs, professional mentorship,
              practical training, and reflective offerings.
            </p>
          </div>

          {/* Service selector pills */}
          <div className="flex flex-wrap justify-center gap-2.5 mb-12">
            {services.map((s, idx) => (
              <button
                key={s.num}
                onClick={() => setActiveService(idx)}
                className={`px-4 py-2.5 rounded-full text-xs font-semibold transition border ${
                  activeService === idx
                    ? `${s.color} border-current shadow-sm`
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${s.dotColor}`}></span>
                  {s.tag}
                </span>
              </button>
            ))}
          </div>

          {/* Active service showcase */}
          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-lg">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${current.color}`}>
                {current.num} • {current.tag}
              </span>
              <span className="text-sm font-bold text-slate-800">{current.pricing}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4">
              {current.title}
            </h3>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-8">
              {current.desc}
            </p>

            <a
              href="#connect"
              onClick={() => {
                if (activeService === 0) setSelectedSession("individual-60");
                else if (activeService === 1) setSelectedSession("couples");
              }}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold text-sm hover:from-indigo-600 hover:to-blue-600 transition shadow-md shadow-indigo-200/50"
            >
              <span>Inquire About {current.title}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Quick pricing strip below */}
          <div className="max-w-4xl mx-auto mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-indigo-100 text-center">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">Individual (30 min)</span>
              <span className="text-2xl font-extrabold text-slate-800">₹1,000</span>
              <p className="text-[11px] text-slate-500 mt-1">Focused support &amp; coping</p>
            </div>
            <div className="bg-white rounded-2xl p-5 border-2 border-blue-300 text-center shadow-md relative">
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                Most Popular
              </div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">Individual (60 min)</span>
              <span className="text-2xl font-extrabold text-slate-800">₹2,000</span>
              <p className="text-[11px] text-slate-500 mt-1">Deep emotional exploration</p>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-pink-100 text-center">
              <span className="text-xs font-bold text-pink-600 uppercase tracking-wider block mb-1">Couples (60-75 min)</span>
              <span className="text-2xl font-extrabold text-slate-800">₹3,000</span>
              <p className="text-[11px] text-slate-500 mt-1">Joint relationship support</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          ABOUT — Soft Sage Green section
          ═══════════════════════════════════════════════════════ */}
      <section id="about" className="py-24 bg-gradient-to-b from-[#F0F7F2] to-[#E5F0E8] px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-5">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-green-50">
              <Image
                src="/images/hero-space.jpg"
                alt="Warm therapy space"
                width={500}
                height={600}
                className="w-full h-80 sm:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green-900/50 via-transparent to-transparent flex items-end p-6">
                <p className="text-white text-sm font-light">
                  A serene, private setting dedicated to your comfort and peace of mind.
                </p>
              </div>
            </div>
          </div>

          <div className="md:col-span-7 space-y-5">
            <span className="text-xs font-bold uppercase tracking-widest text-green-700 bg-green-100 px-3 py-1 rounded-full">
              About Dr. Adya
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800">
              Meet your therapist.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              I am a Clinical Psychologist, Art Therapist, and Counsellor dedicated to walking alongside individuals
              as they navigate anxiety, relationship challenges, grief, and life transitions.
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              My therapeutic stance values depth over quick fixes. Whether through structured cognitive techniques
              (CBT/REBT) or creative modalities like Art Therapy, we work at a pace that honors your story.
            </p>

            <div className="pt-3 grid grid-cols-2 gap-4">
              <div className="bg-white/80 p-4 rounded-xl border border-green-100">
                <p className="text-xs font-bold text-green-800 uppercase tracking-wider">Qualifications</p>
                <p className="text-sm text-slate-600 mt-1">MA Clinical Psychology • Art Therapist</p>
              </div>
              <div className="bg-white/80 p-4 rounded-xl border border-blue-100">
                <p className="text-xs font-bold text-blue-800 uppercase tracking-wider">Modalities</p>
                <p className="text-sm text-slate-600 mt-1">REBT, CBT, Mindfulness &amp; Gestalt</p>
              </div>
              <div className="bg-white/80 p-4 rounded-xl border border-indigo-100">
                <p className="text-xs font-bold text-indigo-800 uppercase tracking-wider">Mode</p>
                <p className="text-sm text-slate-600 mt-1">Online (Worldwide) &amp; In-Person</p>
              </div>
              <div className="bg-white/80 p-4 rounded-xl border border-amber-100">
                <p className="text-xs font-bold text-amber-800 uppercase tracking-wider">Experience</p>
                <p className="text-sm text-slate-600 mt-1">1,000+ Therapy Sessions Conducted</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          CONCERNS / WHO CAN BENEFIT — Light Pink section
          ═══════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-b from-[#FFF5F7] to-[#FDE8EE] px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-pink-700 bg-pink-100 px-3 py-1 rounded-full">
              You&rsquo;re Not Alone
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mt-4 mb-3">
              Therapy can help if you&rsquo;re experiencing...
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { label: "Anxiety & Overwhelm", icon: Sun, bg: "bg-amber-50 border-amber-200", iconColor: "text-amber-500" },
              { label: "Depression & Low Mood", icon: Heart, bg: "bg-indigo-50 border-indigo-200", iconColor: "text-indigo-500" },
              { label: "Relationship Struggles", icon: Users, bg: "bg-pink-50 border-pink-200", iconColor: "text-pink-500" },
              { label: "Self-Doubt & Confidence", icon: Shield, bg: "bg-green-50 border-green-200", iconColor: "text-green-500" },
              { label: "Grief & Loss", icon: Feather, bg: "bg-blue-50 border-blue-200", iconColor: "text-blue-500" },
              { label: "Trauma & Past Wounds", icon: Flower2, bg: "bg-violet-50 border-violet-200", iconColor: "text-violet-500" },
              { label: "Life Transitions", icon: Compass, bg: "bg-teal-50 border-teal-200", iconColor: "text-teal-500" },
              { label: "Academic & Work Stress", icon: BookOpen, bg: "bg-orange-50 border-orange-200", iconColor: "text-orange-500" },
            ].map((concern) => (
              <div
                key={concern.label}
                className={`${concern.bg} border rounded-2xl p-5 text-center hover:shadow-md transition`}
              >
                <concern.icon className={`w-7 h-7 ${concern.iconColor} mx-auto mb-3`} />
                <p className="text-xs sm:text-sm font-semibold text-slate-700">{concern.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          CLIENT VOICES — Soft Lavender section
          ═══════════════════════════════════════════════════════ */}
      <section id="voices" className="py-20 bg-gradient-to-b from-[#F5F0FF] to-[#EDE5FF] px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full">
              Client Reflections
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mt-4 mb-3">
              Words from those who chose to begin.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/80 backdrop-blur-sm p-7 rounded-2xl border border-indigo-100 shadow-sm">
              <Quote className="w-6 h-6 text-indigo-400 mb-4 opacity-60" />
              <p className="text-sm text-slate-600 leading-relaxed italic">
                &ldquo;Adya gave me a space where I didn&rsquo;t have to pretend everything was fine. For the first time in years, my anxiety felt manageable.&rdquo;
              </p>
              <p className="text-xs font-bold text-indigo-700 uppercase tracking-wider mt-5">
                — Client (Individual Therapy)
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-7 rounded-2xl border border-pink-100 shadow-sm">
              <Quote className="w-6 h-6 text-pink-400 mb-4 opacity-60" />
              <p className="text-sm text-slate-600 leading-relaxed italic">
                &ldquo;Couples therapy with Dr. Adya completely changed how my partner and I communicate during disagreements. She was compassionate to both of us.&rdquo;
              </p>
              <p className="text-xs font-bold text-pink-700 uppercase tracking-wider mt-5">
                — Couples Client
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-7 rounded-2xl border border-green-100 shadow-sm">
              <Quote className="w-6 h-6 text-green-400 mb-4 opacity-60" />
              <p className="text-sm text-slate-600 leading-relaxed italic">
                &ldquo;The art therapy sessions unlocked feelings I couldn&rsquo;t put into words. It felt completely natural and deeply grounding.&rdquo;
              </p>
              <p className="text-xs font-bold text-green-700 uppercase tracking-wider mt-5">
                — Workshop &amp; Individual Client
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          CONNECT / BOOKING — Soft Beige → Indigo gradient
          ═══════════════════════════════════════════════════════ */}
      <section id="connect" className="py-24 bg-gradient-to-b from-[#FBF8F3] via-[#F5F0FF] to-[#EDF5FF] px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-8 sm:p-14 border border-slate-200/80 shadow-xl">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full">
                Begin Your Journey
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mt-3 mb-2">
                Book a Session with Dr. Adya
              </h2>
              <p className="text-sm text-slate-500">
                Reach out confidentially. Dr. Adya will confirm your appointment and share the session link within 24 hours.
              </p>
            </div>

            {bookingConfirmed ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-100 to-blue-100 text-green-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Your Request Has Been Received</h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Thank you for reaching out. Dr. Adya Vats will get back to you at your email promptly with confirmation and session details.
                </p>
                <button
                  onClick={() => setBookingConfirmed(false)}
                  className="mt-4 px-6 py-2.5 rounded-full bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition"
                >
                  Send Another Request
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setBookingConfirmed(true);
                }}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Your name"
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="you@email.com"
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Session Type</label>
                  <select
                    value={selectedSession}
                    onChange={(e) => setSelectedSession(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  >
                    <option value="individual-60">Individual Psychotherapy (60 min) — ₹2,000</option>
                    <option value="individual-30">Individual Psychotherapy (30 min) — ₹1,000</option>
                    <option value="couples">Couples Therapy (60-75 min) — ₹3,000</option>
                    <option value="workshop">Workshops &amp; Institutional Programs</option>
                    <option value="supervision">Supervision for Budding Psychologists</option>
                    <option value="tarot">Tarot Card Reading (Reflective Session)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    What brings you here? (Optional &amp; Confidential)
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Share whatever feels comfortable, or simply tell us your preferred days and times..."
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white text-xs uppercase tracking-widest font-bold hover:from-indigo-600 hover:to-blue-600 transition shadow-lg shadow-indigo-200/50"
                >
                  Send Confidential Booking Request
                </button>
              </form>
            )}

            {/* Contact info strip */}
            <div className="mt-8 pt-8 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-500" />
                adyavats13@gmail.com
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-green-500" />
                Online (Worldwide) &amp; In-Person by Appointment
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FOOTER — Soft indigo-blue
          ═══════════════════════════════════════════════════════ */}
      <footer className="bg-gradient-to-r from-indigo-50 via-blue-50 to-green-50 border-t border-indigo-100 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-300 via-blue-200 to-green-200 flex items-center justify-center">
              <Flower2 className="w-4 h-4 text-indigo-700" />
            </div>
            <div>
              <p className="font-bold text-slate-700 text-sm">Dr. Adya Vats</p>
              <p>Clinical Psychology • Art Therapy • Cognitive Guidance</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/tempPages" className="text-indigo-600 hover:underline font-semibold">
              Client Design Review Hub
            </Link>
            <Link href="/tempPages/design-5" className="hover:text-slate-800 transition">Design 5</Link>
            <Link href="/tempPages/design-4" className="hover:text-slate-800 transition">Design 4</Link>
            <Link href="/tempPages/design-3" className="hover:text-slate-800 transition">Design 3</Link>
          </div>

          <p>© {new Date().getFullYear()} Dr. Adya Vats. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
