import Link from "next/link";
import { ExternalLink, Mail, MapPin, MessageSquare, Phone } from "lucide-react";
import { SafetyNotice } from "@/components/common/safety-notice";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { filled, listedSocials, site } from "@/content/site";
import { marketingMetadata } from "@/lib/page-metadata";

export const metadata = marketingMetadata({
  title: site.pages.contact.title,
  description: site.pages.contact.description,
  path: "/contact",
});

function parsePhoneForHref(phoneStr: string): string | null {
  const trimmed = phoneStr.trim();
  if (trimmed.startsWith("+")) {
    const digits = trimmed.replace(/\D/g, "");
    return digits.length >= 7 && digits.length <= 15 ? `+${digits}` : null;
  }
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length === 10) {
    return `+91${digits}`;
  }
  if (digits.length === 12 && digits.startsWith("91")) {
    return `+${digits}`;
  }
  // Ambiguous format: do not guess country, omit tel: href
  return null;
}

const contactLinkClass =
  "inline-flex min-h-11 max-w-full items-center gap-3 rounded-sm text-ink underline-offset-4 [overflow-wrap:anywhere] hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";

export default function ContactPage() {
  const email = filled(site.email) ? site.email.trim() : undefined;
  const phone = filled(site.phone) ? site.phone.trim() : undefined;
  const phoneHref = phone ? parsePhoneForHref(phone) : null;
  const whatsapp = filled(site.whatsapp) ? site.whatsapp.trim() : undefined;
  const waDigits = whatsapp ? whatsapp.replace(/\D/g, "") : "";
  const location = filled(site.location) ? site.location.trim() : undefined;
  const socials = listedSocials();

  const hasAnyContactMethod = Boolean(
    email || phone || (whatsapp && waDigits) || location || socials.length > 0,
  );

  return (
    <>
      {/* Intro section — single h1 */}
      <Section aria-labelledby="contact-page-title">
        <Container>
          <h1
            id="contact-page-title"
            className="font-heading text-display text-ink [overflow-wrap:anywhere]"
          >
            {site.pages.contact.title}
          </h1>
          <p className="mt-4 max-w-[70ch] text-lead text-muted [overflow-wrap:anywhere]">
            {site.pages.contact.intro}
          </p>

          <div className="mt-10">
            {hasAnyContactMethod ? (
              <ul className="list-none space-y-4 p-0" role="list">
                {email ? (
                  <li className="min-w-0">
                    <a
                      href={`mailto:${email}`}
                      className={contactLinkClass}
                      aria-label={`Email ${email}`}
                    >
                      <Mail className="size-5 shrink-0 text-primary" aria-hidden="true" />
                      <span className="font-medium [overflow-wrap:anywhere]">{email}</span>
                    </a>
                  </li>
                ) : null}

                {phone ? (
                  <li className="min-w-0">
                    {phoneHref ? (
                      <a
                        href={`tel:${phoneHref}`}
                        className={contactLinkClass}
                        aria-label={`Call ${phone}`}
                      >
                        <Phone className="size-5 shrink-0 text-primary" aria-hidden="true" />
                        <span className="font-medium [overflow-wrap:anywhere]">{phone}</span>
                      </a>
                    ) : (
                      <span className="inline-flex min-h-11 items-center gap-3 text-ink [overflow-wrap:anywhere]">
                        <Phone className="size-5 shrink-0 text-primary" aria-hidden="true" />
                        <span className="font-medium">{phone}</span>
                      </span>
                    )}
                  </li>
                ) : null}

                {whatsapp && waDigits ? (
                  <li className="min-w-0">
                    <a
                      href={`https://wa.me/${waDigits}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={contactLinkClass}
                      aria-label={`Chat on WhatsApp with ${whatsapp} (opens in a new tab)`}
                    >
                      <MessageSquare className="size-5 shrink-0 text-primary" aria-hidden="true" />
                      <span className="font-medium [overflow-wrap:anywhere]">
                        WhatsApp ({whatsapp})
                      </span>
                    </a>
                  </li>
                ) : null}

                {location ? (
                  <li className="flex min-h-11 items-center gap-3 text-ink [overflow-wrap:anywhere]">
                    <MapPin className="size-5 shrink-0 text-primary" aria-hidden="true" />
                    <span>{location}</span>
                  </li>
                ) : null}

                {socials.length > 0 ? (
                  <li className="pt-2">
                    <p className="font-heading text-xs font-semibold tracking-[0.18em] text-primary uppercase">
                      Social profiles
                    </p>
                    <ul className="mt-3 flex flex-wrap gap-4 list-none p-0" role="list">
                      {socials.map((item) => (
                        <li key={item.key}>
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={contactLinkClass}
                          >
                            <ExternalLink className="size-4 shrink-0 text-primary" aria-hidden="true" />
                            <span>{item.label}</span>
                            <span className="sr-only"> (opens in a new tab)</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                ) : null}
              </ul>
            ) : (
              <p className="text-muted">Contact details coming soon.</p>
            )}

            <div className="mt-10">
              <Button href={site.bookHref} id="contact-book-btn">
                {site.bookLabel}
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* Cancel or change a booking block — only if email exists */}
      {email ? (
        <Section aria-labelledby="contact-changes-title" background="surface">
          <Container>
            <h2
              id="contact-changes-title"
              className="font-heading text-heading text-ink [overflow-wrap:anywhere]"
            >
              Cancel or change a booking
            </h2>
            <p className="mt-4 max-w-[70ch] text-muted [overflow-wrap:anywhere]">
              To cancel or request a change for a confirmed booking, please email{" "}
              <a
                href={`mailto:${email}`}
                className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
              >
                {email}
              </a>{" "}
              as early as possible with your full name and the scheduled session date and time.
            </p>
            <p className="mt-4 max-w-[70ch] text-muted [overflow-wrap:anywhere]">
              Cancellation notices, rescheduling guidelines, and refund terms are detailed on our{" "}
              <Link
                href="/terms-and-cancellation"
                className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
              >
                Terms and cancellation
              </Link>{" "}
              page.
            </p>
          </Container>
        </Section>
      ) : null}

      {/* Safety notice section */}
      <Section aria-labelledby="contact-safety-title">
        <Container>
          <SafetyNotice id="contact-safety-title" headingLevel="h2" />
        </Container>
      </Section>
    </>
  );
}
