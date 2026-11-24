"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Brain,
  Sparkles,
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
import { DemoHeader } from "./components/demo-header";
import { DemoFooter } from "./components/demo-footer";

export default function DesignOnePage() {
  // Concerns slider state
  const concerns = [
    {
      title: "Anxiety & Stress",
      desc: "Learn to quiet racing thoughts, manage panic and chronic worry, and cultivate grounded coping strategies.",
      icon: Sun,
      color: "bg-amber-50 text-amber-600 border-amber-100",
      pill: "bg-amber-100/70",
    },
    {
      title: "Depression & Low Mood",
      desc: "Rebuild emotional vitality, understand difficult internal patterns, and reconnect with energy and meaning.",
      icon: Heart,
      color: "bg-purple-50 text-purple-600 border-purple-100",
      pill: "bg-purple-100/70",
    },
    {
      title: "Relationship Concerns",
      desc: "Navigate recurring conflicts, understand attachment needs, and build healthier, more communicative bonds.",
      icon: Compass,
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
      pill: "bg-emerald-100/70",
    },
    {
      title: "Trauma & Grief",
      desc: "A trauma-informed space respecting your boundaries to process loss, difficult experiences, and life transitions.",
      icon: Feather,
      color: "bg-rose-50 text-rose-600 border-rose-100",
      pill: "bg-rose-100/70",
    },
    {
      title: "Self-Doubt & Transitions",
      desc: "Challenge limiting beliefs, clarify career and life directions, and build unshakeable self-compassion.",
      icon: Smile,
      color: "bg-blue-50 text-blue-600 border-blue-100",
      pill: "bg-blue-100/70",
    },
    {
      title: "Burnout & Overwhelm",
      desc: "Escape the cycle of exhaustion, set healthy emotional boundaries, and restore harmony to your work and life.",
      icon: Flame,
      color: "bg-orange-50 text-orange-600 border-orange-100",
      pill: "bg-orange-100/70",
    },
  ];

  const [concernIndex, setConcernIndex] = useState(0);
  const nextConcern = () => {
    setConcernIndex((prev) => (prev + 1 >= concerns.length - 2 ? 0 : prev + 1));
  };
  const prevConcern = () => {
    setConcernIndex((prev) => (prev - 1 < 0 ? concerns.length - 3 : prev - 1));
  };

  // Approaches / Modalities tabbed interactive widget
  const approachTabs = [
    {
      id: "trauma-informed",
      label: "Trauma-Informed",
      heading: "Trauma-Informed Therapy",
      tagline: "Safety, pacing, and empowerment at your own pace",
      description:
        "Creating a safe, compassionate, and empowering space that recognises the impact of past experiences while respecting each person’s pace, boundaries, and sense of safety.",
      benefits:
        "Benefits: Emotional Safety • Respects Boundaries • Rebuilds Inner Trust • Paced Processing",
      practiceTitle: "Grounding & Somatic Safety Check-in",
      practiceDuration: "02:30",
    },
    {
      id: "emotion-focused",
      label: "Emotion-Focused",
      heading: "Emotion-Focused Approach",
      tagline: "Making sense of emotions rather than suppressing them",
      description:
        "Helping you understand, process, and make sense of your emotions, rather than simply suppressing, intellectualising, or avoiding them in daily life.",
      benefits:
        "Benefits: Emotional Awareness • Unpacking Triggers • Reducing Numbness • Self-Validation",
      practiceTitle: "Mindful Emotion Naming & Softening",
      practiceDuration: "02:00",
    },
    {
      id: "cbt-rebt",
      label: "REBT & CBT",
      heading: "REBT & CBT Therapy",
      tagline: "Cognitive restructuring & healthier behavioral responses",
      description:
        "Using cognitive and behavioural techniques to identify unhelpful thought patterns, challenge limiting beliefs, and develop healthier ways of thinking and responding to life.",
      benefits:
        "Benefits: Cognitive Restructuring • Reframing Automatic Thoughts • Behavioral Activation",
      practiceTitle: "Thought Reframing & Thought-Record Exercise",
      practiceDuration: "03:15",
    },
    {
      id: "mindfulness",
      label: "Mindfulness-Based",
      heading: "Mindfulness-Based Practice",
      tagline: "Cultivating present-moment awareness & gentle presence",
      description:
        "Cultivating present-moment awareness and developing a more compassionate, curious relationship with your thoughts, emotions, and bodily experiences.",
      benefits:
        "Benefits: Decreased Rumination • Nervous System Regulation • Focus • Present Awareness",
      practiceTitle: "5-Sense Sensory Anchor & Mindful Breathing",
      practiceDuration: "02:15",
    },
    {
      id: "hypnotherapy",
      label: "Hypnotherapy",
      heading: "Clinical Hypnotherapy",
      tagline: "Subconscious patterns & deep therapeutic change",
      description:
        "Using guided hypnosis to work with the deeper, subconscious patterns that influence thoughts, emotions, beliefs, and behaviours, supporting greater self-awareness.",
      benefits:
        "Benefits: Subconscious Alignment • Deep Relaxation • Releasing Habits • Core Healing",
      practiceTitle: "Subconscious Relaxation & Mental Sanctuary",
      practiceDuration: "03:00",
    },
    {
      id: "art-therapy",
      label: "Art Therapy",
      heading: "Art & Creative Expression",
      tagline: "Expressing thoughts beyond words",
      description:
        "Using creative expression to explore and communicate emotions, experiences, and thoughts that may feel too complex or difficult to put into ordinary words.",
      benefits:
        "Benefits: Non-Verbal Exploration • Somatic Release • Creative Catharsis • Insight",
      practiceTitle: "Guided Visual Reflection & Journaling Prompt",
      practiceDuration: "02:45",
    },
  ];

  const [activeApproachTab, setActiveApproachTab] = useState<(typeof approachTabs)[number]>(
    approachTabs[0] ?? {
      id: "trauma-informed",
      label: "Trauma-Informed",
      heading: "Trauma-Informed Therapy",
      tagline: "Safety, pacing, and empowerment at your own pace",
      description:
        "Creating a safe, compassionate, and empowering space that recognises the impact of past experiences while respecting each person’s pace, boundaries, and sense of safety.",
      benefits:
        "Benefits: Emotional Safety • Respects Boundaries • Rebuilds Inner Trust • Paced Processing",
      practiceTitle: "Grounding & Somatic Safety Check-in",
      practiceDuration: "02:30",
    }
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioSeconds, setAudioSeconds] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setAudioSeconds((prev) => {
          if (prev >= 150) {
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

  // Form submission state
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [focusArea, setFocusArea] = useState("Individual Counselling & Therapy");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setName("");
      setPhone("");
    }, 4500);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <DemoHeader />

      {/* Hero Section (Image 1 Structure with Dr. Adya's Real Tagline & Pillars) */}
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-purple-200 tracking-wider uppercase mb-6">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Therapy with Dr. Adya Vats
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6 leading-tight max-w-4xl mx-auto">
            A safe, compassionate space to acknowledge what you’re carrying, understand yourself more deeply, and take meaningful steps forward.
          </h1>

          <p className="text-base sm:text-lg text-slate-300 font-light max-w-2xl mx-auto mb-14 leading-relaxed">
            Supporting adolescents and adults through anxiety, stress, depression, self-doubt, trauma, relationship concerns, life transitions, and emotional wellbeing.
          </p>

          {/* 3 Glassmorphic Feature Cards (Dr. Adya's Core Approaches) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {/* Card 1: Trauma-Informed */}
            <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-left flex items-center gap-4 transition shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                <Shield className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-base">Trauma-Informed</h3>
                <p className="text-xs text-slate-300 mt-0.5">Pacing, boundaries, and safety</p>
              </div>
            </div>

            {/* Card 2: Emotion-Focused */}
            <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-left flex items-center gap-4 transition shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                <Heart className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-base">Emotion-Focused</h3>
                <p className="text-xs text-slate-300 mt-0.5">Making sense of deep emotions</p>
              </div>
            </div>

            {/* Card 3: Mindfulness-Based */}
            <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-left flex items-center gap-4 transition shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                <Brain className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-base">Mindfulness-Based</h3>
                <p className="text-xs text-slate-300 mt-0.5">Present awareness &amp; compassion</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Concerns We Address Section (Image 2) */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
              Concerns we address
            </h2>
            <p className="text-slate-500 text-base sm:text-lg">
              Personalised support tailored for where you are, at your own pace
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

      {/* Discover Your Path to Healing (Image 3 Structure with Dr. Adya's Real Background & Experience) */}
      <section className="py-24 bg-[#2b0d66] text-white relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6 tracking-tight">
            Discover your path forward <br className="hidden sm:inline" />
            with Dr. Adya Vats
          </h2>

          <p className="text-base sm:text-lg text-purple-200 max-w-3xl mx-auto mb-16 font-light leading-relaxed">
            My therapeutic approach is grounded in empathy, safety, and non-judgment. I view every client as the author of their own story, providing the tools, perspective, and compassionate containment needed to navigate emotional distress into lasting clarity.
          </p>

          {/* Central Silhouette Head Wire Visual */}
          <div className="max-w-2xl mx-auto mb-20 relative h-64 sm:h-80 flex items-center justify-center">
            <svg
              viewBox="0 0 600 300"
              className="w-full h-full max-h-80 drop-shadow-2xl"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Left Silhouette (Calm Spiral - Self-Awareness) */}
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

              {/* Right Silhouette (Tangled Scribble - Life Challenges) */}
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

          {/* 3 Key Stats at Bottom (Dr. Adya's Real Credentials & Reach) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-purple-800/60 text-left">
            <div>
              <div className="text-4xl font-bold text-white mb-2">1,000+</div>
              <p className="text-purple-200 text-sm">
                Clients guided through individual psychotherapy, emotional healing, and personal growth.
              </p>
            </div>

            <div>
              <div className="text-4xl font-bold text-white mb-2">Multi-Modality</div>
              <p className="text-purple-200 text-sm">
                Integrative care drawing from Trauma-Informed, REBT &amp; CBT, Mindfulness, and Hypnotherapy.
              </p>
            </div>

            <div>
              <div className="text-4xl font-bold text-white mb-2">5+ Years</div>
              <p className="text-purple-200 text-sm">
                Dedicated clinical practice, academic research, institutional workshops, and supervision.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* My Approaches & Interactive Reflective Widget (Image 4 Structure) */}
      <section id="approaches" className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3 tracking-tight">
            My Therapeutic Approaches
          </h2>
          <p className="text-slate-500 text-base sm:text-lg mb-10 max-w-2xl mx-auto">
            Tools and modalities selected and adapted according to your individual needs, comfort, and goals.
          </p>

          {/* Practice Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8">
            {approachTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveApproachTab(tab)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition ${
                  activeApproachTab.id === tab.id
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Benefits Pastel Green Banner */}
          <div className="bg-[#e4f7eb] text-[#1e6b3c] font-medium text-xs sm:text-sm py-3 px-6 rounded-2xl max-w-3xl mx-auto mb-8 shadow-sm">
            {activeApproachTab.benefits}
          </div>

          {/* Interactive Modality Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-8 text-left">
            {/* Left Content */}
            <div className="flex-1 w-full">
              <span className="inline-block bg-[#fff0e6] text-[#e8602b] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
                {activeApproachTab.label}
              </span>

              <h3 className="text-2xl font-bold text-slate-900 mb-1">
                {activeApproachTab.heading}
              </h3>
              <p className="text-purple-600 text-xs font-semibold mb-3">
                {activeApproachTab.tagline}
              </p>
              <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                {activeApproachTab.description}
              </p>

              {/* Scrubber Bar */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden relative">
                  <div
                    className="h-full bg-purple-600 transition-all duration-300"
                    style={{ width: `${(audioSeconds / 150) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs font-medium text-slate-400 min-w-16">
                  {formatAudioTime(audioSeconds)} / {activeApproachTab.practiceDuration}
                </span>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-11 h-11 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-700 flex items-center justify-center transition shrink-0"
                  aria-label={isPlaying ? "Pause practice" : "Play practice"}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 fill-current" />
                  ) : (
                    <Play className="w-5 h-5 fill-current translate-x-0.5" />
                  )}
                </button>
              </div>

              <Link
                href="/tempPages/design-1/book"
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#7a5af8] hover:bg-[#6847f2] text-white font-medium text-sm transition shadow-md shadow-purple-500/20 inline-block text-center"
              >
                Book a Session with Dr. Adya
              </Link>
            </div>

            {/* Right Visual (Zen Stones & Mindful Space) */}
            <div className="w-full md:w-64 h-64 relative rounded-2xl overflow-hidden shadow-md shrink-0 bg-slate-900">
              <Image
                src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80"
                alt="Mindfulness practice and safe therapeutic presence"
                fill
                sizes="(max-width: 768px) 100vw, 256px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                <p className="font-semibold text-sm">{activeApproachTab.practiceTitle}</p>
                <p className="text-[11px] text-slate-300">Reflective calming exercise</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services & Session Options Section (Image 5 Structure with Dr. Adya's Real Offerings) */}
      <section id="services" className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            {/* Left Services / Sessions Breakdown */}
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-100/70 px-3 py-1 rounded-full mb-4">
                What I Offer
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
                Personalised support for where you are
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                Explore one-on-one therapy, relationship support, institutional programs, professional mentorship, practical training, and reflective offerings.
              </p>

              <div className="space-y-4">
                {[
                  {
                    title: "Individual Counselling & Therapy",
                    meta: "30-min (₹1,000) • 60-min (₹2,000)",
                    desc: "Personalised, trauma-informed therapy to work through challenges and move forward with greater clarity.",
                  },
                  {
                    title: "Couples Therapy",
                    meta: "60–75 min (₹3,000)",
                    desc: "A supportive space for couples to communicate openly, work through recurring challenges, and rebuild connection.",
                  },
                  {
                    title: "Workshops & Institutional Programs",
                    meta: "Schools, Colleges & Corporates",
                    desc: "Customised mental health workshops on stress, burnout, emotional regulation, and resilience.",
                  },
                  {
                    title: "Supervision for Budding Psychologists",
                    meta: "Professional Mentorship",
                    desc: "Practical case guidance, structuring sessions, and building therapy-room confidence.",
                  },
                ].map((srv, i) => (
                  <div key={i} className="flex items-start gap-3 bg-white p-4 rounded-2xl border border-slate-200/70 shadow-sm">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-semibold text-slate-900 text-sm">{srv.title}</h4>
                        <span className="text-[11px] font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                          {srv.meta}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{srv.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Callback / Quick Booking Enquiry */}
            <div id="sessions" className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Book or Inquire About a Session</h3>
              <p className="text-xs text-slate-500 mb-6">
                Share your details and focus area. I will reach out to schedule your preferred time slot.
              </p>

              {formSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-7 h-7 stroke-[2.5]" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Enquiry Received</h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Thank you! I will connect with you via WhatsApp or email to confirm your session.
                  </p>
                  <Link
                    href="/book"
                    className="inline-block px-5 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-semibold"
                  >
                    Or Reserve Time Online Directly
                  </Link>
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
                      placeholder="Enter your phone or WhatsApp number"
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
                      <option>Individual Counselling &amp; Therapy (30 min / 60 min)</option>
                      <option>Couples Therapy (60–75 min)</option>
                      <option>Workshops &amp; Institutional Programs</option>
                      <option>Supervision for Budding Psychologists</option>
                      <option>Tarot Card Reading (Reflective Session)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-[#7a5af8] hover:bg-[#6847f2] text-white font-medium text-sm transition shadow-md shadow-purple-500/20"
                  >
                    Request Session Information
                  </button>

                  <div className="pt-2 text-center">
                    <Link
                      href="/tempPages/design-1/book"
                      className="text-xs text-purple-600 hover:text-purple-700 font-semibold"
                    >
                      Prefer instant online scheduling? Click here to book directly →
                    </Link>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Wavy Purple Confidentiality Banner (Image 5 Bottom) */}
        <div className="bg-[#b39ef7] text-slate-900 pt-16 pb-20 relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-2">
                A safe, confidential space for sharing and support
              </h2>
              <p className="text-slate-800/80 text-sm sm:text-base">
                Take the first step toward self-compassion and mental clarity.
              </p>
            </div>

            {/* Mobile App Confidentiality Demonstration */}
            <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8">
              {/* Privacy Mockup Window */}
              <div className="w-full max-w-sm bg-slate-900 rounded-[2.5rem] p-4 shadow-2xl border-4 border-slate-800 text-white">
                <div className="bg-slate-950 rounded-2xl p-4">
                  <div className="flex justify-between items-center text-xs text-slate-400 mb-4 pb-2 border-b border-slate-800">
                    <span className="font-semibold text-white">Client Privacy &amp; Boundaries</span>
                    <span className="bg-emerald-900/60 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full">
                      Strictly Confidential
                    </span>
                  </div>

                  {/* Anonymous / Privacy Switch Demonstration */}
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <span className="text-xs font-semibold text-slate-200">
                        Confidential consultation guarantee
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
                        ? "All session notes, disclosures, and communications are held in strict ethical containment."
                        : "Clinical records maintained strictly per ethical psychological guidelines."}
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
                  Everything you share remains safe, protected, and completely non-judgmental throughout your therapeutic journey.
                </p>
                <Link
                  href="/tempPages/design-1/contact"
                  className="inline-flex items-center gap-2 text-xs font-semibold bg-white/40 px-3 py-1.5 rounded-full hover:bg-white/60 transition"
                >
                  <span>Connect with Dr. Adya</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section (Image 6 Structure with Dr. Adya's Real Client Quotes) */}
      <section id="reviews" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
              Client Testimonials
            </h2>
            <p className="text-slate-500 text-base sm:text-lg">
              Stories of growth, resilience, and healing with Dr. Adya Vats
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Real Testimonial 1 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-lg shadow-slate-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full overflow-hidden relative bg-purple-100 text-purple-700 font-bold flex items-center justify-center shrink-0">
                    A
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Anonymous Client</h3>
                    <p className="text-xs text-slate-400">Individual Therapy</p>
                  </div>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed italic">
                  &ldquo;Regarding the feedback, I must say I was in the right place when I needed it the most. All your efforts are clearly reflected in my progress, and your ability to deeply understand and listen to someone in need is remarkable. Every session I had with you was very calming at that time, and it helped me a lot in overcoming that phase. I would rate every session 10 on 10.&rdquo;
                </p>
              </div>
            </div>

            {/* Real Testimonial 2 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-lg shadow-slate-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full overflow-hidden relative bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0">
                    S
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Therapy Client</h3>
                    <p className="text-xs text-slate-400">Anxiety &amp; Fear Management</p>
                  </div>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed italic">
                  &ldquo;Therapy sessions bahut helpful rahe. Therapist ne meri baat patience aur understanding ke saath suni. Unki guidance se mujhe anxiety aur fear ko better handle karne mein help mili. Sessions comfortable aur supportive feel hote hain. Main emotionally kaafi better feel kar rahi hoon. Highly recommended.&rdquo;
                </p>
              </div>
            </div>

            {/* Real Testimonial 3 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-lg shadow-slate-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full overflow-hidden relative bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0">
                    P
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Long-term Client</h3>
                    <p className="text-xs text-slate-400">Personal Growth &amp; Coping</p>
                  </div>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed italic">
                  &ldquo;I’ve been seeing Adya for a long time and I can honestly say it’s been a life-changing experience. She created a safe, non-judgmental space for me to explore my thoughts, emotions, and concerns. Adya is an exceptional listener, empathetic, and insightful. If you’re struggling with mental health issues or seeking personal growth, I highly recommend her.&rdquo;
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/reviews"
              className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-700"
            >
              <span>Read all client reflections &amp; reviews</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* About Dr. Adya Vats & Tranquil Space - Warm Split Gallery (Image 7 Structure) */}
      <section id="about" className="py-24 bg-[#faf5ee] border-t border-slate-200/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content (Dr. Adya's Real Bio) */}
            <div className="lg:col-span-5 text-left">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-3 py-1 rounded-full mb-4">
                About Dr. Adya Vats
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-6 leading-tight">
                A space where you can come as you are
              </h2>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-4">
                Hi, I’m Dr. Adya Vats. With 5 years of experience, I believe therapy begins with acknowledging what you’re going through, understanding yourself with greater compassion, and finding a way forward with clarity and self-awareness.
              </p>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8">
                My work is trauma-informed, compassionate, and tailored to you — helping you navigate life’s challenges, understand your patterns, and create meaningful change. You don’t have to figure it out alone.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/tempPages/design-1/book"
                  className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm transition shadow-lg flex items-center gap-2"
                >
                  <span>Book a Session</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/about"
                  className="px-6 py-3.5 rounded-xl bg-white border border-slate-300 hover:border-slate-400 text-slate-800 font-medium text-sm transition shadow-sm"
                >
                  Read Full Bio &amp; Qualifications
                </Link>
              </div>
            </div>

            {/* Right Asymmetrical Photo Collage (Using Dr. Adya's Real Practice Photos) */}
            <div className="lg:col-span-7 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                {/* Photo 1: Dr. Adya Portrait */}
                <div className="h-64 sm:h-72 relative rounded-3xl overflow-hidden shadow-md bg-purple-50">
                  <Image
                    src="/images/dr-adya-portrait.jpg"
                    alt="Dr. Adya Vats - Psychologist and Counselor"
                    fill
                    sizes="(max-width: 768px) 50vw, 400px"
                    className="object-cover object-top hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                    <p className="font-semibold text-sm">Dr. Adya Vats</p>
                    <p className="text-[11px] text-slate-200">Psychologist &amp; Counselor</p>
                  </div>
                </div>

                {/* Photo 2: Art Therapy / Workshop */}
                <div className="h-64 sm:h-72 relative rounded-3xl overflow-hidden shadow-md bg-slate-100">
                  <Image
                    src="/images/gallery-art-therapy.jpg"
                    alt="Art Therapy and creative healing workshop"
                    fill
                    sizes="(max-width: 768px) 50vw, 400px"
                    className="object-cover hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                    <p className="font-semibold text-sm">Art Therapy &amp; Creative Expression</p>
                    <p className="text-[11px] text-slate-200">Expressing beyond words</p>
                  </div>
                </div>
              </div>

              {/* Photo 3: Therapy Room Space */}
              <div className="h-[33rem] sm:h-[37rem] relative rounded-3xl overflow-hidden shadow-md bg-slate-100">
                <Image
                  src="/images/hero-space.jpg"
                  alt="Tranquil and welcoming therapy space for Dr. Adya Vats practice"
                  fill
                  sizes="(max-width: 768px) 50vw, 400px"
                  className="object-cover hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                  <p className="font-bold text-base">A Calming, Grounded Space</p>
                  <p className="text-xs text-slate-200 mt-1">
                    Online worldwide and in-person consultations by appointment
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <DemoFooter />
    </div>
  );
}
