# Architecture

Small production website for one independent practice in India. Public pages plus a paid booking flow. Not a SaaS product.

This document is the contract for later phases. Application features are not built yet. Defaults that still need a human yes are marked in `docs/DECISIONS.md`.

The system must never tell a customer a booking is confirmed unless the server has verified the payment and the database has accepted the slot.

## A. Folder structure

Intended tree. Only `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, and `src/app/favicon.ico` exist today.

```text
src/
  app/
    layout.tsx
    page.tsx                         # /
    globals.css
    about/page.tsx
    services/page.tsx
    sessions/page.tsx
    events/page.tsx
    gallery/page.tsx
    reviews/page.tsx
    contact/page.tsx
    book/page.tsx                    # booking flow
    book/confirmation/[token]/page.tsx
    privacy/page.tsx
    terms-and-cancellation/page.tsx
    api/
      availability/route.ts
      bookings/route.ts
      bookings/[token]/route.ts
      payments/verify/route.ts
      webhooks/razorpay/route.ts
      cron/expire-holds/route.ts
  components/                        # thin UI only
    site-header.tsx
    site-footer.tsx
    book/
      session-picker.tsx
      slot-picker.tsx
      details-form.tsx
      checkout-button.tsx
  lib/
    env.ts                           # typed env validation
    supabase/
      server.ts                      # service-role client, server only
    razorpay/
      client.ts                      # orders and payment fetch
      verify.ts                      # checkout signature and webhook signature
    google-calendar/
      auth.ts
      freebusy.ts
      events.ts
    booking/
      create-hold.ts
      confirm.ts                     # the one idempotent confirm function
      status.ts
      expire-holds.ts
    availability/
      slots.ts                       # pure slot arithmetic
    validation/
      availability.ts
      booking.ts
      webhook.ts
    rate-limit.ts
  content/
    site.ts                          # placeholder copy, clearly marked
    sessions.ts                      # two session types, server prices in paise
  types/
    booking.ts
    session.ts
supabase/
  migrations/
    0001_bookings.sql                # written in the database phase, not applied from here
