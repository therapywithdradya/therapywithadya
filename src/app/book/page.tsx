import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { SafetyNotice } from "@/components/common/safety-notice";
import { BookingWizard } from "@/components/booking/booking-wizard";
import { getSiteContent } from "@/lib/site-content.server";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Book a Session | Dr. Adya Vats Practice",
  description:
    "Schedule an individual psychotherapy or integrative modality session with Dr. Adya Vats. Live slot availability with secure Razorpay checkout.",
};

export default async function BookPage() {
  const content = await getSiteContent();
  const copy = content.sessionsPage;

  return (
    <main className="min-h-screen py-12 md:py-20">
      <Container>
        {/* Header Section */}
        <div className="mb-12 text-center">
          <SectionHeading
            eyebrow={copy.bookPageEyebrow}
            title={copy.bookPageTitle}
            intro={copy.bookPageIntro}
          />
        </div>

        {/* Wizard */}
        <Section className="py-0">
          <BookingWizard initialSessions={content.sessions} />
        </Section>

        {/* Crisis Safety Notice */}
        <div className="mt-16">
          <SafetyNotice
            heading={content.legalAndSafety.safetyHeading}
            text={content.legalAndSafety.safetyText}
            resources={content.legalAndSafety.safetyResources}
          />
        </div>
      </Container>
    </main>
  );
}
