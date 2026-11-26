"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, MapPin, Check, Send, ArrowRight, ShieldCheck, ArrowLeft } from "lucide-react";

export default function DesignTwoContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [inquiryType, setInquiryType] = useState("Individual Psychotherapy");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    }, 4500);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#242926] font-sans antialiased">
      {/* Top Demo Bar */}
      <div className="bg-[#1f3b2b] text-emerald-100 text-xs py-2 px-4 flex items-center justify-between border-b border-emerald-900/50">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-medium">Sample Design 2 Demo • Contact (BetterHelp Aesthetic)</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/tempPages" className="text-emerald-300 hover:text-white underline font-medium">
            ← Design Hub
          </Link>
          <Link href="/tempPages/design-2" className="text-emerald-200 hover:text-white">
            Design 2 Home
          </Link>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#e8e4dc] shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/tempPages/design-2" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#2e5b3f] flex items-center justify-center text-white shadow-sm">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15.06c-3.12-.42-5.5-3.1-5.5-6.06 0-1.87.84-3.54 2.16-4.66.39-.33.97-.23 1.25.21.27.42.17.98-.22 1.31C7.86 8.56 7.3 9.71 7.3 11c0 2.21 1.79 4 4 4 .28 0 .5-.22.5-.5V12c0-.55.45-1 1-1h1.5c.55 0 1 .45 1 1v1.5c0 1.93-1.57 3.5-3.5 3.56z" />
              </svg>
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-[#2e5b3f] block leading-none">
                Dr. Adya Vats
              </span>
              <span className="text-[10px] tracking-wider uppercase text-emerald-800 font-semibold block mt-0.5">
                Psychologist &amp; Counselor
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#3b4740]">
            <Link href="/tempPages/design-2" className="hover:text-[#2e5b3f]">Home</Link>
            <Link href="/tempPages/design-2/book" className="hover:text-[#2e5b3f]">Get Started</Link>
            <Link href="/tempPages/design-2/contact" className="text-[#2e5b3f] font-semibold">Contact</Link>
          </nav>

          <Link
            href="/tempPages/design-2/book"
            className="px-5 py-2.5 rounded-full bg-[#85c98a] hover:bg-[#6ebf74] text-white font-semibold text-sm transition shadow-sm"
          >
            Start Consultation
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-[#eaf4ec] px-3.5 py-1 rounded-full">
            GET IN TOUCH
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#1f2923] mt-3 mb-3">
            Contact Dr. Adya Vats
          </h1>
          <p className="text-base text-[#55635a]">
            Have a question or looking to inquire about individual sessions, couples therapy, or institutional programs? We are here to support you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-[#e8e4dc] shadow-sm">
              <h2 className="text-xl font-serif font-bold text-[#1f2923] mb-6">
                Direct Channels
              </h2>

              <div className="space-y-5 text-sm text-[#3b4740]">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#eaf4ec] text-[#2e5b3f] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-[#6e7d73] font-medium">Email Address</p>
                    <a
                      href="mailto:adyavats13@gmail.com"
                      className="font-semibold text-[#1f2923] hover:text-[#2e5b3f] transition [overflow-wrap:anywhere]"
                    >
                      adyavats13@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#eaf4ec] text-[#2e5b3f] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-[#6e7d73] font-medium">Sessions Format</p>
                    <p className="font-semibold text-[#1f2923] leading-snug">
                      Online Consultations (Worldwide) &amp; In-Person by Appointment
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#eaf4ec] text-[#2e5b3f] flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-[#6e7d73] font-medium">Instagram</p>
                    <a
                      href="https://www.instagram.com/dr.adya_vats"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-[#1f2923] hover:text-[#2e5b3f] transition"
                    >
                      @dr.adya_vats
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Ready to Book banner */}
            <div className="bg-[#2e5b3f] text-white rounded-3xl p-8 shadow-sm">
              <h3 className="text-2xl font-serif font-bold text-white mb-2">
                Ready to begin therapy?
              </h3>
              <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed mb-6 font-light">
                Take our quick questionnaire to select the format and reserve your consultation directly online.
              </p>
              <Link
                href="/tempPages/design-2/book"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#85c98a] hover:bg-[#6ebf74] text-white font-bold text-sm transition shadow-sm"
              >
                <span>Take Matching Questionnaire</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-[#e8e4dc] shadow-sm">
            <h2 className="text-2xl font-serif font-bold text-[#1f2923] mb-2">
              Send a Message
            </h2>
            <p className="text-xs text-[#55635a] mb-8">
              Fill in your inquiry details below and Dr. Adya will get back to you within 24 business hours.
            </p>

            {formSubmitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-[#eaf4ec] text-[#2e5b3f] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 stroke-[2.5]" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-[#1f2923] mb-2">
                  Message Sent!
                </h3>
                <p className="text-sm text-[#55635a] max-w-md mx-auto mb-6">
                  Thank you, {name}. Your inquiry has been received. Dr. Adya will reach out to you via email or WhatsApp shortly.
                </p>
                <Link
                  href="/tempPages/design-2"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2e5b3f] hover:underline"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Return to Design 2 Overview</span>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#334238] uppercase tracking-wider mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priyanshu"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#ded9cf] focus:outline-none focus:ring-2 focus:ring-[#2e5b3f] text-sm bg-[#faf8f5]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#334238] uppercase tracking-wider mb-1">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#ded9cf] focus:outline-none focus:ring-2 focus:ring-[#2e5b3f] text-sm bg-[#faf8f5]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#334238] uppercase tracking-wider mb-1">
                      Area of Inquiry *
                    </label>
                    <select
                      value={inquiryType}
                      onChange={(e) => setInquiryType(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#ded9cf] focus:outline-none focus:ring-2 focus:ring-[#2e5b3f] text-sm bg-[#faf8f5] text-[#334238]"
                    >
                      <option>Individual Psychotherapy</option>
                      <option>Couples Therapy</option>
                      <option>School or Institutional Workshop</option>
                      <option>Corporate Wellness Program</option>
                      <option>Supervision for Psychologists</option>
                      <option>General Question</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#334238] uppercase tracking-wider mb-1">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Share a brief note about what you are seeking..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#ded9cf] focus:outline-none focus:ring-2 focus:ring-[#2e5b3f] text-sm bg-[#faf8f5] resize-y"
                  />
                </div>

                <div className="flex items-center gap-2 text-xs text-[#526659] py-1">
                  <ShieldCheck className="w-4 h-4 text-[#2e5b3f] shrink-0" />
                  <span>Strictly confidential under psychological ethics.</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-full bg-[#85c98a] hover:bg-[#6ebf74] text-white font-bold text-sm transition shadow-sm flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
