"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Lock,
  Video,
  Check,
} from "lucide-react";
import { DemoHeader } from "../components/demo-header";
import { DemoFooter } from "../components/demo-footer";

type SessionOption = {
  id: string;
  name: string;
  duration: string;
  price: string;
  priceNum: number;
  popular?: boolean;
  description: string;
};

const SESSIONS: SessionOption[] = [
  {
    id: "individual-30",
    name: "Individual Therapy (30 min)",
    duration: "30 minutes",
    price: "₹1,000",
    priceNum: 1000,
    description:
      "A focused, compassionate session tailored to your immediate concerns — helping you understand what you’re experiencing, gain clarity, and take meaningful steps forward.",
  },
  {
    id: "individual-60",
    name: "Individual Therapy (60 min)",
    duration: "60 minutes",
    price: "₹2,000",
    priceNum: 2000,
    popular: true,
    description:
      "A deeper therapeutic space to explore your emotions, experiences, patterns, and challenges at your own pace.",
  },
  {
    id: "couples-60",
    name: "Couples Therapy (60–75 min)",
    duration: "60–75 minutes",
    price: "₹3,000",
    priceNum: 3000,
    description:
      "A supportive space for couples to communicate openly, understand each other better, work through recurring challenges, and build a healthier, more connected relationship.",
  },
];

// Available dates for booking demo
const DATES = [
  { day: "Today", date: "24 Nov", full: "Monday, 24 November 2026" },
  { day: "Tue", date: "25 Nov", full: "Tuesday, 25 November 2026" },
  { day: "Wed", date: "26 Nov", full: "Wednesday, 26 November 2026" },
  { day: "Thu", date: "27 Nov", full: "Thursday, 27 November 2026" },
  { day: "Fri", date: "28 Nov", full: "Friday, 28 November 2026" },
  { day: "Sat", date: "29 Nov", full: "Saturday, 29 November 2026" },
];

const TIME_SLOTS = [
  "10:00 AM",
  "11:30 AM",
  "02:00 PM",
  "03:30 PM",
  "05:00 PM",
  "06:30 PM",
];

