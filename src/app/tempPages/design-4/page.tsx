"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Wind,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Users,
  Compass,
  Play,
  Pause,
  RotateCcw,
  Star,
  Check,
} from "lucide-react";

export default function DesignFourPage() {
  // Box breathing interactive widget state
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<"Inhale" | "Hold (Full)" | "Exhale" | "Hold (Empty)">("Inhale");
  const [secondsLeft, setSecondsLeft] = useState(4);

  useEffect(() => {
    if (!breathingActive) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          // Change phase
          setBreathPhase((currentPhase) => {
            if (currentPhase === "Inhale") return "Hold (Full)";
            if (currentPhase === "Hold (Full)") return "Exhale";
            if (currentPhase === "Exhale") return "Hold (Empty)";
            return "Inhale";
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [breathingActive]);

  // Mood filter state
  const [selectedFeeling, setSelectedFeeling] = useState<string>("anxiety");

  // Booking step simulation
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("60min");

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased selection:bg-sky-100 selection:text-sky-900">
      {/* Top Notice / Hub Link */}
      <div className="bg-[#0F172A] text-slate-300 px-4 py-2.5 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-sky-400 inline-block animate-pulse"></span>
            Sample Design 4: Calm Horizon • Soft Nordic Serenity &amp; Interactive Mindfulness
          </span>
          <Link
            href="/tempPages"
            className="text-sky-400 hover:text-white transition underline underline-offset-4 font-semibold"
          >
            ← Back to Design Review Hub
          </Link>
        </div>
      </div>

      {/* Modern Floating Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center text-white shadow-sm">
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <Link href="/tempPages/design-4" className="text-xl font-bold tracking-tight text-slate-900 block leading-tight">
                Dr. Adya Vats
              </Link>
              <span className="text-[11px] font-medium text-slate-500 tracking-wide">
                Therapy • Mindfulness • Wellbeing
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#breathing" className="hover:text-sky-600 transition flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
              Breathe Tool
            </a>
            <a href="#feeling" className="hover:text-sky-600 transition">
              Find Support
            </a>
            <a href="#sessions" className="hover:text-sky-600 transition">
              Sessions &amp; Pricing
            </a>
            <a href="#about" className="hover:text-sky-600 transition">
              About Dr. Adya
            </a>
            <a href="#testimonials" className="hover:text-sky-600 transition">
              Reviews
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#book"
              className="px-5 py-2.5 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-sky-600 transition shadow-sm"
            >
              Book a Session
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section with Cloud Gradient & Calming Elements */}
      <section className="pt-16 pb-20 md:pt-24 md:pb-28 px-6 bg-gradient-to-b from-sky-50/70 via-white to-[#F8FAFC]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100/80 text-sky-800 text-xs font-semibold border border-sky-200">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              Gentle, trauma-informed psychological care
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
              Find your breath. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-indigo-600 to-teal-500">
                Restore your inner peace.
              </span>
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
              Whether you are navigating chronic stress, life transitions, or relationship friction,
              Dr. Adya Vats provides a calm, pressure-free sanctuary to help you ground and flourish.
            </p>

            <div className="pt-3 flex flex-wrap gap-4">
              <a
                href="#feeling"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-sky-600 text-white font-semibold text-sm hover:bg-sky-700 transition shadow-md shadow-sky-600/20"
              >
                <span>Find What Fits You</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#breathing"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-slate-700 font-semibold text-sm border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 transition shadow-xs"
              >
                <Wind className="w-4 h-4 text-sky-500" />
                <span>Try 1-Min Calming Tool</span>
              </a>
            </div>

            <div className="pt-6 flex items-center gap-6 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                100% Confidential
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Online &amp; In-Person
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Zero judgment
              </span>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 relative">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-md">
                  <Image
                    src="/images/dr-adya-portrait.jpg"
                    alt="Dr. Adya Vats"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Dr. Adya Vats</h3>
                  <p className="text-xs text-slate-500 font-medium">Psychologist &amp; Art Therapist</p>
                  <div className="flex items-center gap-1 mt-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                    <span className="text-[11px] text-slate-400 font-normal ml-1">5.0 • 1,000+ sessions</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 p-4 rounded-2xl bg-sky-50/60 border border-sky-100 text-xs text-slate-700">
                <p className="font-semibold text-sky-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-sky-600" />
                  Clinical &amp; Creative Specializations
                </p>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 font-medium pt-1">
                  <span className="bg-white px-2.5 py-1.5 rounded-lg border border-sky-100">CBT &amp; REBT</span>
                  <span className="bg-white px-2.5 py-1.5 rounded-lg border border-sky-100">Art Therapy</span>
                  <span className="bg-white px-2.5 py-1.5 rounded-lg border border-sky-100">Mindfulness Care</span>
                  <span className="bg-white px-2.5 py-1.5 rounded-lg border border-sky-100">Trauma-Informed</span>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block">Starting at</span>
                  <span className="text-lg font-bold text-slate-900">₹1,000</span>
                  <span className="text-slate-400 text-[10px]"> / session</span>
                </div>
                <a
                  href="#sessions"
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white font-medium hover:bg-sky-600 transition"
                >
                  View Options
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE BOX BREATHING WIDGET */}
      <section id="breathing" className="py-16 px-6 bg-gradient-to-r from-sky-500 via-indigo-600 to-sky-700 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider mb-4">
            <Wind className="w-3.5 h-3.5" />
            Interactive Mindful Pause
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            Take a 1-Minute Grounding Breath
          </h2>
          <p className="text-sky-100 text-sm sm:text-base max-w-xl mx-auto mb-8 font-light">
            Box breathing stimulates the parasympathetic nervous system, lowering stress hormones and resetting racing thoughts.
          </p>

          {/* Breathing Visualizer */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 max-w-sm mx-auto shadow-2xl mb-8">
            <div className="relative w-44 h-44 mx-auto flex flex-col items-center justify-center">
              {/* Outer pulsing ring */}
              <div
                className={`absolute inset-0 rounded-full border-4 border-white/40 transition-all duration-1000 ${
                  breathingActive && (breathPhase === "Inhale" || breathPhase === "Hold (Full)")
                    ? "scale-110 bg-white/20"
                    : "scale-90 bg-white/5"
                }`}
              />

              <p className="text-xs uppercase tracking-widest text-sky-200 font-bold mb-1">
                {breathingActive ? breathPhase : "Ready?"}
              </p>
              <p className="text-4xl font-extrabold text-white">
                {breathingActive ? `${secondsLeft}s` : "4s"}
              </p>
              <p className="text-[10px] text-sky-100 mt-1">
                {breathingActive ? "Follow the rhythm" : "Press Start"}
              </p>
            </div>

            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => setBreathingActive(!breathingActive)}
                className="px-6 py-2.5 rounded-full bg-white text-slate-900 font-bold text-xs uppercase tracking-wider hover:bg-sky-100 transition shadow-md flex items-center gap-1.5"
              >
                {breathingActive ? (
                  <>
                    <Pause className="w-3.5 h-3.5" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" /> Start Breathing
                  </>
                )}
              </button>
              {breathingActive && (
                <button
                  onClick={() => {
                    setBreathingActive(false);
                    setBreathPhase("Inhale");
                    setSecondsLeft(4);
                  }}
                  className="px-4 py-2.5 rounded-full bg-white/20 text-white hover:bg-white/30 text-xs font-semibold transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <p className="text-xs text-sky-200">
            Feeling calm? Carry this grounded clarity into your therapy exploration below.
          </p>
        </div>
      </section>

      {/* INTERACTIVE "HOW ARE YOU FEELING" RECOMMENDATION TOOL */}
      <section id="feeling" className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-100 px-3 py-1 rounded-full">
            Personalized Fit
          </span>
          <h2 className="text-3xl font-bold text-slate-900 mt-4 mb-2">
            What is currently on your mind?
          </h2>
          <p className="text-slate-600 text-sm">
            Select what best matches your current experience to see Dr. Adya&rsquo;s recommended pathway.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {[
            { id: "anxiety", label: "Anxious, Overwhelmed or Racing Thoughts" },
            { id: "burnout", label: "Depleted, Burnout or Feeling Stuck" },
            { id: "relationship", label: "Relationship Disconnect or Conflict" },
            { id: "growth", label: "Self-Doubt & Desire for Personal Growth" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedFeeling(item.id)}
              className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition border ${
                selectedFeeling === item.id
                  ? "bg-slate-900 text-white border-slate-900 shadow-md"
                  : "bg-white text-slate-700 border-slate-200 hover:border-sky-300 hover:bg-sky-50/50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Recommendation Result Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-lg shadow-slate-100 max-w-4xl mx-auto">
          {selectedFeeling === "anxiety" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-8 space-y-4">
                <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
                  Recommended Modality
                </span>
                <h3 className="text-2xl font-bold text-slate-900">
                  Individual Psychotherapy (60 min) with REBT &amp; Somatic Coping
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  When anxiety is running the show, we work on grounding your physical body first,
                  followed by examining cognitive distortions and catastrophizing cycles using REBT and CBT.
                </p>
                <div className="flex items-center gap-4 text-xs font-medium text-slate-700 pt-2">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-sky-600" /> 60 minutes
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> ₹2,000 / session
                  </span>
                </div>
              </div>
              <div className="md:col-span-4 flex flex-col gap-3">
                <a
                  href="#book"
                  onClick={() => setSelectedPlan("60min")}
                  className="w-full py-3.5 rounded-2xl bg-sky-600 text-white text-xs font-bold uppercase tracking-wider text-center hover:bg-sky-700 transition shadow-sm"
                >
                  Book 60-Min Session
                </a>
                <a
                  href="#sessions"
                  className="w-full py-3.5 rounded-2xl bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider text-center hover:bg-slate-200 transition"
                >
                  View All Formats
                </a>
              </div>
            </div>
          )}

          {selectedFeeling === "burnout" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-8 space-y-4">
                <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
                  Recommended Modality
                </span>
                <h3 className="text-2xl font-bold text-slate-900">
                  Individual Therapy (30 or 60 min) with Art Therapy Elements
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  When words feel exhausting, Art Therapy and mindfulness allow emotional expression without cognitive strain.
                  We focus on gentle nervous system restoration and boundary rebuilding.
                </p>
                <div className="flex items-center gap-4 text-xs font-medium text-slate-700 pt-2">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-sky-600" /> 30 min (₹1,000) or 60 min (₹2,000)
                  </span>
                </div>
              </div>
              <div className="md:col-span-4 flex flex-col gap-3">
                <a
                  href="#book"
                  onClick={() => setSelectedPlan("30min")}
                  className="w-full py-3.5 rounded-2xl bg-sky-600 text-white text-xs font-bold uppercase tracking-wider text-center hover:bg-sky-700 transition shadow-sm"
                >
                  Book 30-Min Reset (₹1,000)
                </a>
              </div>
            </div>
          )}

          {selectedFeeling === "relationship" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-8 space-y-4">
                <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
                  Recommended Modality
                </span>
                <h3 className="text-2xl font-bold text-slate-900">
                  Couples Therapy (60 - 75 min)
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  A neutral, compassionate forum to de-escalate defensiveness, understand underlying emotional bids,
                  and learn constructive communication protocols.
                </p>
                <div className="flex items-center gap-4 text-xs font-medium text-slate-700 pt-2">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-sky-600" /> 60 - 75 minutes
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-indigo-600" /> ₹3,000 / couple
                  </span>
                </div>
              </div>
              <div className="md:col-span-4 flex flex-col gap-3">
                <a
                  href="#book"
                  onClick={() => setSelectedPlan("couples")}
                  className="w-full py-3.5 rounded-2xl bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider text-center hover:bg-indigo-700 transition shadow-sm"
                >
                  Book Couples Therapy
                </a>
              </div>
            </div>
          )}

          {selectedFeeling === "growth" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-8 space-y-4">
                <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
                  Recommended Modality
                </span>
                <h3 className="text-2xl font-bold text-slate-900">
                  Individual Psychotherapy &amp; Reflective Sessions
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Deepen self-awareness, unpack inner critic voices, and explore possibilities through cognitive therapy,
                  art therapy, or reflective tarot sessions.
                </p>
                <div className="flex items-center gap-4 text-xs font-medium text-slate-700 pt-2">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-sky-600" /> Tailored to your pace
                  </span>
                </div>
              </div>
              <div className="md:col-span-4 flex flex-col gap-3">
                <a
                  href="#sessions"
                  className="w-full py-3.5 rounded-2xl bg-slate-900 text-white text-xs font-bold uppercase tracking-wider text-center hover:bg-slate-800 transition"
                >
                  Explore All 6 Services
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SESSIONS & PRICING GRID */}
      <section id="sessions" className="py-20 px-6 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-100 px-3 py-1 rounded-full">
              Transparent Care
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-4 mb-2">
              Simple, upfront pricing.
            </h2>
            <p className="text-slate-600 text-sm">
              No hidden fees, no subscriptions. Pay per session securely online.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: 30 Min */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition">
              <div>
                <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Individual Focus</span>
                <h3 className="text-xl font-bold text-slate-900 mt-1 mb-2">30-Minute Therapy</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-extrabold text-slate-900">₹1,000</span>
                  <span className="text-xs text-slate-500">/ session</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  Targeted, solution-oriented session for immediate anxiety, urgent decisions, or brief emotional resets.
                </p>
                <div className="space-y-2.5 text-xs text-slate-600 mb-8">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>30 minutes one-on-one video call</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Focused coping mechanisms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Flexible follow-up scheduling</span>
                  </div>
                </div>
              </div>
              <a
                href="#book"
                onClick={() => setSelectedPlan("30min")}
                className="w-full py-3 rounded-2xl bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider text-center hover:bg-slate-200 transition"
              >
                Choose 30-Min
              </a>
            </div>

            {/* Card 2: 60 Min Highlighted */}
            <div className="bg-white rounded-3xl p-8 border-2 border-sky-500 shadow-xl shadow-sky-100 flex flex-col justify-between relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-sky-600 text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm">
                Most Popular
              </div>
              <div>
                <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Deep Transformative</span>
                <h3 className="text-xl font-bold text-slate-900 mt-1 mb-2">60-Minute Therapy</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-extrabold text-slate-900">₹2,000</span>
                  <span className="text-xs text-slate-500">/ session</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  Comprehensive therapeutic session integrating REBT, CBT, and Art Therapy to unpack roots and build resilience.
                </p>
                <div className="space-y-2.5 text-xs text-slate-600 mb-8">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Full 60 minutes exploratory therapy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Deep emotional pattern exploration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Integrative tools (REBT + Art Therapy)</span>
                  </div>
                </div>
              </div>
              <a
                href="#book"
                onClick={() => setSelectedPlan("60min")}
                className="w-full py-3 rounded-2xl bg-sky-600 text-white text-xs font-bold uppercase tracking-wider text-center hover:bg-sky-700 transition shadow-md shadow-sky-500/20"
              >
                Choose 60-Min
              </a>
            </div>

            {/* Card 3: Couples */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Relationship Care</span>
                <h3 className="text-xl font-bold text-slate-900 mt-1 mb-2">Couples Therapy</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-extrabold text-slate-900">₹3,000</span>
                  <span className="text-xs text-slate-500">/ session</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  Joint session for partners to restore emotional safety, communicate transparently, and resolve cycles.
                </p>
                <div className="space-y-2.5 text-xs text-slate-600 mb-8">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>60 to 75 minutes joint consultation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Attachment &amp; communication repair</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Joint home practice tools</span>
                  </div>
                </div>
              </div>
              <a
                href="#book"
                onClick={() => setSelectedPlan("couples")}
                className="w-full py-3 rounded-2xl bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider text-center hover:bg-slate-200 transition"
              >
                Choose Couples
              </a>
            </div>
          </div>

          {/* Additional Offerings strip */}
          <div className="mt-12 bg-white rounded-3xl p-6 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <Compass className="w-5 h-5 text-sky-600 shrink-0" />
              <p className="text-slate-600">
                Also offering: <strong className="text-slate-900">Workshops &amp; Institutional Programs</strong>,{" "}
                <strong className="text-slate-900">Supervision for Budding Psychologists</strong>, and{" "}
                <strong className="text-slate-900">Tarot Card Reading (Intuitive Reflection)</strong>.
              </p>
            </div>
            <a
              href="#book"
              className="text-sky-600 font-bold hover:underline whitespace-nowrap"
            >
              Inquire About Other Offerings →
            </a>
          </div>
        </div>
      </section>

      {/* DIRECT BOOKING FORM SECTION */}
      <section id="book" className="py-20 px-6 max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-100 px-3 py-1 rounded-full">
              Schedule Your Slot
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-3 mb-2">
              Book with Dr. Adya Vats
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm">
              Select your format and details. Dr. Adya will personally confirm your session within 24 hours.
            </p>
          </div>

          {bookingConfirmed ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Booking Request Sent</h3>
              <p className="text-slate-600 text-sm max-w-md mx-auto">
                Thank you! Your confidential request has been recorded. Check your email for appointment confirmation and Google Meet link.
              </p>
              <button
                onClick={() => setBookingConfirmed(false)}
                className="mt-4 px-6 py-2.5 rounded-full bg-slate-900 text-white text-xs font-semibold"
              >
                Book Another Time
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setBookingConfirmed(true);
              }}
              className="space-y-5 text-xs sm:text-sm"
            >
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">Selected Session Format</label>
                <select
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-sky-500 font-medium"
                >
                  <option value="60min">Individual Psychotherapy (60 min) — ₹2,000</option>
                  <option value="30min">Individual Psychotherapy (30 min) — ₹1,000</option>
                  <option value="couples">Couples Therapy (60-75 min) — ₹3,000</option>
                  <option value="supervision">Supervision for Budding Psychologists</option>
                  <option value="tarot">Tarot Card Reading (Intuitive Reflection)</option>
                  <option value="workshop">Institutional / Corporate Workshop</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1.5">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter full name"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="name@email.com"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1.5">Preferred Mode</label>
                  <select className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-sky-500">
                    <option>Online Video Consultation (Worldwide)</option>
                    <option>In-Person Consultation (by appointment)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1.5">Preferred Time Window</label>
                  <select className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-sky-500">
                    <option>Weekday Evenings (5:00 PM - 8:00 PM)</option>
                    <option>Weekday Mornings (10:00 AM - 1:00 PM)</option>
                    <option>Weekend Slots (Saturday / Sunday)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-sky-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-sky-700 transition shadow-lg shadow-sky-600/20"
              >
                Confirm Appointment Request
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Dr. Adya Vats Practice. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/tempPages" className="text-sky-600 hover:underline font-semibold">
              Client Design Review Hub
            </Link>
            <Link href="/tempPages/design-3" className="hover:text-slate-900 transition">
              Sample Design 3
            </Link>
            <Link href="/tempPages/design-2" className="hover:text-slate-900 transition">
              Sample Design 2
            </Link>
            <Link href="/tempPages/design-1" className="hover:text-slate-900 transition">
              Sample Design 1
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
