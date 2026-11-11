import { Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { filled, listedSocials, site, socialChannels } from "@/content/site";

const textLinkClass =
  "inline-flex min-h-11 max-w-full items-center gap-2 rounded-sm text-ink underline-offset-4 [overflow-wrap:anywhere] hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";

export function ContactSection({
  eyebrow,
  title,
  intro,
  email: propEmail,
  phone: propPhone,
  whatsapp: propWhatsapp,
  location: propLocation,
  socials: propSocials,
  bookHref,
  bookLabel,
}: {
  eyebrow?: string;
  title?: string;
  intro?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  location?: string;
  socials?: Partial<Record<"instagram" | "facebook" | "youtube" | "linkedin", string>>;
  bookHref?: string;
  bookLabel?: string;
} = {}) {
  const rawEmail = propEmail !== undefined ? propEmail : site.email;
  const rawPhone = propPhone !== undefined ? propPhone : site.phone;
  const rawWhatsapp = propWhatsapp !== undefined ? propWhatsapp : site.whatsapp;
  const rawLocation = propLocation !== undefined ? propLocation : site.location;

  const email = filled(rawEmail) ? rawEmail.trim() : undefined;
  const phone = filled(rawPhone) ? rawPhone.trim() : undefined;
  const whatsapp = filled(rawWhatsapp) ? rawWhatsapp.trim() : undefined;
  const location = filled(rawLocation) ? rawLocation.trim() : undefined;
  const socials = propSocials
    ? socialChannels.flatMap((ch) => {
        const href = propSocials[ch.key];
        return filled(href) ? [{ key: ch.key, label: ch.label, href: href.trim() }] : [];
      })
    : listedSocials();
  const hasDetails = Boolean(email || phone || whatsapp || location || socials.length > 0);
  const waDigits = whatsapp ? whatsapp.replace(/\D/g, "") : "";
  const waUrl =
    whatsapp && whatsapp.startsWith("http")
      ? whatsapp
      : waDigits
        ? `https://wa.me/${waDigits}`
        : undefined;

  return (
    <Section aria-labelledby="home-contact-title" background="surface">
      <Container>
        <SectionHeading
          id="home-contact-title"
          eyebrow={eyebrow || "Contact"}
          title={title || site.home.contactTitle}
          intro={intro ?? site.home.contactIntro}
        />
        {hasDetails ? (
          <ul className="mt-6 max-w-xl list-none space-y-1 p-0">
            {email ? (
              <li>
                <a href={`mailto:${email}`} className={textLinkClass}>
                  <Mail className="size-5 shrink-0" aria-hidden="true" />
                  <span>{email}</span>
                </a>
              </li>
            ) : null}
            {phone ? (
              <li>
                <a href={`tel:${phone.replace(/\s+/g, "")}`} className={textLinkClass}>
                  <Phone className="size-5 shrink-0" aria-hidden="true" />
                  <span>{phone}</span>
                </a>
              </li>
            ) : null}
            {waUrl ? (
              <li>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={textLinkClass}
                >
                  <span>WhatsApp ({whatsapp})</span>
                </a>
              </li>
            ) : null}
            {location ? (
              <li className="flex min-h-11 items-center gap-2 text-ink [overflow-wrap:anywhere]">
                <MapPin className="size-5 shrink-0" aria-hidden="true" />
                <span>{location}</span>
              </li>
            ) : null}
            {socials.length > 0 ? (
              <li>
                <ul className="list-none space-y-1 p-0">
                  {socials.map((item) => (
                    <li key={item.key}>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={textLinkClass}
                      >
                        {item.label}
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ) : null}
          </ul>
        ) : null}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button href="/contact" className="w-full sm:w-auto">
            Contact page
          </Button>
          <Button href={bookHref || site.bookHref} variant="secondary" className="w-full sm:w-auto">
            {bookLabel || site.bookLabel}
          </Button>
        </div>
      </Container>
    </Section>
  );
}
