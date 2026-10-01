-- Core tables for the booking site.
-- Apply this file first. It does not insert data and does not touch a remote database by itself.
--
-- There is no session_types table. Prices, durations, and buffers live in server code.
-- The booking function receives that snapshot and stores a copy on the booking row.
--
-- Name map (docs/ARCHITECTURE.md wins on table and column names):
--   starts_at / ends_at          architecture names (phase brief said start_at / end_at)
--   amount_paise                 architecture name (phase brief said price_paise)
--   payment_events.razorpay_event_id
--                                architecture names (phase brief said razorpay_events.event_id)
-- Allowed calendar_sync_status values follow this phase: not_required, pending, created, failed.
-- Architecture called the success value synced. See docs/DECISIONS.md.

-- gen_random_uuid() is built into Postgres 13+ (Supabase is on 15). No extension.
-- tstzrange && uses the built-in gist range opclass. btree_gist is not required
-- because this exclusion constraint does not compare a scalar column.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := pg_catalog.now();
  return new;
end;
$$;

comment on function public.set_updated_at() is
  'Trigger helper. Not security definer. Execute is revoked from public roles in 0003.';

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  public_token_hash text not null,
  session_slug text not null,
  session_name text not null,
  amount_paise integer not null,
  currency text not null default 'INR',
  duration_minutes integer not null,
  buffer_minutes integer not null default 15,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  customer_note text null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  blocked_until timestamptz not null,
  timezone text not null default 'Asia/Kolkata',
  booking_status text not null default 'pending',
  payment_status text not null default 'unpaid',
  hold_expires_at timestamptz null,
  cancel_reason text null,
  razorpay_order_id text null,
  razorpay_payment_id text null,
  google_event_id text null,
  calendar_sync_status text not null default 'not_required',
  calendar_attempts integer not null default 0,
  calendar_error text null,
  needs_manual_review boolean not null default false,
  review_reason text null,
  admin_note text null,
  confirmed_at timestamptz null,
  cancelled_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint bookings_public_token_hash_key unique (public_token_hash),
  constraint bookings_public_token_hash_format check (public_token_hash ~ '^[0-9a-f]{64}$'),
  constraint bookings_session_slug_format check (session_slug ~ '^[a-z0-9-]{1,60}$'),
  constraint bookings_session_name_len check (char_length(session_name) between 1 and 120),
  constraint bookings_amount_paise_positive check (amount_paise > 0),
  constraint bookings_currency_inr check (currency = 'INR'),
  constraint bookings_duration_minutes_range check (duration_minutes between 15 and 480),
  constraint bookings_buffer_minutes_range check (buffer_minutes between 0 and 120),
  constraint bookings_customer_name_len check (char_length(btrim(customer_name)) between 1 and 100),
  constraint bookings_customer_email_len check (char_length(customer_email) <= 254),
  constraint bookings_customer_email_lower check (customer_email = lower(customer_email)),
  constraint bookings_customer_email_at check (position('@' in customer_email) > 1),
  constraint bookings_customer_phone_len check (char_length(customer_phone) between 7 and 20),
  constraint bookings_customer_note_len check (customer_note is null or char_length(customer_note) <= 500),
  -- ends_at = starts_at + duration is enforced in create_pending_booking, not here.
  -- timestamptz + interval is only STABLE, so it must not appear in an index or exclusion expression.
  constraint bookings_time_order check (ends_at > starts_at and blocked_until >= ends_at),
  constraint bookings_booking_status_values check (
    booking_status in ('pending', 'confirmed', 'cancelled', 'failed')
  ),
  constraint bookings_payment_status_values check (
    payment_status in ('unpaid', 'pending', 'paid', 'failed', 'refund_pending', 'refunded')
  ),
  constraint bookings_cancel_reason_values check (
    cancel_reason is null or cancel_reason in ('hold_expired', 'operator', 'customer_request')
  ),
  constraint bookings_razorpay_order_id_key unique (razorpay_order_id),
  constraint bookings_razorpay_payment_id_key unique (razorpay_payment_id),
  constraint bookings_google_event_id_key unique (google_event_id),
  constraint bookings_calendar_sync_status_values check (
    calendar_sync_status in ('not_required', 'pending', 'created', 'failed')
  ),
  constraint bookings_calendar_attempts_nonnegative check (calendar_attempts >= 0),
  constraint bookings_calendar_error_len check (
    calendar_error is null or char_length(calendar_error) <= 300
  ),
  constraint bookings_confirmed_requires_payment check (
    booking_status <> 'confirmed'
    or (
      payment_status in ('paid', 'refund_pending', 'refunded')
      and razorpay_payment_id is not null
    )
  ),
  constraint bookings_paid_requires_payment_id check (
    payment_status not in ('paid', 'refund_pending', 'refunded')
    or razorpay_payment_id is not null
  ),
  constraint bookings_review_requires_reason check (
    needs_manual_review = false or review_reason is not null
  )
);

