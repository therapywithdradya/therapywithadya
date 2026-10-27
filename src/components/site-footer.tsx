import { ExternalLink } from "lucide-react";
import { SiteLink } from "@/components/site-link";
import { Container } from "@/components/ui/container";
import { filled, listedSocials, site, wordmark } from "@/content/site";

export function SiteFooter() {
  const year = new Date().getFullYear();
  const email = filled(site.email) ? site.email : undefined;
  const phone = filled(site.phone) ? site.phone : undefined;
  const whatsapp = filled(site.whatsapp) ? site.whatsapp : undefined;
  const location = filled(site.location) ? site.location : undefined;
  const socials = listedSocials();
  const brand = wordmark();
  const hasContact = Boolean(email || phone || whatsapp || location);

  return (
    <footer className="border-t border-border bg-surface text-ink">
      <Container className="grid gap-10 py-section md:grid-cols-2 lg:grid-cols-4">
        <div className="max-w-sm">
          <p className="font-heading text-2xl font-semibold tracking-tight [overflow-wrap:anywhere]">
            {brand}
          </p>
          {filled(site.tagline) ? <p className="mt-4 max-w-sm text-muted">{site.tagline}</p> : null}
          {filled(site.practitionerName) && site.practitionerName !== brand ? (
            <p className="mt-3 text-muted">{site.practitionerName}</p>
          ) : null}
        </div>
        <nav aria-label="Quick links">
          <h2 className="font-heading text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            Quick links
          </h2>
          <ul className="mt-3 space-y-2">
            <li>
              <SiteLink href="/">Home</SiteLink>
            </li>
            {site.nav.map((item) => (
              <li key={item.href}>
                <SiteLink href={item.href}>{item.label}</SiteLink>
              </li>
            ))}
            <li>
              <SiteLink href={site.bookHref}>{site.bookLabel}</SiteLink>
            </li>
          </ul>
        </nav>
        {hasContact ? (
          <div>
            <h2 className="font-heading text-xs font-semibold tracking-[0.18em] text-primary uppercase">
              Contact
            </h2>
            <ul className="mt-3 space-y-2">
              {email ? (
                <li>
                  <a
                    href={`mailto:${email}`}
                    className="rounded-sm [overflow-wrap:anywhere] text-ink underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                  >
                    {email}
                  </a>
                </li>
              ) : null}
              {phone ? (
                <li>
                  <a
                    href={`tel:${phone.replace(/\s+/g, "")}`}
                    className="rounded-sm text-ink underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                  >
                    {phone}
                  </a>
                </li>
              ) : null}
              {whatsapp ? (
                <li>
                  <a
                    href={whatsapp}
                    className="rounded-sm text-ink underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                  >
                    WhatsApp
                  </a>
                </li>
              ) : null}
              {location ? <li className="text-ink [overflow-wrap:anywhere]">{location}</li> : null}
            </ul>
          </div>
        ) : null}
        {socials.length > 0 ? (
          <div>
            <h2 className="font-heading text-xs font-semibold tracking-[0.18em] text-primary uppercase">
              Social
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {socials.map((item) => (
                <li key={item.key}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${item.label} (opens in a new tab)`}
                    className="inline-flex size-11 items-center justify-center rounded-full border border-border text-muted shadow-soft hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                  >
                    <ExternalLink className="size-5 shrink-0" aria-hidden={true} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Container>
      <Container className="flex flex-col gap-3 border-t border-border py-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <p className="text-sm text-muted [overflow-wrap:anywhere]">
          © {year} {brand}
        </p>
        <nav aria-label="Legal" className="flex flex-wrap gap-x-4 gap-y-2">
          <SiteLink href="/privacy">Privacy</SiteLink>
          <SiteLink href="/terms-and-cancellation">Terms and cancellation</SiteLink>
          <SiteLink href="/admin">Practitioner Login</SiteLink>
        </nav>

      </Container>
    </footer>
  );
}
