# Style guide

Visual reference: `D:\Major Project\anchor & sage` (read-only). Token names in that project do not match the colours. The roles below use the hex values as they are actually applied.

## Colour palette

| Hex | Role in the reference | Text pairing |
| --- | --- | --- |
| `#0F1410` | Page background | Text `#EAE8E1` (15.19:1) |
| `#16251C` | Alternate section and footer background | Text `#EAE8E1` (13.02:1) |
| `#EAE8E1` | Primary text | On `#0F1410` and `#16251C` |
| `#C9A86C` | Gold accent, primary button fill, active nav, eyebrows, focus ring | Dark text `#0F1410` on the gold fill (8.25:1). Gold text on `#0F1410` is 8.25:1 |
| `#4E7A60` | Sage highlight | 3.79:1 on `#0F1410`. Fails body text. Not used for text here |
| `#283830` | Borders and dividers | Not used as text |

Muted body copy in the reference is the text colour at about 70–80% opacity. A solid `#B3B3AD` is used here instead so contrast stays 8.84:1 on the page background and 7.58:1 on the surface.

Selection in the reference is sage with ivory text (4.01:1, short of body text). This project selects with gold `#C9A86C` and `#0F1410` text.

## Type

- Headings: Plus Jakarta Sans, weight 600, `letter-spacing: -0.02em`, line-height 1.15. `h1` is weight 700.
- Body: Inter, 16px, line-height 1.7.
- Scale: `h1` `clamp(2rem, 5vw, 3.75rem)`, `h2` `clamp(1.75rem, 4vw, 2.75rem)`, `h3` `clamp(1.35rem, 3vw, 2rem)`, `h4` `clamp(1.15rem, 2vw, 1.4rem)`, body `1rem`.
- Eyebrows: heading font, 12–14px, weight 600, uppercase, tracking `0.18em`, gold.
- Both faces are on Google Fonts and are loaded with `next/font`.

## Spacing and layout

- Container: max-width 1200px, centered. Gutters 1rem, then 1.5rem from 480px, 2.5rem from 768px, 3rem from 1024px.
- Section padding: 3rem, 4rem from 640px, 5rem from 768px.
- Alternate sections use the forest background with a faint top and bottom border.
- Radius: buttons 12px, cards 16px, portrait frame about 20px outside and 16px inside, pills fully round.
- Shadows: soft `0 2px 16px rgb(0 0 0 / 0.35)`, card `0 4px 24px rgb(0 0 0 / 0.30)`, nav `0 1px 8px rgb(0 0 0 / 0.40)`.
- Borders are 1px, low-contrast green-grey, or a 2px gold border on a featured card.

## Buttons

- Primary: gold fill, dark text, 12px radius, horizontal padding about 1.25–1.5rem, vertical padding about 0.625–0.875rem, weight 600, soft shadow, slightly deeper gold on hover, card shadow on hover.
- Secondary: transparent, 1px border, same radius, hover shifts the border and label toward gold.
- Focus: 2px gold outline, 2px offset.

## Cards

- Dark surface, 16px radius, 1px border, soft shadow. Featured card uses a 2px gold border and the stronger shadow.
- Pills are fully rounded, small heading type, a faint border, and a soft shadow.

## Header

- Fixed to the top. Transparent on larger screens until the page scrolls more than 20px, then a blurred near-solid background, a bottom border, and the nav shadow.
- Small screens start slightly translucent.
- Desktop: logo at the left, text links with a wide gap, gold primary action at the right. The current item is gold with a 2px gold underline.
- Mobile: a short gold action plus a menu icon. The menu is a right-hand panel over a dark blurred backdrop.

## Footer

- Forest background, top border, generous vertical padding.
- Three groups: brand and short line, navigation under a gold uppercase label, connect (round icon links, then email and phone).
- A hairline divider, then a copyright row.

## Hero and home section order

1. Hero: two columns on large screens. Eyebrow, large heading with one gold italic phrase, short paragraph, primary and secondary actions, portrait in a rounded shadowed frame.
2. About: centered eyebrow and heading, a short italic line, narrow body copy, a gold left border callout, then a stat card and pills.
3. Services: centered heading, then a row of pricing cards.
4. Contact: form and direct contact on the forest background.

## Icons and motion

- Icons are small line icons (Lucide) or simple stroked brand marks, about 18px, inside 40px circles in the footer.
- Motion is short: fade and a 12–20px rise, about 0.3–0.6s, ease-out. The mobile panel slides in from the right. Hover on the portrait is a slow scale. Reduced motion is not handled in the reference.

## Tone of the reference copy

Short, direct, and confident. Sentences speak to the reader. Headings are plain rather than clinical. Gold italics mark one phrase in a heading. This site does not reuse that wording.

## What to apply here

- Dark charcoal page, forest sections, ivory text, gold actions and eyebrows.
- Plus Jakarta Sans for headings and Inter for body, at the reference scale.
- 1200px container, the section padding rhythm, 12px buttons, 16px cards, and the three soft shadows.
- Sticky header that is translucent until scroll, then solid with blur and the nav shadow. It stays sticky, rather than fixed, so a wrapped header cannot cover the title.
- Footer labels in small gold uppercase type, with round icon links when a social URL exists.
- Current navigation in gold with an underline. Focus rings stay gold and visible.
- Page-enter motion is not added. Existing reduced-motion rules stay.

## What NOT to carry over

- Any words, offers, prices, statistics, testimonials, or biography from that project.
- Its photographs, logo, favicon, and brand name.
- Its contact details, social accounts, and form endpoint.
- Framer Motion, the single-page scroll navigation, and the pricing-card product.
- The sage colour as small text, because it fails WCAG AA on the dark backgrounds.