```

`src/lib` does not import React. Route handlers parse input, call `src/lib`, and map results to HTTP. Components do not call Razorpay, Google, or Supabase with secrets.

## B. Route map

### Public pages

| Path | Purpose |
| --- | --- |
| `/` | Home. Placeholder until real copy is supplied. |
| `/about` | About the practitioner. No invented qualifications. |
| `/services` | What the practice offers, in the client's own words. |
| `/sessions` | The two bookable session types, duration, and price from server content. |
| `/events` | Events listing. Empty state until the client supplies events. |
| `/gallery` | Images the client supplies. Empty state until then. |
| `/reviews` | Reviews the client supplies. No invented testimonials. |
| `/contact` | Name, email, phone, short message. No clinical questions. Delivery of the message waits until notifications are requested; until then the page states that the form is not live. |
| `/book` | Choose session type, then a date and start time, then name, email, phone, and optional note, then Razorpay Checkout. |
| `/book/confirmation/[token]` | Loads status by token. Shows a confirmed booking only when `booking_status` is `confirmed`. |
| `/privacy` | What is collected and why. |
| `/terms-and-cancellation` | Fees, the 24-hour notice default, and the reschedule default. |

Marketing pages are static Server Components. `/book` is the interactive flow. No account login.

### API route handlers

Every handler validates input with zod. Browser POSTs also check that `Origin` (or `Referer` if Origin is absent) matches `NEXT_PUBLIC_SITE_URL`. The webhook and the cron route do not use that check; they have their own secrets.

| Handler | Method | Purpose | Auth and validation |
| --- | --- | --- | --- |
| `/api/availability` | `GET` | Return bookable start times for one session type and a date range. | Query schema: session type id, `from`, `to`. Range capped at 42 days. Rate limited. No cookies. |
| `/api/bookings` | `POST` | Validate the slot and the person, insert a `pending` hold, create a Razorpay order, store the order id. | JSON body: session type id, start time, name, email, phone, optional note (max 500 characters). Reject clinical-field names if sent. Server sets the price. Rate limited. |
| `/api/payments/verify` | `POST` | Path 1 into the shared confirm function, immediately after Checkout. | JSON: booking token, `razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature`. Signature checked before any status write. |
| `/api/bookings/[token]` | `GET` | Booking status for the confirmation page. Recovery path when the browser closed after payment. | Token format checked, then hashed and looked up. If the row is still `pending` and has an order id, the server asks Razorpay for the order and its payments, then calls the same confirm function when Razorpay says the payment is captured. |
| `/api/webhooks/razorpay` | `POST` | Path 2 into the shared confirm function. | Raw body required. `X-Razorpay-Signature` verified with `RAZORPAY_WEBHOOK_SECRET`. Accept `payment.captured` and `order.paid` for confirm. Accept `payment.failed` only as a payment failure, not as a slot release. Accept `refund.processed` to move `refund_pending` to `refunded`. |
| `/api/cron/expire-holds` | `POST` | Backup sweeper for unpaid holds past `hold_expires_at`. | `Authorization: Bearer <CRON_SECRET>` compared in constant time. Not a substitute for expiring holds inside availability and create-booking. |

No public route reads or writes the database with a browser key.

## C. Booking and payment state machine

Two independent columns.

`booking_status`: `pending` | `confirmed` | `cancelled` | `failed`

`payment_status`: `unpaid` | `pending` | `paid` | `failed` | `refund_pending` | `refunded`

A new row starts as `booking_status = pending`, `payment_status = unpaid`, with `hold_expires_at = now() + 15 minutes`. The create request then creates the Razorpay order. Money is `amount_paise` (integer). Times are `timestamptz` in UTC.

Only server code moves these columns, except a person working in the Razorpay dashboard and in Supabase for a manual refund (there is no admin UI).

| From booking | From payment | To booking | To payment | Trigger | Who |
| --- | --- | --- | --- | --- | --- |
| (none) | (none) | `pending` | `unpaid` | Slot insert succeeded | Server, create-booking |
| `pending` | `unpaid` | `pending` | `pending` | Razorpay order created and stored | Server, create-booking |
| `pending` | `unpaid` | `failed` | `failed` | Order creation failed; hold released in the same request | Server, create-booking |
| `pending` | `pending` | `confirmed` | `paid` | Confirm function: signature or Razorpay entity says captured, and the slot is still ours | Server, via verify, webhook, or status recovery |
| `pending` | `pending` | `pending` | `failed` | `payment.failed` for this order. The hold stays until expiry so a retry on the same order can still succeed | Server, webhook |
| `pending` | `pending` or `failed` | `failed` | unchanged, or `failed` if still unpaid at Razorpay | `hold_expires_at` has passed and Razorpay does not show a captured payment | Server, lazy expiry or cron |
| `pending` | `pending` | `failed` | `refund_pending` | Captured payment, but the hold expired and another `pending` or `confirmed` row owns an overlapping block. `needs_manual_review = true` | Server, confirm function |
| `pending` | `pending` | `confirmed` | `paid` | Captured payment after the hold clock passed, and no other row owns the block, so this row can still take it | Server, confirm function |
| `confirmed` | `paid` | `confirmed` | `paid` | Duplicate verify or webhook for the same payment id | Server, no-op |
| `confirmed` | `paid` | `cancelled` | `refund_pending` | Person accepts a cancellation that meets the published policy. Not a customer button in v1 | Human, manual database update |
| `cancelled` or `failed` | `refund_pending` | unchanged | `refunded` | `refund.processed` webhook, or a manual update after a dashboard refund | Server webhook, or human |
| `confirmed` | `paid` | `confirmed` | `paid` | Google event insert fails | Server sets `calendar_sync_status = failed` only. Booking stays confirmed |

Checkout dismissed by the customer is not a transition. The hold remains until expiry or a later successful payment on that order.

`failed` means the session was never successfully booked. `cancelled` means it was confirmed and later called off.

### Hold expiry and a late payment

1. For 15 minutes the `pending` row blocks the slot through the database constraint.
2. After `hold_expires_at`, a sweeper sets `booking_status = failed` only after a server-side Razorpay read shows the order is not paid. A captured payment is sent to the confirm function instead of being expired.
3. If the confirm function finds the payment captured and the exclusion constraint still accepts this row, the booking becomes `confirmed` / `paid` even though the clock passed.
4. If another row already overlaps, this row becomes `failed` / `refund_pending` with `needs_manual_review`. The other customer's booking is left alone. The user-facing message is that the payment was received but the slot is no longer available, and the fee will be reviewed for a refund. The page must not say the session is booked.

No code path confirms two overlapping rows.

## D. Slot availability algorithm

### Inputs

From `src/content/sessions.ts` for the chosen type: duration in minutes, price in paise.

From configuration (defaults in `docs/DECISIONS.md`):

- buffer: 15 minutes
- working hours: Mon–Sat 10:00–18:00, Sunday closed
- minimum notice: 12 hours
- maximum advance: 60 days
- slot interval: 30 minutes
- timezone: `BUSINESS_TIMEZONE`, default `Asia/Kolkata`

### Timezone

Compute wall-clock slots in the business timezone with Luxon (added in the availability phase, not installed yet). Persist `starts_at`, `ends_at`, and `blocked_until` as UTC `timestamptz`.

`Asia/Kolkata` does not observe daylight saving. The library still has to be DST-safe because the timezone is configurable. Do not add a fixed `+05:30` offset, and do not build slots by slicing a UTC day.

Display uses the same timezone, with a visible "IST" (or the configured zone's short name) on the booking UI.

### Steps

1. Reject a range outside the max-advance window, or wider than 42 days.
2. In one database transaction, expire unpaid holds whose `hold_expires_at` is in the past and whose Razorpay order is not captured. Then read `pending` rows with `hold_expires_at > now()` and all `confirmed` rows that overlap the window.
3. Ask Google Calendar `freeBusy.query` for `GOOGLE_CALENDAR_ID` over the same window. If this call fails or times out, stop and return HTTP 503. Do not treat failure as "no busy periods".
4. Build candidate starts on the 30-minute grid in the business zone. A candidate is kept only when all of the following are true:
   - the local day is a working day
   - start is at or after 10:00 local
   - `start + duration` is at or before 18:00 local
   - start is at or after `now + min notice`
   - start is at or before `now + max advance`
5. Each candidate occupies `[start, start + duration)`. It is unavailable if that interval overlaps any Google busy period expanded by the buffer, or any booking block. Google busy `[busyStart, busyEnd)` is treated as `[busyStart, busyEnd + buffer)`. A booking already stores `blocked_until = ends_at + buffer`, so the buffer is not added twice.
6. The buffer may run past 18:00 after the last session of the day. It must not spill into the next day's grid as a fake busy morning unless a real event or booking extends that far.
7. Sort the remaining starts and return them.

### What the API returns

```json
{
  "timezone": "Asia/Kolkata",
  "sessionTypeId": "session-60",
  "slots": ["2026-10-05T04:30:00.000Z"]
}
```

`slots` are available start instants only. Omission means unavailable. An empty array means the calendar was read and nothing is free. A calendar outage is a 503 with `{ "error": "availability_unavailable" }`, never an empty array.

The response must not include event titles, descriptions, attendees, or calendar ids.

### Cache

Server cache only, TTL 30 seconds, keyed by session type and range. Do not cache 503s. The HTTP response is `Cache-Control: private, no-store` so browsers and shared caches do not keep slots. A slot can be shown for up to 30 seconds after it was taken; the database constraint is what makes the later POST fail cleanly.

### Calendar unreachable

Fail closed. The booking page shows: "Availability is temporarily unavailable. Please try again in a few minutes." It does not offer times.

## E. Double-booking prevention

App checks are not the guarantee. PostgreSQL rejects overlapping blocks.

`btree_gist` is required. The booking phase migration will add:

```sql
alter table public.bookings
  add constraint bookings_no_overlap
  exclude using gist (
    tstzrange(starts_at, blocked_until, '[)') with &&
  )
  where (booking_status in ('pending', 'confirmed'));
