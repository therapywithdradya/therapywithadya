"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  X,
  Lock,
} from "lucide-react";

export default function DesignTwoPage() {
  // Stepper state for the BetterHelp style interactive intake
  const [step, setStep] = useState<number>(1);

  // Question 1: Type of therapy
  const [therapyType, setTherapyType] = useState<string>("Individual (for myself)");

  // Question 2: Concerns / Reasons (Multi-select)
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([
    "I feel anxious or overwhelmed",
  ]);

  const concernsList = [
    "I've been feeling depressed or low on energy",
    "I feel anxious or overwhelmed",
    "My mood is interfering with my daily routine or work",
    "I struggle with building or maintaining relationships",
    "I want to understand and process past emotional wounds or trauma",
    "I am grieving or coping with loss",
    "I need to talk through a specific life transition or challenge",
    "I want to gain self-confidence and quiet self-doubt",
    "I want to improve emotional regulation through mindfulness",
    "Recommended to me (friend, family, doctor)",
    "Just exploring therapeutic support",
    "Other personal growth goals",
  ];

  const toggleConcern = (item: string) => {
    setSelectedConcerns((prev) =>
      prev.includes(item) ? prev.filter((c) => c !== item) : [...prev, item]
    );
  };

  // Question 3: Preferred Session Format
  const [selectedFormat, setSelectedFormat] = useState<string>("individual-60");

  // Question 4: Client Info
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");

  // Confirmation state
  const [isCompleted, setIsCompleted] = useState(false);

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#242926] font-sans antialiased">
      {/* Top Demo Bar */}
      <div className="bg-[#1f3b2b] text-emerald-100 text-xs py-2 px-4 flex items-center justify-between border-b border-emerald-900/50">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-medium">Sample Design 2 Demo • BetterHelp Style (Intake &amp; Therapy Matching)</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/tempPages" className="text-emerald-300 hover:text-white underline font-medium">
            ← Design Hub
          </Link>
          <Link href="/tempPages/design-1" className="text-emerald-200 hover:text-white">
            Switch to Design 1
          </Link>
        </div>
      </div>

      {/* BetterHelp Style Clean Minimalist Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#e8e4dc] shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/tempPages/design-2" className="flex items-center gap-2.5 group">
            {/* Two overlapping leaf/hand shapes reminiscent of BetterHelp */}
            <div className="w-9 h-9 rounded-full bg-[#2e5b3f] flex items-center justify-center text-white shadow-sm group-hover:bg-[#254b34] transition">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15.06c-3.12-.42-5.5-3.1-5.5-6.06 0-1.87.84-3.54 2.16-4.66.39-.33.97-.23 1.25.21.27.42.17.98-.22 1.31C7.86 8.56 7.3 9.71 7.3 11c0 2.21 1.79 4 4 4 .28 0 .5-.22.5-.5V12c0-.55.45-1 1-1h1.5c.55 0 1 .45 1 1v1.5c0 1.93-1.57 3.5-3.5 3.56z" />
              </svg>
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-[#2e5b3f] block leading-none">
                Dr. Adya Vats
              </span>
              <span className="text-[10px] tracking-wider uppercase text-emerald-800 font-semibold block mt-0.5">
                Psychologist &amp; Psychotherapy Practice
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#3b4740]">
            <a href="#about" className="hover:text-[#2e5b3f] transition">About</a>
            <a href="#services" className="hover:text-[#2e5b3f] transition">Services</a>
            <a href="#comparison" className="hover:text-[#2e5b3f] transition">Why Online Therapy</a>
            <a href="#outcomes" className="hover:text-[#2e5b3f] transition">Clinical Outcomes</a>
            <Link href="/tempPages/design-2/contact" className="hover:text-[#2e5b3f] transition">Contact</Link>
          </nav>

          {/* Action Button */}
          <div className="flex items-center gap-3">
            <Link
              href="/tempPages/design-2/book"
              className="px-5 py-2.5 rounded-full border-2 border-[#2e5b3f] text-[#2e5b3f] hover:bg-[#2e5b3f] hover:text-white text-sm font-semibold transition"
            >
              Book a session
            </Link>
          </div>
        </div>
      </header>

      {/* Main Interactive Questionnaire Container (Images 1-8) */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Horizontal Segmented Progress Bar */}
        <div className="flex items-center justify-center gap-2 max-w-md mx-auto mb-10">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                step >= i ? "bg-[#2e5b3f]" : "bg-[#ded9cf]"
              }`}
            />
          ))}
        </div>

        {/* STEP 1: What type of therapy are you looking for? (Image 1) */}
        {step === 1 && (
          <div className="text-center animate-fadeIn">
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#1f2923] tracking-tight mb-4">
              Help us match you to the{" "}
              <span className="text-[#2e5b3f] italic font-medium">right therapeutic space</span>
            </h1>
            <p className="text-base sm:text-lg text-[#55635a] max-w-2xl mx-auto mb-10 font-normal leading-relaxed">
              It’s important to have a therapeutic space where you feel genuinely heard and understood. The following questions help tailor your consultation with Dr. Adya Vats according to your pace, boundaries, and personal goals.
            </p>

            {/* Centered Selection Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#e8e4dc] shadow-sm max-w-xl mx-auto text-left">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1f2923] mb-6 text-center">
                What type of therapy are you looking for?
              </h2>

              <div className="space-y-3.5 mb-8">
                {[
                  {
                    title: "Individual (for myself)",
                    desc: "Anxiety, stress, mood, self-doubt, grief, or life transitions",
                  },
                  {
                    title: "Couples (for myself and my partner)",
                    desc: "Communication, attachment healing, and recurring conflicts",
                  },
                  {
                    title: "Adolescent / Young Adult (for my child or student)",
                    desc: "Academic stress, emotional regulation, and self-esteem",
                  },
                  {
                    title: "Professional Supervision / Mentorship",
                    desc: "Case discussions and therapy-room confidence for budding psychologists",
                  },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setTherapyType(item.title);
                      setStep(2);
                    }}
                    className={`w-full py-4 px-6 rounded-2xl text-left border-2 transition duration-200 flex items-center justify-between ${
                      therapyType === item.title
                        ? "bg-[#eef7f0] border-[#2e5b3f] text-[#1f3b2b] shadow-sm"
                        : "bg-[#85c98a]/20 hover:bg-[#85c98a]/35 border-transparent text-[#1f3b2b]"
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-base">{item.title}</p>
                      <p className="text-xs text-[#526659] mt-0.5">{item.desc}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#2e5b3f] shrink-0 ml-2" />
                  </button>
                ))}
              </div>

              {/* Bottom Info Pill Banner (Matches Image 1) */}
              <div className="bg-[#eaf4ec] text-[#224d33] p-4 rounded-2xl flex items-start gap-3 text-xs sm:text-sm">
                <div className="w-5 h-5 rounded-full bg-[#2e5b3f] text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                  i
                </div>
                <p className="leading-relaxed">
                  Let’s walk through your preferences! We’ll start off with a few brief questions to help Dr. Adya prepare your session roadmap.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: What led you to consider therapy today? (Image 2) */}
        {step === 2 && (
          <div className="max-w-xl mx-auto animate-fadeIn">
            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#2e5b3f] hover:underline mb-6"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous question</span>
            </button>

            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#e8e4dc] shadow-sm">
              <h2 className="text-2xl font-serif font-bold text-[#1f2923] mb-2">
                What led you to consider therapy today?
              </h2>
              <p className="text-xs text-[#55635a] mb-6">
                Select all that apply. This helps Dr. Adya understand what you are currently carrying.
              </p>

              <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
                {concernsList.map((item, idx) => {
                  const isChecked = selectedConcerns.includes(item);

                  return (
                    <label
                      key={idx}
                      onClick={() => toggleConcern(item)}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                        isChecked
                          ? "bg-[#eaf4ec] border-[#2e5b3f] text-[#1c3826]"
                          : "bg-white border-[#ded9cf] hover:border-[#b0c4b5] text-[#334238]"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center mt-0.5 shrink-0 transition ${
                          isChecked
                            ? "bg-[#2e5b3f] border-[#2e5b3f] text-white"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className="text-sm font-medium leading-snug">{item}</span>
                    </label>
                  );
                })}
              </div>

              <div className="mt-8 pt-4 border-t border-[#f0ede6] flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={selectedConcerns.length === 0}
                  className="px-8 py-3.5 rounded-full bg-[#85c98a] hover:bg-[#6ebf74] text-white font-semibold text-sm transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Outcome Metrics & Comparison (Images 5 & 6) */}
        {step === 3 && (
          <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn">
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#2e5b3f] hover:underline"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous question</span>
            </button>

            {/* Outcome Gauge Card (Image 6) */}
            <div className="bg-white rounded-3xl p-8 border border-[#e8e4dc] shadow-sm text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-[#eaf4ec] px-3 py-1 rounded-full">
                CLINICAL IMPACT &amp; GROWTH
              </span>
              <h2 className="text-2xl font-serif font-bold text-[#1f2923] mt-3 mb-8">
                After 3 months of therapy with Dr. Adya
              </h2>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-10 mb-8">
                {/* 69% Anxiety Flower Gauge */}
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-[#a8e0b2] via-[#c6ebd0] to-[#e4f7ea] flex items-center justify-center relative shadow-inner">
                    <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <span className="text-2xl font-bold text-[#2e5b3f]">69%</span>
                    </div>
                  </div>
                  <p className="text-xs text-[#526659] mt-3 font-medium max-w-[180px]">
                    Of clients with anxiety experienced notable improvement
                  </p>
                </div>

                {/* 73% Depression Flower Gauge */}
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-[#98d8df] via-[#bfe8ec] to-[#e1f5f7] flex items-center justify-center relative shadow-inner">
                    <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <span className="text-2xl font-bold text-[#1f666f]">73%</span>
                    </div>
                  </div>
                  <p className="text-xs text-[#526659] mt-3 font-medium max-w-[180px]">
                    Of clients with low mood &amp; overwhelm regained emotional clarity
                  </p>
                </div>
              </div>
            </div>

            {/* Comparison Table: Dr. Adya vs. Traditional In-Office (Image 5) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e8e4dc] shadow-sm">
              <h3 className="text-xl font-serif font-bold text-[#1f2923] text-center mb-6">
                Dr. Adya Practice vs. traditional in-office clinic
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-[#e8e4dc]">
                      <th className="py-3 px-3 font-semibold text-[#55635a]">Feature</th>
                      <th className="py-3 px-3 font-bold text-white bg-[#2e5b3f] rounded-t-xl text-center">
                        Dr. Adya Practice
                      </th>
                      <th className="py-3 px-3 font-semibold text-[#55635a] text-center">
                        Traditional Clinic
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0ede6]">
                    {[
                      {
                        label: "Provided by qualified, trauma-informed psychologist",
                        drAdya: true,
                        traditional: true,
                      },
                      {
                        label: "Flexible online sessions worldwide",
                        drAdya: true,
                        traditional: false,
                      },
                      {
                        label: "Between-session reflective tools & exercises",
                        drAdya: true,
                        traditional: false,
                      },
                      {
                        label: "Trauma-informed, paced therapy room",
                        drAdya: true,
                        traditional: true,
                      },
                      {
                        label: "Direct coordination & prompt WhatsApp confirmation",
                        drAdya: true,
                        traditional: false,
                      },
                      {
                        label: "Transparent fees with zero hidden clinic charges",
                        drAdya: true,
                        traditional: false,
                      },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-[#faf8f5]">
                        <td className="py-3 px-3 text-[#334238] font-medium">{row.label}</td>
                        <td className="py-3 px-3 text-center bg-[#f2f8f4]">
                          {row.drAdya ? (
                            <div className="w-5 h-5 rounded-full bg-[#2e5b3f] text-white flex items-center justify-center mx-auto">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          ) : (
                            <X className="w-4 h-4 text-red-500 mx-auto" />
                          )}
                        </td>
                        <td className="py-3 px-3 text-center">
                          {row.traditional ? (
                            <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                          ) : (
                            <X className="w-4 h-4 text-slate-400 mx-auto" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-8 py-3.5 rounded-full bg-[#85c98a] hover:bg-[#6ebf74] text-white font-semibold text-sm transition shadow-sm"
                >
                  Continue to Select Format
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Choose Session Format (Dr. Adya's Real Offerings) */}
        {step === 4 && (
          <div className="max-w-xl mx-auto animate-fadeIn">
            <button
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#2e5b3f] hover:underline mb-6"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous step</span>
            </button>

            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#e8e4dc] shadow-sm">
              <h2 className="text-2xl font-serif font-bold text-[#1f2923] mb-2">
                Select your preferred session format
              </h2>
              <p className="text-xs text-[#55635a] mb-6">
                All consultations are conducted one-on-one via secure Google Meet or in-person by appointment.
              </p>

              <div className="space-y-3.5 mb-8">
                {[
                  {
                    id: "individual-30",
                    title: "Individual Therapy (30 min)",
                    duration: "30 minutes",
                    price: "₹1,000",
                    desc: "Focused session for immediate concerns and actionable clarity.",
                  },
                  {
                    id: "individual-60",
                    title: "Individual Therapy (60 min)",
                    duration: "60 minutes",
                    price: "₹2,000",
                    popular: true,
                    desc: "Deep therapeutic space to explore emotions, root patterns, and growth.",
                  },
                  {
                    id: "couples-60",
                    title: "Couples Therapy (60–75 min)",
                    duration: "60–75 minutes",
                    price: "₹3,000",
                    desc: "Supportive space for couples to communicate openly and build connection.",
                  },
                ].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedFormat(item.id)}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition relative ${
                      selectedFormat === item.id
                        ? "bg-[#eef7f0] border-[#2e5b3f]"
                        : "bg-white border-[#ded9cf] hover:border-[#b0c4b5]"
                    }`}
                  >
                    {item.popular && (
                      <span className="absolute top-3 right-4 bg-[#2e5b3f] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                        Most Popular
                      </span>
                    )}

                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className="font-bold text-[#1f2923] text-base">{item.title}</h4>
                      <span className="text-lg font-bold text-[#2e5b3f]">{item.price}</span>
                    </div>
                    <p className="text-xs text-[#526659] leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(5)}
                  className="px-8 py-3.5 rounded-full bg-[#85c98a] hover:bg-[#6ebf74] text-white font-semibold text-sm transition shadow-sm"
                >
                  Continue to Your Details
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Your Details & Communication Channels */}
        {step === 5 && (
          <div className="max-w-xl mx-auto animate-fadeIn">
            <button
              onClick={() => setStep(4)}
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#2e5b3f] hover:underline mb-6"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous step</span>
            </button>

            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#e8e4dc] shadow-sm">
              <h2 className="text-2xl font-serif font-bold text-[#1f2923] mb-2">
                Where should we send your session details?
              </h2>
              <p className="text-xs text-[#55635a] mb-6">
                Your information is held under strict professional and clinical confidentiality.
              </p>

              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-xs font-bold text-[#334238] uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#ded9cf] focus:outline-none focus:ring-2 focus:ring-[#2e5b3f] text-sm bg-[#faf8f5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#334238] uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#ded9cf] focus:outline-none focus:ring-2 focus:ring-[#2e5b3f] text-sm bg-[#faf8f5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#334238] uppercase tracking-wider mb-1">
                    WhatsApp / Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#ded9cf] focus:outline-none focus:ring-2 focus:ring-[#2e5b3f] text-sm bg-[#faf8f5]"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (!clientName || !clientEmail || !clientPhone) {
                      alert("Please provide your name, email, and phone number.");
                      return;
                    }
                    setStep(6);
                  }}
                  className="px-8 py-3.5 rounded-full bg-[#85c98a] hover:bg-[#6ebf74] text-white font-semibold text-sm transition shadow-sm"
                >
                  Review &amp; Schedule
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: Welcome Onboarding & Consultation Confirmation (Images 7 & 8) */}
        {step === 6 && (
          <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn">
            {/* Welcome Banner (Matches Images 7 & 8) */}
            <div className="bg-white rounded-3xl p-8 border border-[#e8e4dc] shadow-sm">
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1f2923] mb-4 text-center">
                {clientName ? `${clientName}, welcome` : "Welcome"} to Therapy with Dr. Adya!
              </h2>

              {/* Info Green Alert (Image 7) */}
              <div className="bg-[#eaf4ec] text-[#224d33] p-4 rounded-2xl flex items-start gap-3 text-xs sm:text-sm mb-8">
                <div className="w-5 h-5 rounded-full bg-[#2e5b3f] text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                  i
                </div>
                <p className="leading-relaxed">
                  Thanks for sharing your preferences! As we prepare your consultation, please review the following guide and begin your therapeutic journey.
                </p>
              </div>

              {/* What Happens Next? (Image 7) */}
              <div className="space-y-6 text-sm text-[#3b4740] mb-8 border-b border-[#f0ede6] pb-8">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#1f2923] mb-3">What happens next?</h3>
                  <ul className="space-y-2.5">
                    <li className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#2e5b3f] mt-2 shrink-0"></div>
                      <span>You will receive a personalized intake confirmation from Dr. Adya Vats.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#2e5b3f] mt-2 shrink-0"></div>
                      <span>Dr. Adya will thoughtfully review what you have shared and connect with you to confirm your date &amp; time.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#2e5b3f] mt-2 shrink-0"></div>
                      <span>You can begin communicating online, and your healing journey starts in a safe, confidential space.</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-serif font-bold text-lg text-[#1f2923] mb-3">Who will be your therapist?</h3>
                  <p className="text-xs text-[#55635a] mb-3">
                    Your profile matches directly with Dr. Adya Vats based on your focus areas:
                  </p>
                  <div className="flex items-center gap-4 bg-[#faf8f5] p-4 rounded-2xl border border-[#ded9cf]">
                    <div className="w-14 h-14 rounded-full overflow-hidden relative shrink-0 bg-purple-100">
                      <Image
                        src="/images/dr-adya-portrait.jpg"
                        alt="Dr. Adya Vats"
                        fill
                        className="object-cover object-top"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-base text-[#1f2923]">Dr. Adya Vats</p>
                      <p className="text-xs text-[#526659]">
                        Psychologist • Trauma-Informed, REBT &amp; CBT Therapist • 5+ Years Experience
                      </p>
                    </div>
                  </div>
                </div>

                {/* Session Cost & Payment Card (Images 3 & 4) */}
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#1f2923] mb-3">Consultation Fee &amp; Confirmation</h3>

                  <div className="bg-[#fcfbf9] rounded-2xl p-5 border border-[#e8e4dc] space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#ded9cf]">
                      <span className="font-semibold text-sm">
                        {selectedFormat === "individual-30"
                          ? "Individual Therapy (30 min)"
                          : selectedFormat === "couples-60"
                          ? "Couples Therapy (60–75 min)"
                          : "Individual Therapy (60 min)"}
                      </span>
                      <span className="font-bold text-lg text-[#2e5b3f]">
                        {selectedFormat === "individual-30"
                          ? "₹1,000"
                          : selectedFormat === "couples-60"
                          ? "₹3,000"
                          : "₹2,000"}
                      </span>
                    </div>

                    {/* Benefit code pill */}
                    <div className="bg-[#eaf4ec] text-[#224d33] text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Introductory Consultation Session • 100% Confidential</span>
                    </div>

                    {isCompleted ? (
                      <div className="p-4 bg-emerald-100 text-emerald-900 rounded-xl text-center text-sm font-semibold">
                        ✓ Consultation Request Confirmed! Dr. Adya will message you on {clientPhone}.
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsCompleted(true)}
                        className="w-full py-4 rounded-full bg-[#85c98a] hover:bg-[#6ebf74] text-white font-bold text-sm transition shadow-md flex items-center justify-center gap-2"
                      >
                        <Lock className="w-4 h-4" />
                        <span>Confirm &amp; Start Therapy Journey</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Link
                  href="/tempPages"
                  className="text-xs text-[#2e5b3f] hover:underline font-semibold"
                >
                  ← Return to Design Hub
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* BetterHelp Styled Footer */}
      <footer className="bg-white border-t border-[#e8e4dc] py-12 mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-[#6e7d73]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-sm text-[#2e5b3f]">Therapy with Dr. Adya</span>
              <span>•</span>
              <span>Sample Design 2 Demo (BetterHelp Aesthetic)</span>
            </div>
            <div className="flex gap-4">
              <Link href="/tempPages/design-2/contact" className="hover:text-[#2e5b3f]">Contact</Link>
              <Link href="/tempPages/design-2/book" className="hover:text-[#2e5b3f]">Book a Session</Link>
              <Link href="/tempPages" className="text-[#2e5b3f] font-semibold">Design Hub</Link>
            </div>
          </div>
          <p className="border-t border-[#f0ede6] pt-4 text-[#8a9990] leading-relaxed">
            Emergency note: If you are in crisis or experiencing an emergency, please do not use this site. Contact national emergency services at 112 or Tele-MANAS at 14416.
          </p>
        </div>
      </footer>
    </div>
  );
}
