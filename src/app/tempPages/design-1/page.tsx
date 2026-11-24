"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Brain,
  Sparkles,
  Users,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Check,
  Shield,
  ArrowRight,
  Heart,
  Smile,
  Compass,
  Feather,
  Sun,
  Flame,
  ChevronDown,
} from "lucide-react";

export default function DesignOnePage() {
  // Concerns slider state
  const concerns = [
    {
      title: "Pain Management",
      desc: "Pain is temporary; resilience is forever. Let us help you manage and heal.",
      icon: Feather,
      color: "bg-red-50 text-red-600 border-red-100",
      pill: "bg-rose-100/70",
    },
    {
      title: "Anxiety & Stress",
      desc: "Quiet the mental noise, break the loop of overwhelm, and ground into the present.",
      icon: Sun,
      color: "bg-amber-50 text-amber-600 border-amber-100",
      pill: "bg-amber-100/70",
    },
    {
      title: "Anger Management",
      desc: "Our therapy and meditation sessions can guide you to a calmer, more balanced state.",
      icon: Flame,
      color: "bg-orange-50 text-orange-600 border-orange-100",
      pill: "bg-orange-100/70",
    },
    {
      title: "Relax & Unwind",
      desc: "Escape the daily stress & chaos. Recharge your mind & body with our relaxation & unwinding sessions.",
      icon: Smile,
      color: "bg-blue-50 text-blue-600 border-blue-100",
      pill: "bg-blue-100/70",
    },
    {
      title: "Low Mood & Depression",
      desc: "Rebuild emotional vitality, understand difficult feelings, and find clarity with safe support.",
      icon: Heart,
      color: "bg-purple-50 text-purple-600 border-purple-100",
      pill: "bg-purple-100/70",
    },
    {
      title: "Relationship Patterns",
      desc: "Work through communication breakdowns, heal attachment wounds, and build lasting safety.",
      icon: Compass,
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
      pill: "bg-emerald-100/70",
    },
  ];

  const [concernIndex, setConcernIndex] = useState(0);
  const nextConcern = () => {
    setConcernIndex((prev) => (prev + 1 >= concerns.length - 2 ? 0 : prev + 1));
  };
  const prevConcern = () => {
    setConcernIndex((prev) => (prev - 1 < 0 ? concerns.length - 3 : prev - 1));
  };

  // Audio widget practice state
  const practiceTabs = [
    "Mindfulness",
    "Breathwork",
    "Sleep Stories",
    "Guided Meditation",
    "Soothing Soundscapes",
    "Ambient Sounds",
  ];
  const [activePracticeTab, setActivePracticeTab] = useState("Mindfulness");
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioSeconds, setAudioSeconds] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setAudioSeconds((prev) => {
          if (prev >= 119) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const formatAudioTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `0${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Anonymous toggle demo
  const [isAnonymous, setIsAnonymous] = useState(true);

  // Form submission demo
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [focusArea, setFocusArea] = useState("Anxiety & Stress Management");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setName("");
      setPhone("");
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Top Demo Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Sample Design 1 Demo • Mindhouse Aesthetic (Dr. Adya Practice)</span>
        </div>
        <Link
          href="/tempPages"
          className="text-purple-300 hover:text-white underline font-medium"
        >
          ← Design Hub
        </Link>
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-purple-600 flex items-center justify-center p-1 bg-purple-50">
              <svg viewBox="0 0 100 100" className="w-full h-full text-purple-600 stroke-current fill-none stroke-[6]">
                <circle cx="50" cy="50" r="40" strokeDasharray="180" strokeLinecap="round" />
                <circle cx="50" cy="50" r="26" strokeDasharray="120" strokeLinecap="round" />
                <circle cx="50" cy="50" r="12" strokeDasharray="60" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight text-slate-900 block leading-tight">
                MINDHOUSE
              </span>
              <span className="text-[10px] tracking-widest uppercase text-slate-400 font-semibold block">
                Therapy with Dr. Adya
              </span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-700">
            <a href="#therapy" className="hover:text-purple-600 transition">
              Therapy
            </a>
            <a href="#meditation" className="hover:text-purple-600 transition">
              Meditation
            </a>
            <div className="relative group cursor-pointer flex items-center gap-1 hover:text-purple-600 transition">
              <span>Community</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </div>
            <a href="#corporate" className="hover:text-purple-600 transition">
              Corporate plan
            </a>
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <a
              href="#booking-section"
              className="px-5 py-2.5 rounded-full bg-[#7a5af8] hover:bg-[#6847f2] text-white text-sm font-medium transition shadow-md shadow-purple-500/20"
            >
              Book a Session
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section (Image 1) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#182559] via-[#141e4d] to-[#0d1434] text-white pt-20 pb-28 sm:pb-36">
        {/* Satin Sheen wave effect */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <svg className="w-full h-full object-cover" viewBox="0 0 1440 800" fill="none" preserveAspectRatio="none">
            <path
              d="M0,250 C320,120 450,380 750,220 C1050,60 1200,320 1440,180 L1440,800 L0,800 Z"
              fill="url(#satin-grad)"
              opacity="0.3"
            />
            <defs>
              <linearGradient id="satin-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#4361ee" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#7209b7" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#3a0ca3" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
            Make time for your mind <br className="hidden sm:inline" />
            with Mindhouse
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 font-light max-w-2xl mx-auto mb-14">
            The only sanctuary you need for all your mental health and emotional well-being needs.
          </p>

          {/* 3 Glassmorphic Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {/* Card 1 */}
            <a
              href="#therapy"
              className="group bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-left flex items-center gap-4 transition shadow-lg"
            >
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20 group-hover:scale-105 transition">
                <Brain className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-base">Therapy</h3>
                <p className="text-xs text-slate-300 mt-0.5">Get help from a professional</p>
              </div>
            </a>

            {/* Card 2 */}
            <a
              href="#meditation"
              className="group bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-left flex items-center gap-4 transition shadow-lg"
            >
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20 group-hover:scale-105 transition">
                <Sparkles className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-base">Meditation</h3>
                <p className="text-xs text-slate-300 mt-0.5">Train your Mind</p>
              </div>
            </a>

            {/* Card 3 */}
            <a
              href="#community"
              className="group bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-left flex items-center gap-4 transition shadow-lg"
            >
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20 group-hover:scale-105 transition">
                <Users className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-base">Community</h3>
                <p className="text-xs text-slate-300 mt-0.5">Learn from relatable experiences</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Concerns We Address Section (Image 2) */}
      <section id="therapy" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
              Concerns we address
            </h2>
            <p className="text-slate-500 text-base sm:text-lg">
              Transform Your Life with Mindhouse: Your Path to Wellness and Fulfillment
            </p>
          </div>

          {/* Interactive Card Slider */}
          <div className="relative">
            {/* Nav Arrows */}
            <button
              onClick={prevConcern}
              className="absolute -left-4 sm:-left-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-600 hover:text-purple-600 hover:border-purple-200 transition"
              aria-label="Previous concern"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={nextConcern}
              className="absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-600 hover:text-purple-600 hover:border-purple-200 transition"
              aria-label="Next concern"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Slider Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
              {concerns.slice(concernIndex, concernIndex + 3).map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={idx}
                    className="flex flex-col items-center text-center p-8 rounded-3xl bg-slate-50/60 border border-slate-100 hover:bg-white hover:border-slate-200 hover:shadow-xl transition duration-300"
                  >
                    {/* Circular Illustrated Badge */}
                    <div className="w-24 h-24 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center mb-6 relative">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center ${item.pill}`}>
                        <IconComponent className="w-8 h-8 text-slate-700" />
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed max-w-xs">{item.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Slider Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {[0, 1, 2, 3].map((dot) => (
                <button
                  key={dot}
                  onClick={() => setConcernIndex(dot)}
                  className={`h-2 rounded-full transition-all ${
                    concernIndex === dot ? "w-6 bg-purple-600" : "w-2 bg-slate-200"
                  }`}
                  aria-label={`Go to slide ${dot + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Discover Your Perfect Therapist (Image 3) */}
      <section className="py-24 bg-[#2b0d66] text-white relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6 tracking-tight">
            Discover your perfect Therapist <br className="hidden sm:inline" />
            with Mindhouse
          </h2>

          <p className="text-base sm:text-lg text-purple-200 max-w-3xl mx-auto mb-16 font-light leading-relaxed">
            Our signature questionnaire, <span className="underline decoration-purple-300 font-medium">The Harmony Profile</span>, delves into your personality and needs, guiding us to match you with the ideal therapist. Our diverse team brings a wealth of experiences and expertise across various fields and walks of life.
          </p>

          {/* Central Silhouette Head Wire Visual */}
          <div className="max-w-2xl mx-auto mb-20 relative h-64 sm:h-80 flex items-center justify-center">
            <svg
              viewBox="0 0 600 300"
              className="w-full h-full max-h-80 drop-shadow-2xl"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Left Silhouette (Calm Spiral) */}
              <g className="text-purple-300/40">
                <path
                  d="M140 260 C140 260 140 230 140 220 C140 190 120 180 120 150 C120 110 145 70 190 70 C240 70 270 100 270 150 C270 180 250 200 250 220 C250 240 250 260 250 260 Z"
                  fill="currentColor"
                  opacity="0.3"
                />
                {/* Spiral Lines in left head */}
                <path
                  d="M195 150 A15 15 0 0 1 210 165 A30 30 0 0 1 180 195 A45 45 0 0 1 135 150 A60 60 0 0 1 195 90 A75 75 0 0 1 270 165"
                  stroke="#c4b5fd"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                />
              </g>

              {/* Connecting Thread */}
              <path
                d="M270 165 C320 165 330 155 380 155"
                stroke="#e9d5ff"
                strokeWidth="3"
                strokeDasharray="6 6"
                className="animate-pulse"
              />

              {/* Right Silhouette (Tangled Scribble) */}
              <g className="text-purple-300/40">
                <path
                  d="M460 260 C460 260 460 230 460 220 C460 190 480 180 480 150 C480 110 455 70 410 70 C360 70 330 100 330 150 C330 180 350 200 350 220 C350 240 350 260 350 260 Z"
                  fill="currentColor"
                  opacity="0.3"
                />
                {/* Tangled Scribble in right head */}
                <path
                  d="M380 155 C390 130 420 120 440 140 C460 160 430 180 410 160 C390 140 430 110 450 125 C470 140 420 170 395 165 C370 160 390 135 425 135 C460 135 450 175 420 180 C390 185 410 150 435 145"
                  stroke="#c4b5fd"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </g>
            </svg>
          </div>

          {/* 3 Key Stats at Bottom */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-purple-800/60 text-left">
            <div>
              <div className="text-4xl font-bold text-white mb-2">70%</div>
              <p className="text-purple-200 text-sm">
                Female therapists for diverse perspectives and relatable empathy.
              </p>
            </div>

            <div>
              <div className="text-4xl font-bold text-white mb-2">50% Therapists</div>
              <p className="text-purple-200 text-sm">
                Speak multiple languages. Insights from 25+ cities and diverse backgrounds.
              </p>
            </div>

            <div>
              <div className="text-4xl font-bold text-white mb-2">250+ years</div>
              <p className="text-purple-200 text-sm">
                Of combined experience to empower your well-being and personal growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Train Your Mind Interactive Practice Widget (Image 4) */}
      <section id="meditation" className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3 tracking-tight">
            Train your mind with Mindhouse
          </h2>
          <p className="text-slate-500 text-base sm:text-lg mb-10">
            Practice with our specially designed content, tailored for your goals
          </p>

          {/* Practice Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
            {practiceTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActivePracticeTab(tab)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                  activePracticeTab === tab
                    ? "bg-white text-slate-900 border-2 border-slate-900 shadow-sm"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Benefits Pastel Green Banner */}
          <div className="bg-[#e4f7eb] text-[#1e6b3c] font-medium text-xs sm:text-sm py-3 px-6 rounded-2xl max-w-3xl mx-auto mb-8 shadow-sm">
            Benefits of {activePracticeTab}: Improve Focus, Manage Anxiety, Anger Management
          </div>

          {/* Interactive Player Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-8 text-left">
            {/* Left Audio Details */}
            <div className="flex-1 w-full">
              <span className="inline-block bg-[#fff0e6] text-[#e8602b] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
                FREE SAMPLE
              </span>

              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Musical Mindfulness
              </h3>
              <p className="text-slate-500 text-sm mb-6">
                Train your mind to build awareness and focus on the present moment
              </p>

              {/* Scrubber Bar */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden relative">
                  <div
                    className="h-full bg-purple-600 transition-all duration-300"
                    style={{ width: `${(audioSeconds / 119) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs font-medium text-slate-400 min-w-16">
                  {formatAudioTime(audioSeconds)} / 01:59
                </span>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-11 h-11 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-700 flex items-center justify-center transition shrink-0"
                  aria-label={isPlaying ? "Pause audio" : "Play audio"}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 fill-current" />
                  ) : (
                    <Play className="w-5 h-5 fill-current translate-x-0.5" />
                  )}
                </button>
              </div>

              <button
                onClick={() => alert("Redirecting to session consultation with Dr. Adya Vats")}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#7a5af8] hover:bg-[#6847f2] text-white font-medium text-sm transition shadow-md shadow-purple-500/20"
              >
                Continue in Mindhouse App
              </button>
            </div>

            {/* Right Visual (Zen Stones) */}
            <div className="w-full md:w-64 h-64 relative rounded-2xl overflow-hidden shadow-md shrink-0 bg-slate-900">
              <Image
                src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80"
                alt="Zen meditation stones representing mindfulness"
                fill
                sizes="(max-width: 768px) 100vw, 256px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                <p className="font-semibold text-sm">Musical Mindfulness</p>
                <p className="text-[11px] text-slate-300">Train your mind to build awareness</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Unlock Full Experience & Form (Image 5) */}
      <section id="booking-section" className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            {/* Left Perks List */}
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-8">
                Unlock the full Mindhouse <br />
                experience
              </h2>

              <ul className="space-y-5">
                {[
                  "Early access to Mindhouse therapy & Meditation Classes.",
                  "Early bird discounts across platform.",
                  "Access to exclusive Mindhouse content on App.",
                  "Daily inspirational content to start your day right.",
                ].map((perk, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span className="text-slate-700 text-base font-normal">{perk}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Callback Form */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl">
              {formSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-7 h-7 stroke-[2.5]" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Request Received!</h3>
                  <p className="text-sm text-slate-600">
                    Thank you! Our care coordinator will connect with you via WhatsApp/call shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="sr-only">Enter your name</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm bg-slate-50/50"
                    />
                  </div>

                  <div className="flex gap-2">
                    <div className="flex items-center gap-1 px-3 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 text-sm font-medium">
                      <span>+91</span>
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    </div>
                    <input
                      type="tel"
                      required
                      placeholder="Enter your phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="flex-1 px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm bg-slate-50/50"
                    />
                  </div>

                  <div>
                    <label className="sr-only">Select your focus area</label>
                    <select
                      value={focusArea}
                      onChange={(e) => setFocusArea(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm bg-slate-50/50 text-slate-700"
                    >
                      <option>Select your focus area</option>
                      <option>Anxiety & Overwhelm</option>
                      <option>Depression & Low Energy</option>
                      <option>Relationship & Couples Therapy</option>
                      <option>Burnout & Corporate Stress</option>
                      <option>Trauma & Grief Counselling</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-[#7a5af8] hover:bg-[#6847f2] text-white font-medium text-sm transition shadow-md shadow-purple-500/20"
                  >
                    Submit details
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Wavy Purple Safe Space Banner (Image 5 Bottom) */}
        <div id="community" className="bg-[#b39ef7] text-slate-900 pt-16 pb-20 relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-2">
                A safe space for sharing and support
              </h2>
              <p className="text-slate-800/80 text-sm sm:text-base">
                Be a part of our Mindhouse community.
              </p>
            </div>

            {/* Mobile App Confidentiality Showcase */}
            <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8">
              {/* Phone Mockup Window */}
              <div className="w-full max-w-sm bg-slate-900 rounded-[2.5rem] p-4 shadow-2xl border-4 border-slate-800 text-white">
                <div className="bg-slate-950 rounded-2xl p-4">
                  <div className="flex justify-between items-center text-xs text-slate-400 mb-4 pb-2 border-b border-slate-800">
                    <span className="font-semibold text-white">Mindhouse Community</span>
                    <span className="bg-purple-900/60 text-purple-300 text-[10px] px-2 py-0.5 rounded-full">
                      Protected
                    </span>
                  </div>

                  {/* Anonymous Switch Demonstration */}
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <span className="text-xs font-semibold text-slate-200">
                        Do you want to post this anonymously?
                      </span>
                      <button
                        onClick={() => setIsAnonymous(!isAnonymous)}
                        className={`w-12 h-6 rounded-full transition p-1 flex items-center ${
                          isAnonymous ? "bg-emerald-500 justify-end" : "bg-slate-700 justify-start"
                        }`}
                      >
                        <div className="w-4 h-4 rounded-full bg-white shadow"></div>
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-tight">
                      {isAnonymous
                        ? "Other users won't be able to see your name and profile picture."
                        : "Your public display name will be visible to members."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Security Benefit Reassurance */}
              <div className="max-w-xs text-left">
                <div className="w-12 h-12 rounded-2xl bg-white/30 backdrop-blur-md flex items-center justify-center mb-4 text-slate-900">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Speak your mind without fear.
                </h3>
                <p className="text-slate-800/80 text-sm leading-relaxed mb-4">
                  Connect with others on a deeper level while maintaining your complete privacy on Mindhouse.
                </p>
                <div className="inline-flex items-center gap-2 text-xs font-semibold bg-white/40 px-3 py-1.5 rounded-full">
                  <span>Join our Community</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section (Image 6) */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
              Testimonials
            </h2>
            <p className="text-slate-500 text-base sm:text-lg">
              Stories of growth and resilience with Mindhouse
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-lg shadow-slate-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full overflow-hidden relative bg-purple-100 shrink-0">
                    <Image
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
                      alt="Monica Thukral"
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Monica Thukral</h3>
                    <p className="text-xs text-slate-400">Mindfulness Member</p>
                  </div>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed italic">
                  &ldquo;My morning meditation classes with Mindhouse have made my work days much more productive! I feel completely fresh &amp; energized through the day, and my ability to focus at work has improved. The cyclic meditation class is my favorite, with an interesting mix of movements and meditation.&rdquo;
                </p>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-lg shadow-slate-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full overflow-hidden relative bg-blue-100 shrink-0">
                    <Image
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
                      alt="Prabir Banerjee"
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Prabir Banerjee</h3>
                    <p className="text-xs text-slate-400">Therapy Client</p>
                  </div>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed italic">
                  &ldquo;I love the goal based meditation classes on the Mindhouse app. The instructors make it very easy for beginners to follow. The productivity tools have been especially helpful while working from home. I absolutely recommend it to anyone feeling stressed or anxious!&rdquo;
                </p>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-lg shadow-slate-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full overflow-hidden relative bg-emerald-100 shrink-0">
                    <Image
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
                      alt="Shantanu Saha"
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Shantanu Saha</h3>
                    <p className="text-xs text-slate-400">Corporate Member</p>
                  </div>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed italic">
                  &ldquo;The first class was so interesting that I immediately signed up for an unlimited membership. The awesome studio, extremely user-friendly app, wonderful trainers, extremely helpful staff and the various sessions have me hooked!&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Train your mind at Mindhouse - Warm Split Gallery (Image 7) */}
      <section id="corporate" className="py-24 bg-[#faf5ee] border-t border-slate-200/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-5 text-left">
              <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-6 leading-tight">
                Train your mind at Mindhouse
              </h2>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-8">
                Mindhouse is your personal mind gym to help you take care of your mental well-being. We offer a diverse range of exercises and tools designed to strengthen your emotional resilience, boost mindfulness, and foster a positive mindset.
              </p>

              {/* App / Booking Action Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="#booking-section"
                  className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm transition shadow-lg flex items-center gap-2"
                >
                  <span>Book a Consultation</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <Link
                  href="/services"
                  className="px-6 py-3.5 rounded-xl bg-white border border-slate-300 hover:border-slate-400 text-slate-800 font-medium text-sm transition shadow-sm"
                >
                  View All Services
                </Link>
              </div>
            </div>

            {/* Right Asymmetrical Photo Collage (Matches Image 7) */}
            <div className="lg:col-span-7 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                {/* Photo 1: Meditating on dock */}
                <div className="h-64 sm:h-72 relative rounded-3xl overflow-hidden shadow-md">
                  <Image
                    src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80"
                    alt="Man meditating peacefully outdoors"
                    fill
                    sizes="(max-width: 768px) 50vw, 400px"
                    className="object-cover hover:scale-105 transition duration-500"
                  />
                </div>

                {/* Photo 2: Headphone mindfulness */}
                <div className="h-64 sm:h-72 relative rounded-3xl overflow-hidden shadow-md">
                  <Image
                    src="https://images.unsplash.com/photo-1516307365426-bea591f05011?auto=format&fit=crop&w=800&q=80"
                    alt="Listening to guided mindfulness audio"
                    fill
                    sizes="(max-width: 768px) 50vw, 400px"
                    className="object-cover hover:scale-105 transition duration-500"
                  />
                </div>
              </div>

              {/* Photo 3: Therapy session room */}
              <div className="h-[33rem] sm:h-[37rem] relative rounded-3xl overflow-hidden shadow-md">
                <Image
                  src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&w=800&q=80"
                  alt="Therapy and supportive group space"
                  fill
                  sizes="(max-width: 768px) 50vw, 400px"
                  className="object-cover hover:scale-105 transition duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-900 tracking-tight">MINDHOUSE</span>
            <span className="text-slate-300">|</span>
            <span>Dr. Adya Vats Practice Design Concept</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/tempPages" className="text-purple-600 hover:text-purple-700 font-medium">
              View Design Hub
            </Link>
            <Link href="/" className="hover:text-slate-900">
              Live Website
            </Link>
            <span>&copy; {new Date().getFullYear()} Mindhouse Demo. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