```

`blocked_until` is `ends_at` plus the buffer, so two sessions cannot sit closer than the buffer. A `pending` row counts until its status changes, which is why expiry must update the status rather than relying on `now()` inside the constraint. `now()` is not allowed in a partial index predicate.

Create-booking, inside one transaction:

1. Expire overlapping abandoned holds that Razorpay does not show as paid.
2. Insert the new `pending` row.
3. On unique violation of this constraint (`SQLSTATE 23P01`), roll back and return HTTP 409.

The 409 body is `{ "error": "slot_taken" }`. The page says: "That time was just taken. Please pick another." It does not say the booking succeeded, and it does not open Checkout.

Confirmed rows stay in the constraint until `cancelled` or `failed`.

## F. Payment confirmation

Two paths call one function, `confirmBooking` in `src/lib/booking/confirm.ts`. A third path recovers a closed browser.

### Shared confirm function

Inputs: booking id (resolved from the token or the Razorpay order id), Razorpay order id, Razorpay payment id, and the source (`verify`, `webhook`, or `recovery`).

The function:

1. Locks the booking row with `select … for update`.
2. If `payment_status` is already `paid` and `razorpay_payment_id` equals this payment id, returns success without inserting another calendar event. That is the duplicate-webhook and double-click case.
3. If the row is already `paid` for a different payment id, returns success for the stored payment and does not switch payments.
4. Loads the payment from Razorpay when the caller did not already prove it (recovery, and as a re-check for webhooks). The captured amount must equal `amount_paise` and the currency must be `INR`. The order id must match the row.
5. Applies the late-payment rules in section C. The exclusion constraint is the backstop if two confirms race.
6. On success, sets `confirmed` / `paid`, stores the payment id, and then attempts the calendar insert (section H). Calendar failure does not roll back the payment.

There is no client-supplied `paid: true` flag and no development shortcut that marks a booking paid without a Razorpay signature or a Razorpay API read.

### Path 1 — Checkout return

Razorpay Checkout calls the browser with `razorpay_order_id`, `razorpay_payment_id`, and `razorpay_signature`. The browser posts those, plus the booking token, to `/api/payments/verify`.

The server computes HMAC-SHA256 of `order_id + "|" + payment_id` with `RAZORPAY_KEY_SECRET` and compares it to the signature in constant time. A bad signature is HTTP 400 and writes nothing. A good signature calls `confirmBooking`.

### Path 2 — Webhook

`/api/webhooks/razorpay` reads `await request.text()` and verifies HMAC-SHA256 of that raw string with `RAZORPAY_WEBHOOK_SECRET` against `X-Razorpay-Signature`. Parsing JSON before the HMAC is a bug, because the bytes would not match Razorpay's signature.

`payment.captured` and `order.paid` both call `confirmBooking`. Razorpay can send both. The payment-id check makes the second call a no-op.

Webhook event ids are stored in `payment_events (razorpay_event_id text primary key)`. A duplicate delivery hits the primary key and returns 200 without a second side effect.

`payment.failed` sets `payment_status = failed` only while the booking is still `pending`. It does not set `booking_status = failed` and does not free the constraint early.

The handler returns 200 only after the database commit. A 500 makes Razorpay retry.

### Path 3 — Browser closed after payment

`GET /api/bookings/[token]`, when the row is `pending` or `payment_status` is `failed` but an order id exists and the hold has not been finally rejected, calls Razorpay's order/payments API. If any payment for that order is captured for the right amount, it calls `confirmBooking` before it answers.

The confirmation page polls this endpoint a small number of times. The JSON it returns to the browser is limited to: booking status, payment status, session type name, start time, and whether a manual review is needed. It does not return the Razorpay secret, signatures, or Google data.

### Failed and cancelled payments

A failed payment leaves the person on `/book` with the hold still counting down if time remains, and a plain message that the payment did not go through. They may try Checkout again on the same order until the hold expires. After expiry the slot is released and they must pick a time again. A new attempt creates a new booking row and a new order. The old row stays `failed`.

## G. Google Calendar auth

Official scope list used here: [Choose Google Calendar API scopes](https://developers.google.com/workspace/calendar/api/auth), last updated 2026-09-03. Free/busy authorization is from [Freebusy: query](https://developers.google.com/calendar/api/v3/reference/freebusy/query). Attendee behaviour is from [Events: insert](https://developers.google.com/calendar/api/v3/reference/events/insert): "Service accounts need to use domain-wide delegation of authority to populate the attendee list." Refresh-token lifetime is from [Using OAuth 2.0 to Access Google APIs](https://developers.google.com/identity/protocols/oauth2): an external consent screen in **Testing** issues refresh tokens that expire in 7 days, unless the only scopes are name, email, and profile. Calendar scopes are not in that exception.

Minimal scopes for this design, and no broader `calendar` scope:

| Scope | Why |
| --- | --- |
| `https://www.googleapis.com/auth/calendar.events.freebusy` | "See the availability on Google calendars you have access to." `freeBusy.query` allows this scope, plus `calendar.freebusy`, `calendar.readonly`, and `calendar`. This is the narrow one that still matches free/busy on calendars the account can access. |
| `https://www.googleapis.com/auth/calendar.events` | "View and edit events on all your calendars." Required to insert the booking event. `freeBusy.query` does **not** list this scope as sufficient for free/busy, so it does not replace the free/busy scope. |

