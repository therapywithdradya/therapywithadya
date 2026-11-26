import Link from "next/link";
import { ExternalLink, Mail, MapPin, MessageSquare, Phone } from "lucide-react";
import { SafetyNotice } from "@/components/common/safety-notice";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { filled } from "@/content/site";
import { getSiteContent } from "@/lib/site-content.server";

export const revalidate = 60;

const BASE = "/tempPages/design-6";

function parsePhoneForHref(phoneStr: string): string | null {
  const trimmed = phoneStr.trim();
  if (trimmed.startsWith("+")) {
    const digits = trimmed.replace(/\D/g, "");
    return digits.length >= 7 && digits.length <= 15 ? `+${digits}` : null;
  }
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  return null;
}

const contactLinkClass =
  "inline-flex min-h-11 max-w-full items-center gap-3 rounded-sm text-slate-800 underline-offset-4 [overflow-wrap:anywhere] hover:text-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500";

export default async function Design6ContactPage() {
  const content = await getSiteContent();
  const copy = content.pagesCopy.contact;
  const email = filled(content.contact.email) ? content.contact.email.trim() : undefined;
  const phone = filled(content.contact.phone) ? content.contact.phone.trim() : undefined;
  const phoneHref = phone ? parsePhoneForHref(phone) : null;
  const whatsapp = filled(content.contact.whatsapp) ? content.contact.whatsapp.trim() : undefined;
  const waDigits = whatsapp ? whatsapp.replace(/\D/g, "") : "";
  const location = filled(content.contact.location) ? content.contact.location.trim() : undefined;
  const socialDefs = [
    { key: "instagram", label: "Instagram", href: content.contact.socials.instagram },
    { key: "facebook", label: "Facebook", href: content.contact.socials.facebook },
    { key: "youtube", label: "YouTube", href: content.contact.socials.youtube },
    { key: "linkedin", label: "LinkedIn", href: content.contact.socials.linkedin },
  ];
  const socials = socialDefs.filter((item) => filled(item.href));

  const hasAnyContactMethod = Boolean(
    email || phone || (whatsapp && waDigits) || location || socials.length > 0,
  );

  return (
    <>
      <section
        aria-labelledby="contact-page-title"
        className="bg-gradient-to-b from-[#FFFDF2] via-[#EFF7FF] to-[#FBF7EE] py-section"
      >
        <Container>
          <p className="font-heading text-xs font-semibold tracking-[0.18em] text-indigo-600 uppercase">
            {copy.eyebrow}
          </p>
          <h1
            id="contact-page-title"
            className="mt-3 font-heading text-display text-slate-900 [overflow-wrap:anywhere]"
          >
            {copy.title}
          </h1>
          <p className="mt-4 max-w-[70ch] text-lead text-slate-600 [overflow-wrap:anywhere]">
            {copy.intro}
          </p>

          <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
            <Card className="border-indigo-200/80 bg-white/95 p-6 sm:p-8">
              <p className="font-heading text-xs font-semibold tracking-[0.16em] text-indigo-600 uppercase">
                {copy.cardEyebrow}
              </p>
              <h2 className="mt-2 font-heading text-heading text-slate-900">
                {copy.cardTitle}
              </h2>
              <div className="mt-6">
                {hasAnyContactMethod ? (
                  <ul className="list-none space-y-4 p-0" role="list">
                    {email ? (
                      <li className="min-w-0">
                        <a href={`mailto:${email}`} className={contactLinkClass}>
                          <Mail className="size-5 shrink-0 text-indigo-500" aria-hidden="true" />
                          <span className="font-medium [overflow-wrap:anywhere]">{email}</span>
                        </a>
                      </li>
                    ) : null}

                    {phone ? (
                      <li className="min-w-0">
                        {phoneHref ? (
                          <a href={`tel:${phoneHref}`} className={contactLinkClass}>
                            <Phone className="size-5 shrink-0 text-indigo-500" aria-hidden="true" />
                            <span className="font-medium [overflow-wrap:anywhere]">{phone}</span>
                          </a>
                        ) : (
                          <span className="inline-flex min-h-11 items-center gap-3 text-slate-800">
                            <Phone className="size-5 shrink-0 text-indigo-500" aria-hidden="true" />
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
                        >
                          <MessageSquare className="size-5 shrink-0 text-emerald-600" aria-hidden="true" />
                          <span className="font-medium [overflow-wrap:anywhere]">
                            WhatsApp ({whatsapp})
                          </span>
                        </a>
                      </li>
                    ) : null}

                    {location ? (
                      <li className="flex min-h-11 items-center gap-3 text-slate-700 [overflow-wrap:anywhere]">
                        <MapPin className="size-5 shrink-0 text-emerald-600" aria-hidden="true" />
                        <span>{location}</span>
                      </li>
                    ) : null}

                    {socials.length > 0 ? (
                      <li className="border-t border-indigo-100 pt-4">
                        <p className="font-heading text-xs font-semibold tracking-[0.18em] text-indigo-600 uppercase">
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
                                <ExternalLink className="size-4 shrink-0 text-indigo-500" aria-hidden="true" />
                                <span>{item.label}</span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ) : null}
                  </ul>
                ) : (
                  <p className="text-slate-600">Contact details coming soon.</p>
                )}
              </div>
            </Card>

            <Card className="flex flex-col justify-between border-amber-200/80 bg-[#FFFDF8] p-6 sm:p-8">
              <div>
                <p className="font-heading text-xs font-semibold tracking-[0.16em] text-indigo-600 uppercase">
                  {copy.appointmentsEyebrow}
                </p>
                <h2 className="mt-2 font-heading text-[clamp(1.25rem,2.4vw,1.6rem)] text-slate-900">
                  {copy.appointmentsTitle}
                </h2>
                <p className="mt-3 border-l-2 border-indigo-400 pl-4 text-sm leading-relaxed text-slate-600 [overflow-wrap:anywhere]">
                  {copy.appointmentsText}
                </p>
              </div>
              <div className="mt-8 flex flex-col gap-3">
                <Link
                  href={`${BASE}/book`}
                  className="inline-flex min-h-11 w-full items-center justify-center rounded-button bg-indigo-500 px-5 font-semibold text-white shadow-xs hover:bg-indigo-600 transition"
                >
                  {content.brand.bookLabel}
                </Link>
                <Link
                  href={`${BASE}/sessions`}
                  className="inline-flex min-h-11 w-full items-center justify-center rounded-button border border-indigo-200 bg-white px-5 font-semibold text-indigo-700 hover:bg-indigo-50 transition"
                >
                  View session options
                </Link>
              </div>
            </Card>
          </div>
        </Container>
      </section>

      {email ? (
        <section
          aria-labelledby="contact-changes-title"
          className="bg-gradient-to-b from-[#F5F2FF] to-[#ECE7FF] py-section border-y border-indigo-100"
        >
          <Container>
            <SectionHeading
              id="contact-changes-title"
              eyebrow={copy.changesEyebrow}
              title={copy.changesTitle}
            />
            <p className="mt-4 max-w-[70ch] text-slate-700 [overflow-wrap:anywhere]">
              To cancel or request a change for a confirmed booking, please email{" "}
              <a
                href={`mailto:${email}`}
                className="font-semibold text-indigo-600 underline-offset-4 hover:underline"
              >
                {email}
              </a>{" "}
              as early as possible with your full name and the scheduled session date and time.
            </p>
            <p className="mt-4 max-w-[70ch] text-slate-700 [overflow-wrap:anywhere]">
              Cancellation notices, rescheduling guidelines, and refund terms are detailed on our{" "}
              <Link
                href="/terms-and-cancellation"
                className="font-semibold text-indigo-600 underline-offset-4 hover:underline"
              >
                Terms and cancellation
              </Link>{" "}
              page.
            </p>
          </Container>
        </section>
      ) : null}

      <section
        aria-labelledby="contact-safety-title"
        className="bg-gradient-to-b from-[#EFF8F2] to-[#FFFDF7] py-section"
      >
        <Container>
          <SafetyNotice
            id="contact-safety-title"
            headingLevel="h2"
            heading={content.legalAndSafety.safetyHeading}
            text={content.legalAndSafety.safetyText}
            resources={content.legalAndSafety.safetyResources}
          />
        </Container>
      </section>
    </>
  );
}
