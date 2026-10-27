"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Mail,
  Phone,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Lock,
} from "lucide-react";
import { formatPriceFromPaise } from "@/lib/format";

type SessionOption = {
  slug: string;
  name: string;
  description: string;
  durationMinutes: number;
  pricePaise: number;
};

const SESSIONS: SessionOption[] = [
  {
    slug: "session-a-60",
    name: "Individual Therapy Session (60 min)",
    description:
      "A compassionate, trauma-informed 1-on-1 therapy session tailored to your emotional and psychological needs. Focuses on anxiety, depression, stress, self-doubt, relationship challenges, and coping strategies.",
    durationMinutes: 60,
    pricePaise: 150000,
  },
  {
    slug: "session-b-90",
    name: "Integrative Therapy & Modality Deep-Dive (90 min)",
    description:
      "An intensive extended session combining psychotherapy with specialized modalities such as Hypnotherapy, Art Therapy, or Graphology (handwriting analysis).",
    durationMinutes: 90,
    pricePaise: 220000,
  },
];

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: (response: unknown) => void) => void;
    };
  }
}

export function BookingWizard() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Session
  const [selectedSession, setSelectedSession] = useState<SessionOption>(SESSIONS[0]!);

  // Step 2: Date & Slot
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  // Step 3: Details
  const [customerName, setCustomerName] = useState<string>("");
  const [customerEmail, setCustomerEmail] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [customerNote, setCustomerNote] = useState<string>("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Step 4: Checkout
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  // Load Razorpay checkout script
  useEffect(() => {
    const existingScript = document.getElementById("razorpay-checkout-js");
    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "razorpay-checkout-js";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Compute upcoming dates (next 14 days, excluding Sundays)
  const availableDates: { dateString: string; label: string; weekday: string }[] = [];
  const today = new Date();
  for (let i = 1; i <= 21 && availableDates.length < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    // Sunday is 0 in JS Date
    if (d.getDay() !== 0) {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      const dateString = `${yyyy}-${mm}-${dd}`;
      const weekday = d.toLocaleDateString("en-IN", { weekday: "short" });
      const label = d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
      availableDates.push({ dateString, label, weekday });
    }
  }

  // Event-driven slot fetching (React 19 compliant, avoiding setState in effect)
  async function fetchSlots(date: string, sessionSlug: string) {
    if (!date || !sessionSlug) {
      setAvailableSlots([]);
      return;
    }
    setLoadingSlots(true);
    setSlotsError(null);
    setSelectedSlot("");

    try {
      const res = await fetch(
        `/api/availability?session=${encodeURIComponent(sessionSlug)}&fromDate=${encodeURIComponent(date)}&toDate=${encodeURIComponent(date)}`,
      );
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(data.message || "Failed to load availability");
      }
      const data = (await res.json()) as { slots: string[] };
      setAvailableSlots(data.slots || []);
    } catch (err) {
      setSlotsError(
        err instanceof Error ? err.message : "Availability temporarily unavailable",
      );
    } finally {
      setLoadingSlots(false);
    }
  }

  function handleSelectDate(dateString: string) {
    setSelectedDate(dateString);
    fetchSlots(dateString, selectedSession.slug);
  }

  function validateForm(): boolean {
    const errors: Record<string, string> = {};
    if (!customerName.trim()) {
      errors.name = "Full name is required";
    }
    if (!customerEmail.trim()) {
      errors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      errors.email = "Please enter a valid email address";
    }
    if (!customerPhone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^[0-9+()\- ]{7,20}$/.test(customerPhone)) {
      errors.phone = "Please enter a valid phone number with country code";
    }
    if (customerNote && customerNote.length > 500) {
      errors.note = "Note must not exceed 500 characters";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleProceedToCheckout() {
    setIsSubmitting(true);
    setCheckoutError(null);

    try {
      // 1. Create pending reservation hold + Razorpay order
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionSlug: selectedSession.slug,
          startAt: selectedSlot,
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim(),
          customerPhone: customerPhone.trim(),
          customerNote: customerNote.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to create booking reservation");
      }

      const { orderId, amountPaise, keyId, publicToken } = data;

      // 2. Open Razorpay Checkout modal
      if (!window.Razorpay) {
        throw new Error("Payment gateway SDK failed to load. Please refresh and try again.");
      }

      const options = {
        key: keyId,
        amount: amountPaise,
        currency: "INR",
        name: "Dr. Adya Vats Practice",
        description: selectedSession.name,
        order_id: orderId,
        prefill: {
          name: customerName.trim(),
          email: customerEmail.trim(),
          contact: customerPhone.trim(),
        },
        theme: {
          color: "#C9A86C", // Primary practice gold
        },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            // 3. Verify payment on server
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                token: publicToken,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.redirectUrl) {
              startTransition(() => {
                router.push(verifyData.redirectUrl);
              });
            } else {
              router.push(`/book/confirmation/${encodeURIComponent(publicToken)}`);
            }
          } catch {
            router.push(`/book/confirmation/${encodeURIComponent(publicToken)}`);
          }
        },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : "Booking initialization failed");
      setIsSubmitting(false);
    }
  }

  function formatTime(isoString: string): string {
    const d = new Date(isoString);
    return d.toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  function formatFullDate(isoString: string): string {
    const d = new Date(isoString);
    return d.toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-surface/50 p-6 shadow-elevation-card backdrop-blur-md md:p-10">
      {/* Wizard Progress Stepper */}
      <div className="mb-10 flex items-center justify-between border-b border-border pb-6">
        {[
          { stepNum: 1, label: "Session Type" },
          { stepNum: 2, label: "Date & Time" },
          { stepNum: 3, label: "Your Details" },
          { stepNum: 4, label: "Confirm & Pay" },
        ].map((s) => (
          <div key={s.stepNum} className="flex items-center gap-2">
            <div
              className={`flex size-8 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                step === s.stepNum
                  ? "bg-primary text-on-primary ring-4 ring-primary/20"
                  : step > s.stepNum
                    ? "bg-accent text-on-primary"
                    : "border border-border bg-background text-muted"
              }`}
            >
              {step > s.stepNum ? "✓" : s.stepNum}
            </div>
            <span
              className={`hidden text-sm font-medium sm:inline ${
                step === s.stepNum ? "text-ink" : "text-muted"
              }`}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Step 1: Session Picker */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-serif text-ink">Choose your session type</h2>
            <p className="mt-1 text-sm text-muted">
              Select the modality that aligns best with your therapeutic goals.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {SESSIONS.map((session) => {
              const isSelected = selectedSession.slug === session.slug;
              return (
                <div
                  key={session.slug}
                  onClick={() => setSelectedSession(session)}
                  className={`group relative flex cursor-pointer flex-col justify-between rounded-xl border p-6 transition-all duration-200 ${
                    isSelected
                      ? "border-primary bg-primary/5 shadow-elevation-soft ring-1 ring-primary"
                      : "border-border bg-background/50 hover:border-border/80 hover:bg-background"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 rounded-full bg-surface px-3 py-1 text-xs font-medium text-accent">
                        <Clock className="size-3" />
                        {session.durationMinutes} minutes
                      </span>
                      <span className="text-lg font-semibold text-primary">
                        {formatPriceFromPaise(session.pricePaise)}
                      </span>
                    </div>
                    <h3 className="text-lg font-serif font-medium text-ink">
                      {session.name}
                    </h3>
                    <p className="text-xs leading-relaxed text-muted">
                      {session.description}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-4">
                    <span className="text-xs text-muted">15-min restorative buffer included</span>
                    <div
                      className={`size-5 rounded-full border flex items-center justify-center transition-colors ${
                        isSelected
                          ? "border-primary bg-primary text-on-primary"
                          : "border-border bg-transparent"
                      }`}
                    >
                      {isSelected && <span className="text-[10px]">●</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-on-primary transition hover:bg-primary-hover shadow-elevation-soft"
            >
              Choose Date & Time <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Date & Slot Picker */}
      {step === 2 && (
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-serif text-ink">Select date and slot</h2>
            <p className="mt-1 text-sm text-muted">
              All appointments are in India Standard Time (<span className="text-primary font-medium">IST / Asia/Kolkata</span>).
            </p>
          </div>

          {/* Date Chips Carousel */}
          <div>
            <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-muted">
              1. Choose a consultation day
            </label>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {availableDates.map((item) => {
                const isSelected = selectedDate === item.dateString;
                return (
                  <button
                    key={item.dateString}
                    type="button"
                    onClick={() => handleSelectDate(item.dateString)}
                    className={`flex flex-col items-center justify-center min-w-[72px] rounded-xl border p-3 text-center transition-all ${
                      isSelected
                        ? "border-primary bg-primary text-on-primary shadow-elevation-soft"
                        : "border-border bg-background/60 text-muted hover:border-primary/50 hover:text-ink"
                    }`}
                  >
                    <span className="text-[11px] uppercase tracking-wider font-medium opacity-80">
                      {item.weekday}
                    </span>
                    <span className="mt-1 text-base font-semibold">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Slots Grid */}
          <div>
            <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-muted">
              2. Select start time
            </label>

            {!selectedDate ? (
              <div className="flex items-center justify-center rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted">
                Please select a consultation day above to see available slots.
              </div>
            ) : loadingSlots ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="h-11 animate-pulse rounded-lg bg-surface/80 border border-border/50"
                  />
                ))}
              </div>
            ) : slotsError ? (
              <div className="flex items-center gap-3 rounded-xl border border-error/30 bg-error/10 p-4 text-sm text-error">
                <AlertCircle className="size-5 shrink-0" />
                <span>{slotsError}</span>
              </div>
            ) : availableSlots.length === 0 ? (
              <div className="rounded-xl border border-border bg-surface/30 p-8 text-center text-sm text-muted">
                No slots available on this day. Please select another date.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {availableSlots.map((slotIso) => {
                  const isSelected = selectedSlot === slotIso;
                  return (
                    <button
                      key={slotIso}
                      type="button"
                      onClick={() => setSelectedSlot(slotIso)}
                      className={`flex items-center justify-center gap-1.5 rounded-lg border py-2.5 text-sm font-medium transition-all ${
                        isSelected
                          ? "border-primary bg-primary text-on-primary font-semibold shadow-elevation-soft"
                          : "border-border bg-background/80 text-ink hover:border-primary/60 hover:bg-background"
                      }`}
                    >
                      <Clock className="size-3.5 opacity-70" />
                      {formatTime(slotIso)}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-border pt-6">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-surface"
            >
              <ChevronLeft className="size-4" /> Back
            </button>
            <button
              type="button"
              disabled={!selectedSlot}
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-on-primary transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50 shadow-elevation-soft"
            >
              Continue to Details <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Client Details Form */}
      {step === 3 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-serif text-ink">Your details</h2>
            <p className="mt-1 text-sm text-muted">
              We need your contact information to send calendar invites and session links.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-ink">
                <User className="size-3.5 text-primary" /> Full Name *
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Dr. / Mr. / Ms. Full Name"
                className={`w-full rounded-lg border bg-background px-4 py-2.5 text-sm text-ink outline-none transition focus:border-primary ${
                  formErrors.name ? "border-error" : "border-border"
                }`}
              />
              {formErrors.name && (
                <p className="mt-1 text-xs text-error">{formErrors.name}</p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-ink">
                  <Mail className="size-3.5 text-primary" /> Email Address *
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="name@example.com"
                  className={`w-full rounded-lg border bg-background px-4 py-2.5 text-sm text-ink outline-none transition focus:border-primary ${
                    formErrors.email ? "border-error" : "border-border"
                  }`}
                />
                {formErrors.email && (
                  <p className="mt-1 text-xs text-error">{formErrors.email}</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-ink">
                  <Phone className="size-3.5 text-primary" /> Phone / WhatsApp *
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className={`w-full rounded-lg border bg-background px-4 py-2.5 text-sm text-ink outline-none transition focus:border-primary ${
                    formErrors.phone ? "border-error" : "border-border"
                  }`}
                />
                {formErrors.phone && (
                  <p className="mt-1 text-xs text-error">{formErrors.phone}</p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-ink">
                Scheduling Note (Optional)
              </label>
              <textarea
                value={customerNote}
                onChange={(e) => setCustomerNote(e.target.value)}
                placeholder="Any logistical or scheduling preferences..."
                rows={3}
                className={`w-full rounded-lg border bg-background px-4 py-2.5 text-sm text-ink outline-none transition focus:border-primary ${
                  formErrors.note ? "border-error" : "border-border"
                }`}
              />
              {formErrors.note && (
                <p className="mt-1 text-xs text-error">{formErrors.note}</p>
              )}
              <div className="mt-2 flex items-start gap-2 rounded-lg bg-surface/60 p-3 text-xs text-muted border border-border/50">
                <ShieldCheck className="size-4 shrink-0 text-accent mt-0.5" />
                <span>
                  <strong>Privacy Disclosure:</strong> Please do not include sensitive clinical history, psychiatric records, or medications here. Clinical sharing occurs safely and confidentially during your session.
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-border pt-6">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-surface"
            >
              <ChevronLeft className="size-4" /> Back
            </button>
            <button
              type="button"
              onClick={() => {
                if (validateForm()) {
                  setStep(4);
                }
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-on-primary transition hover:bg-primary-hover shadow-elevation-soft"
            >
              Review Booking <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Summary & Payment */}
      {step === 4 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-serif text-ink">Review & Confirm</h2>
            <p className="mt-1 text-sm text-muted">
              Review your appointment summary and proceed to secure payment via Razorpay.
            </p>
          </div>

          {checkoutError && (
            <div className="flex items-start gap-3 rounded-xl border border-error/30 bg-error/10 p-4 text-sm text-error">
              <AlertCircle className="size-5 shrink-0 mt-0.5" />
              <span>{checkoutError}</span>
            </div>
          )}

          <div className="rounded-xl border border-border bg-background/60 p-6 space-y-4">
            <div className="flex items-start justify-between border-b border-border/60 pb-4">
              <div>
                <span className="text-xs uppercase font-medium tracking-wider text-accent">Session Offering</span>
                <h3 className="text-lg font-serif font-medium text-ink mt-0.5">{selectedSession.name}</h3>
                <span className="text-xs text-muted">Duration: {selectedSession.durationMinutes} minutes</span>
              </div>
              <div className="text-right">
                <span className="text-xs uppercase font-medium tracking-wider text-muted">Total Fee</span>
                <div className="text-xl font-bold text-primary mt-0.5">
                  {formatPriceFromPaise(selectedSession.pricePaise)}
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 text-sm">
              <div className="flex items-center gap-2 text-ink">
                <CalendarIcon className="size-4 text-primary" />
                <span>{formatFullDate(selectedSlot)}</span>
              </div>
              <div className="flex items-center gap-2 text-ink">
                <Clock className="size-4 text-primary" />
                <span>{formatTime(selectedSlot)} (India Standard Time)</span>
              </div>
              <div className="flex items-center gap-2 text-ink">
                <User className="size-4 text-muted" />
                <span>{customerName}</span>
              </div>
              <div className="flex items-center gap-2 text-ink">
                <Mail className="size-4 text-muted" />
                <span>{customerEmail}</span>
              </div>
            </div>

            {customerNote && (
              <div className="border-t border-border/50 pt-3 text-xs text-muted">
                <strong>Scheduling Note:</strong> {customerNote}
              </div>
            )}
          </div>

          {/* Cancellation Notice */}
          <div className="rounded-xl border border-border/60 bg-surface/40 p-4 text-xs text-muted flex items-start gap-3">
            <CheckCircle2 className="size-4 shrink-0 text-accent mt-0.5" />
            <div>
              <strong>Cancellation & Rescheduling Policy:</strong> Free rescheduling or cancellation is available with at least 24 hours prior notice. Sessions cancelled within 24 hours are non-refundable.
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-border pt-6">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-surface disabled:opacity-50"
            >
              <ChevronLeft className="size-4" /> Back
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleProceedToCheckout}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-on-primary transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50 shadow-elevation-card"
            >
              {isSubmitting ? (
                <>Reserving Slot...</>
              ) : (
                <>
                  <Lock className="size-4" /> Pay {formatPriceFromPaise(selectedSession.pricePaise)} via Razorpay
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