`calendar.events` can also read event details. The code must call only `freeBusy.query` and the event insert/patch methods. If a later Google doc shows `calendar.events.owned` is enough to insert on a calendar the user owns, switch to it and record the change. That part is not assumed here.

### Option 1 — OAuth with a stored refresh token (recommended, provisional)

Setup for a non-technical client: the developer creates the Cloud project, the OAuth client, and the consent screen, then the practitioner signs in once and grants those two scopes. The developer puts the refresh token in the host's environment. The practitioner does not handle a private key.

Access tokens expire after about an hour and are refreshed. The refresh token does not get the 7-day Testing expiry if the consent screen's publishing status is **In production**. Do that before relying on the token. Calendar scopes are sensitive, so an unverified app shows Google's unverified-app warning; the practitioner can still grant access for their own account. Removing that warning needs Google's verification. That verification is not required for the 7-day rule itself. Refresh tokens can still die later: the user revokes access, the token is unused for six months, or more than 100 live refresh tokens exist for that client (Google drops the oldest). Do not mint tokens in the OAuth Playground for production; those are short-lived.

On revocation or `invalid_grant`, availability fails closed (section D) and new event inserts set `calendar_sync_status = failed`. Already confirmed bookings stay confirmed.

Attendee invites work, because the event is owned by the practitioner's Google account. The customer's email can be an attendee and Google can email the invite. That is the only notification channel in v1, and only if the insert asks Google to send updates. Whether to send that invite is part of the provisional choice: default is to add the customer as an attendee so the calendar invite exists, without a separate mail vendor.

