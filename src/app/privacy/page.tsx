import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { filled, site, wordmark } from "@/content/site";
import { marketingMetadata } from "@/lib/page-metadata";

export const metadata = marketingMetadata({
  title: site.pages.privacy.title,
  description: site.pages.privacy.description,
  path: "/privacy",
});

export default function PrivacyPage() {
  const brand = wordmark();
  const contactEmail = filled(site.email) ? site.email.trim() : null;
  const minorsPolicy = filled(site.policies.minorsSummary)
    ? site.policies.minorsSummary.trim()
    : "[DUMMY] pending client policy";

  return (
    <>
      {/* Draft banner */}
      <aside
        aria-label="Draft notice"
        className="border-b border-border bg-surface/80 py-3 text-center text-sm font-medium text-muted"
      >
        <Container>
          <p>[DUMMY] Draft pending client review before launch</p>
        </Container>
      </aside>

      {/* Hero / title section */}
      <Section aria-labelledby="privacy-page-title">
        <Container>
          <h1
            id="privacy-page-title"
            className="font-heading text-display text-ink [overflow-wrap:anywhere]"
          >
            {site.pages.privacy.title}
          </h1>
          <p className="mt-4 max-w-[70ch] text-lead text-muted [overflow-wrap:anywhere]">
            {site.pages.privacy.intro}
          </p>
        </Container>
      </Section>

      {/* Main content sections */}
      <Section aria-labelledby="privacy-details-title" background="surface">
        <Container>
          <div className="max-w-[70ch] space-y-12">
            {/* 1. Who runs this site */}
            <div className="space-y-4">
              <h2
                id="privacy-who-title"
                className="font-heading text-heading text-ink [overflow-wrap:anywhere]"
              >
                1. Who runs this site and how to contact us
              </h2>
              <p className="text-body text-ink [overflow-wrap:anywhere]">
                This website is operated by {brand}. If you have questions about how your
                information is handled or wish to exercise any of your rights regarding your
                personal data, you can contact us
                {contactEmail ? (
                  <>
                    {" "}by email at{" "}
                    <a
                      href={`mailto:${contactEmail}`}
                      className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                    >
                      {contactEmail}
                    </a>
                  </>
                ) : (
                  " using the contact details published on this website"
                )}
                .
              </p>
            </div>

            {/* 2. What is collected when you book */}
            <div className="space-y-4">
              <h2
                id="privacy-collected-title"
                className="font-heading text-heading text-ink [overflow-wrap:anywhere]"
              >
                2. What information is collected when you book
              </h2>
              <p className="text-body text-ink [overflow-wrap:anywhere]">
                When you schedule a session through our booking system, we collect the following details:
              </p>
              <ul className="list-disc space-y-2 pl-6 text-muted">
                <li>
                  <strong className="text-ink">Contact and session details:</strong> Your full name,
                  email address, telephone number, selected session type, date, time, and timezone.
                </li>
                <li>
                  <strong className="text-ink">Optional note:</strong> A brief note you may choose to
                  provide about your session. Please do not include sensitive medical or clinical details.
                </li>
                <li>
                  <strong className="text-ink">Payment identifiers:</strong> The transaction identifier,
                  order identifier, and payment amount. Payment card details and UPI credentials are
                  processed directly by our payment provider (Razorpay) and never reach or get stored
                  by our server.
                </li>
                <li>
                  <strong className="text-ink">Confirmation link token:</strong> When your booking is
                  created, a secure link token is generated. Only a cryptographic hash (SHA-256) of this
                  token is stored in our database.
                </li>
                <li>
                  <strong className="text-ink">Technical logs and rate limiting:</strong> Standard server
                  request logs are recorded by our website host. To prevent automated abuse of the
                  booking and availability system, rate limiting uses a one-way hashed key rather than
                  storing raw IP addresses.
                </li>
              </ul>
            </div>

            {/* 3. Why it is used */}
            <div className="space-y-4">
              <h2
                id="privacy-purpose-title"
                className="font-heading text-heading text-ink [overflow-wrap:anywhere]"
              >
                3. Why your information is used
              </h2>
              <p className="text-body text-ink [overflow-wrap:anywhere]">
                We use the information collected exclusively for the following purposes:
              </p>
              <ul className="list-disc space-y-2 pl-6 text-muted">
                <li>To create, schedule, and administer your session booking.</li>
                <li>To verify and confirm your session fee payment.</li>
                <li>To add the scheduled appointment to the practitioner&apos;s working calendar.</li>
                <li>To respond to your direct enquiries and booking questions.</li>
              </ul>
            </div>

            {/* 4. The calendar */}
            <div className="space-y-4">
              <h2
                id="privacy-calendar-title"
                className="font-heading text-heading text-ink [overflow-wrap:anywhere]"
              >
                4. Practitioner calendar and event details
              </h2>
              <p className="text-body text-ink [overflow-wrap:anywhere]">
                Once your payment is verified, an event entry is created in the practitioner&apos;s
                Google Calendar to reserve the time slot. The calendar entry includes the session title,
                start and end times, and your optional booking note in the event description so the
                practitioner can review it. Depending on the final calendar configuration, your email
                address may be included as a calendar attendee so you receive an automatic calendar invite.
              </p>
            </div>

            {/* 5. Who it is shared with */}
            <div className="space-y-4">
              <h2
                id="privacy-sharing-title"
                className="font-heading text-heading text-ink [overflow-wrap:anywhere]"
              >
                5. Third-party service providers
              </h2>
              <p className="text-body text-ink [overflow-wrap:anywhere]">
                We do not sell or rent your personal information. Information is shared only with
                the trusted service providers required to deliver this website and booking flow:
              </p>
              <ul className="list-disc space-y-2 pl-6 text-muted">
                <li><strong className="text-ink">Razorpay:</strong> Payment processing and transaction verification.</li>
                <li><strong className="text-ink">Google:</strong> Calendar synchronization for confirmed appointments.</li>
                <li><strong className="text-ink">Supabase:</strong> Database hosting and data storage.</li>
                <li><strong className="text-ink">Vercel:</strong> Website hosting and infrastructure delivery.</li>
              </ul>
            </div>

            {/* 6. Cookies and analytics */}
            <div className="space-y-4">
              <h2
                id="privacy-cookies-title"
                className="font-heading text-heading text-ink [overflow-wrap:anywhere]"
              >
                6. Cookies and analytics
              </h2>
              <p className="text-body text-ink [overflow-wrap:anywhere]">
                This website sets no analytics cookies, tracking beacons, or advertising cookies.
                When you initiate payment, the Razorpay Checkout modal may use its own necessary cookies
                or local storage in your browser while the payment window is open to process the transaction securely.
              </p>
            </div>

            {/* 7. Retention */}
            <div className="space-y-4">
              <h2
                id="privacy-retention-title"
                className="font-heading text-heading text-ink [overflow-wrap:anywhere]"
              >
                7. Data retention
              </h2>
              <p className="text-body text-ink [overflow-wrap:anywhere]">
                Booking records and transaction references are retained for [DUMMY] retention period to be confirmed by the client,
                after which records that are no longer required for accounting or legal obligations are removed or anonymized.
              </p>
            </div>

            {/* 8. Your choices */}
            <div className="space-y-4">
              <h2
                id="privacy-rights-title"
                className="font-heading text-heading text-ink [overflow-wrap:anywhere]"
              >
                8. Your choices and data rights
              </h2>
              <p className="text-body text-ink [overflow-wrap:anywhere]">
                You may request access to, correction of, or deletion of the personal data we hold
                about you. To submit a request, please contact us by email
                {contactEmail ? (
                  <>
                    {" "}at{" "}
                    <a
                      href={`mailto:${contactEmail}`}
                      className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                    >
                      {contactEmail}
                    </a>
                  </>
                ) : null}
                . We will respond to your request within [DUMMY] response time to be confirmed.
              </p>
            </div>

            {/* 9. Sensitive information warning */}
            <div className="space-y-4">
              <h2
                id="privacy-sensitive-title"
                className="font-heading text-heading text-ink [overflow-wrap:anywhere]"
              >
                9. Sensitive health information
              </h2>
              <p className="text-body text-ink [overflow-wrap:anywhere]">
                Please do not include sensitive medical, psychiatric, or personal health details in
                the booking note field. The booking note is intended only for brief scheduling
                context. Any personal or therapeutic discussions should take place privately during
                your session.
              </p>
            </div>

            {/* 10. Under-18s */}
            <div className="space-y-4">
              <h2
                id="privacy-minors-title"
                className="font-heading text-heading text-ink [overflow-wrap:anywhere]"
              >
                10. Under-18s policy
              </h2>
              <p className="text-body text-ink [overflow-wrap:anywhere]">
                {minorsPolicy}
              </p>
            </div>

            {/* 11. Changes and last updated */}
            <div className="space-y-4 border-t border-border pt-8">
              <h2
                id="privacy-changes-title"
                className="font-heading text-heading text-ink [overflow-wrap:anywhere]"
              >
                11. Changes to this policy
              </h2>
              <p className="text-body text-ink [overflow-wrap:anywhere]">
                Any updates to this privacy policy will be posted on this page.
              </p>
              <p className="text-sm text-muted">
                Last updated: {site.legalLastUpdated}
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
