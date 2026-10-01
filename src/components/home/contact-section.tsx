import { Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { filled, listedSocials, site } from "@/content/site";

const textLinkClass =
  "inline-flex min-h-11 max-w-full items-center gap-2 rounded-sm text-ink underline-offset-4 [overflow-wrap:anywhere] hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";

export function ContactSection() {
  const email = filled(site.email) ? site.email.trim() : undefined;
  const phone = filled(site.phone) ? site.phone.trim() : undefined;
  const whatsapp = filled(site.whatsapp) ? site.whatsapp.trim() : undefined;
  const location = filled(site.location) ? site.location.trim() : undefined;
  const socials = listedSocials();
  const hasDetails = Boolean(email || phone || whatsapp || location || socials.length > 0);

  return (
    <Section aria-labelledby="home-contact-title" background="surface">
      <Container>
        <SectionHeading
          id="home-contact-title"
          eyebrow="Contact"
          title={site.home.contactTitle}
          intro={site.home.contactIntro}
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
            {whatsapp ? (
              <li>
                <a href={whatsapp} className={textLinkClass}>
                  <span>WhatsApp</span>
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
          <Button href={site.bookHref} variant="secondary" className="w-full sm:w-auto">
            {site.bookLabel}
          </Button>
        </div>
      </Container>
    </Section>
  );
}