Secrets live in server env: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`, `GOOGLE_CALENDAR_ID`.

### Option 2 — Service account, calendar shared to it

Setup: the developer creates a service account. The practitioner shares their calendar with the service-account email and grants "Make changes to events". That share is understandable with a short guide. Domain-wide delegation is not understandable in this setup, and it requires Google Workspace, which this project does not assume.

Service-account keys are not OAuth refresh tokens, so the 7-day Testing rule does not apply. Keys can still be revoked or given an expiry in Cloud Console; the developer should check the key has no surprise expiry and can rotate it. There is no user consent screen to revoke; unsharing the calendar is the revocation. Effect: availability fails closed, event inserts fail, paid bookings stay confirmed and flagged.

Attendee invites do not work for a personal Gmail calendar. Google's insert reference says a service account must use domain-wide delegation to populate attendees. Without Workspace, the event can still appear on the shared calendar for the practitioner, with no customer invite.

The private key and client email would be server env vars (`GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`), never a committed JSON file.

### Recommendation

Use option 1, and set the consent screen to In production before the refresh token is issued. Option 2 is the fallback if the client uses Workspace or explicitly does not want customer invites. This is **provisional** in `docs/DECISIONS.md`.

## H. Calendar event after payment

`confirmBooking` calls event creation only after the booking is `confirmed` and `paid`.

Idempotency:

- Store `google_event_id` on the booking. It is unique.
- Use a deterministic Google event id derived from the booking UUID (Google's event-id alphabet: characters from the base32hex of the UUID, length within Google's limits). A retry that sees HTTP 409 loads that id and saves it.
- Also set a private extended property `bookingId` so a human can see why the event exists.
- If `google_event_id` is already set and `calendar_sync_status` is `synced`, do nothing.

If the insert fails after payment: leave `booking_status = confirmed` and `payment_status = paid`. Set `calendar_sync_status = failed`. The confirmation page still says the session is booked, and adds that the calendar entry is delayed. The status read retries the insert once, idempotently. The daily cron retries rows in `failed`. The row stays flagged until `synced`. The customer is not told the booking failed, and they are not charged again.

`calendar_sync_status`: `pending` | `synced` | `failed`. A `failed` or `cancelled` booking uses `not_required` if no event was created. Cancelling later is a manual calendar edit in v1, because there is no cancel API yet.

## I. Environment variables

Dummy values below match `.env.example`. They are not credentials.

| Name | Visibility | Used by | Supplied by | Example |
| --- | --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public | Origin checks, absolute links | Developer | `http://localhost:3000` |
| `SUPABASE_URL` | Server | Supabase server client | Supabase project settings | `https://example.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Server | Supabase server client. Bypasses RLS | Supabase project settings | `dummy_supabase_service_role_key_replace_me` |
| `RAZORPAY_KEY_ID` | Server; the id alone is handed to Checkout | Create order, Checkout | Razorpay dashboard, **test mode** while developing | `rzp_test_dummykeyid000000` |
| `RAZORPAY_KEY_SECRET` | Server | Order API, checkout HMAC | Razorpay dashboard, test mode | `dummy_razorpay_key_secret_replace_me` |
| `RAZORPAY_WEBHOOK_SECRET` | Server | Webhook HMAC | Razorpay webhook configuration | `dummy_razorpay_webhook_secret_replace_me` |
| `GOOGLE_CLIENT_ID` | Server | OAuth refresh | Developer, Google Cloud OAuth client | `000000000000-dummy.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Server | OAuth refresh | Developer, Google Cloud | `dummy_google_client_secret_replace_me` |
| `GOOGLE_REFRESH_TOKEN` | Server | OAuth refresh | Generated once when the practitioner grants access | `dummy_google_refresh_token_replace_me` |
| `GOOGLE_CALENDAR_ID` | Server | free/busy and event insert | Client's calendar id; `primary` is acceptable | `primary` |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Server, only if option 2 is chosen | Service-account auth | Google Cloud | commented out in `.env.example` |
| `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` | Server, only if option 2 is chosen | Service-account auth | Google Cloud | commented out in `.env.example` |
| `CRON_SECRET` | Server | Expire-holds route | Developer, random string | `dummy_cron_secret_replace_me` |
| `BUSINESS_TIMEZONE` | Server | Slot math and display | Developer, confirm with client | `Asia/Kolkata` |

