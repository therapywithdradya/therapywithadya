"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Check,
  Sparkles,
  Compass,
  MapPin,
  Mail,
  Quote,
  Feather,
  Shield,
} from "lucide-react";

export default function DesignThreePage() {
  const [activeTab, setActiveTab] = useState<"individual" | "couples" | "institutional" | "tarot">("individual");
  const [selectedFormat, setSelectedFormat] = useState<string>("ind-60");
  const [inquirySent, setInquirySent] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", concern: "" });

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySent(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C2420] font-serif antialiased selection:bg-[#EADDCF] selection:text-[#2C2420]">
      {/* Top Notice / Hub Link */}
      <div className="bg-[#2C2420] text-[#EDE4D8] px-4 py-2.5 text-xs tracking-wider uppercase flex items-center justify-between font-sans">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#B85D38] inline-block animate-pulse"></span>
            Sample Design 3: Atelier Serene • Warm Earthy Editorial
          </span>
          <Link
            href="/tempPages"
            className="text-[#D8A783] hover:text-white transition underline underline-offset-4 font-semibold"
          >
            ← Back to Design Review Hub
          </Link>
        </div>
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#EADDCF]/80">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-baseline gap-3">
            <Link href="/tempPages/design-3" className="text-2xl font-bold tracking-tight text-[#2C2420]">
              Dr. Adya Vats
            </Link>
            <span className="hidden sm:inline-block text-xs font-sans uppercase tracking-widest text-[#846D62] border-l border-[#D6C4B4] pl-3">
              Psychologist &amp; Art Therapist
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 font-sans text-sm tracking-wide text-[#5C4D44]">
            <a href="#philosophy" className="hover:text-[#2C2420] transition">
              Philosophy
            </a>
            <a href="#services" className="hover:text-[#2C2420] transition">
              Offerings &amp; Fees
            </a>
            <a href="#about" className="hover:text-[#2C2420] transition">
              About
            </a>
            <a href="#reflections" className="hover:text-[#2C2420] transition">
              Client Reflections
            </a>
            <a href="#inquire" className="hover:text-[#2C2420] transition">
              Inquire
            </a>
          </nav>

          <div className="flex items-center gap-3 font-sans">
            <a
              href="#inquire"
              className="px-5 py-2.5 rounded-full bg-[#B85D38] text-white text-xs font-medium uppercase tracking-wider hover:bg-[#9E4A28] transition shadow-sm"
            >
              Book Consultation
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-24 md:pt-24 md:pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFE6DC] border border-[#DFCFC0] text-[#785E50] text-xs font-sans tracking-wide uppercase">
              <Feather className="w-3.5 h-3.5 text-[#B85D38]" />
              Trauma-Informed • Compassionate • Confidential
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.15] text-[#2C2420]">
              Therapy that holds space for <span className="italic font-normal text-[#B85D38]">your whole story</span>.
            </h1>

            <p className="font-sans text-lg sm:text-xl text-[#67544A] leading-relaxed max-w-2xl font-light">
              A gentle, reflective haven designed to help you slow down, untangle overwhelming thoughts,
              and reconnect with genuine clarity, self-compassion, and inner grounding.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 font-sans">
              <a
                href="#services"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#2C2420] text-[#FAF7F2] text-sm uppercase tracking-wider font-medium hover:bg-[#433731] transition shadow-md"
              >
                <span>View Session Offerings</span>
                <ArrowRight className="w-4 h-4 text-[#D8A783]" />
              </a>

              <a
                href="#about"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full border border-[#CBB6A5] text-[#4F3F36] text-sm uppercase tracking-wider font-medium hover:bg-[#EFE7DC] transition"
              >
                <span>The Practice</span>
              </a>
            </div>

            {/* Quick reassurance strip */}
            <div className="pt-8 border-t border-[#E8DCCF] grid grid-cols-3 gap-6 font-sans">
              <div>
                <p className="text-2xl font-serif text-[#2C2420]">1,000+</p>
                <p className="text-xs text-[#846D62] mt-0.5">Therapy Hours</p>
              </div>
              <div>
                <p className="text-2xl font-serif text-[#2C2420]">Worldwide</p>
                <p className="text-xs text-[#846D62] mt-0.5">Online &amp; In-Person</p>
              </div>
              <div>
                <p className="text-2xl font-serif text-[#2C2420]">1-on-1</p>
                <p className="text-xs text-[#846D62] mt-0.5">Tailored Pace</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md">
              {/* Decorative arched border */}
              <div className="absolute -inset-3 rounded-t-[140px] rounded-b-3xl border border-[#D9C6B4] -rotate-1 pointer-events-none" />
              
              <div className="relative overflow-hidden rounded-t-[130px] rounded-b-2xl shadow-xl border-4 border-[#FAF7F2] bg-[#EAE0D4]">
                <Image
                  src="/images/dr-adya-portrait.jpg"
                  alt="Dr. Adya Vats - Psychologist"
                  width={600}
                  height={750}
                  className="w-full h-auto object-cover transform hover:scale-105 transition duration-700"
                  priority
                />
              </div>

              {/* Float quote tag */}
              <div className="absolute -bottom-6 -left-6 bg-[#FAF7F2] border border-[#DFCFC0] p-4 rounded-2xl shadow-lg max-w-xs font-sans">
                <Quote className="w-5 h-5 text-[#B85D38] mb-1 opacity-70" />
                <p className="text-xs italic text-[#5C4C42] leading-relaxed">
                  &ldquo;Healing is not about becoming someone new, but gently letting go of what is not yours to carry.&rdquo;
                </p>
                <p className="text-[10px] uppercase font-bold tracking-widest text-[#93786A] mt-2">
                  — Dr. Adya Vats
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy & Approach Section */}
      <section id="philosophy" className="py-20 bg-[#F2ECE3] border-y border-[#E4D7C8] px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-sans uppercase tracking-widest text-[#B85D38] font-bold">
              Therapeutic Grounding
            </span>
            <h2 className="text-3xl sm:text-4xl font-normal text-[#2C2420] mt-3 mb-4">
              An integrative space rooted in warmth, empathy, and precision.
            </h2>
            <p className="font-sans text-[#6B574C] font-light leading-relaxed">
              Every mind carries a unique emotional architecture. My practice weaves together cognitive clarity,
              creative expression, and mindful regulation so you feel heard without judgment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#FAF7F2] p-8 rounded-2xl border border-[#E0D2C3] shadow-sm hover:border-[#B85D38]/50 transition duration-300">
              <div className="w-12 h-12 rounded-full bg-[#EFE4D6] flex items-center justify-center text-[#B85D38] mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-normal text-[#2C2420] mb-3">Trauma-Informed Care</h3>
              <p className="font-sans text-sm text-[#6C594E] leading-relaxed font-light">
                Creating safe, boundaried spaces where past wounds are held gently, respecting your pacing and emotional nervous system.
              </p>
            </div>

            <div className="bg-[#FAF7F2] p-8 rounded-2xl border border-[#E0D2C3] shadow-sm hover:border-[#B85D38]/50 transition duration-300">
              <div className="w-12 h-12 rounded-full bg-[#EFE4D6] flex items-center justify-center text-[#B85D38] mb-6">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-normal text-[#2C2420] mb-3">Cognitive &amp; REBT Tools</h3>
              <p className="font-sans text-sm text-[#6C594E] leading-relaxed font-light">
                Actionable frameworks to examine belief systems, untangle catastrophizing loops, and cultivate practical emotional resilience.
              </p>
            </div>

            <div className="bg-[#FAF7F2] p-8 rounded-2xl border border-[#E0D2C3] shadow-sm hover:border-[#B85D38]/50 transition duration-300">
              <div className="w-12 h-12 rounded-full bg-[#EFE4D6] flex items-center justify-center text-[#B85D38] mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-normal text-[#2C2420] mb-3">Art Therapy &amp; Mindfulness</h3>
              <p className="font-sans text-sm text-[#6C594E] leading-relaxed font-light">
                Expressive modalities that allow emotions beyond verbal vocabulary to emerge and gently process through somatic awareness.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services & Pricing Section */}
      <section id="services" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs font-sans uppercase tracking-widest text-[#B85D38] font-bold">
              Offerings &amp; Investment
            </span>
            <h2 className="text-3xl sm:text-5xl font-normal text-[#2C2420] mt-3">
              Clear, transparent pathways to care.
            </h2>
          </div>
          <p className="font-sans text-sm text-[#745F53] max-w-md font-light leading-relaxed">
            All sessions are held in strict clinical confidentiality. Available both online via secure video call or in-person by appointment.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-12 border-b border-[#E2D4C6] pb-4 font-sans">
          <button
            onClick={() => setActiveTab("individual")}
            className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-wider font-medium transition ${
              activeTab === "individual"
                ? "bg-[#2C2420] text-[#FAF7F2]"
                : "bg-transparent text-[#6D594F] hover:bg-[#EFE6DC]"
            }`}
          >
            01 • Individual Psychotherapy
          </button>
          <button
            onClick={() => setActiveTab("couples")}
            className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-wider font-medium transition ${
              activeTab === "couples"
                ? "bg-[#2C2420] text-[#FAF7F2]"
                : "bg-transparent text-[#6D594F] hover:bg-[#EFE6DC]"
            }`}
          >
            02 • Couples Therapy
          </button>
          <button
            onClick={() => setActiveTab("institutional")}
            className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-wider font-medium transition ${
              activeTab === "institutional"
                ? "bg-[#2C2420] text-[#FAF7F2]"
                : "bg-transparent text-[#6D594F] hover:bg-[#EFE6DC]"
            }`}
          >
            03 • Institutional &amp; Supervision
          </button>
          <button
            onClick={() => setActiveTab("tarot")}
            className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-wider font-medium transition ${
              activeTab === "tarot"
                ? "bg-[#2C2420] text-[#FAF7F2]"
                : "bg-transparent text-[#6D594F] hover:bg-[#EFE6DC]"
            }`}
          >
            06 • Intuitive Reflection (Tarot)
          </button>
        </div>

        {/* Tab 1: Individual Psychotherapy */}
        {activeTab === "individual" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#FAF7F2] border border-[#DECFC0] rounded-3xl p-8 sm:p-10 relative flex flex-col justify-between hover:shadow-lg transition">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#B85D38]">
                      30 Minutes • Focused Space
                    </span>
                    <h3 className="text-2xl font-normal text-[#2C2420] mt-1">
                      Individual Psychotherapy (30 min)
                    </h3>
                  </div>
                  <span className="text-3xl font-normal text-[#2C2420]">₹1,000</span>
                </div>
                <p className="font-sans text-sm text-[#665348] font-light leading-relaxed mb-6">
                  A focused, compassionate session tailored to address immediate concerns, emotional overwhelm, or specific situational stress.
                </p>
                <div className="space-y-2.5 font-sans text-xs text-[#58453B] mb-8">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#B85D38]" />
                    <span>One-on-one focused guidance &amp; coping tools</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#B85D38]" />
                    <span>Gentle emotional check-in &amp; ground setting</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#B85D38]" />
                    <span>Online video session link provided upon confirmation</span>
                  </div>
                </div>
              </div>
              <a
                href="#inquire"
                onClick={() => setSelectedFormat("ind-30")}
                className="w-full py-3.5 rounded-full border border-[#2C2420] text-[#2C2420] text-xs font-sans uppercase tracking-widest text-center font-medium hover:bg-[#2C2420] hover:text-[#FAF7F2] transition"
              >
                Reserve 30-Min Session
              </a>
            </div>

            <div className="bg-[#FAF7F2] border-2 border-[#B85D38] rounded-3xl p-8 sm:p-10 relative flex flex-col justify-between shadow-md">
              <div className="absolute -top-3.5 right-8 bg-[#B85D38] text-white text-[10px] font-sans uppercase font-bold tracking-widest px-3 py-1 rounded-full">
                Most Comprehensive
              </div>
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#B85D38]">
                      60 Minutes • Deep Dive
                    </span>
                    <h3 className="text-2xl font-normal text-[#2C2420] mt-1">
                      Individual Psychotherapy (60 min)
                    </h3>
                  </div>
                  <span className="text-3xl font-normal text-[#2C2420]">₹2,000</span>
                </div>
                <p className="font-sans text-sm text-[#665348] font-light leading-relaxed mb-6">
                  A deeper, reflective therapeutic space to explore root emotional patterns, unpack trauma, build insight, and cultivate lasting self-awareness.
                </p>
                <div className="space-y-2.5 font-sans text-xs text-[#58453B] mb-8">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#B85D38]" />
                    <span>In-depth exploratory psychotherapy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#B85D38]" />
                    <span>Integration of REBT, CBT, and Art Therapy elements</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#B85D38]" />
                    <span>Personalized reflective takeaways and self-care plans</span>
                  </div>
                </div>
              </div>
              <a
                href="#inquire"
                onClick={() => setSelectedFormat("ind-60")}
                className="w-full py-3.5 rounded-full bg-[#B85D38] text-white text-xs font-sans uppercase tracking-widest text-center font-medium hover:bg-[#9C4B29] transition shadow-sm"
              >
                Reserve 60-Min Session
              </a>
            </div>
          </div>
        )}

        {/* Tab 2: Couples Therapy */}
        {activeTab === "couples" && (
          <div className="bg-[#FAF7F2] border border-[#DECFC0] rounded-3xl p-8 sm:p-12 max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <span className="text-xs font-sans uppercase font-bold tracking-wider text-[#B85D38]">
                  60 - 75 Minutes • Joint Space
                </span>
                <h3 className="text-3xl font-normal text-[#2C2420] mt-1">Couples Therapy</h3>
              </div>
              <span className="text-4xl font-normal text-[#2C2420]">₹3,000</span>
            </div>
            <p className="font-sans text-base text-[#665348] font-light leading-relaxed mb-8">
              A balanced, non-judgmental space for partners to speak openly, bridge misunderstandings,
              break repetitive arguments, and rebuild authentic emotional intimacy.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-xs text-[#524137] mb-8">
              <div className="p-4 rounded-xl bg-[#F3EDE4] border border-[#E3D6C9]">
                <p className="font-bold text-[#2C2420] mb-1">Constructive Dialogue</p>
                <p className="font-light">Unravel communication breakdowns without hostility or blame.</p>
              </div>
              <div className="p-4 rounded-xl bg-[#F3EDE4] border border-[#E3D6C9]">
                <p className="font-bold text-[#2C2420] mb-1">Attachment Repair</p>
                <p className="font-light">Understand emotional triggers, vulnerabilities, and shared goals.</p>
              </div>
            </div>
            <a
              href="#inquire"
              onClick={() => setSelectedFormat("couples-75")}
              className="inline-block w-full py-4 rounded-full bg-[#2C2420] text-white text-xs font-sans uppercase tracking-widest text-center font-medium hover:bg-[#433731] transition"
            >
              Reserve Couples Session (₹3,000)
            </a>
          </div>
        )}

        {/* Tab 3: Institutional & Mentorship */}
        {activeTab === "institutional" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#FAF7F2] border border-[#DECFC0] rounded-3xl p-8 flex flex-col justify-between">
              <div>
                <span className="text-xs font-sans uppercase font-bold tracking-wider text-[#B85D38]">
                  Schools, Universities &amp; Corporate Teams
                </span>
                <h3 className="text-2xl font-normal text-[#2C2420] mt-2 mb-4">
                  Workshops &amp; Institutional Programs
                </h3>
                <p className="font-sans text-sm text-[#665348] font-light leading-relaxed mb-6">
                  Interactive mental health modules on stress &amp; burnout management, emotional regulation, resilience,
                  and workplace psychological safety.
                </p>
              </div>
              <a
                href="#inquire"
                onClick={() => setSelectedFormat("workshop")}
                className="w-full py-3.5 rounded-full border border-[#2C2420] text-[#2C2420] text-xs font-sans uppercase tracking-widest text-center font-medium hover:bg-[#2C2420] hover:text-white transition"
              >
                Inquire For Your Organization
              </a>
            </div>

            <div className="bg-[#FAF7F2] border border-[#DECFC0] rounded-3xl p-8 flex flex-col justify-between">
              <div>
                <span className="text-xs font-sans uppercase font-bold tracking-wider text-[#B85D38]">
                  Professional Mentorship
                </span>
                <h3 className="text-2xl font-normal text-[#2C2420] mt-2 mb-4">
                  Supervision for Budding Psychologists
                </h3>
                <p className="font-sans text-sm text-[#665348] font-light leading-relaxed mb-6">
                  Case conceptualization, ethical practice, and guidance on navigating complex client dynamics in the therapy room.
                </p>
              </div>
              <a
                href="#inquire"
                onClick={() => setSelectedFormat("supervision")}
                className="w-full py-3.5 rounded-full border border-[#2C2420] text-[#2C2420] text-xs font-sans uppercase tracking-widest text-center font-medium hover:bg-[#2C2420] hover:text-white transition"
              >
                Request Clinical Supervision
              </a>
            </div>
          </div>
        )}

        {/* Tab 4: Intuitive Reflection */}
        {activeTab === "tarot" && (
          <div className="bg-[#FAF7F2] border border-[#DECFC0] rounded-3xl p-8 sm:p-12 max-w-3xl mx-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-xs font-sans uppercase font-bold tracking-wider text-[#B85D38]">
                  06 • Intuitive Reflection
                </span>
                <h3 className="text-3xl font-normal text-[#2C2420] mt-1">Tarot Card Reading</h3>
              </div>
              <span className="text-xs font-sans uppercase px-3 py-1 bg-[#EFE6DC] rounded-full text-[#7B6355]">
                Reflective Space
              </span>
            </div>
            <p className="font-sans text-base text-[#665348] font-light leading-relaxed mb-6">
              Looking for a little clarity, reflection, or a different perspective? Tarot readings offer a reflective space
              to explore your thoughts, questions, emotions, and possibilities — helping you pause, reflect, and look at your situation from a fresh angle.
            </p>
            <p className="text-xs font-sans text-[#8C7567] italic mb-8">
              Offered as a reflective tool alongside therapeutic offerings. Held in full respect and confidentiality.
            </p>
            <a
              href="#inquire"
              onClick={() => setSelectedFormat("tarot")}
              className="inline-block w-full py-4 rounded-full bg-[#B85D38] text-white text-xs font-sans uppercase tracking-widest text-center font-medium hover:bg-[#9E4A28] transition"
            >
              Inquire About a Tarot Reading
            </a>
          </div>
        )}
      </section>

      {/* Practitioner Bio Section */}
      <section id="about" className="py-24 bg-[#FAF7F2] border-t border-[#E8DDCF] px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-5">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-[#DECFC0]">
              <Image
                src="/images/hero-space.jpg"
                alt="Therapy space"
                width={500}
                height={600}
                className="w-full h-80 sm:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2C2420]/80 via-transparent to-transparent flex items-end p-6">
                <p className="text-white text-sm font-sans font-light">
                  A serene, private setting dedicated to your comfort and peace of mind.
                </p>
              </div>
            </div>
          </div>

          <div className="md:col-span-7 space-y-6">
            <span className="text-xs font-sans uppercase tracking-widest text-[#B85D38] font-bold">
              About The Practitioner
            </span>
            <h2 className="text-3xl sm:text-4xl font-normal text-[#2C2420]">
              Meet Dr. Adya Vats
            </h2>
            <p className="font-sans text-sm sm:text-base text-[#67544A] leading-relaxed font-light">
              I am a Clinical Psychologist, Art Therapist, and counselor dedicated to walking alongside individuals as they navigate anxiety, relationship challenges, grief, and life transitions.
            </p>
            <p className="font-sans text-sm sm:text-base text-[#67544A] leading-relaxed font-light">
              My therapeutic stance values depth over quick fixes. Whether through structured cognitive techniques (CBT/REBT) or creative modalities like Art Therapy, we work at a pace that honors your story.
            </p>

            <div className="pt-4 grid grid-cols-2 gap-4 font-sans text-xs text-[#524137]">
              <div className="p-3.5 rounded-xl bg-[#F4EDE4] border border-[#DECFC0]">
                <p className="font-bold text-[#2C2420]">Qualifications</p>
                <p className="text-[#6D5A50] mt-0.5 font-light">MA Clinical Psychology • Art Therapist</p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#F4EDE4] border border-[#DECFC0]">
                <p className="font-bold text-[#2C2420]">Modalities</p>
                <p className="text-[#6D5A50] mt-0.5 font-light">REBT, CBT, Mindfulness &amp; Gestalt</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Client Reflections */}
      <section id="reflections" className="py-20 bg-[#F4EDE4] px-6 border-y border-[#E2D4C6]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-sans uppercase tracking-widest text-[#B85D38] font-bold">
              Voices of Transformation
            </span>
            <h2 className="text-3xl sm:text-4xl font-normal text-[#2C2420] mt-2">
              Words from those who walked this path.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#FAF7F2] p-8 rounded-2xl border border-[#DDCFC0] flex flex-col justify-between">
              <div>
                <Quote className="w-6 h-6 text-[#B85D38] opacity-60 mb-4" />
                <p className="text-sm font-sans text-[#5A483E] leading-relaxed font-light italic">
                  &ldquo;Adya gave me a space where I didn&rsquo;t have to pretend everything was fine. For the first time in years, my anxiety felt manageable.&rdquo;
                </p>
              </div>
              <p className="text-xs font-sans font-bold text-[#8C7466] uppercase tracking-wider mt-6">
                — Client (Individual Therapy)
              </p>
            </div>

            <div className="bg-[#FAF7F2] p-8 rounded-2xl border border-[#DDCFC0] flex flex-col justify-between">
              <div>
                <Quote className="w-6 h-6 text-[#B85D38] opacity-60 mb-4" />
                <p className="text-sm font-sans text-[#5A483E] leading-relaxed font-light italic">
                  &ldquo;Couples therapy with Dr. Adya completely changed how my partner and I communicate during disagreements. She was compassionate to both of us.&rdquo;
                </p>
              </div>
              <p className="text-xs font-sans font-bold text-[#8C7466] uppercase tracking-wider mt-6">
                — Couples Client
              </p>
            </div>

            <div className="bg-[#FAF7F2] p-8 rounded-2xl border border-[#DDCFC0] flex flex-col justify-between">
              <div>
                <Quote className="w-6 h-6 text-[#B85D38] opacity-60 mb-4" />
                <p className="text-sm font-sans text-[#5A483E] leading-relaxed font-light italic">
                  &ldquo;The art therapy sessions unlocked feelings I couldn&rsquo;t put into words. It felt completely natural and deeply grounding.&rdquo;
                </p>
              </div>
              <p className="text-xs font-sans font-bold text-[#8C7466] uppercase tracking-wider mt-6">
                — Workshop &amp; Individual Client
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Inquire & Booking Section */}
      <section id="inquire" className="py-24 px-6 max-w-4xl mx-auto">
        <div className="bg-[#FAF7F2] border border-[#DECFC0] rounded-3xl p-8 sm:p-14 shadow-md">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-sans uppercase tracking-widest text-[#B85D38] font-bold">
              Begin Your Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-normal text-[#2C2420] mt-2 mb-3">
              Request Your Initial Session
            </h2>
            <p className="font-sans text-sm text-[#745F53] font-light">
              Send a note directly to Dr. Adya Vats. You will receive a response within 24 hours with available time slots.
            </p>
          </div>

          {inquirySent ? (
            <div className="bg-[#EFE7DC] border border-[#D6C4B4] rounded-2xl p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#B85D38] text-white flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-normal text-[#2C2420]">Inquiry Received with Care</h3>
              <p className="font-sans text-sm text-[#665449] max-w-md mx-auto font-light leading-relaxed">
                Thank you, {formData.name || "friend"}. Dr. Adya Vats has received your note and will get back to you at {formData.email || "your email"} promptly.
              </p>
              <button
                onClick={() => setInquirySent(false)}
                className="mt-4 px-6 py-2.5 rounded-full border border-[#2C2420] text-xs font-sans uppercase tracking-widest text-[#2C2420] hover:bg-[#2C2420] hover:text-white transition"
              >
                Send Another Note
              </button>
            </div>
          ) : (
            <form onSubmit={handleInquirySubmit} className="space-y-6 font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase font-medium text-[#6B574C] mb-2 tracking-wider">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name"
                    className="w-full px-4 py-3.5 rounded-xl border border-[#D2C3B4] bg-[#FDFBF9] text-[#2C2420] text-sm focus:outline-none focus:border-[#B85D38]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-medium text-[#6B574C] mb-2 tracking-wider">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3.5 rounded-xl border border-[#D2C3B4] bg-[#FDFBF9] text-[#2C2420] text-sm focus:outline-none focus:border-[#B85D38]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-medium text-[#6B574C] mb-2 tracking-wider">
                  Service Format of Interest
                </label>
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border border-[#D2C3B4] bg-[#FDFBF9] text-[#2C2420] text-sm focus:outline-none focus:border-[#B85D38]"
                >
                  <option value="ind-60">Individual Psychotherapy (60 min - ₹2,000)</option>
                  <option value="ind-30">Individual Psychotherapy (30 min - ₹1,000)</option>
                  <option value="couples-75">Couples Therapy (60-75 min - ₹3,000)</option>
                  <option value="workshop">Workshops &amp; Institutional Programs</option>
                  <option value="supervision">Supervision for Budding Psychologists</option>
                  <option value="tarot">Tarot Card Reading (Reflective Session)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase font-medium text-[#6B574C] mb-2 tracking-wider">
                  What brings you to therapy? (Optional &amp; Confidential)
                </label>
                <textarea
                  rows={4}
                  value={formData.concern}
                  onChange={(e) => setFormData({ ...formData, concern: e.target.value })}
                  placeholder="Share anything you feel comfortable sharing, or simply request available consultation times..."
                  className="w-full px-4 py-3.5 rounded-xl border border-[#D2C3B4] bg-[#FDFBF9] text-[#2C2420] text-sm focus:outline-none focus:border-[#B85D38]"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-full bg-[#B85D38] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#9E4A28] transition shadow-md"
              >
                Send Confidential Inquiry
              </button>
            </form>
          )}

          <div className="mt-8 pt-8 border-t border-[#E8DCCF] flex flex-wrap items-center justify-between gap-4 font-sans text-xs text-[#7B6658]">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#B85D38]" />
              adyavats13@gmail.com
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#B85D38]" />
              Online (Worldwide) &amp; In-Person by Appointment
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#241D19] text-[#E0D5C7] py-14 px-6 border-t border-[#3A302A] font-sans">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#9B887B]">
          <div>
            <p className="font-serif text-lg text-[#F4EDE4] font-normal mb-1">Dr. Adya Vats</p>
            <p>Clinical Psychology • Art Therapy • Cognitive Guidance</p>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/tempPages" className="text-[#D8A783] hover:text-white transition underline underline-offset-4 font-medium">
              Client Design Review Hub
            </Link>
            <Link href="/tempPages/design-1" className="hover:text-white transition">
              Sample Design 1
            </Link>
            <Link href="/tempPages/design-2" className="hover:text-white transition">
              Sample Design 2
            </Link>
          </div>

          <p>© {new Date().getFullYear()} Dr. Adya Vats. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
