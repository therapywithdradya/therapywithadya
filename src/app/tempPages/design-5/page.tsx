"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Check,
  Compass,
  Heart,
  Shield,
  ChevronRight,
} from "lucide-react";

export default function DesignFivePage() {
  const [selectedServiceIndex, setSelectedServiceIndex] = useState(0);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const services = [
    {
      num: "01",
      category: "INDIVIDUAL SUPPORT",
      title: "Individual Counselling & Therapy",
      highlight: "Personalized Care",
      desc: "Feeling overwhelmed, stuck, or unsure where to begin? You’re in the right place. Personalised, trauma-informed therapy to help you understand what you’re experiencing, work through challenges, and move forward with greater clarity, self-compassion, and self-awareness.",
      pricing: [
        { label: "30-Minute Focused Session", fee: "₹1,000", note: "Immediate clarity & coping" },
        { label: "60-Minute Comprehensive Session", fee: "₹2,000", note: "Deep emotional exploration" },
      ],
      features: [
        "Trauma-informed, personalized pace",
        "REBT & CBT cognitive frameworks",
        "Art therapy expressive integration",
        "Available online worldwide & in-person",
      ],
    },
    {
      num: "02",
      category: "RELATIONSHIPS",
      title: "Couples Therapy",
      highlight: "Connection & Alignment",
      desc: "Finding it difficult to communicate, understand each other, or feel connected again? A supportive space for couples to communicate openly, understand each other better, work through recurring challenges, and build healthier, more connected relationship patterns.",
      pricing: [
        { label: "60 - 75 Minute Joint Session", fee: "₹3,000", note: "Dedicated space for two" },
      ],
      features: [
        "De-escalating recurrent arguments",
        "Repairing broken communication bridges",
        "Understanding individual attachment triggers",
        "Constructive homework & dialogue protocols",
      ],
    },
    {
      num: "03",
      category: "INSTITUTIONAL PROGRAMS",
      title: "Workshops, Seminars & Institutional Programs",
      highlight: "Resilience & Culture",
      desc: "Looking to create a healthier, more resilient, and supportive environment? Interactive mental health and wellbeing workshops, seminars, and institutional programs for schools, colleges, educational institutions, and corporate teams.",
      pricing: [
        { label: "Tailored Institutional Package", fee: "Custom Quote", note: "School or corporate setting" },
      ],
      features: [
        "Schools: Exam anxiety, emotional regulation, peer dynamics & teacher wellbeing",
        "Corporates: Workplace burnout, emotional agility, team communication & focus",
        "Interactive case discussions and experiential activities",
      ],
    },
    {
      num: "04",
      category: "PROFESSIONAL MENTORSHIP",
      title: "Supervision for Budding Psychologists",
      highlight: "Clinical Mentorship",
      desc: "Starting your practice but unsure how to navigate the therapy room? Practical supervision and mentorship for budding psychologists and counsellors who may feel stuck with a client, need help carrying a session forward, or want greater confidence in their practice.",
      pricing: [
        { label: "Mentorship & Case Guidance", fee: "Per Session", note: "1-on-1 clinician supervision" },
      ],
      features: [
        "Case conceptualization and session structuring",
        "Navigating client resistance & challenging sessions",
        "Applying CBT & REBT techniques in live practice",
        "Therapist boundary-setting and ethical guidance",
      ],
    },
    {
      num: "05",
      category: "PRACTICAL TRAINING",
      title: "Internships & Courses",
      highlight: "Coming Soon",
      desc: "Want to move beyond learning theories and actually understand how to use them in practice? Practical learning programs designed to bridge the gap between psychological theory and real-world application.",
      pricing: [
        { label: "Upcoming Cohort", fee: "Waitlist Open", note: "Launching soon" },
      ],
      features: [
        "Understanding therapeutic approaches in action",
        "Role plays & simulated clinical sessions",
        "Case-based learning modules",
        "Learn. Practice. Apply. Grow.",
      ],
    },
    {
      num: "06",
      category: "INTUITIVE REFLECTION",
      title: "Tarot Card Reading",
      highlight: "Reflective Insight",
      desc: "Looking for a little clarity, reflection, or a different perspective? Tarot readings offer a reflective space to explore your thoughts, questions, emotions, and possibilities — helping you pause, reflect, and look at your situation from a different perspective.",
      pricing: [
        { label: "Reflective Reading Session", fee: "On Request", note: "Perspective & intuitive reflection" },
      ],
      features: [
        "Gentle, respectful intuitive inquiry",
        "Exploring recurring personal questions",
        "Safe, reflective pause from routine",
        "Offered respectfully alongside therapeutic care",
      ],
    },
  ];

  const currentService = services[selectedServiceIndex] ?? services[0]!;

  return (
    <div className="min-h-screen bg-[#09110D] text-[#E8EFEA] font-sans antialiased selection:bg-[#204030] selection:text-[#A3D9B5]">
      {/* Top Notice / Hub Link */}
      <div className="bg-[#050A08] text-[#8EA395] px-4 py-2.5 text-xs flex items-center justify-between border-b border-[#14231B]">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
          <span className="flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#52C485] inline-block animate-ping"></span>
            Sample Design 5: Modern Sanctuary • Botanical Luxury &amp; Studio Aesthetic
          </span>
          <Link
            href="/tempPages"
            className="text-[#52C485] hover:text-white transition underline underline-offset-4 font-semibold"
          >
            ← Back to Design Review Hub
          </Link>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#09110D]/90 backdrop-blur-md border-b border-[#172A20]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1C3B2C] to-[#0D1D16] border border-[#2E5943] flex items-center justify-center text-[#52C485] font-serif font-bold text-lg">
              AV
            </div>
            <div>
              <Link href="/tempPages/design-5" className="text-lg font-bold tracking-tight text-white block">
                Dr. Adya Vats
              </Link>
              <span className="text-[10px] uppercase tracking-widest text-[#7B9585] block">
                Psychologist &amp; Art Therapist
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-widest text-[#9CB5A5]">
            <a href="#suite" className="hover:text-white transition">
              Clinical Suite
            </a>
            <a href="#credentials" className="hover:text-white transition">
              Credentials
            </a>
            <a href="#space" className="hover:text-white transition">
              The Space
            </a>
            <a href="#consultation" className="hover:text-white transition">
              Consultation
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#consultation"
              className="px-5 py-2.5 rounded-full bg-[#183827] border border-[#31694A] text-[#A3D9B5] text-xs uppercase tracking-wider font-semibold hover:bg-[#204933] hover:text-white transition shadow-sm"
            >
              Book Session
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section with Botanical Luxury Accents */}
      <section className="pt-20 pb-24 px-6 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#123122]/40 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#10241A] border border-[#1E4330] text-[#71C792] text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#52C485] animate-pulse"></span>
              Accepting New Clients • Online &amp; In-Person
            </div>

            <h1 className="text-4xl sm:text-6xl font-serif font-normal tracking-tight text-white leading-[1.12]">
              Elevated psychological care,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A3D9B5] via-[#D8C7A0] to-[#52C485]">
                deeply personalized.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#95AEA0] leading-relaxed max-w-xl font-light">
              A private, contemporary sanctuary where clinical precision meets intuitive warmth.
              Individual psychotherapy, couples alignment, and institutional mental health leadership.
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <a
                href="#suite"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#204933] to-[#163826] border border-[#387452] text-white font-semibold text-xs uppercase tracking-widest hover:border-[#52C485] transition shadow-lg shadow-[#10281B]"
              >
                <span>Explore Clinical Suite</span>
                <ArrowRight className="w-4 h-4 text-[#A3D9B5]" />
              </a>

              <a
                href="#consultation"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-[#0D1812] border border-[#1E3628] text-[#A5C2B1] font-semibold text-xs uppercase tracking-widest hover:bg-[#12221A] hover:text-white transition"
              >
                <span>Reserve Consultation</span>
              </a>
            </div>

            {/* Credential tickers */}
            <div className="pt-8 border-t border-[#162A1F] grid grid-cols-3 gap-6 text-xs">
              <div>
                <p className="text-2xl font-serif text-white">MA</p>
                <p className="text-[#6C8576] mt-0.5 uppercase tracking-wider text-[10px]">Clinical Psychology</p>
              </div>
              <div>
                <p className="text-2xl font-serif text-white">REBT / CBT</p>
                <p className="text-[#6C8576] mt-0.5 uppercase tracking-wider text-[10px]">Cognitive Tools</p>
              </div>
              <div>
                <p className="text-2xl font-serif text-white">Art Therapy</p>
                <p className="text-[#6C8576] mt-0.5 uppercase tracking-wider text-[10px]">Expressive Care</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-3xl p-2 bg-gradient-to-b from-[#224835] via-[#142A1E] to-[#0A140E] shadow-2xl border border-[#27533C]">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/5]">
                <Image
                  src="/images/dr-adya-portrait.jpg"
                  alt="Dr. Adya Vats"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#09110D] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-xs uppercase tracking-widest text-[#72C893] font-bold">
                    Principal Practitioner
                  </p>
                  <h3 className="text-xl font-serif font-bold text-white mt-1">Dr. Adya Vats</h3>
                  <p className="text-xs text-[#8BA495] mt-1 font-light">
                    Guiding clients toward emotional resilience, self-discovery, and meaningful connection.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE 6-SERVICE CLINICAL SUITE (Interactive Matrix) */}
      <section id="suite" className="py-24 px-6 bg-[#0B1510] border-y border-[#172B20]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#52C485] font-bold">
                Tailored Psychological Care
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif font-normal text-white mt-2">
                The Clinical Suite
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#7F9A8A] max-w-md font-light leading-relaxed">
              Explore one-on-one therapy, relationship support, institutional programs, professional mentorship,
              practical training, and reflective offerings — thoughtfully designed to meet you where you are.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Service selector tabs */}
            <div className="lg:col-span-5 space-y-2">
              {services.map((item, idx) => (
                <button
                  key={item.num}
                  onClick={() => setSelectedServiceIndex(idx)}
                  className={`w-full p-5 rounded-2xl text-left transition flex items-center justify-between border ${
                    selectedServiceIndex === idx
                      ? "bg-[#142A1E] border-[#31694A] text-white shadow-lg"
                      : "bg-[#0E1B14] border-[#15281D] text-[#869F90] hover:bg-[#112219] hover:text-[#C5D9CC]"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono font-bold text-[#52C485]">{item.num}</span>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-[#64806F] font-semibold">{item.category}</p>
                      <h4 className="text-sm font-bold text-white mt-0.5">{item.title}</h4>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 transition ${
                      selectedServiceIndex === idx ? "text-[#52C485] translate-x-1" : "text-[#3D5748]"
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Active Service Showcase Card */}
            <div className="lg:col-span-7 bg-[#0E1C15] border border-[#234533] rounded-3xl p-8 sm:p-12 relative shadow-2xl">
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#52C485] bg-[#142B1F] px-3 py-1 rounded-full border border-[#244A35]">
                  Service {currentService.num} • {currentService.category}
                </span>
                <span className="text-xs uppercase tracking-wider text-[#A8C7B5] font-medium">
                  {currentService.highlight}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-4">
                {currentService.title}
              </h3>

              <p className="text-sm text-[#95AEA0] leading-relaxed mb-8 font-light">
                {currentService.desc}
              </p>

              {/* Pricing Blocks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {currentService.pricing.map((p, i) => (
                  <div key={i} className="bg-[#13261C] border border-[#1E3B2C] p-4 rounded-xl">
                    <span className="text-[11px] text-[#71907E] uppercase block">{p.label}</span>
                    <span className="text-2xl font-serif font-bold text-[#52C485] mt-1 block">{p.fee}</span>
                    <span className="text-[10px] text-[#93AFA0] mt-0.5 block">{p.note}</span>
                  </div>
                ))}
              </div>

              {/* Feature Checklist */}
              <div className="space-y-3 mb-8 text-xs text-[#BED7C7]">
                {currentService.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#52C485] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <a
                href="#consultation"
                className="inline-flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-gradient-to-r from-[#204933] to-[#163826] border border-[#387452] text-white text-xs uppercase tracking-widest font-bold hover:border-[#52C485] transition shadow-md"
              >
                <span>Reserve {currentService.title}</span>
                <ArrowRight className="w-4 h-4 text-[#52C485]" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CREDENTIALS & PRACTICE ETHOS */}
      <section id="credentials" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#0D1812] border border-[#182F22] rounded-3xl p-8">
            <Shield className="w-8 h-8 text-[#52C485] mb-4" />
            <h4 className="text-lg font-bold text-white mb-2">Absolute Confidentiality</h4>
            <p className="text-xs text-[#809B8B] leading-relaxed font-light">
              Your sessions, records, and personal reflections are strictly confidential, adhering to ethical psychological codes of conduct.
            </p>
          </div>

          <div className="bg-[#0D1812] border border-[#182F22] rounded-3xl p-8">
            <Heart className="w-8 h-8 text-[#52C485] mb-4" />
            <h4 className="text-lg font-bold text-white mb-2">Integrative Art &amp; Mind</h4>
            <p className="text-xs text-[#809B8B] leading-relaxed font-light">
              Bridging cognitive restructuring (REBT/CBT) with non-verbal Art Therapy expression, honoring where your thoughts and feelings meet.
            </p>
          </div>

          <div className="bg-[#0D1812] border border-[#182F22] rounded-3xl p-8">
            <Compass className="w-8 h-8 text-[#52C485] mb-4" />
            <h4 className="text-lg font-bold text-white mb-2">Paced to Your Rhythm</h4>
            <p className="text-xs text-[#809B8B] leading-relaxed font-light">
              No rushed advice or cookie-cutter solutions. We construct a safe cadence that respects your individual emotional readiness.
            </p>
          </div>
        </div>
      </section>

      {/* INSTANT CONSULTATION FORM */}
      <section id="consultation" className="py-24 px-6 max-w-4xl mx-auto">
        <div className="bg-[#0E1C15] border border-[#214130] rounded-3xl p-8 sm:p-14 shadow-2xl relative overflow-hidden">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-mono uppercase tracking-widest text-[#52C485] bg-[#142B1F] px-3 py-1 rounded-full border border-[#244A35]">
              Direct Booking
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-4 mb-2">
              Reserve Your Consultation
            </h2>
            <p className="text-xs sm:text-sm text-[#8BA495] font-light">
              Connect directly with Dr. Adya Vats. Confirmation and session link are delivered within 24 hours.
            </p>
          </div>

          {bookingConfirmed ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#183827] text-[#52C485] flex items-center justify-center mx-auto border border-[#31694A]">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-serif text-white">Consultation Initiated</h3>
              <p className="text-xs text-[#8CA696] max-w-md mx-auto leading-relaxed">
                Thank you. Dr. Adya Vats has received your request and will reach out with confirmed time slots and session link shortly.
              </p>
              <button
                onClick={() => setBookingConfirmed(false)}
                className="mt-4 px-6 py-2.5 rounded-full bg-[#163826] border border-[#31694A] text-[#A3D9B5] text-xs uppercase tracking-wider font-semibold hover:text-white"
              >
                Schedule Another Consultation
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setBookingConfirmed(true);
              }}
              className="space-y-6 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[#A5C2B1] uppercase tracking-wider font-semibold mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    className="w-full px-4 py-3.5 rounded-xl border border-[#203D2E] bg-[#09110D] text-white focus:outline-none focus:border-[#52C485]"
                  />
                </div>
                <div>
                  <label className="block text-[#A5C2B1] uppercase tracking-wider font-semibold mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@domain.com"
                    className="w-full px-4 py-3.5 rounded-xl border border-[#203D2E] bg-[#09110D] text-white focus:outline-none focus:border-[#52C485]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#A5C2B1] uppercase tracking-wider font-semibold mb-2">
                  Session Type
                </label>
                <select className="w-full px-4 py-3.5 rounded-xl border border-[#203D2E] bg-[#09110D] text-white focus:outline-none focus:border-[#52C485]">
                  <option>01 • Individual Psychotherapy (60 min - ₹2,000)</option>
                  <option>01 • Individual Psychotherapy (30 min - ₹1,000)</option>
                  <option>02 • Couples Therapy (60-75 min - ₹3,000)</option>
                  <option>03 • Institutional / Corporate Workshop</option>
                  <option>04 • Supervision for Budding Psychologists</option>
                  <option>05 • Internships &amp; Courses (Waitlist)</option>
                  <option>06 • Tarot Card Reading (Intuitive Reflection)</option>
                </select>
              </div>

              <div>
                <label className="block text-[#A5C2B1] uppercase tracking-wider font-semibold mb-2">
                  What would you like to explore? (Confidential)
                </label>
                <textarea
                  rows={4}
                  placeholder="Share a brief overview or your preferred days/times for consultation..."
                  className="w-full px-4 py-3.5 rounded-xl border border-[#203D2E] bg-[#09110D] text-white focus:outline-none focus:border-[#52C485]"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#204933] to-[#163826] border border-[#387452] text-white text-xs uppercase tracking-widest font-bold hover:border-[#52C485] transition shadow-lg shadow-[#10281B]"
              >
                Submit Consultation Request
              </button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-[#193224] flex flex-wrap items-center justify-between text-[11px] text-[#6F8A7A]">
            <span>Direct Email: adyavats13@gmail.com</span>
            <span>Online (Worldwide) • In-Person by Appointment</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#050A08] border-t border-[#14231B] py-12 px-6 text-xs text-[#6F8A7A]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Dr. Adya Vats Practice. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/tempPages" className="text-[#52C485] hover:underline font-semibold">
              Client Design Review Hub
            </Link>
            <Link href="/tempPages/design-4" className="hover:text-white transition">
              Sample Design 4
            </Link>
            <Link href="/tempPages/design-3" className="hover:text-white transition">
              Sample Design 3
            </Link>
            <Link href="/tempPages/design-2" className="hover:text-white transition">
              Sample Design 2
            </Link>
            <Link href="/tempPages/design-1" className="hover:text-white transition">
              Sample Design 1
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