There is no anon key and no email-provider key. Do not add a `NEXT_PUBLIC_` secret. Use test Razorpay keys until a deliberate production cutover in the deployment phase.

`.env.example` is the committed copy of these names, with the same dummy values and the comment "Use TEST keys only during development".

## J. Failure modes

| Step | What can fail | What the user sees | Database left as | Recovery |
| --- | --- | --- | --- | --- |
| Load slots | Invalid query | A validation message, no times | Unchanged | User fixes the request |
| Load slots | Google down, slow, or revoked | "Availability is temporarily unavailable." | Unchanged | Retry later. No slots invented |
| Load slots | Supabase down | Same temporary-unavailable message | Unchanged | Retry later |
| Create hold | Slot just taken (`23P01`) | "That time was just taken. Please pick another." | No new row | User picks another start |
| Create hold | Validation error | Field errors. No payment | No row | User corrects the form |
| Create order | Razorpay order API fails | "We could not start payment. Your time was not booked." | Row set to `failed` / `failed` so the constraint releases | User tries again, which creates a new row |
| Checkout | User closes the modal | "Payment was not completed. This time is held for a few minutes." | `pending` / `pending` until expiry | Resume Checkout or let it expire |
| Checkout | Payment fails | "The payment did not go through." | `pending` / `failed`, hold kept until expiry | Retry on the same order, or start over after expiry |
| Verify | Bad signature | "We could not confirm that payment." Nothing is marked paid | Unchanged | Webhook or status recovery if the payment was real |
| Verify or webhook | Signature good, slot already gone | "We received the payment, but that time is no longer available. It has been flagged for a refund." | `failed` / `refund_pending`, `needs_manual_review` | A person refunds in Razorpay and the refund webhook or a manual edit sets `refunded` |
| Webhook | Bad signature | Razorpay sees a non-200; user is unaffected if verify already ran | Unchanged | Fix the webhook secret. Path 1 or path 3 can still confirm |
| Webhook | Handler crashes after Razorpay captured | User may still be on Checkout | Unchanged if the transaction rolled back | Razorpay retries. Status recovery also confirms |
| Browser closed | User never calls verify | Confirmation URL, if they have it, or they return with the token | `pending` until recovery runs | Status GET reads Razorpay and confirms |
| Confirm | Duplicate webhook | No change the user can see | Stays `confirmed` / `paid` | Event-id primary key and payment-id check |
| Calendar insert | Google error after payment | "Your session is booked. Adding it to the calendar is delayed." | `confirmed` / `paid`, `calendar_sync_status = failed` | Idempotent retry on status read and daily cron |
| Expire hold | Sweeper cannot reach Razorpay | Slot may stay blocked past 15 minutes | Stays `pending` | Next request tries again. Blocking too long is safer than freeing a paid slot |
| Cron | Wrong or missing `CRON_SECRET` | No user impact | Unchanged | Lazy expiry in the booking requests still runs |

