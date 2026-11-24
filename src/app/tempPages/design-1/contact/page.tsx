"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, MapPin, Check, Send, ArrowRight, ShieldCheck, Calendar } from "lucide-react";
import { DemoHeader } from "../components/demo-header";
import { DemoFooter } from "../components/demo-footer";

export default function DemoContactPage() {
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
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <DemoHeader />

      {/* Hero Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#182559] via-[#141e4d] to-[#0d1434] text-white pt-16 pb-20 sm:pb-24">
        {/* Subtle satin sheen */}
        <div className="absolute inset-0 opacity-25 pointer-events-none">
          <svg className="w-full h-full object-cover" viewBox="0 0 1440 400" fill="none">
            <path
              d="M0,150 C320,80 450,220 750,130 C1050,40 1200,180 1440,110 L1440,400 L0,400 Z"
              fill="#4361ee"
              opacity="0.4"
            />
          </svg>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-purple-200 tracking-wider uppercase mb-4">
            GET IN TOUCH
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Contact Dr. Adya Vats
          </h1>
          <p className="text-base sm:text-lg text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
            Have questions or want to inquire about therapy sessions, workshops, corporate wellness, or supervision? Connect directly.
          </p>
        </div>
      </section>

      {/* Contact Content Grid */}
      <section className="py-16 sm:py-24 bg-slate-50/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Direct Channels & Booking Teaser */}
            <div className="lg:col-span-5 space-y-6">
              {/* Direct Info Card */}
              <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
                  DIRECT CHANNELS
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-1 mb-6">
                  Reach out to Dr. Adya
                </h2>

                <div className="space-y-5 text-sm text-slate-700">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Email Address</p>
                      <a
                        href="mailto:adyavats13@gmail.com"
                        className="font-semibold text-slate-900 hover:text-purple-600 transition [overflow-wrap:anywhere]"
                      >
                        adyavats13@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Session Format &amp; Location</p>
                      <p className="font-semibold text-slate-900 leading-snug">
                        Online Sessions (Worldwide) &amp; In-Person by Appointment
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Social Profile</p>
                      <a
                        href="https://www.instagram.com/dr.adya_vats"
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-slate-900 hover:text-purple-600 transition"
                      >
                        @dr.adya_vats
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ready to schedule banner card */}
              <div className="bg-gradient-to-br from-purple-900 to-indigo-950 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                  APPOINTMENTS &amp; SCHEDULING
                </span>
                <h3 className="text-2xl font-bold text-white mt-1 mb-3">
                  Ready to book a session?
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-6 font-light">
                  You can reserve 30-minute individual therapy, 60-minute individual therapy, or 60–75 minute couples therapy directly online with live slot availability.
                </p>
                <Link
                  href="/tempPages/design-1/book"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#7a5af8] hover:bg-[#6847f2] text-white text-sm font-semibold transition shadow-md shadow-purple-500/30"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Open Booking Calendar</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>

            {/* Right Column: Inquiry Message Form */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
                SEND A MESSAGE
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 mb-3">
                How can I support you?
              </h2>
              <p className="text-slate-500 text-sm mb-8">
                Please leave your details and note. I will respond to you within 24 business hours.
              </p>

              {formSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 stroke-[2.5]" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Sent Successfully!</h3>
                  <p className="text-slate-600 text-sm max-w-md mx-auto mb-6">
                    Thank you, {name}. Your inquiry has been received. I will reach out to you via email or WhatsApp shortly.
                  </p>
                  <Link
                    href="/tempPages/design-1"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-700"
                  >
                    <span>Return to Overview</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Priya Sharma"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm bg-slate-50/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm bg-slate-50/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        WhatsApp / Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm bg-slate-50/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Area of Inquiry *
                      </label>
                      <select
                        value={inquiryType}
                        onChange={(e) => setInquiryType(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm bg-slate-50/50 text-slate-700"
                      >
                        <option>Individual Psychotherapy</option>
                        <option>Couples Therapy</option>
                        <option>School or Institutional Workshop</option>
                        <option>Corporate Wellness Program</option>
                        <option>Supervision for Psychologists</option>
                        <option>Tarot Card Reading (Reflective)</option>
                        <option>General Question</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Your Message or Concern *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Share a brief note about what you are seeking or any questions you have..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm bg-slate-50/50 resize-y"
                    />
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 py-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Your privacy and notes are strictly protected under clinical confidentiality.</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-[#7a5af8] hover:bg-[#6847f2] text-white font-medium text-sm transition shadow-md shadow-purple-500/20 flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message to Dr. Adya</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <DemoFooter />
    </div>
  );
}
