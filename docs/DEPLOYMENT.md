# Deployment Guide

Step-by-step instructions to set up and deploy this project from scratch. Follow sections in order. Each section states clearly when it applies to development only versus production.

> **Rule from ARCHITECTURE.md §L:** The agent does not run `vercel` or a remote database push as part of unattended work. Every command below is meant to be run by a person.

---

## Prerequisites

| Tool | Version | Install |
|---|---|---|
| Node.js | `>=24.12.0 <25` | [nodejs.org/en/download](https://nodejs.org/en/download) or `nvm use` (see `.nvmrc`) |
| npm | bundled with Node | — |
| Git | any recent | [git-scm.com](https://git-scm.com) |
| psql (optional) | any | Only needed if you prefer CLI over the Supabase SQL editor |

Check your versions:

```bash
node -v      # must print v24.x.x
npm -v
git --version
```

---

## 1. Clone and install

```bash
# Clone the repository (replace URL with your remote)
git clone https://github.com/YOUR_ORG/adyas-project.git
cd adyas-project

# Install dependencies (Node 24 required)
npm install
```

---

## 2. Environment variables

All secrets live in `.env.local`, which is **never committed**.

```bash
# Copy the example file
cp .env.example .env.local
```

Then open `.env.local` and fill in the values described in the sections below. The table in `docs/ARCHITECTURE.md §I` lists every variable and who supplies it. Leave dummy values in place for any service you have not set up yet — the dev server will start but those features will not work.

> **Never prefix a secret with `NEXT_PUBLIC_`.** Only `NEXT_PUBLIC_SITE_URL` is intentionally public.

---

## 3. Supabase setup

### 3a. Create a project

1. Go to [supabase.com](https://supabase.com) → **New project**.
2. Choose a region close to your users (India → `ap-south-1`).
3. Set a strong database password and save it somewhere safe.
4. Wait for provisioning (~2 minutes).

### 3b. Copy credentials into `.env.local`

In the Supabase dashboard: **Project Settings → API**.

```env
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> The service-role key bypasses Row Level Security. Never put it in a `NEXT_PUBLIC_` variable or expose it to the browser.

### 3c. Run the migrations (SQL Editor)

Open the Supabase dashboard → **SQL Editor**. Run each file in a **separate query**, in order, and wait for each to finish before running the next.

**Step 1 — Core tables**
```
Paste the full contents of:  supabase/migrations/0001_core_tables.sql
Click "Run"
```

**Step 2 — Booking functions**
```
New query. Paste: supabase/migrations/0002_booking_functions.sql
Click "Run"
```

**Step 3 — RLS and grants**
```
New query. Paste: supabase/migrations/0003_rls_and_grants.sql
Click "Run"
```

> `0003` uses the Supabase roles `anon`, `authenticated`, and `service_role`. It must be run inside the Supabase project, not against a bare Postgres instance.

**Step 4 — Seed dummy data** (development only)
```
New query. Paste: supabase/seed.sql
Click "Run"
```

Expected row counts after seed:

```sql
select count(*) as testimonials from public.testimonials;     -- 3
select count(*) as events       from public.events_workshops; -- 4
select count(*) as gallery      from public.gallery_items;    -- 6
select count(*) as bookings     from public.bookings;         -- 0
```

**Step 5 — Verification** (optional but recommended)
```
New query. Paste: supabase/tests/verify.sql
Run the WHOLE file in one execution.
```
Look for the notice `VERIFICATION PASSED` followed by `ROLLBACK`. A `VERIFICATION FAILED` notice lists what did not match. Run `rollback;` in a follow-up query if the editor reports an open transaction.

### 3d. Alternative: psql

If you have `psql` installed, from the repository root:

```bash
export DB="postgresql://postgres:YOUR_DB_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres"

psql "$DB" -v ON_ERROR_STOP=1 -f supabase/migrations/0001_core_tables.sql
psql "$DB" -v ON_ERROR_STOP=1 -f supabase/migrations/0002_booking_functions.sql
psql "$DB" -v ON_ERROR_STOP=1 -f supabase/migrations/0003_rls_and_grants.sql
psql "$DB" -v ON_ERROR_STOP=1 -f supabase/seed.sql
psql "$DB" -v ON_ERROR_STOP=1 -f supabase/tests/verify.sql
```

Get the connection string from: **Project Settings → Database → Connection string → URI**.

> Do **not** commit the connection string. Do **not** run `supabase db reset` on a database with real bookings.

### 3e. Confirm RLS is working

In the SQL editor:

```sql
set local role anon;
select count(*) from public.bookings;
-- Expected: permission denied (or 0 rows if the statement was allowed but RLS hides them)
reset role;
```

---

## 4. Razorpay setup (test mode first)

### 4a. Create a Razorpay account

1. Go to [razorpay.com](https://razorpay.com) → sign up → complete KYC (required for live mode; test mode works before KYC).
2. Stay on the **Test** tab in the dashboard for all development and staging work.

### 4b. Get test API keys

Dashboard → **Settings → API Keys → Test Mode**.

Generate keys and copy them into `.env.local`:

```env
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXXXXXXXXXX
```

### 4c. Set up a webhook (test mode)

Dashboard → **Settings → Webhooks → Add new webhook**.

| Field | Value |
|---|---|
| Webhook URL | `https://YOUR_NGROK_OR_TUNNEL_URL/api/webhooks/razorpay` |
| Secret | any strong random string |
| Events to subscribe | `payment.captured`, `payment.failed`, `order.paid`, `refund.processed` |

Copy the secret into `.env.local`:

```env
RAZORPAY_WEBHOOK_SECRET=YOUR_WEBHOOK_SECRET
```

> For local testing you need a tunnel. Run `npx localtunnel --port 3000` or install [ngrok](https://ngrok.com). Update the webhook URL in the Razorpay dashboard each time the tunnel URL changes.

### 4d. Test card numbers

Use Razorpay's [test payment methods](https://razorpay.com/docs/payments/payments/test-card-details/) during development. Never use a real card against test keys.

---

## 5. Google Calendar OAuth setup

This project uses **OAuth with a stored refresh token** (Architecture §G, Option 1). Complete this section only when building the Calendar phase (Phase 5 in the architecture).

### 5a. Create a Google Cloud project

1. Go to [console.cloud.google.com](https://console.cloud.google.com) → **New project**.
2. Name it (e.g., `adyas-booking`).

### 5b. Enable the Google Calendar API

**APIs & Services → Library → Google Calendar API → Enable**.

### 5c. Create an OAuth 2.0 client

1. **APIs & Services → Credentials → Create Credentials → OAuth client ID**.
2. Application type: **Web application**.
3. Name: `Adyas Booking`.
4. Authorized redirect URIs: Add `https://developers.google.com/oauthplayground` (for the one-time token generation step).
5. Download the JSON — you need `client_id` and `client_secret`.

```env
GOOGLE_CLIENT_ID=000000000000-xxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxx
```

### 5d. Configure the OAuth consent screen

**APIs & Services → OAuth consent screen**.

- **User type**: External (unless you have Google Workspace for the practitioner's domain).
- **Publishing status**: Set to **In production** before generating the refresh token. This prevents the 7-day expiry that applies to tokens from apps in Testing status.
- Scopes to add:
  - `https://www.googleapis.com/auth/calendar.events.freebusy`
  - `https://www.googleapis.com/auth/calendar.events`

> The unverified-app warning will appear when the practitioner signs in. That is expected and safe for a single internal user. Google verification (to remove the warning) is not required for the app to function.

### 5e. Generate a refresh token (one-time)

1. Go to [Google OAuth Playground](https://developers.google.com/oauthplayground).
2. Click the **gear icon** → check **Use your own OAuth credentials** → enter your `client_id` and `client_secret`.
3. In the left panel, paste and select both scopes:
   ```
   https://www.googleapis.com/auth/calendar.events.freebusy
   https://www.googleapis.com/auth/calendar.events
   ```
4. Click **Authorize APIs** → sign in as the practitioner's Google account → grant access.
5. Click **Exchange authorization code for tokens**.
6. Copy the **Refresh token** value.

```env
GOOGLE_REFRESH_TOKEN=1//0gXXXXXXXXXXXXXXX...
```

> Do **not** use tokens generated from an account in Testing status. Do **not** commit the refresh token. If the token expires or is revoked, repeat this step.

### 5f. Set the calendar ID

For the practitioner's primary calendar:

```env
GOOGLE_CALENDAR_ID=primary
```

Or, if they want a dedicated booking calendar, share it with the OAuth account and use its calendar ID (found in calendar settings → **Integrate calendar**).

---

## 6. Cron secret

Generate a strong random string for the hold-expiry cron route:

```bash
# On macOS/Linux:
openssl rand -base64 32

# On Windows (PowerShell):
[Convert]::ToBase64String((1..32 | ForEach-Object { [byte](Get-Random -Max 256) }))
```

```env
CRON_SECRET=YOUR_RANDOM_STRING_HERE
```

---

## 7. Run locally

```bash
npm run dev
```

The site is available at [http://localhost:3000](http://localhost:3000).

### Health checks

```bash
# TypeScript — must pass with zero errors
npm run typecheck

# ESLint
npm run lint

# Unit tests
npm run test

# Check for placeholder copy (run before any content phase)
npm run check:placeholders

# Production build (run before deploying)
npm run build
```

All four checks must pass before each deployment.

---

## 8. Git workflow

### Initial commit (first time only)

```bash
cd "D:\Major Project\adyas-project"

git init                          # skip if the repo already exists
git remote add origin https://github.com/YOUR_ORG/adyas-project.git

git add .
git commit -m "chore: initial scaffold and architecture"
git push -u origin main
```

### Normal commit flow

```bash
# Stage changes
git add .

# Or stage specific files
git add src/app/about/page.tsx src/components/site-header.tsx

# Commit with a short, present-tense message
git commit -m "feat: add about page and site header"

# Push to remote
git push
```

### Commit message conventions

| Prefix | When to use |
|---|---|
| `feat:` | New page, component, or API route |
| `fix:` | Bug fix |
| `chore:` | Config, deps, scripts, docs |
| `refactor:` | Code reorganisation without behaviour change |
| `test:` | Add or update tests |
| `docs:` | Documentation only |

### `.gitignore` — what is never committed

The existing `.gitignore` already excludes:

- `.env.local` — your real secrets
- `.next/` — build output
- `node_modules/` — dependencies

Never add `.env.local`, database passwords, API keys, or the Supabase connection string to any committed file.

---

## 9. Deploy to Vercel

> **Only proceed here when typecheck, lint, and build all pass, and test mode works end-to-end.**

### 9a. Install Vercel CLI (optional)

```bash
npm install -g vercel
```

Or deploy entirely through the Vercel dashboard without the CLI.

### 9b. Connect the repository

1. Go to [vercel.com](https://vercel.com) → **New Project**.
2. Import the GitHub/GitLab/Bitbucket repository.
3. Framework: **Next.js** (auto-detected).
4. **Do not click Deploy yet** — set environment variables first.

### 9c. Add environment variables in Vercel

In the project settings → **Environment Variables**, add every variable from `.env.local`:

| Variable | Environment |
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

Set `NEXT_PUBLIC_SITE_URL` to your actual production domain (e.g., `https://adyas.in`).

> For **Production** deployments, swap `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` from test keys to live keys (see §9e). Do this deliberately — not automatically.

### 9d. Node.js version

In Vercel project settings → **General → Node.js Version**, select **24.x**. This matches `"engines": { "node": ">=24.12.0 <25" }` in `package.json`.

### 9e. Switch to Razorpay live mode (production only)

1. In the Razorpay dashboard, complete KYC if not done.
2. Switch to the **Live** tab → **Settings → API Keys** → generate live keys.
3. Update `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in Vercel → **Production** environment only.
4. Create a live webhook in Razorpay pointing to `https://YOUR_DOMAIN/api/webhooks/razorpay` with the same events as the test webhook. Use a new `RAZORPAY_WEBHOOK_SECRET` for live mode.

### 9f. Deploy

```bash
# Via CLI (first deployment)
vercel --prod

# Or push to main branch — Vercel auto-deploys on every push
git push origin main
```

### 9g. Set up the cron job on Vercel

Add a `vercel.json` at the repository root to schedule the hold-expiry endpoint:

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

The cron route requires the `Authorization: Bearer CRON_SECRET` header. Configure the CRON_SECRET env var in Vercel and verify your route reads it from `process.env.CRON_SECRET`.

### 9h. Update Razorpay webhook URL for production

In the Razorpay dashboard (live mode): update the webhook URL from your tunnel URL to `https://YOUR_DOMAIN/api/webhooks/razorpay`.

### 9i. Update `NEXT_PUBLIC_SITE_URL`

```env
NEXT_PUBLIC_SITE_URL=https://YOUR_DOMAIN
```

This value is used for Origin checks on all browser-to-server POST requests.

---

## 10. Domain and DNS

1. In Vercel → **Domains**, add your custom domain.
2. Vercel will show you the DNS records to add at your domain registrar (usually an `A` record or `CNAME`).
3. TLS is automatic via Vercel.

---

## 11. Pre-launch checklist

Work through this before switching to live Razorpay keys:

- [ ] `npm run typecheck` — zero errors
- [ ] `npm run lint` — zero errors
- [ ] `npm run build` — succeeds
- [ ] `npm run test` — all pass
- [ ] `npm run check:placeholders` — no placeholder strings remain on public pages
- [ ] All Supabase migrations applied to the production database and `verify.sql` passed
- [ ] RLS confirmed: `anon` role cannot read `public.bookings`
- [ ] Razorpay test end-to-end: a test payment reaches `confirmed` / `paid` in the database
- [ ] Bad Razorpay signature returns HTTP 400 with no database write
- [ ] Duplicate webhook returns 200 with no second calendar event (idempotent)
- [ ] Google busy times disappear from the availability payload
- [ ] A forced Google failure returns 503, never an empty slot array
- [ ] Two overlapping booking inserts — second one rejected with `bookings_no_overlap`
- [ ] `NEXT_PUBLIC_SITE_URL` set to the production domain in Vercel
- [ ] Razorpay live keys set in Vercel → Production environment only
- [ ] Live Razorpay webhook URL updated to the production domain
- [ ] Google OAuth consent screen is in **In production** status
- [ ] `CRON_SECRET` is set and the cron route returns 401 without it
- [ ] No secret appears in Vercel build logs or in the browser network tab
- [ ] Security headers reviewed (see `docs/ARCHITECTURE.md §K`)

---

## 12. After first production deploy

1. Create a booking in production using a real test card if Razorpay live is not yet active, or a live small-value transaction.
2. Confirm the booking row is `confirmed` / `paid` in Supabase.
3. Confirm a Google Calendar event appeared on the practitioner's calendar.
4. Check the confirmation page loads and shows the correct session details.
5. Verify that replaying the Razorpay live webhook does not create a second calendar event.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `supabase: failed to fetch` | `SUPABASE_URL` or `SUPABASE_SERVICE_ROLE_KEY` wrong | Re-copy from Supabase dashboard → Project Settings → API |
| Availability returns 503 | Google credentials invalid or not set | Check `GOOGLE_REFRESH_TOKEN`. Re-run OAuth Playground step if token expired |
| Razorpay Checkout does not open | `RAZORPAY_KEY_ID` not set or wrong | Check the value; must start with `rzp_test_` in dev |
| Webhook always 400 | `RAZORPAY_WEBHOOK_SECRET` mismatch | Re-copy the secret from the Razorpay webhook settings |
| Double-booking not rejected | Migration `0001` or `0002` not applied | Re-run migrations in order |
| `invalid_grant` from Google | Refresh token revoked or expired | Re-run OAuth Playground step; ensure consent screen is In production |
| Cron route returns 401 | `CRON_SECRET` not set or header wrong | Check the `Authorization: Bearer` header matches the env var |
| Build fails on Vercel | Node version mismatch | Set Node 24.x in Vercel project settings |

---

## Reference

| Document | What it covers |
|---|---|
| `docs/ARCHITECTURE.md` | Full system design, state machine, security checklist |
| `docs/DECISIONS.md` | Defaults that need client confirmation |
| `supabase/README.md` | Database run order and operator runbook |
| `.env.example` | All environment variable names and dummy values |