## K. Security checklist

| Threat | What this architecture does |
| --- | --- |
| Public database reads | RLS enabled on every table. No policies for `anon` or `authenticated`, so those roles have no access. The Next.js server uses the service-role key only. |
| Tampered prices or times | Server looks up duration and paise from `src/content/sessions.ts`. The client cannot set `amount`. Zod rejects unexpected fields. |
| Fake payment success | Checkout HMAC with the key secret, webhook HMAC with the webhook secret over the raw body, and a Razorpay API read on the recovery path. All three go through `confirmBooking`. |
| Duplicate charges or duplicate confirms | Unique `razorpay_order_id`, unique `razorpay_payment_id`, unique webhook event id, row lock, deterministic Google event id. |
| Double booking | GiST exclusion constraint on `[starts_at, blocked_until)` for `pending` and `confirmed`. |
| Secret leakage | Only `NEXT_PUBLIC_SITE_URL` is public. Logs must not include name, email, phone, note, tokens, signatures, or secrets. Confirmation tokens are stored as SHA-256 hashes. |
| Enumeration | Confirmation URLs use 32 random bytes, base64url. Status responses are generic on an unknown token. |
| CSRF | No cookie session. State-changing browser routes still require a matching `Origin`. Webhook uses the signature. Cron uses `CRON_SECRET`. |
| Abuse of booking and availability | A `rate_limits` table: hashed IP plus route plus window, limits about 30 availability reads per 5 minutes and 8 booking creates per 10 minutes per IP. Fits Vercel without Redis. Tune in the booking phase. |
| Security headers | Add in `next.config.ts` during the security-review phase, not on the empty scaffold: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`, `Permissions-Policy` with camera, microphone, and geolocation disabled, and `Strict-Transport-Security` on production HTTPS. Content-Security-Policy must allow Razorpay Checkout (`https://checkout.razorpay.com` and `https://api.razorpay.com`) and must not be guessed before that script is integrated. |
| Client bundle | No service-role key, Razorpay secret, webhook secret, or Google token in client components or `NEXT_PUBLIC_` names. |