-- Multiple NULLs are allowed in the unique columns above (default UNIQUE behaviour).
-- Two unpaid holds can both have a null Razorpay order id.

comment on table public.bookings is
  'One row per booking attempt. Active rows are pending and confirmed. Do not add this table to supabase_realtime.';

comment on column public.bookings.public_token_hash is
  'Lowercase hex SHA-256 of the confirmation token. The raw token is never stored.';

comment on column public.bookings.amount_paise is
  'Integer paise. Architecture column name. The phase brief called this price_paise.';

comment on column public.bookings.starts_at is
  'UTC timestamptz. Architecture column name. The phase brief called this start_at.';

comment on column public.bookings.ends_at is
  'UTC timestamptz. Equals starts_at plus duration_minutes, computed in create_pending_booking.';

comment on column public.bookings.blocked_until is
  'UTC timestamptz. Equals ends_at plus buffer_minutes. Stored so the exclusion constraint stays immutable.';

comment on column public.bookings.calendar_error is
  'Short operator-facing error. Never store tokens, secrets, or customer notes here.';

-- Active bookings cannot overlap on [starts_at, blocked_until).
-- Pending counts until status changes, so expiry must update booking_status.
-- now() is not used in this predicate. btree_gist is not created.
alter table public.bookings
  add constraint bookings_no_overlap
  exclude using gist (
    tstzrange(starts_at, blocked_until, '[)') with &&
  )
  where (booking_status in ('pending', 'confirmed'));

create index bookings_active_starts_at_idx
  on public.bookings (starts_at)
  where booking_status in ('pending', 'confirmed');

create index bookings_customer_email_idx
  on public.bookings (customer_email);

create index bookings_status_hold_expires_idx
  on public.bookings (booking_status, hold_expires_at);

-- Partial index for the operator review queue, ordered by created_at.
create index bookings_needs_manual_review_idx
  on public.bookings (created_at)
  where needs_manual_review;

create trigger bookings_set_updated_at
  before update on public.bookings
  for each row
  execute function public.set_updated_at();

-- Webhook idempotency. Ids and type only. Never store the payload or customer fields.
create table public.payment_events (
  razorpay_event_id text primary key,
  event_type text not null,
  razorpay_order_id text null,
  razorpay_payment_id text null,
  received_at timestamptz not null default now(),
  processed_at timestamptz null,
  constraint payment_events_event_type_len check (char_length(btrim(event_type)) between 1 and 120)
);

comment on table public.payment_events is
  'Razorpay webhook ids. Architecture table name. The phase brief called this razorpay_events. Do not add this table to supabase_realtime.';

comment on column public.payment_events.razorpay_event_id is
  'Value of the x-razorpay-event-id header. Architecture column name. The phase brief called this event_id.';

-- Counters keyed by a hash computed in app code. The database never sees raw IPs.
create table public.rate_limits (
  key_hash text not null,
  window_start timestamptz not null,
  count integer not null default 0,
  primary key (key_hash, window_start),
  constraint rate_limits_count_nonnegative check (count >= 0),
  constraint rate_limits_key_hash_len check (char_length(key_hash) between 1 and 128)
);

comment on table public.rate_limits is
  'Fixed-window request counters. key_hash is computed in app code. Do not add this table to supabase_realtime.';

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  quote text not null,
  rating smallint null,
  is_approved boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint testimonials_rating_range check (rating is null or rating between 1 and 5),
  constraint testimonials_display_name_len check (char_length(btrim(display_name)) between 1 and 120),
  constraint testimonials_quote_len check (char_length(btrim(quote)) between 1 and 2000)
);

comment on table public.testimonials is
  'Public content, still read only by the server. Dummy rows are marked in the quote text. Do not add this table to supabase_realtime.';

-- Upcoming versus past is derived from starts_at at query time. There is no status column for that.
create table public.events_workshops (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  kind text not null,
  title text not null,
  description text not null,
  starts_at timestamptz not null,
  ends_at timestamptz null,
  location text null,
  image_path text null,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  constraint events_workshops_slug_key unique (slug),
  constraint events_workshops_slug_format check (slug ~ '^[a-z0-9-]{1,80}$'),
  constraint events_workshops_kind_values check (kind in ('event', 'workshop')),
  constraint events_workshops_title_len check (char_length(btrim(title)) between 1 and 200),
  constraint events_workshops_time_order check (ends_at is null or ends_at > starts_at)
);

comment on table public.events_workshops is
  'Events and workshops. Filter upcoming or past with starts_at at query time. Do not add this table to supabase_realtime.';

create table public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  image_path text not null,
  alt_text text not null,
  caption text null,
  category text null,
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  constraint gallery_items_alt_text_present check (char_length(btrim(alt_text)) > 0),
  constraint gallery_items_image_path_len check (char_length(btrim(image_path)) between 1 and 300)
);

comment on table public.gallery_items is
  'Gallery metadata. Image files are not seeded. Do not add this table to supabase_realtime.';
