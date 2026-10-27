import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { SafetyNotice } from "@/components/common/safety-notice";
import { BookingWizard } from "@/components/booking/booking-wizard";

export const metadata: Metadata = {
  title: "Book a Session | Dr. Adya Vats Practice",
  description:
    "Schedule an individual psychotherapy or integrative modality session with Dr. Adya Vats. Live slot availability with secure Razorpay checkout.",
};

export default function BookPage() {
  return (
    <main className="min-h-screen py-12 md:py-20">
      <Container>
        {/* Header Section */}
        <div className="mb-12 text-center">
          <SectionHeading
            eyebrow="Appointments & Scheduling"
            title="Book Your Consultation"
            intro="Choose a session format, select a date and time that suits your routine, and confirm your reservation securely."
          />
        </div>

        {/* Wizard */}
        <Section className="py-0">
          <BookingWizard />
        </Section>

        {/* Crisis Safety Notice */}
        <div className="mt-16">
          <SafetyNotice />
        </div>
      </Container>
    </main>
  );
}