Personal data collected at booking: name, email, phone, optional note. No health or clinical fields. The note is stored and shown only on the practitioner's calendar description, not on public pages.

## L. Implementation phases

Each phase is done only when typecheck, lint, and build pass, and its "done when" line is true. Do not start a phase by deploying or by pushing a database to a remote project.

| Phase | Deliverable | Done when |
| --- | --- | --- |
| 1. Scaffold and architecture | This repository's app shell, rules, and docs | `npm run typecheck`, `lint`, and `build` pass. `.env.example` has dummy values only. |
| 2. Database | `supabase/migrations/0001_bookings.sql` with the columns in this document, the exclusion constraint, RLS deny-by-default, `payment_events`, and `rate_limits`. Not applied to a remote database from the agent. | The SQL file exists, is reviewed against sections C and E, and is not executed against production. |
| 3. Public UI | The marketing routes, responsive layout, header, footer, and clearly marked placeholder copy. | Every public route renders. No invented qualifications, testimonials, stats, or fees. Keyboard and contrast basics hold. |
| 4. Booking flow without money | Session picker, slot picker, details form, hold creation against a local or dev database, 409 handling, confirmation page for a pending hold. | A second overlapping hold is rejected by the database. The UI copy matches the 409 message. No payment is marked successful. |
| 5. Calendar | Free/busy subtraction, fail-closed 503, event insert after a confirmed row, idempotent event id. | With test Google credentials, busy times disappear from the payload and the payload has no event details. A forced Google failure does not show slots. |
| 6. Razorpay | Test-mode orders, Checkout, verify, webhook, and status recovery, all through `confirmBooking`. | A test payment reaches `confirmed` / `paid`. A bad signature does not. A replayed webhook does not create a second event. |
| 7. Integration | The full visitor path on test keys: choose type, choose slot, pay, see a true confirmation, see one calendar event. Late payment when the slot was taken flags `refund_pending` and does not double-book. | Those two scripts have been run and the database rows match section C. |
| 8. Notifications | Only if the client asks. | Not started while `docs/DECISIONS.md` still says no email. |
| 9. Real content | Replace placeholders with copy, prices, and images the client provides. | No placeholder string remains on public pages. Prices match the server config in paise. |
| 10. SEO | Titles, descriptions, canonical URL, sitemap, and a sensible heading outline for the real pages. | Each public route has unique title and description. Draft pages are not advertised as a live clinic. |
| 11. Security review | Headers, rate limits, log review, env review, RLS review. | Checklist in section K is either implemented or has a line in `docs/KNOWN_ISSUES.md`. |
| 12. Deployment | Vercel project, Node 24, test-to-live key swap done by a person, Razorpay live webhook, OAuth consent screen In production. | A person deploys. The agent does not run `vercel` or a remote database push as part of unattended work. |

## M. Open questions

Resolved as defaults in `docs/DECISIONS.md` until the client says otherwise:

- Full payment up front, not a deposit.
- 24-hour cancellation notice, no self-serve cancel, no automatic refund.
- No self-serve reschedule.
- Online sessions, no invented location, no automatic Meet link.
- Monday–Saturday 10:00–18:00 IST, Sunday closed.
- 15-minute buffer, 30-minute grid, 12-hour notice, 60-day horizon.
- Two placeholder session lengths: 60 and 90 minutes, prices supplied later, checkout blocked at zero paise.
- Existing busy events block slots.
- No email or SMS notifications.
- Calendar auth: OAuth refresh token, provisional, documented in section G.
