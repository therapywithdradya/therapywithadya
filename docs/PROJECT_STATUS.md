# Project Status & Completion Roadmap

**Project**: Dr. Adya's Practice Website (`therapywithadya.com`)  
**Stack**: Next.js 16.3.8 (App Router, Turbopack, React 19, Node 24 LTS), Tailwind CSS v4, Supabase (PostgreSQL 15+), Razorpay, Google Calendar API, Vitest.  
**Last Updated**: October 2026  
**Repository Branch**: `main` (tracked at `therapywithdradya/therapywithadya`)  

---

## 1. Executive Summary

This project is a bespoke, privacy-first web application for Dr. Adya’s clinical psychology practice. It combines an editorial marketing front-end with an automated, double-booking-proof appointment scheduling and payment engine.

### Current System Health
- **Typecheck (`npm run typecheck`)**: 100% clean (0 TypeScript errors).
- **Linter (`npm run lint`)**: 100% clean (0 ESLint warnings/errors).
- **Unit Test Suite (`npm test`)**: 135/135 tests passing across 8 test suites.
- **Placeholder Audit (`npm run check:placeholders`)**: 0 placeholders remaining (practitioner bio, photos, session options, and fees populated from reference docs).
- **Build Status (`npm run build`)**: 14/14 static marketing routes compile successfully with ISR.

---

## 2. What Has Been Done

```
[Phase 1] Scaffold & Docs       ───► [Phase 2] Database & State Machine ───► [Phase 3] Design System & Shell
                                                                                      │
[Phase 5a] Availability Engine  ◄─── [Content] Real Bio & Assets (adc3389) ◄───────────┴───► [Phase 4] All Marketing Pages
```