export default function DemoBookPage() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedSession, setSelectedSession] = useState<SessionOption>(SESSIONS[1]!);
  const [selectedDate, setSelectedDate] = useState(DATES[1]!);
  const [selectedTime, setSelectedTime] = useState(TIME_SLOTS[2]!);

  // Client Details
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientNotes, setClientNotes] = useState("");

  // Confirmation state
  const [isBooked, setIsBooked] = useState(false);

  const handleCompleteBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBooked(true);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <DemoHeader />

      {/* Hero Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#182559] via-[#141e4d] to-[#0d1434] text-white pt-14 pb-20 sm:pb-24">
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
          <span className="inline-block px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-purple-200 tracking-wider uppercase mb-3">
            APPOINTMENTS &amp; SCHEDULING
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-3">
            Book Your Consultation
          </h1>
          <p className="text-base sm:text-lg text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
            Choose a session format, select a date and time that suits your routine, and confirm your reservation securely.
          </p>

          {/* Stepper Wizard Bar */}
          <div className="max-w-3xl mx-auto mt-10">
            <div className="grid grid-cols-4 gap-2 sm:gap-4 text-xs font-medium">
              {[
                { num: 1, label: "Session Type" },
                { num: 2, label: "Date & Time" },
                { num: 3, label: "Your Details" },
                { num: 4, label: "Confirm & Pay" },
              ].map((step) => {
                const isActive = currentStep === step.num;
                const isCompleted = currentStep > step.num;

                return (
                  <button
                    key={step.num}
                    onClick={() => {
                      if (step.num < currentStep) {
                        setCurrentStep(step.num as 1 | 2 | 3 | 4);
                      }
                    }}
                    disabled={step.num > currentStep && !isBooked}
                    className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 py-3 px-2 rounded-2xl border transition ${
                      isActive
                        ? "bg-white text-slate-900 border-white shadow-lg"
                        : isCompleted
                        ? "bg-purple-900/60 text-purple-200 border-purple-700/60 cursor-pointer"
                        : "bg-white/5 text-slate-400 border-white/10 cursor-not-allowed"
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        isActive
                          ? "bg-purple-600 text-white"
                          : isCompleted
                          ? "bg-emerald-500 text-white"
                          : "bg-white/10 text-slate-400"
                      }`}
                    >
                      {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : step.num}
                    </span>
                    <span className="truncate">{step.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Booking Body Section */}
      <section className="py-16 sm:py-20 bg-slate-50/60 min-h-[500px]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* SUCCESS CONFIRMATION SCREEN */}
          {isBooked ? (
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                Booking Confirmed
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-3 mb-2">
                Your Session is Scheduled!
              </h2>
              <p className="text-slate-600 text-sm max-w-md mx-auto mb-8">
                A calendar invitation and Google Meet link have been prepared for {clientName || "you"}.
              </p>

              {/* Booking Summary Box */}
              <div className="bg-slate-50 rounded-2xl p-6 max-w-md mx-auto text-left space-y-3 mb-8 border border-slate-200/80 text-sm">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Therapist</span>
                  <span className="font-semibold text-slate-900">Dr. Adya Vats</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Service</span>
                  <span className="font-semibold text-slate-900">{selectedSession.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Date</span>
                  <span className="font-semibold text-slate-900">{selectedDate.full}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Time</span>
                  <span className="font-semibold text-slate-900">{selectedTime} (IST)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Location</span>
                  <span className="font-semibold text-purple-700 flex items-center gap-1">
                    <Video className="w-3.5 h-3.5" /> Online (Google Meet)
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={() => {
                    setIsBooked(false);
                    setCurrentStep(1);
                  }}
                  className="px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-medium transition"
                >
                  Book Another Session
                </button>
                <Link
                  href="/tempPages/design-1"
                  className="px-6 py-3 rounded-full bg-[#7a5af8] hover:bg-[#6847f2] text-white text-sm font-medium transition shadow-md shadow-purple-500/20"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* STEP 1: SESSION TYPE */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center sm:text-left">
                    <h2 className="text-2xl font-bold text-slate-900">Choose your session type</h2>
                    <p className="text-slate-500 text-sm mt-1">
                      Select the therapy format that aligns best with your needs and goals.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {SESSIONS.map((session) => {
                      const isSelected = selectedSession.id === session.id;

                      return (
                        <div
                          key={session.id}
                          onClick={() => setSelectedSession(session)}
                          className={`relative cursor-pointer bg-white rounded-3xl p-6 sm:p-8 border-2 transition-all duration-200 shadow-sm ${
                            isSelected
                              ? "border-purple-600 bg-purple-50/20 shadow-md ring-2 ring-purple-600/10"
                              : "border-slate-200/90 hover:border-purple-300 hover:bg-slate-50/50"
                          }`}
                        >
                          {session.popular && (
                            <span className="absolute top-4 right-6 bg-[#7a5af8] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                              Most Popular
                            </span>
                          )}

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-3">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                                  isSelected
                                    ? "border-purple-600 bg-purple-600"
                                    : "border-slate-300"
                                }`}
                              >
                                {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                              </div>
                              <h3 className="font-bold text-lg sm:text-xl text-slate-900">
                                {session.name}
                              </h3>
                            </div>

                            <div className="flex items-center gap-3 self-start sm:self-auto">
                              <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                {session.duration}
                              </span>
                              <span className="text-xl font-bold text-slate-900">
                                {session.price}
                              </span>
                            </div>
                          </div>

                          <p className="text-slate-600 text-sm leading-relaxed sm:pl-8">
                            {session.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="px-8 py-3.5 rounded-full bg-[#7a5af8] hover:bg-[#6847f2] text-white font-medium text-sm transition shadow-md shadow-purple-500/20 flex items-center gap-2"
                    >
                      <span>Continue to Date &amp; Time</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: DATE & TIME */}
              {currentStep === 2 && (
                <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Select Date &amp; Time</h2>
                    <p className="text-slate-500 text-sm mt-1">
                      All session times are in India Standard Time (IST).
                    </p>
                  </div>

                  {/* Dates Selection Slider */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                      1. Pick an available date
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
                      {DATES.map((item, idx) => {
                        const isSelected = selectedDate.date === item.date;

                        return (
                          <button
                            key={idx}
                            onClick={() => setSelectedDate(item)}
                            className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                              isSelected
                                ? "bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-500/20"
                                : "bg-slate-50 border-slate-200 text-slate-700 hover:border-purple-300"
                            }`}
                          >
                            <span className="text-[11px] font-medium opacity-80">{item.day}</span>
                            <span className="text-base font-bold">{item.date}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Time Slots Selection */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                      2. Pick an available time slot
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {TIME_SLOTS.map((slot, idx) => {
                        const isSelected = selectedTime === slot;

                        return (
                          <button
                            key={idx}
                            onClick={() => setSelectedTime(slot)}
                            className={`py-3 px-4 rounded-xl border text-sm font-semibold transition flex items-center justify-center gap-2 ${
                              isSelected
                                ? "bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-500/20"
                                : "bg-white border-slate-200 text-slate-700 hover:border-purple-300 hover:bg-purple-50/30"
                            }`}
                          >
                            <Clock className="w-3.5 h-3.5 opacity-60" />
                            <span>{slot}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Chosen Summary Pill */}
                  <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-purple-900">
                      <CalendarIcon className="w-4 h-4 text-purple-600" />
                      <span>{selectedDate.full} at {selectedTime}</span>
                    </div>
                    <span className="font-bold text-purple-700">{selectedSession.price}</span>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="px-6 py-2.5 rounded-full border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition flex items-center gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="px-8 py-3.5 rounded-full bg-[#7a5af8] hover:bg-[#6847f2] text-white font-medium text-sm transition shadow-md shadow-purple-500/20 flex items-center gap-2"
                    >
                      <span>Continue to Details</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: CLIENT DETAILS */}
              {currentStep === 3 && (
                <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Enter Your Information</h2>
                    <p className="text-slate-500 text-sm mt-1">
                      Your details will remain strictly confidential and will only be used to send your session link.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          placeholder="Your name"
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm bg-slate-50/50"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Email Address *
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            required
                            placeholder="you@example.com"
                            value={clientEmail}
                            onChange={(e) => setClientEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm bg-slate-50/50"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          WhatsApp / Phone *
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="tel"
                            required
                            placeholder="+91 98765 43210"
                            value={clientPhone}
                            onChange={(e) => setClientPhone(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm bg-slate-50/50"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        What would you like to explore or focus on? (Optional)
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Any specific challenges, questions, or context you'd like Dr. Adya to know before the session..."
                        value={clientNotes}
                        onChange={(e) => setClientNotes(e.target.value)}
                        className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm bg-slate-50/50 resize-y"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-3 text-xs text-emerald-800">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>
                      100% Confidentiality: All session information and records are protected under clinical ethical guidelines.
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="px-6 py-2.5 rounded-full border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition flex items-center gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      onClick={() => {
                        if (!clientName || !clientEmail || !clientPhone) {
                          alert("Please fill in your name, email, and phone number.");
                          return;
                        }
                        setCurrentStep(4);
                      }}
                      className="px-8 py-3.5 rounded-full bg-[#7a5af8] hover:bg-[#6847f2] text-white font-medium text-sm transition shadow-md shadow-purple-500/20 flex items-center gap-2"
                    >
                      <span>Review &amp; Confirm</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: CONFIRM & PAY */}
              {currentStep === 4 && (
                <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Review &amp; Confirm Booking</h2>
                    <p className="text-slate-500 text-sm mt-1">
                      Please verify your reservation details before confirming.
                    </p>
                  </div>

                  {/* Summary Card */}
                  <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                      <div>
                        <p className="font-bold text-slate-900 text-base">{selectedSession.name}</p>
                        <p className="text-xs text-slate-500">Therapist: Dr. Adya Vats</p>
                      </div>
                      <span className="text-2xl font-bold text-purple-700">{selectedSession.price}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
                      <div>
                        <span className="text-slate-400 block font-medium">Date &amp; Time</span>
                        <span className="font-semibold text-slate-900 text-sm">{selectedDate.full} at {selectedTime}</span>
                      </div>

                      <div>
                        <span className="text-slate-400 block font-medium">Session Mode</span>
                        <span className="font-semibold text-slate-900 text-sm flex items-center gap-1">
                          <Video className="w-3.5 h-3.5 text-purple-600" />
                          Online Video (Google Meet)
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block font-medium">Client Name</span>
                        <span className="font-semibold text-slate-900 text-sm">{clientName}</span>
                      </div>

                      <div>
                        <span className="text-slate-400 block font-medium">Client Contact</span>
                        <span className="font-semibold text-slate-900 text-sm">{clientEmail} • {clientPhone}</span>
                      </div>
                    </div>

                    {clientNotes && (
                      <div className="pt-2 text-xs border-t border-slate-200">
                        <span className="text-slate-400 block font-medium">Focus Area</span>
                        <span className="text-slate-700">{clientNotes}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Lock className="w-4 h-4 text-emerald-600" />
                    <span>Secure encrypted checkout. Rescheduling allowed up to 24 hours prior.</span>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="px-6 py-2.5 rounded-full border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition flex items-center gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      onClick={handleCompleteBooking}
                      className="px-8 py-3.5 rounded-full bg-[#7a5af8] hover:bg-[#6847f2] text-white font-medium text-sm transition shadow-md shadow-purple-500/20 flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Confirm &amp; Complete Demo Booking</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <DemoFooter />
    </div>
  );
}
