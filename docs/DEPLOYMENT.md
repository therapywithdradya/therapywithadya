# Deployment Guide

> **Rule (ARCHITECTURE.md §L):** Every command here must be run by a person. The agent does not run `vercel` or any remote database command unattended.

---

## Current state (as of last push)

| Item | Status |
|---|---|
| Git repository | ✅ Initialized |
| Remote (`origin`) | ✅ `https://github.com/therapywithdradya/therapywithadya.git` |
| Branch | ✅ `main`, tracking `origin/main` |
| Node version | ✅ 24.x (see `.nvmrc`) |
| Dependencies | ✅ `npm install` done |
| `.env.local` | ⬜ Not yet — copy from `.env.example` and fill in |
| **Phase 1** — Scaffold & architecture | ✅ Done (`c65aa0c`) |
| **Phase 2** — Database schema, RLS, booking functions | ✅ SQL written (`c98545c`) — **not yet applied to any remote database** |
| **Phase 3** — Design system, layout shell | ✅ Done (`b376d4e`, `806e650`) |
| **Phase 4** — All public pages (home → terms) | ✅ Done (`6d80dca` → `d4e9b4d`) |
| **Phase 5a** — Availability engine + tests | ✅ Done (`b8260a2`) — 97 tests passing |
| **Practitioner Content** — Bio, imagery & fees | ✅ Populated (`adc3389`) — 0 placeholders |
| **Phase 5b** — Google Calendar free/busy + event sync | ✅ Done (`0ad0389`) — 20 tests passing |
| **Phase 5c** — Availability API route | ✅ Done (`0ad0389`) — rate limited, cached, 18 tests passing |
| **Phase 6** — Razorpay + booking flow | ✅ Done — `/book` wizard, orders, verification, webhooks, confirm |
| **Phase 7** — Integration end-to-end | ⬜ Waiting on Razorpay live keys |
| **Phase 8** — Notifications | ✅ Done — Resend email templates & dispatcher (175 tests passing) |
| **Phase 9** — Client policy sign-off | ⬜ Ready for final client confirmation |
| **Phase 10** — SEO & Structured Data | ✅ Done — Dynamic sitemap.xml, robots.txt, Schema.org JSON-LD |
| **Phase 11** — Security review & CSP | ✅ Done — Hardened CSP, HSTS, Permissions-Policy in next.config.ts |
| **Phase 12** — Comprehensive testing phase | ✅ Done — 175/175 tests passing, 0 lint/type errors, build verified |
| **Phase 13** — Production deployment | 🟡 Live on therapywithdradya.com (waiting for Razorpay live keys for payment) |

