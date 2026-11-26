import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { filled, listedSocials, site, socialChannels, wordmark } from "@/content/site";
import type { EditableSiteContent } from "@/lib/site-content-types";

const BASE = "/tempPages/design-6";

const footerNav = [
  { href: BASE, label: "Home" },
  { href: `${BASE}/about`, label: "About" },
  { href: `${BASE}/services`, label: "Services" },
  { href: `${BASE}/sessions`, label: "Sessions" },
  { href: `${BASE}/events`, label: "Events" },
  { href: `${BASE}/gallery`, label: "Gallery" },
  { href: `${BASE}/reviews`, label: "Reviews" },
  { href: `${BASE}/contact`, label: "Contact" },
  { href: `${BASE}/book`, label: "Book a session" },
];

export function Design6Footer({ content }: { content?: EditableSiteContent }) {
  const year = new Date().getFullYear();
  const rawEmail = content ? content.contact.email : site.email;
  const rawPhone = content ? content.contact.phone : site.phone;
  const rawWhatsapp = content ? content.contact.whatsapp : site.whatsapp;
  const rawLocation = content ? content.contact.location : site.location;
  const rawTagline = content ? content.hero.tagline : site.tagline;
  const rawPractitioner = content ? content.brand.practitionerName : site.practitionerName;

  const email = filled(rawEmail) ? rawEmail.trim() : undefined;
  const phone = filled(rawPhone) ? rawPhone.trim() : undefined;
  const whatsapp = filled(rawWhatsapp) ? rawWhatsapp.trim() : undefined;
  const location = filled(rawLocation) ? rawLocation.trim() : undefined;
  const brand = content?.brand.siteName?.trim() || wordmark();

  const socials = content
    ? socialChannels.flatMap((ch) => {
        const href = content.contact.socials[ch.key];
        return filled(href) ? [{ key: ch.key, label: ch.label, href: href.trim() }] : [];
      })
    : listedSocials();

  const hasContact = Boolean(email || phone || whatsapp || location);

  return (
    <footer className="border-t border-indigo-100 bg-gradient-to-br from-[#F2F0FF] via-[#EEF7FF] to-[#EDF7F0] text-slate-800">
      <div className="mx-auto grid max-w-[75rem] gap-10 px-4 sm:px-6 lg:px-8 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div className="max-w-sm">
          <p className="font-heading text-2xl font-semibold tracking-tight text-slate-900 [overflow-wrap:anywhere]">
            {brand}
          </p>
          {filled(rawTagline) ? <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-600">{rawTagline}</p> : null}
          {filled(rawPractitioner) && rawPractitioner !== brand ? (
            <p className="mt-3 text-sm font-medium text-indigo-700">{rawPractitioner}</p>
          ) : null}
        </div>

        <nav aria-label="Quick links">
          <h2 className="font-heading text-xs font-bold tracking-[0.18em] text-indigo-600 uppercase">
            Quick links
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {footerNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-slate-700 underline-offset-4 hover:text-indigo-700 hover:underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {hasContact ? (
          <div>
            <h2 className="font-heading text-xs font-bold tracking-[0.18em] text-indigo-600 uppercase">
              Contact
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              {email ? (
                <li>
                  <a
                    href={`mailto:${email}`}
                    className="text-slate-700 underline-offset-4 hover:text-indigo-700 hover:underline [overflow-wrap:anywhere]"
                  >
                    {email}
                  </a>
                </li>
              ) : null}
              {phone ? (
                <li>
                  <a
                    href={`tel:${phone.replace(/\s+/g, "")}`}
                    className="text-slate-700 underline-offset-4 hover:text-indigo-700 hover:underline"
                  >
                    {phone}
                  </a>
                </li>
              ) : null}
              {whatsapp ? (
                <li>
                  <a
                    href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-700 underline-offset-4 hover:text-indigo-700 hover:underline"
                  >
                    WhatsApp
                  </a>
                </li>
              ) : null}
              {location ? <li className="text-slate-600 [overflow-wrap:anywhere]">{location}</li> : null}
            </ul>
          </div>
        ) : null}

        {socials.length > 0 ? (
          <div>
            <h2 className="font-heading text-xs font-bold tracking-[0.18em] text-indigo-600 uppercase">
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
                    className="inline-flex size-11 items-center justify-center rounded-full border border-indigo-200 bg-white/80 text-indigo-600 shadow-xs hover:border-indigo-400 hover:bg-white transition"
                  >
                    <ExternalLink className="size-5 shrink-0" aria-hidden={true} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <div className="border-t border-indigo-200/60">
        <div className="mx-auto flex max-w-[75rem] flex-col gap-3 px-4 sm:px-6 lg:px-8 py-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between text-sm text-slate-600">
          <p>© {year} {brand}</p>
          <nav aria-label="Demo Navigation" className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/tempPages" className="font-semibold text-indigo-700 hover:underline">
              All Design Demos Hub
            </Link>
            <Link href="/privacy" className="hover:text-indigo-700 hover:underline">
              Privacy
            </Link>
            <Link href="/terms-and-cancellation" className="hover:text-indigo-700 hover:underline">
              Terms and cancellation
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
