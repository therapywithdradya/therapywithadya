"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Clock,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Video,
  Check,
} from "lucide-react";

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
      "A focused, compassionate session tailored to your immediate concerns — helping you gain clarity and take meaningful steps forward.",
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
      "A supportive space for couples to communicate openly, understand each other better, work through recurring challenges, and build connection.",
  },
];

const DATES = [
  { day: "Today", date: "25 Nov", full: "Tuesday, 25 November 2026" },
  { day: "Wed", date: "26 Nov", full: "Wednesday, 26 November 2026" },
  { day: "Thu", date: "27 Nov", full: "Thursday, 27 November 2026" },
  { day: "Fri", date: "28 Nov", full: "Friday, 28 November 2026" },
  { day: "Sat", date: "29 Nov", full: "Saturday, 29 November 2026" },
  { day: "Sun", date: "30 Nov", full: "Sunday, 30 November 2026" },
];

const TIME_SLOTS = [
  "10:00 AM",
  "11:30 AM",
  "02:00 PM",
  "03:30 PM",
  "05:00 PM",
  "06:30 PM",
];

export default function DesignTwoBookPage() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedSession, setSelectedSession] = useState<SessionOption>(SESSIONS[1]!);
  const [selectedDate, setSelectedDate] = useState(DATES[1]!);
  const [selectedTime, setSelectedTime] = useState(TIME_SLOTS[2]!);

  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientNotes, setClientNotes] = useState("");
  const [isBooked, setIsBooked] = useState(false);

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#242926] font-sans antialiased">
      {/* Top Demo Bar */}
      <div className="bg-[#1f3b2b] text-emerald-100 text-xs py-2 px-4 flex items-center justify-between border-b border-emerald-900/50">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-medium">Sample Design 2 Demo • Booking (BetterHelp Aesthetic)</span>
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
            <Link href="/tempPages/design-2/book" className="text-[#2e5b3f] font-semibold">Book a Slot</Link>
            <Link href="/tempPages/design-2/contact" className="hover:text-[#2e5b3f]">Contact</Link>
          </nav>
        </div>
      </header>

      {/* Stepper Progress Bar */}
      <div className="max-w-xl mx-auto px-4 pt-10">
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                currentStep >= i ? "bg-[#2e5b3f]" : "bg-[#ded9cf]"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Booking Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {isBooked ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#e8e4dc] shadow-sm text-center max-w-xl mx-auto">
            <div className="w-16 h-16 bg-[#eaf4ec] text-[#2e5b3f] rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-[#eaf4ec] px-3.5 py-1 rounded-full">
              CONSULTATION SCHEDULED
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1f2923] mt-3 mb-2">
              Your Session is Confirmed!
            </h1>
            <p className="text-sm text-[#55635a] mb-6">
              A Google Meet link and confirmation invite have been sent to {clientEmail || "your email"}.
            </p>

            <div className="bg-[#faf8f5] rounded-2xl p-5 text-left text-xs sm:text-sm space-y-2.5 mb-8 border border-[#ded9cf]">
              <div className="flex justify-between py-1 border-b border-[#e8e4dc]">
                <span className="text-[#6e7d73]">Therapist</span>
                <span className="font-semibold text-[#1f2923]">Dr. Adya Vats</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#e8e4dc]">
                <span className="text-[#6e7d73]">Session</span>
                <span className="font-semibold text-[#1f2923]">{selectedSession.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#e8e4dc]">
                <span className="text-[#6e7d73]">Date &amp; Time</span>
                <span className="font-semibold text-[#1f2923]">{selectedDate.full} at {selectedTime}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#6e7d73]">Mode</span>
                <span className="font-semibold text-[#2e5b3f] flex items-center gap-1">
                  <Video className="w-3.5 h-3.5" /> Online (Google Meet)
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/tempPages/design-2"
                className="px-6 py-3 rounded-full bg-[#85c98a] hover:bg-[#6ebf74] text-white font-bold text-sm transition shadow-sm"
              >
                Return to Design 2
              </Link>
              <Link
                href="/tempPages"
                className="px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition"
              >
                Design Review Hub
              </Link>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            {/* Step 1: Session Format */}
            {currentStep === 1 && (
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#e8e4dc] shadow-sm">
                <h2 className="text-2xl font-serif font-bold text-[#1f2923] mb-2">
                  Choose your session format
                </h2>
                <p className="text-xs text-[#55635a] mb-6">
                  Select the therapeutic consultation that best matches your immediate goals.
                </p>

                <div className="space-y-3.5 mb-8">
                  {SESSIONS.map((session) => {
                    const isSelected = selectedSession.id === session.id;

                    return (
                      <div
                        key={session.id}
                        onClick={() => setSelectedSession(session)}
                        className={`p-5 rounded-2xl border-2 cursor-pointer transition relative ${
                          isSelected
                            ? "bg-[#eef7f0] border-[#2e5b3f]"
                            : "bg-white border-[#ded9cf] hover:border-[#b0c4b5]"
                        }`}
                      >
                        {session.popular && (
                          <span className="absolute top-3 right-4 bg-[#2e5b3f] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                            Most Popular
                          </span>
                        )}

                        <div className="flex items-center justify-between mb-1.5">
                          <h3 className="font-bold text-[#1f2923] text-base">{session.name}</h3>
                          <span className="text-lg font-bold text-[#2e5b3f]">{session.price}</span>
                        </div>
                        <p className="text-xs text-[#526659] leading-relaxed">{session.description}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-8 py-3.5 rounded-full bg-[#85c98a] hover:bg-[#6ebf74] text-white font-bold text-sm transition shadow-sm flex items-center gap-2"
                  >
                    <span>Continue to Date &amp; Time</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Date & Time */}
            {currentStep === 2 && (
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#e8e4dc] shadow-sm space-y-6">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-[#1f2923] mb-1">
                    Select Consultation Slot
                  </h2>
                  <p className="text-xs text-[#55635a]">
                    Times shown in India Standard Time (IST). Online link provided upon booking.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#334238] uppercase tracking-wider mb-2.5">
                    Available Dates
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {DATES.map((item, idx) => {
                      const isSelected = selectedDate.date === item.date;

                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedDate(item)}
                          className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                            isSelected
                              ? "bg-[#2e5b3f] text-white border-[#2e5b3f] shadow-sm"
                              : "bg-[#faf8f5] border-[#ded9cf] text-[#334238] hover:border-[#2e5b3f]"
                          }`}
                        >
                          <span className="text-[10px] font-medium opacity-80">{item.day}</span>
                          <span className="text-sm font-bold">{item.date}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#334238] uppercase tracking-wider mb-2.5">
                    Available Time Slots
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {TIME_SLOTS.map((slot, idx) => {
                      const isSelected = selectedTime === slot;

                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedTime(slot)}
                          className={`py-3 px-4 rounded-xl border text-sm font-semibold transition flex items-center justify-center gap-2 ${
                            isSelected
                              ? "bg-[#2e5b3f] text-white border-[#2e5b3f] shadow-sm"
                              : "bg-white border-[#ded9cf] text-[#334238] hover:border-[#2e5b3f] hover:bg-[#faf8f5]"
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5 opacity-60" />
                          <span>{slot}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#eaf4ec] text-[#224d33] flex items-center justify-between text-xs sm:text-sm">
                  <span>Selected: <strong>{selectedDate.full} at {selectedTime}</strong></span>
                  <span className="font-bold text-[#2e5b3f]">{selectedSession.price}</span>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-[#f0ede6]">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-6 py-2.5 rounded-full border border-[#ded9cf] text-[#55635a] text-sm font-medium hover:bg-[#faf8f5]"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="px-8 py-3.5 rounded-full bg-[#85c98a] hover:bg-[#6ebf74] text-white font-bold text-sm transition shadow-sm flex items-center gap-2"
                  >
                    <span>Continue to Details</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Details */}
            {currentStep === 3 && (
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#e8e4dc] shadow-sm space-y-6">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-[#1f2923] mb-1">
                    Your Information
                  </h2>
                  <p className="text-xs text-[#55635a]">
                    Please provide your contact details for your private calendar link.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#334238] uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your name"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#ded9cf] focus:outline-none focus:ring-2 focus:ring-[#2e5b3f] text-sm bg-[#faf8f5]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        WhatsApp / Phone *
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

                  <div>
                    <label className="block text-xs font-bold text-[#334238] uppercase tracking-wider mb-1">
                      Brief context or focus area (Optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Share what you hope to address or explore in therapy..."
                      value={clientNotes}
                      onChange={(e) => setClientNotes(e.target.value)}
                      className="w-full p-3.5 rounded-xl border border-[#ded9cf] focus:outline-none focus:ring-2 focus:ring-[#2e5b3f] text-sm bg-[#faf8f5] resize-y"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-[#f0ede6]">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-6 py-2.5 rounded-full border border-[#ded9cf] text-[#55635a] text-sm font-medium hover:bg-[#faf8f5]"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!clientName || !clientEmail || !clientPhone) {
                        alert("Please fill in your name, email, and phone number.");
                        return;
                      }
                      setCurrentStep(4);
                    }}
                    className="px-8 py-3.5 rounded-full bg-[#85c98a] hover:bg-[#6ebf74] text-white font-bold text-sm transition shadow-sm flex items-center gap-2"
                  >
                    <span>Confirm &amp; Review</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Summary & Confirm */}
            {currentStep === 4 && (
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#e8e4dc] shadow-sm space-y-6">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-[#1f2923] mb-1">
                    Review &amp; Confirm
                  </h2>
                  <p className="text-xs text-[#55635a]">
                    Please verify your consultation reservation details.
                  </p>
                </div>

                <div className="bg-[#faf8f5] rounded-2xl p-6 border border-[#ded9cf] space-y-3.5 text-xs sm:text-sm">
                  <div className="flex justify-between items-center pb-3 border-b border-[#e8e4dc]">
                    <div>
                      <p className="font-bold text-base text-[#1f2923]">{selectedSession.name}</p>
                      <p className="text-xs text-[#6e7d73]">With Dr. Adya Vats</p>
                    </div>
                    <span className="text-xl font-bold text-[#2e5b3f]">{selectedSession.price}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#3b4740]">
                    <div>
                      <span className="text-[#6e7d73] block">Date &amp; Time</span>
                      <span className="font-semibold">{selectedDate.full} at {selectedTime}</span>
                    </div>
                    <div>
                      <span className="text-[#6e7d73] block">Session Format</span>
                      <span className="font-semibold flex items-center gap-1">
                        <Video className="w-3.5 h-3.5 text-[#2e5b3f]" /> Online Video (Google Meet)
                      </span>
                    </div>
                    <div>
                      <span className="text-[#6e7d73] block">Client Name</span>
                      <span className="font-semibold">{clientName}</span>
                    </div>
                    <div>
                      <span className="text-[#6e7d73] block">Contact</span>
                      <span className="font-semibold">{clientEmail} • {clientPhone}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-[#526659]">
                  <ShieldCheck className="w-4 h-4 text-[#2e5b3f]" />
                  <span>Strict clinical confidentiality. Rescheduling available up to 24 hours prior.</span>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-[#f0ede6]">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="px-6 py-2.5 rounded-full border border-[#ded9cf] text-[#55635a] text-sm font-medium hover:bg-[#faf8f5]"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsBooked(true)}
                    className="px-8 py-3.5 rounded-full bg-[#85c98a] hover:bg-[#6ebf74] text-white font-bold text-sm transition shadow-sm flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Confirm Consultation</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
