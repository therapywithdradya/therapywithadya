import { BookingWizard } from "@/components/booking/booking-wizard";
import { SafetyNotice } from "@/components/common/safety-notice";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { getSiteContent } from "@/lib/site-content.server";

export const revalidate = 60;

export default async function Design6BookPage() {
  const content = await getSiteContent();
  const copy = content.sessionsPage;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFDF2] via-[#F2F0FF] to-[#EFF8F2] py-12 md:py-20">
      <Container>
        <div className="mb-12 text-center">
          <SectionHeading
            eyebrow={copy.bookPageEyebrow}
            title={copy.bookPageTitle}
            intro={copy.bookPageIntro}
          />
        </div>

        <Section className="py-0">
          <BookingWizard initialSessions={content.sessions} />
        </Section>

        <div className="mt-16">
          <SafetyNotice
            heading={content.legalAndSafety.safetyHeading}
            text={content.legalAndSafety.safetyText}
            resources={content.legalAndSafety.safetyResources}
          />
        </div>
      </Container>
    </div>
  );
}