### Phase 1: Architecture & Foundation (`c65aa0c`)
- Initialized Next.js 16 App Router application pinned to Node 24 LTS (`.nvmrc`).
- Established strict architectural contracts in [`docs/ARCHITECTURE.md`](file:///d:/Major%20Project/adyas-project/docs/ARCHITECTURE.md).
- Authored decision log [`docs/DECISIONS.md`](file:///d:/Major%20Project/adyas-project/docs/DECISIONS.md) capturing business rules, defaults, and security boundaries.
- Configured `.gitignore` to prevent any credentials or `.env*` leaks while preserving `.env.example`.

### Phase 2: Database Schema & Booking State Machine (`c98545c`)
- **Core Schema ([`supabase/migrations/0001_core_tables.sql`](file:///d:/Major%20Project/adyas-project/supabase/migrations/0001_core_tables.sql))**:
  - `bookings`: Complete lifecycle tracking (`pending`, `confirmed`, `cancelled`, `failed`), client contact info, and token hashes.
  - **GiST Exclusion Constraint**: `tstzrange(starts_at, blocked_until, '[)')` preventing overlapping active bookings directly at the database engine level.
  - `payment_events`: Razorpay webhook audit log ensuring strict idempotency.
  - `rate_limits`: Hash-indexed window rate limiter without external Redis dependency.
  - `testimonials`, `events_workshops`, `gallery_items` tables.
- **Transactional Stored Procedures ([`supabase/migrations/0002_booking_functions.sql`](file:///d:/Major%20Project/adyas-project/supabase/migrations/0002_booking_functions.sql))**:
  - `create_pending_booking()`: Atomic hold reservation (15-min hold) with overlap check.
  - `confirm_booking_payment()`: Row-locked (`FOR UPDATE`) payment verification handling late captures, amounts check, and duplicate webhook deliveries.
  - `expire_stale_pending_bookings()`: Sweeper releasing abandoned holds.
  - `mark_payment_failed()`, `get_booked_ranges()`, `check_rate_limit()`.
- **Row-Level Security & Grants ([`supabase/migrations/0003_rls_and_grants.sql`](file:///d:/Major%20Project/adyas-project/supabase/migrations/0003_rls_and_grants.sql))**:
  - RLS enabled on all tables; public/anon access denied; service-role only.
- **Data Access Layer ([`src/lib/supabase/admin.ts`](file:///d:/Major%20Project/adyas-project/src/lib/supabase/admin.ts))**:
  - Service-role client guarded by `import "server-only"`.

### Phase 3: Visual Design System & Application Shell (`b376d4e`, `806e650`)
- Defined design tokens in [`src/app/globals.css`](file:///d:/Major%20Project/adyas-project/src/app/globals.css) using Tailwind CSS v4:
  - Deep forest surface (`#16251C`), dark slate base (`#0F1410`), ivory text (`#F7F4EE`), sage accents (`#6C917B`), muted gold interactive accents (`#C9A86C`).
  - Google Fonts typography: **Plus Jakarta Sans** (headings) & **Inter** (body) with fluid typography and WCAG AA contrast.
- Responsive, accessible [`SiteHeader`](file:///d:/Major%20Project/adyas-project/src/components/site-header.tsx) (sticky blur, keyboard escape, 44px touch targets) and [`SiteFooter`](file:///d:/Major%20Project/adyas-project/src/components/site-footer.tsx).
- Standard UI atoms: [`Button`](file:///d:/Major%20Project/adyas-project/src/components/ui/button.tsx), [`Card`](file:///d:/Major%20Project/adyas-project/src/components/ui/card.tsx), [`Badge`](file:///d:/Major%20Project/adyas-project/src/components/ui/badge.tsx), [`SiteImage`](file:///d:/Major%20Project/adyas-project/src/components/ui/SiteImage.tsx), and [`SafetyNotice`](file:///d:/Major%20Project/adyas-project/src/components/common/safety-notice.tsx).

### Phase 4: Public Marketing & Content Pages (`6d80dca` through `d4e9b4d`)
- Implemented and verified all public routes with ISR (`revalidate = 3600`):
  - `/` (Home): Hero, about preview, services cards, session cards, reviews, upcoming events, gallery preview, crisis contact CTA.
  - `/about`: Professional biography, approach, clinical philosophy, qualifications.
  - `/services`: Comprehensive service descriptions (Individual Psychotherapy, Couples Therapy, Workshops).
  - `/sessions`: Session details, duration, pricing notes, policy summaries.
  - `/events`: Upcoming and past workshops with local IST date formatting (`Asia/Kolkata`).
  - `/gallery`: Categorized visual gallery with client-side progressive `<dialog>` lightbox.
  - `/reviews`: Curated client testimonials with verified quote ratings.
  - `/contact`: Direct reachout channels (Email, WhatsApp, Phone with E.164 normalization, emergency helpline routing).
  - `/privacy` & `/terms-and-cancellation`: Privacy policy aligned with database fields and technical system guarantees.

### Phase 5a: Slot Availability Algorithm (`b8260a2`)
- Authored pure functional availability engine in [`src/lib/availability/`](file:///d:/Major%20Project/adyas-project/src/lib/availability/):
  - Business constraints in [`booking-rules.ts`](file:///d:/Major%20Project/adyas-project/src/lib/booking/booking-rules.ts): Monday–Saturday 10:00–18:00 IST, 15m post-session buffer, 30m grid, 12h minimum notice, 60-day advance booking limit.
  - Rigorous interval arithmetic with half-open intervals `[start, end)`.
  - Fail-closed design: provider timeouts or errors immediately throw `AvailabilityUnavailableError` to prevent showing ghost slots.
- **97 Passing Vitest Tests** covering daylight saving transitions, boundary edge cases, buffer padding, and concurrency conflicts.

### Practitioner Content & Infrastructure Updates (`adc3389`)
- Real practitioner content for Dr. Adya populated from source material into [`site.ts`](file:///d:/Major%20Project/adyas-project/src/content/site.ts) and [`dummy-data.ts`](file:///d:/Major%20Project/adyas-project/src/content/dummy-data.ts).
- Actual imagery integrated into `public/images/` (portrait, art therapy, workshop photos).
- Session pricing defined in [`session-config.ts`](file:///d:/Major%20Project/adyas-project/src/lib/booking/session-config.ts) (60 min @ ₹2,500 = 250000 paise; 90 min @ ₹3,500 = 350000 paise).
- Added GitHub Actions workflow [`.github/workflows/keep-supabase-active.yml`](file:///d:/Major%20Project/adyas-project/.github/workflows/keep-supabase-active.yml) to prevent Supabase free tier inactivity pausing.

---

## 3. What Needs to Be Done (From This Point to Launch)

The project is currently at **Phase 5b**. Below is the comprehensive step-by-step roadmap to achieve 100% production readiness.

```
Current Point (Phase 5a Complete)
       │
       ▼
[Phase 5b] Google Calendar Integration (Free/Busy + Event Creation)
       │
       ▼
[Phase 5c] Availability API Route (`/api/availability`)
       │
       ▼
[Phase 6]  Full Booking Flow & Razorpay Integration
           ├── 6a: Multi-Step Client Booking UI (`/book`)
           ├── 6b: Create Pending Booking & Razorpay Order API
           ├── 6c: Razorpay Modal Integration & Payment Verification API
           ├── 6d: Webhook Route (`/api/webhooks/razorpay`)
           ├── 6e: Booking Confirmation Page (`/book/confirmation/[token]`)
           └── 6f: Hold Expiry Cron Handler (`/api/cron/expire-holds`)
       │
       ▼
[Phase 7]  End-to-End Integration & Edge Case Validation
       │
       ▼
[Phase 8]  Transactional Notifications (Email Confirmations via Resend - if requested)
       │
       ▼
[Phase 9]  Client Sign-off & Policy Confirmation
       │
       ▼
[Phase 10] SEO Polish (Sitemap, Robots.txt, OpenGraph, Schema.org)
       │
       ▼
[Phase 11] Security & Compliance Audit (CSP, Headers, Secret Scans)
       │
       ▼
[Phase 12] Comprehensive Testing Phase (Unit, Integration, E2E, Load, Pen-Test)
       │
       ▼
[Phase 13] Production Deployment & Go-Live Runbook
```

---

### Detailed Implementation Phases

#### Phase 5b: Google Calendar Integration
- **File to create**: `src/lib/calendar/google.ts`
- **Responsibilities**:
  1. **OAuth 2.0 Client / Refresh Token Handler**: Instantiate Google Calendar API client using `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_REFRESH_TOKEN`.
  2. **Free/Busy Query (`getBusyIntervals(range)` Provider)**:
     - Calls `calendar.freebusy.query` for `timeMin` / `timeMax`.
     - Maps busy blocks to `{ start: Date, end: Date }` objects.
     - Never reads or exposes event titles, attendees, or descriptions.
     - Implements in-memory TTL cache (60 seconds) to avoid Google API rate limits.
  3. **Event Writer (`createCalendarBookingEvent(booking)` Provider)**:
     - Inserts event into primary calendar once payment is confirmed.
     - Deterministic ID format: `adyas_booking_<uuid_without_hyphens>` to prevent duplicate calendar entries.
     - Summary: `Session: <SessionName> - <ClientName>`.
     - Description: Includes sanitized client note and payment confirmation code.
     - Start/End in `Asia/Kolkata` time zone.

#### Phase 5c: Public Availability API Route
- **File to create**: `src/app/api/availability/route.ts`
- **Responsibilities**:
  - Accept `GET /api/availability?session=<slug>&fromDate=<YYYY-MM-DD>&toDate=<YYYY-MM-DD>`.
  - Rate limiting via `check_rate_limit()` in Supabase (max 30 reads per 5 min per IP).
  - Call `getAvailability()` connecting:
    - `busyProvider`: Google Calendar client from Phase 5b.
    - `bookedProvider`: Supabase `get_booked_ranges()` stored procedure.
  - Fail-closed: return HTTP 503 if Google Calendar is unreachable (never return an empty array that falsely implies 100% availability).
  - Return JSON array of available ISO slot start times.

#### Phase 6: Interactive Booking Flow & Razorpay Integration
- **6a. Booking UI (`src/app/book/page.tsx` & subcomponents in `src/components/booking/`)**:
  - Replace `PlaceholderPage` with a fluid 4-step booking wizard:
    - **Step 1: Session Selector**: 60-minute Individual Psychotherapy vs 90-minute Couples/Family session.
    - **Step 2: Date & Slot Picker**: Calendar day selector with live slot grid populated from `/api/availability`. Real-time timezone badge (`Asia/Kolkata`).
    - **Step 3: Client Details Form**: Full Name, Email, Phone (with Indian +91 normalization and validation), Optional Note (with privacy disclosure: "Please do not include sensitive clinical history here").
    - **Step 4: Booking Summary**: Summary card showing exact date, time, duration, and fee in ₹ INR.
- **6b. Hold Creation API (`src/app/api/bookings/create-pending/route.ts`)**:
  - Validates request payload using Zod.
  - Calls `create_pending_booking()` in Supabase (holds slot for 15 minutes).
  - If DB returns `slot_taken` → returns HTTP 409 Conflict with user-friendly message.
  - Calls Razorpay Orders API: creates order with `amount = pricePaise`, `currency = "INR"`, `receipt = booking_id`.
  - Updates booking row with `razorpay_order_id`.
  - Returns `{ orderId, amountPaise, keyId, bookingId, publicToken }`.
- **6c. Razorpay Modal Integration & Verification API**:
  - Client component loads `https://checkout.razorpay.com/v1/checkout.js`.
  - Opens modal prefilled with client name/email/phone.
  - On `handler(response)` callback: client calls `POST /api/bookings/verify-payment`.
  - Verification API:
    - Validates HMAC SHA-256 signature (`crypto.createHmac("sha256", RAZORPAY_KEY_SECRET)`).
    - Calls `confirm_booking_payment()` in Supabase.
    - Spawns background Google Calendar event creation.
    - Returns `{ redirectUrl: "/book/confirmation/" + publicToken }`.
- **6d. Razorpay Webhook Handler (`src/app/api/webhooks/razorpay/route.ts`)**:
  - Validates `X-Razorpay-Signature` against `RAZORPAY_WEBHOOK_SECRET`.
  - Handles `payment.captured`, `order.paid`, `payment.failed`, `refund.processed`.
  - Records event in `payment_events` table for idempotency.
  - Calls `confirm_booking_payment()` (handles browser drop-off/network loss cases).
- **6e. Booking Confirmation Page (`src/app/book/confirmation/[token]/page.tsx`)**:
  - Validates token against database `public_token_hash` (SHA-256).
  - Displays confirmed appointment details, Google Calendar invite confirmation, cancellation policy reminder, and practitioner contact links.
  - Safe error states for `pending`, `failed`, or `refund_pending` (late payment collision).
- **6f. Hold Expiry Cron Handler (`src/app/api/cron/expire-holds/route.ts`)**:
  - Protected with `Authorization: Bearer <CRON_SECRET>`.
  - Executes `expire_stale_pending_bookings()` to release uncaptured slots past 15 minutes.
  - Configured via `vercel.json` cron every 10–15 minutes.

#### Phase 7: End-to-End Integration & Edge Case Validation
- Validate the two critical race conditions:
  1. Two clients attempting to book the identical slot simultaneously (the second must get a clean HTTP 409 and prompt to choose another slot).
  2. Late payment capture after 15-minute hold expiry:
     - If slot is still free: confirmed successfully.
     - If slot was taken by someone else: booking marked `failed`, payment marked `refund_pending`, `needs_manual_review` flagged in DB, zero double bookings.

#### Phase 8: Notifications (Client Decision)
- *Default decision*: No transactional emails in v1 (relies on confirmation page + Google Calendar invite).
- *If client requests email*: Implement transactional email sender via Resend with clean HTML receipt and .ics calendar attachment.

#### Phase 9: Client Sign-off & Policy Confirmation
- Review final session fees and cancellation terms with Dr. Adya.
- Set `policies.confirmed: true` in [`src/content/site.ts`](file:///d:/Major%20Project/adyas-project/src/content/site.ts).

#### Phase 10: Technical SEO Polish
- Create `src/app/sitemap.ts` dynamically listing all 14 routes.
- Create `src/app/robots.ts` disallowing API and confirmation token routes.
- Add Schema.org JSON-LD structured data (`MedicalBusiness` / `Psychologist`).

#### Phase 11: Security & Compliance Audit
- Implement strict Content-Security-Policy (CSP) in [`next.config.ts`](file:///d:/Major%20Project/adyas-project/next.config.ts) allowing:
  - Scripts: `'self'`, `https://checkout.razorpay.com`
  - Frames/Connect: `https://api.razorpay.com`, `https://*.supabase.co`
- Enable HTTP Strict Transport Security (`Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`).
- Audit log hygiene: ensure no PII, tokens, notes, or secrets are logged to stdout.

---

## 4. Comprehensive Testing Phase Plan

Before initiating production deployment, the application must pass a 5-tier testing regimen:

```
┌─────────────────────────────────────────────────────────────┐
│ Tier 1: Static Analysis & Unit Tests (Vitest, TSC, Lint)   │
├─────────────────────────────────────────────────────────────┤
│ Tier 2: Database Integrity & Stored Procedures (verify.sql) │
├─────────────────────────────────────────────────────────────┤
│ Tier 3: API & Mock Integration Tests (Razorpay / Google)    │
├─────────────────────────────────────────────────────────────┤
│ Tier 4: Manual End-to-End User Journey & Browser QA         │
├─────────────────────────────────────────────────────────────┤
│ Tier 5: Security, Rate-Limit & Penetration Checks           │
└─────────────────────────────────────────────────────────────┘
```

### Tier 1: Static Analysis & Unit Tests
Run in terminal:
```bash
npm run typecheck
npm run lint
npm test
npm run check:placeholders
```
- **Acceptance Criteria**: 0 TypeScript errors, 0 ESLint errors, 97+ Vitest unit tests passing, 0 placeholder markers.

### Tier 2: Database Integrity Tests
Run against the Supabase database instance:
1. Apply `supabase/migrations/0001_core_tables.sql`
2. Apply `supabase/migrations/0002_booking_functions.sql`
3. Apply `supabase/migrations/0003_rls_and_grants.sql`
4. Apply `supabase/tests/verify.sql` in SQL Editor
- **Acceptance Criteria**: `verify.sql` prints `VERIFICATION PASSED`. Anon role read on `public.bookings` yields `permission denied`. GiST exclusion constraint rejects overlapping `tstzrange` inserts.

### Tier 3: Integration & Gateway Tests (Test Keys)
Using Razorpay Test Mode keys (`rzp_test_...`) and Google OAuth Playground:
- **Test 3.1: Slot Availability Calculation**:
  - Insert busy event in Google Calendar (e.g. 14:00–15:00 IST).
  - Verify `/api/availability` drops all 14:00 and 14:30 slots, plus buffer intervals.
- **Test 3.2: Google API Downtime (Fail Closed)**:
  - Provide an invalid Google token.
  - Verify `/api/availability` returns HTTP 503 Service Unavailable (not an empty array).
- **Test 3.3: Happy Path Booking**:
  - Select session → pick slot → fill details → Razorpay test card `success`.
  - Booking status moves to `confirmed`, payment status to `paid`.
  - Google Calendar event created with deterministic ID.
- **Test 3.4: Webhook Replay Idempotency**:
  - Re-send identical `payment.captured` webhook payload.
  - Verify API returns HTTP 200 `already_confirmed` without creating duplicate calendar events.

### Tier 4: Edge Cases & Concurrency Tests
- **Test 4.1: Slot Sniping / Double-Booking Race**:
  - Open two incognito browser windows on the exact same date and slot.
  - Submit Window A, then submit Window B 2 seconds later.
  - Result: Window A gets hold; Window B receives immediate 409 Conflict with friendly prompt.
- **Test 4.2: Hold Expiry**:
  - Client initiates checkout and abandons for 16 minutes.
  - Run `POST /api/cron/expire-holds`.
  - Slot becomes available again in `/api/availability`.
- **Test 4.3: Late Capture / Conflict Recovery**:
  - Client pays for an expired hold after another client has confirmed the slot.
  - Stored procedure routes payment to `refund_pending` and flags `needs_manual_review = true`. Zero double-bookings.

### Tier 5: UX & Device Testing
- **Viewport tests**: Test at 320px (iPhone SE), 390px (iPhone 14/15), 768px (iPad), 1024px, 1440px desktop.
- **Accessibility**:
  - Full keyboard-only booking navigation (Tab, Enter, Space, Escape on modal).
  - Screen reader announcements on form errors and status updates.
- **Performance**:
  - Google Lighthouse score > 90 across Performance, Accessibility, Best Practices, and SEO.

---

## 5. Deployment & Go-Live Plan

Follow this operator runbook to deploy Dr. Adya's practice website to production.

```
Step 1: Accounts & Cloud Setup (Supabase, Razorpay, Google Cloud, Vercel)
   │
Step 2: Database Migration on Production Supabase
   │
Step 3: Vercel Project Link & Environment Variables Configuration
   │
Step 4: Cron Job Scheduling (`vercel.json`)
   │
Step 5: Google OAuth Consent Screen Switch to "In Production"
   │
Step 6: Razorpay Webhook Configuration & Live Key Activation
   │
Step 7: Custom Domain & DNS Mapping
   │
Step 8: Post-Deployment Smoke Test
```

### Pre-Deployment Checklist

| Service | Requirement | Status / Action Needed |
|---|---|---|
| **Supabase** | Production project in `ap-south-1` (Mumbai) | Create project, save DB password |
| **Razorpay** | Active business account with KYC approved | Generate Live Key Id & Secret |
| **Google Cloud** | Project with Google Calendar API enabled | Set OAuth Consent Screen to **In production** |
| **Vercel** | Team/Personal project connected to GitHub | Pinned to Node.js 24.x |
| **Domain** | DNS control for `therapywithadya.com` | Ready to add CNAME / A records |

---

### Step-by-Step Execution Runbook

#### Step 1: Provision Production Supabase Database
1. Go to [supabase.com](https://supabase.com) → **New Project** → Select **South Asia (Mumbai)**.
2. Open **SQL Editor**, and run in sequential order:
   - File 1: `supabase/migrations/0001_core_tables.sql`
   - File 2: `supabase/migrations/0002_booking_functions.sql`
   - File 3: `supabase/migrations/0003_rls_and_grants.sql`
   - File 4: `supabase/tests/verify.sql` (Confirm `VERIFICATION PASSED`).
3. **DO NOT** run `supabase/seed.sql` on production.
4. Copy `Project Settings` → `API`:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY` (Keep secure; server-only).

#### Step 2: Configure Google Calendar API (Production)
1. In Google Cloud Console:
   - Ensure Calendar API is enabled.
   - Go to **OAuth consent screen** → Click **Publish App** to move status from *Testing* to **In production** (prevents the 7-day refresh token expiration limit).
2. Generate refresh token for Dr. Adya's Google account via OAuth 2.0 Playground.
3. Save:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_REFRESH_TOKEN`
   - `GOOGLE_CALENDAR_ID` (`primary` or practice calendar ID)

#### Step 3: Configure Razorpay (Live Mode)
1. Log into Razorpay Dashboard → Toggle from Test to **Live**.
2. **Settings → API Keys** → Generate Live Key (`rzp_live_...`).
3. **Settings → Webhooks** → Add Webhook:
   - URL: `https://therapywithadya.com/api/webhooks/razorpay`
   - Secret: Generate high-entropy string (`openssl rand -hex 32`)
   - Events: `payment.captured`, `payment.failed`, `order.paid`, `refund.processed`

#### Step 4: Configure Vercel Project
1. Import repository `therapywithdradya/therapywithadya` into Vercel.
2. **Project Settings → General**: Set Node.js Version to **24.x**.
3. **Project Settings → Environment Variables**:
   ```env
   NEXT_PUBLIC_SITE_URL=https://therapywithadya.com
   SUPABASE_URL=https://<prod-ref>.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=<prod-service-role-key>
   RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXXXX
   RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXXXXXXXXXX
   RAZORPAY_WEBHOOK_SECRET=<generated-live-webhook-secret>
   GOOGLE_CLIENT_ID=XXXXXXXXXXXX.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=XXXXXXXXXXXXXXXXXXXXXXXX
   GOOGLE_REFRESH_TOKEN=1//XXXXXXXXXXXXXXXXXXXXXXXX
   GOOGLE_CALENDAR_ID=primary
   BUSINESS_TIMEZONE=Asia/Kolkata
   CRON_SECRET=<generated-cron-secret>
   ```
4. Verify `vercel.json` exists in root for cron scheduling:
   ```json
   {
     "crons": [
       {
         "path": "/api/cron/expire-holds",
         "schedule": "*/15 * * * *"
       }
     ]
   }
   ```

#### Step 5: Custom Domain & DNS
1. In Vercel: **Settings → Domains** → Add `therapywithadya.com` and `www.therapywithadya.com`.
2. At Domain Registrar (DNS settings):
   - `A` Record: `@` → `76.76.21.21` (Vercel IP)
   - `CNAME` Record: `www` → `cname.vercel-dns.com`
3. Wait for SSL certificate auto-issuance.

#### Step 6: Post-Deployment Smoke Test
Perform a live verification check:
- [ ] Visit `https://therapywithadya.com` — verify HTTPS, fonts, and dark theme load instantly.
- [ ] Check all marketing pages (`/about`, `/services`, `/sessions`, `/events`, `/gallery`, `/reviews`, `/contact`, `/privacy`, `/terms-and-cancellation`).
- [ ] Visit `/book` — verify availability loads without delay or 503 errors.
- [ ] Book a test session using real payment (or ₹1 test coupon if configured in Razorpay).
- [ ] Verify booking appears immediately on Dr. Adya's Google Calendar.
- [ ] Verify booking row in Supabase has status `confirmed` and `paid`.
- [ ] Trigger manual refund from Razorpay dashboard to verify refund mechanics.

---

## 6. Phase Completion Tracking Matrix

| Phase | Description | Deliverable | Current Status |
|:---:|---|---|:---:|
| **1** | Scaffold & Architecture | Next.js 16, Node 24, architecture & rules docs | ✅ Complete (`c65aa0c`) |
| **2** | Database & State Machine | Tables, PL/pgSQL functions, GiST exclusion, RLS | ✅ Complete (`c98545c`) |
| **3** | Design System & Shell | Tailwind 4 tokens, responsive layout, header, footer | ✅ Complete (`b376d4e`) |
| **4** | Public Marketing Pages | 14 static pages, lightbox, crisis safety notices | ✅ Complete (`d4e9b4d`) |
| **5a** | Availability Engine | Pure slot calculation engine, 97 unit tests | ✅ Complete (`b8260a2`) |
| **Content** | Practitioner Content | Real bio, portraits, gallery, session pricing | ✅ Complete (`adc3389`) |
| **5b** | Google Calendar Client | Free/busy provider & event writer | ✅ Complete |
| **5c** | Availability API Route | `/api/availability` endpoint with rate-limiting | ✅ Complete |
| **6** | Booking Flow & Payments | `/book` wizard, Razorpay checkout, webhooks | ⬜ **Next Step** |
| **7** | Concurrency Integration | Double-booking race tests, late payment recovery | ⬜ Pending 6 |
| **8** | Transactional Emails | Email receipts (if requested by client) | ⏸️ On Hold (per decisions) |
| **9** | Policy Final Sign-Off | Client confirmation of cancellation rules | ⬜ Ready for client |
| **10** | SEO & Structured Data | Sitemap, robots.txt, OpenGraph, Schema.org | ⬜ Pending 6 |
| **11** | Security Review & CSP | Content-Security-Policy & audit checklist | ⬜ Pending 6 |
| **12** | Testing Phase | Unit, database, integration, and user journey tests | ⬜ Pending 11 |
| **13** | Production Deployment | Vercel go-live, live Razorpay, domain setup | ⬜ Final Step |

---

## 7. Quick Command Reference

```bash
# Development server
npm run dev

# Run full Vitest test suite (one-shot mode)
npm test

# Type safety check
npm run typecheck

# Code formatting and linting
npm run lint

# Placeholder string audit
npm run check:placeholders

# Production build test
npm run build
```
