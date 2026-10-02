import Link from "next/link";
import { SafetyNotice } from "@/components/common/safety-notice";
import { PolicySummary } from "@/components/policy/PolicySummary";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { site } from "@/content/site";
import { marketingMetadata } from "@/lib/page-metadata";

export const metadata = marketingMetadata({
  title: site.pages.termsAndCancellation.title,
  description: site.pages.termsAndCancellation.description,
  path: "/terms-and-cancellation",
});

export default function TermsPage() {
  return (
    <>
      {/* Intro section — single h1 */}
      <Section aria-labelledby="terms-page-title">
        <Container>
          <h1
            id="terms-page-title"
            className="font-heading text-display text-ink [overflow-wrap:anywhere]"
          >
            {site.pages.termsAndCancellation.title}
          </h1>
          <p className="mt-4 max-w-[70ch] text-lead text-muted [overflow-wrap:anywhere]">
            {site.pages.termsAndCancellation.intro}
          </p>
        </Container>
      </Section>

      {/* Practice policies in sections mode */}
      <Section aria-labelledby="terms-policies-title" background="surface">
        <Container>
          <h2
            id="terms-policies-title"
            className="sr-only"
          >
            Practice policies
          </h2>
          <div className="max-w-[70ch]">
            <PolicySummary mode="sections" />
          </div>
        </Container>
      </Section>

      {/* System mechanics */}
      <Section aria-labelledby="terms-system-title">
        <Container>
          <div className="max-w-[70ch] space-y-10">
            <div className="space-y-4">
              <h2
                id="terms-system-title"
                className="font-heading text-heading text-ink [overflow-wrap:anywhere]"
              >
                How booking and holds work
              </h2>
              <p className="text-body text-ink [overflow-wrap:anywhere]">
                When you select a date and start time on our booking page, that slot is temporarily
                held for 15 minutes to allow you to complete payment. During this window, no other
                client can reserve that time slot.
              </p>
              <p className="text-body text-ink [overflow-wrap:anywhere]">
                Your booking is officially confirmed only after payment is verified by our server.
                The confirmation page displayed on screen immediately following successful payment
                serves as your proof of booking.
              </p>
            </div>

            <div className="space-y-4">
              <h2
                id="terms-online-title"
                className="font-heading text-heading text-ink [overflow-wrap:anywhere]"
              >
                Session delivery format
              </h2>
              <p className="text-body text-ink [overflow-wrap:anywhere]">
                All sessions offered on this site are conducted online. Meeting access details are
                arranged directly between you and the practitioner prior to your session time. There
                is no in-person clinic address.
              </p>
            </div>

            <div className="space-y-4">
              <h2
                id="terms-unhonoured-title"
                className="font-heading text-heading text-ink [overflow-wrap:anywhere]"
              >
                If we cannot honour a paid booking
              </h2>
              <p className="text-body text-ink [overflow-wrap:anywhere]">
                [DUMMY] Pending client confirmation: In the rare situation where payment is completed
                after a 15-minute hold has expired and the slot has already been taken by another
                client, the session cannot be confirmed. In such cases, the practitioner will arrange
                a full refund to your original payment method within [DUMMY] refund timeline to be confirmed.
              </p>
            </div>

            <div className="space-y-4">
              <h2
                id="terms-changes-title"
                className="font-heading text-heading text-ink [overflow-wrap:anywhere]"
              >
                Cancellations and rescheduling
              </h2>
              <p className="text-body text-ink [overflow-wrap:anywhere]">
                This site does not offer self-serve cancellation or rescheduling buttons. To cancel or
                request a date or time change for a booked session, please contact the practitioner
                by email as outlined on our{" "}
                <Link
                  href="/contact"
                  className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                >
                  Contact page
                </Link>
                . Please send your request as early as possible with your full name and scheduled session details.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Safety notice section */}
      <Section aria-labelledby="terms-safety-title" background="surface">
        <Container>
          <div className="max-w-[70ch]">
            <SafetyNotice id="terms-safety-title" headingLevel="h2" />
          </div>
        </Container>
      </Section>

      {/* Last updated footer line */}
      <Section aria-labelledby="terms-updated-title">
        <Container>
          <div className="max-w-[70ch]">
            <h2 id="terms-updated-title" className="sr-only">
              Document updates
            </h2>
            <p className="text-sm text-muted">
              Last updated: {site.legalLastUpdated}
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