> See [`docs/PROJECT_STATUS.md`](file:///d:/Major%20Project/adyas-project/docs/PROJECT_STATUS.md) for the complete roadmap, testing phase details, and feature specifications.

---

## Immediate next steps

Work through these in order before touching Phase 6 (Razorpay).

### Step A — Set up `.env.local`

```bash
# Windows PowerShell — run from the project root
copy .env.example .env.local
```

Open `.env.local`. The dummy values are placeholders — the dev server starts with them, but each feature fails until the real value is set. Fill in each section as you complete Steps B–E below.

> Never commit `.env.local`. Never add any secret to a `NEXT_PUBLIC_` variable except `NEXT_PUBLIC_SITE_URL`.

---

### Step B — Create and configure Supabase

#### B1. Create a project

1. Go to [supabase.com](https://supabase.com) → sign in → **New project**.
2. Region: **South Asia (Mumbai)** — closest to Indian users.
3. Set a strong database password. Save it somewhere secure (you need it for psql later).
4. Wait ~2 minutes for provisioning.

#### B2. Copy credentials into `.env.local`

In the Supabase dashboard: **Project Settings → API**.

```env
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> The `service_role` key bypasses Row Level Security. Never use it in client code or a `NEXT_PUBLIC_` variable.

#### B3. Apply migrations — SQL Editor (recommended)

Go to Supabase dashboard → **SQL Editor**. Run each file as a **separate query** in the order shown. Wait for each to complete before running the next.

| Order | File | Notes |
|---|---|---|
| 1 | `supabase/migrations/0001_core_tables.sql` | Creates all tables and the exclusion constraint |
| 2 | `supabase/migrations/0002_booking_functions.sql` | PL/pgSQL functions for booking and expiry |
| 3 | `supabase/migrations/0003_rls_and_grants.sql` | RLS + grants — needs Supabase roles `anon`, `authenticated`, `service_role` |
| 4 | `supabase/seed.sql` | Dummy rows for development only |
| 5 | `supabase/tests/verify.sql` | Runs as one script — read the NOTICE output |

After seed, confirm row counts:

```sql
select count(*) as testimonials from public.testimonials;     -- 3
select count(*) as events       from public.events_workshops; -- 4
select count(*) as gallery      from public.gallery_items;    -- 6
select count(*) as bookings     from public.bookings;         -- 0
```

After `verify.sql`, look for: `VERIFICATION PASSED` then `ROLLBACK`. If you see `VERIFICATION FAILED`, it lists what did not match. Run `rollback;` if the editor shows an open transaction.

#### B4. Apply migrations — psql (alternative)

If you have `psql` installed:

```bash
# Replace USER, PASSWORD, HOST with values from Supabase
# Project Settings → Database → Connection string → URI
set DB=postgresql://postgres:YOUR_PASSWORD@db.YOUR_REF.supabase.co:5432/postgres

psql "%DB%" -v ON_ERROR_STOP=1 -f supabase/migrations/0001_core_tables.sql
psql "%DB%" -v ON_ERROR_STOP=1 -f supabase/migrations/0002_booking_functions.sql
psql "%DB%" -v ON_ERROR_STOP=1 -f supabase/migrations/0003_rls_and_grants.sql
psql "%DB%" -v ON_ERROR_STOP=1 -f supabase/seed.sql
psql "%DB%" -v ON_ERROR_STOP=1 -f supabase/tests/verify.sql
```

> Do not commit the connection string. Do not run `supabase db reset` on a database that has real bookings.

#### B5. Verify RLS is working

In the SQL editor:

```sql
set local role anon;
select count(*) from public.bookings;
-- Expected: permission denied
reset role;
```

---

### Step C — Set up Razorpay (test mode)

You need this before Phase 6 (booking flow + payment).

#### C1. Create an account

1. Go to [razorpay.com](https://razorpay.com) → **Sign up**.
2. KYC is required for live mode. Test mode works before KYC is complete.
3. Stay on the **Test** tab for all development work.

#### C2. Get test API keys

Dashboard → **Settings → API Keys → Generate Test Key**.

```env
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXXXXXXXXXX
```

#### C3. Set up a test webhook

Dashboard → **Settings → Webhooks → Add new webhook**.

| Field | Value |
|---|---|
| Webhook URL | `https://YOUR_TUNNEL_URL/api/webhooks/razorpay` |
| Secret | generate a strong random string (see Step E for how) |
| Active events | `payment.captured`, `payment.failed`, `order.paid`, `refund.processed` |

```env
RAZORPAY_WEBHOOK_SECRET=YOUR_WEBHOOK_SECRET
```

For local webhook testing you need a tunnel. Start one in a separate terminal:

```bash
npx localtunnel --port 3000
# or install ngrok: https://ngrok.com
```

The tunnel URL changes on every restart — update the webhook URL in Razorpay each time.

Razorpay test cards: https://razorpay.com/docs/payments/payments/test-card-details/

---

### Step D — Set up Google Calendar OAuth

Complete this section when starting **Phase 5b** (Google Calendar free/busy). The availability engine (Phase 5a) is already done and tested; this wires it to the real Google API.

#### D1. Create a Google Cloud project

1. Go to [console.cloud.google.com](https://console.cloud.google.com) → **New project** → name it `adyas-booking`.

#### D2. Enable the Google Calendar API

**APIs & Services → Library → Google Calendar API → Enable**.

#### D3. Create an OAuth 2.0 client

1. **APIs & Services → Credentials → Create Credentials → OAuth client ID**.
2. Application type: **Web application** → name it `Adyas Booking`.
3. Authorized redirect URI: `https://developers.google.com/oauthplayground`
4. Save `client_id` and `client_secret`:

```env
GOOGLE_CLIENT_ID=000000000000-xxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxx
```

#### D4. Configure the consent screen — CRITICAL

**APIs & Services → OAuth consent screen**.

- User type: **External**
- **Publishing status: set to `In production` BEFORE generating any refresh token**
  - Tokens from an app left in `Testing` status expire in 7 days. Calendar scopes are not exempt.
  - The unverified-app warning still appears when granting access — that is fine for a single internal user.
- Add scopes:
  - `https://www.googleapis.com/auth/calendar.events.freebusy`
  - `https://www.googleapis.com/auth/calendar.events`

#### D5. Generate a refresh token (one-time, by the practitioner)

1. Open [Google OAuth Playground](https://developers.google.com/oauthplayground).
2. **Gear icon** → check **Use your own OAuth credentials** → enter `client_id` and `client_secret`.
3. In the left panel enter both scopes:
   ```
   https://www.googleapis.com/auth/calendar.events.freebusy
   https://www.googleapis.com/auth/calendar.events
   ```
4. **Authorize APIs** → sign in as the practitioner's Google account → grant access.
5. **Exchange authorization code for tokens** → copy the **Refresh token**.

```env
GOOGLE_REFRESH_TOKEN=1//0gXXXXXXXXXXXXXXX...
GOOGLE_CALENDAR_ID=primary
```

> If the practitioner has a dedicated booking calendar, use its calendar ID instead of `primary` (found in Google Calendar Settings → the calendar → **Integrate calendar**).

---

### Step E — Generate a cron secret

```powershell
# PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { [byte](Get-Random -Max 256) }))
```

```env
CRON_SECRET=YOUR_RANDOM_STRING_HERE
```

---

### Step F — Run the dev server and verify

```bash
npm run dev
```

Site at [http://localhost:3000](http://localhost:3000).

Run all checks — all must pass before committing:

```bash
npm run typecheck        # zero TypeScript errors
npm run lint             # zero ESLint errors
npm run test             # all vitest tests pass
npm run check:placeholders  # reports dummy markers (expected until Phase 9)
npm run build            # production build succeeds
```

---

## Git workflow going forward

The remote is already set. Every change follows this pattern:

```bash
# Stage files
git add .
# or specific files:
git add src/lib/google-calendar/freebusy.ts src/app/api/availability/route.ts

# Commit
git commit -m "feat: wire availability route to Google free/busy"

# Push
git push
```

### Commit message prefixes

| Prefix | Use for |
|---|---|
| `feat:` | New page, component, or API route |
| `fix:` | Bug fix |
| `chore:` | Config, deps, scripts, docs |
| `refactor:` | Restructure with no behaviour change |
| `test:` | Add or update tests |
| `docs:` | Documentation only |

### What is never committed

`.gitignore` already excludes:
- `.env.local` — real secrets
- `.next/` — build output
- `node_modules/` — dependencies

Never commit a database connection string, API key, or the Supabase service-role key.

---

## Remaining build phases

These follow the architecture phases in `docs/ARCHITECTURE.md §L`. Complete them in order.

### Phase 5b — Google Calendar free/busy + `/api/availability` route

**What to build:**
- `src/lib/google-calendar/auth.ts` — OAuth token refresh using `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`
- `src/lib/google-calendar/freebusy.ts` — calls `freeBusy.query` for `GOOGLE_CALENDAR_ID` over a date range; throws `AvailabilityUnavailableError` on any failure
- `src/app/api/availability/route.ts` — GET handler: validates query params, calls the availability engine (already built in Phase 5a) with Google busy periods and database booked ranges, returns JSON

**Done when:** A forced Google error returns HTTP 503 with `{ "error": "availability_unavailable" }`. Real busy times disappear from the slot list.

**Commit:** `git commit -m "feat: phase 5b — Google Calendar free/busy and availability route"`

---

### Phase 6 — Razorpay + booking flow

**What to build:**
- `src/lib/razorpay/client.ts` — create orders, fetch order payments
- `src/lib/razorpay/verify.ts` — HMAC-SHA256 for Checkout signature and webhook signature
- `src/lib/booking/create-hold.ts` — insert pending booking + create Razorpay order (one transaction)
- `src/lib/booking/confirm.ts` — the shared `confirmBooking` function (all three paths)
- `src/lib/booking/status.ts` — token lookup + recovery read from Razorpay
- `src/app/api/bookings/route.ts` — POST: create hold
- `src/app/api/payments/verify/route.ts` — POST: Path 1 confirm
- `src/app/api/webhooks/razorpay/route.ts` — POST: Path 2 confirm
- `src/app/api/bookings/[token]/route.ts` — GET: status + Path 3 recovery
- `src/app/book/page.tsx` — session picker → slot picker → details form → Checkout
- `src/app/book/confirmation/[token]/page.tsx` — polls status, shows confirmed only when `booking_status = confirmed`

**Requires:** Steps B (Supabase) and C (Razorpay) complete.

**Done when:** A test payment reaches `confirmed` / `paid` in the database. A bad signature is HTTP 400 with no write. A duplicate webhook is a no-op.

**Commit:** `git commit -m "feat: phase 6 — Razorpay orders, checkout, verify, webhook, confirm"`

---

### Phase 7 — Integration

**What to do:**
- Walk the full visitor path with test keys: choose session type → pick slot → fill details → pay → see the confirmation page → confirm one calendar event was created
- Trigger the late-payment path: let a hold expire while payment is captured → check `refund_pending` + `needs_manual_review` + no double-book

**Done when:** Both scripts have been run and the database rows match the state machine in `docs/ARCHITECTURE.md §C`.

**Commit:** `git commit -m "test: phase 7 — integration verification"`

---

### Phase 8 — Notifications *(skip unless the client asks)*

Transactional email (confirmation + reminders). Not started. `docs/DECISIONS.md` says no email until requested.

---

### Phase 9 — Real content

**What to do:**
- Replace every `[DUMMY]` string in `src/content/site.ts`, `src/lib/booking/session-config.ts`, `src/content/content.ts`, and any inline copy with text, prices, and images the client supplies
- Set real session prices in paise (e.g., ₹1500 = `150000`)
- Run `npm run check:placeholders` — it must report zero dummy markers

**Done when:** No `[DUMMY]` or `[PLACEHOLDER]` string remains on any public page.

**Commit:** `git commit -m "content: replace all placeholder copy with real content"`

---

### Phase 10 — SEO

**What to do:**
- Unique `title` and `description` metadata on every public route (already scaffolded with `marketingMetadata()` — just needs real strings from Phase 9)
- Canonical URL using `NEXT_PUBLIC_SITE_URL`
- `sitemap.xml` via Next.js app router `sitemap.ts`
- `robots.txt` — allow all on production, disallow on preview/staging

**Done when:** Each public route has a unique title and description under 160 characters.

**Commit:** `git commit -m "feat: phase 10 — SEO metadata, sitemap, robots"`

---

### Phase 11 — Security review

**What to check against `docs/ARCHITECTURE.md §K`:**
- Content-Security-Policy (must allow `https://checkout.razorpay.com` and `https://api.razorpay.com`)
- HSTS on production HTTPS only
- Rate limit tuning (`rate_limits` table in Supabase)
- Log review: no name, email, phone, token, or signature in server logs
- RLS re-check: anon and authenticated roles still have zero policies

**Done when:** Every item in the security checklist is either implemented or noted in `docs/KNOWN_ISSUES.md`.

**Commit:** `git commit -m "chore: phase 11 — security headers, CSP, rate limit review"`

---

### Phase 12 — Production deployment on Vercel

> **Do this step yourself. Do not ask the agent to run `vercel` or push to the production database.**

#### 12a. Create the Vercel project

1. [vercel.com](https://vercel.com) → **New Project** → Import `therapywithdradya/therapywithadya`.
2. Framework auto-detected as **Next.js**.
3. **Do not click Deploy yet.**

#### 12b. Set Node.js version

Project Settings → **General → Node.js Version → 24.x**.

#### 12c. Add all environment variables

Project Settings → **Environment Variables**. Add every key from `.env.local`:

| Variable | Environments |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Production, Preview, Development |
| `SUPABASE_URL` | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | Production, Preview, Development |
| `RAZORPAY_KEY_ID` | Production, Preview, Development |
| `RAZORPAY_KEY_SECRET` | Production, Preview, Development |
| `RAZORPAY_WEBHOOK_SECRET` | Production, Preview, Development |
| `GOOGLE_CLIENT_ID` | Production, Preview, Development |
| `GOOGLE_CLIENT_SECRET` | Production, Preview, Development |
| `GOOGLE_REFRESH_TOKEN` | Production, Preview, Development |
| `GOOGLE_CALENDAR_ID` | Production, Preview, Development |
| `CRON_SECRET` | Production, Preview, Development |
| `BUSINESS_TIMEZONE` | Production, Preview, Development |

Set `NEXT_PUBLIC_SITE_URL` to the production domain (e.g., `https://adyas.in`).

#### 12d. Switch to Razorpay live keys (production only, deliberate)

1. Complete KYC on Razorpay if not done.
2. Razorpay dashboard → **Live** tab → **Settings → API Keys** → generate live keys.
3. In Vercel → update `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` for **Production** only.
4. Create a live webhook at `https://YOUR_DOMAIN/api/webhooks/razorpay` with the same four events. Use a new `RAZORPAY_WEBHOOK_SECRET`.

#### 12e. Add the cron job

Create `vercel.json` in the repository root:

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

Commit and push:

```bash
git add vercel.json
git commit -m "chore: add Vercel cron for hold expiry"
git push
```

#### 12f. Apply migrations to the production Supabase database

In the production Supabase SQL editor, repeat Step B3 with the production project. Do **not** apply `seed.sql` to production.

#### 12g. Deploy

Either push to `main` (Vercel auto-deploys) or:

```bash
vercel --prod
```

#### 12h. Custom domain

Vercel → **Domains** → add your domain → copy the DNS records to your registrar. TLS is automatic.

---

## Pre-launch checklist

Complete all items before going live:

- [ ] `npm run typecheck` — zero errors
- [ ] `npm run lint` — zero errors
- [ ] `npm run build` — succeeds
- [ ] `npm run test` — all pass
- [ ] `npm run check:placeholders` — zero dummy markers
- [ ] Supabase migrations applied to production, `verify.sql` passed
- [ ] `anon` role gets permission denied on `public.bookings`
- [ ] Test payment end-to-end: reaches `confirmed` / `paid`
- [ ] Bad Razorpay signature → HTTP 400, no DB write
- [ ] Duplicate webhook → 200, no second calendar event
- [ ] Google busy times removed from slot list
- [ ] Forced Google error → 503, never empty slot array
- [ ] Two overlapping inserts → second rejected with `bookings_no_overlap`
- [ ] `NEXT_PUBLIC_SITE_URL` = production domain in Vercel
- [ ] Razorpay **live** keys in Vercel → Production only
- [ ] Live Razorpay webhook URL = production domain
- [ ] Google OAuth consent screen = **In production** status
- [ ] Cron route returns 401 without the correct `Authorization` header
- [ ] No secret visible in Vercel build logs or browser network tab
- [ ] Security headers checked (see `docs/ARCHITECTURE.md §K`)

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `supabase: failed to fetch` | Wrong `SUPABASE_URL` or `SUPABASE_SERVICE_ROLE_KEY` | Re-copy from Supabase → Project Settings → API |
| Availability returns 503 | Google credentials missing or invalid | Check `GOOGLE_REFRESH_TOKEN`; re-run OAuth Playground if revoked |
| Razorpay Checkout does not open | `RAZORPAY_KEY_ID` wrong or missing | Must start with `rzp_test_` in dev |
| Webhook always 400 | `RAZORPAY_WEBHOOK_SECRET` mismatch | Re-copy from Razorpay webhook settings |
| Double-booking not rejected | Migrations not applied | Re-run `0001` then `0002` in order |
| `invalid_grant` from Google | Refresh token revoked or expired | Re-run OAuth Playground; confirm consent screen is In production |
| Cron route returns 401 | `CRON_SECRET` missing or header wrong | Header must be `Authorization: Bearer <CRON_SECRET>` |
| Build fails on Vercel | Node version wrong | Set Node 24.x in Vercel project settings |
| `pricePaise` is 0, booking fails | Placeholder session prices not set | Set real values in `src/lib/booking/session-config.ts` (Phase 9) |

---

## Reference

| Document | What it covers |
|---|---|
| `docs/PROJECT_STATUS.md` | Full project completion status, roadmap, testing phase, and deployment plan |
| `docs/ARCHITECTURE.md` | Full system design, state machine, security checklist |
| `docs/DECISIONS.md` | All decisions with status; PROVISIONAL items need human confirmation |
| `supabase/README.md` | Migration run order and operator runbook (cancel, refund, review) |
| `.env.example` | All environment variable names with dummy values |
