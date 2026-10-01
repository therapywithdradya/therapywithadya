# Database

Schema, booking functions, and deny-by-default row level security for this site. Nothing here has been applied to a remote database.

There is no `session_types` table. The two placeholder sessions, including price and duration, live in `src/lib/booking/session-config.ts`.

## Run order

Run these files in this order, each to completion, before the next:

1. `supabase/migrations/0001_core_tables.sql`
2. `supabase/migrations/0002_booking_functions.sql`
3. `supabase/migrations/0003_rls_and_grants.sql`
4. `supabase/seed.sql` (dummy content only)
5. `supabase/tests/verify.sql` (optional, and safe to repeat; it rolls back)

`0003` requires the Supabase roles `anon`, `authenticated`, and `service_role`. Apply it in the Supabase project, not in an empty Postgres that does not have those roles.

## Supabase SQL editor

1. Open the project in the Supabase dashboard and go to **SQL Editor**.
2. Paste the full text of `0001_core_tables.sql`. Run it. It should finish without an error.
3. New query. Paste `0002_booking_functions.sql`. Run it.
4. New query. Paste `0003_rls_and_grants.sql`. Run it.
5. New query. Paste `seed.sql`. Run it.
6. Optional: new query. Paste `supabase/tests/verify.sql` and run the **whole file in one execution**. Read the notices.
   - Success is a notice `VERIFICATION PASSED`, then `ROLLBACK`.
   - A warning `VERIFICATION FAILED` lists the checks that did not match. The file still ends with `ROLLBACK`, so those rows are not kept.
   - If a notice never appears and the editor shows a SQL error, run `rollback;` in a follow-up query if it says a transaction is still open. The checks before that error did not stay committed.

Do not add any of these tables to the `supabase_realtime` publication.

## psql

From this repository, against the database you intend to change:

```text
psql "postgresql://USER:PASSWORD@HOST:5432/postgres" -v ON_ERROR_STOP=1 -f supabase/migrations/0001_core_tables.sql
psql "postgresql://USER:PASSWORD@HOST:5432/postgres" -v ON_ERROR_STOP=1 -f supabase/migrations/0002_booking_functions.sql
psql "postgresql://USER:PASSWORD@HOST:5432/postgres" -v ON_ERROR_STOP=1 -f supabase/migrations/0003_rls_and_grants.sql
psql "postgresql://USER:PASSWORD@HOST:5432/postgres" -v ON_ERROR_STOP=1 -f supabase/seed.sql
psql "postgresql://USER:PASSWORD@HOST:5432/postgres" -v ON_ERROR_STOP=1 -f supabase/tests/verify.sql
```

Use the connection string from the Supabase dashboard. Do not commit it.

## Supabase CLI

`supabase db push` applies the files in `supabase/migrations/` to the linked project. It does not run `seed.sql` or `verify.sql`. Run those two in the SQL editor or with `psql` after a push.

Do not run `supabase db push` until the SQL editor checks below have passed. Do not run `supabase db reset` on a database that already has real bookings. This phase did not run either command.

## Razorpay Checkout timeout

When Razorpay Checkout is built in the payment phase, set its timeout option to no more than the 15-minute hold. A longer Checkout window can still be taking payment after `hold_expires_at`, which is the late-payment path in `confirm_booking_payment`.

## Operator runbook

There is no admin screen. Use the Supabase SQL editor, signed in as the database owner. These queries return or change personal data. Do not paste the results into chat, email, or tickets.

The service-role key bypasses row level security. It belongs only in server environment variables. A leaked anon key should expose nothing, because every table has row level security enabled and no policies.

### Bookings that need a person

```sql
select
  id,
  booking_status,
  payment_status,
  session_name,
  starts_at,
  ends_at,
  customer_name,
  customer_email,
  razorpay_order_id,
  razorpay_payment_id,
  google_event_id,
  review_reason,
  needs_manual_review,
  created_at
from public.bookings
where needs_manual_review = true
order by created_at;
```

### Cancel a booking

Use `operator` when the practice calls it off, and `customer_request` when the customer asked. This does not refund money and does not delete a Google Calendar event.

```sql
update public.bookings
set
  booking_status = 'cancelled',
  cancel_reason = 'operator',
  cancelled_at = now()
where id = '00000000-0000-0000-0000-000000000000'
  and booking_status = 'confirmed';
```

Replace the uuid. For a customer request, set `cancel_reason` to `customer_request` instead of `operator`.

If `google_event_id` is not null, delete that event by hand on the practitioner's Google Calendar. There is no cancel API in this phase.

### Mark a refund after the Razorpay dashboard

Refund in the Razorpay dashboard first. Then:

```sql
update public.bookings
set payment_status = 'refunded'
where id = '00000000-0000-0000-0000-000000000000'
  and payment_status = 'refund_pending';
```

### Clear a review flag

```sql
update public.bookings
set
  needs_manual_review = false,
  admin_note = 'Reviewed and cleared.'
where id = '00000000-0000-0000-0000-000000000000'
  and needs_manual_review = true;
```

`review_reason` is left in place so the earlier reason is still visible. Replace the note with what was actually checked.

### Backup hold expiry

Availability reads and booking creation already expire stale holds. For a daily backup, call:

```sql
select public.expire_stale_pending_bookings();
select public.purge_old_rate_limits();
```

The cron route that calls these is not built yet. Both functions are granted to `service_role` only.

## Not tested

`psql` is not installed on the machine that prepared this phase, and no local Postgres was running. Docker was not installed or started. No remote database command was run. The SQL was reviewed by reading only.

Run this in the Supabase SQL editor before treating the schema as verified:

1. Run `0001_core_tables.sql`, then `0002_booking_functions.sql`, then `0003_rls_and_grants.sql`, each as its own query. Each should complete with no error.
2. Run `seed.sql`. Then:

```sql
select count(*) as testimonials from public.testimonials;
select count(*) as events from public.events_workshops;
select count(*) as gallery from public.gallery_items;
select count(*) as bookings from public.bookings;
```

Expected: testimonials `3`, events `4`, gallery `6`, bookings `0`. Titles should start with `[DUMMY]` and testimonial quotes with `[PLACEHOLDER]`.

3. Run `supabase/tests/verify.sql` as one script. Expected notice: `VERIFICATION PASSED`. Then:

```sql
select count(*) as bookings_after_verify from public.bookings;
```

Expected: `0`, because the script rolls back.

4. Confirm public roles cannot read:

```sql
set local role anon;
select count(*) from public.bookings;
```

Expected: permission denied, or zero rows if the statement is allowed and row level security hides them. Then run `reset role;` before any other query.

5. Two overlapping inserts at the same moment are not covered by `verify.sql`, because that file is one transaction. To check it, open two SQL editor tabs and start a transaction in each. Insert two pending bookings with the same `starts_at` and overlapping `blocked_until`, using different 64-character hex token hashes. Commit one, then commit the other. The second commit should fail with exclusion violation `bookings_no_overlap`. Roll both back if you used real-looking data. Do not leave those rows.

6. A real Razorpay capture, a real Google event id, and the daily cron route are not part of this phase.
