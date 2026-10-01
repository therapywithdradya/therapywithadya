-- Booking functions. Apply after 0001_core_tables.sql.
-- Every function is security definer with an empty search_path and schema-qualified names.
-- 0003 revokes execute from public, anon, and authenticated, and grants service_role.
-- Failures return jsonb codes or booleans. They do not return SQLERRM (it can contain row data).

create or replace function public.expire_stale_pending_bookings()
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_count bigint;
begin
  -- Pending rows past hold_expires_at stop blocking the slot, whatever the
  -- payment_status is. An opened-but-abandoned checkout has payment_status
  -- 'pending' and must not block the slot forever. payment_status is set back
  -- to 'unpaid' only when it was 'pending' or 'failed'.
  -- A payment captured late is recovered by confirm_booking_payment case 4
  -- in the phase brief's wording. In this function the expired-hold recovery
  -- is step 7. Step 4 only replays an already recorded paid_slot_lost result.
  update public.bookings
  set
    booking_status = 'cancelled',
    cancel_reason = 'hold_expired',
    cancelled_at = pg_catalog.now(),
    payment_status = case
      when payment_status in ('pending', 'failed') then 'unpaid'
      else payment_status
    end
  where booking_status = 'pending'
    and hold_expires_at < pg_catalog.now();

  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

create or replace function public.create_pending_booking(
  p_session_slug text,
  p_session_name text,
  p_price_paise integer,
  p_duration_minutes integer,
  p_buffer_minutes integer,
  p_start_at timestamptz,
  p_customer_name text,
  p_customer_email text,
  p_customer_phone text,
  p_customer_note text,
  p_timezone text,
  p_token_hash text
) returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_name text;
  v_email text;
  v_phone text;
  v_note text;
  v_end timestamptz;
  v_blocked timestamptz;
  v_hold timestamptz;
  v_id uuid;
  v_constraint text;
begin
  -- Expiry is committed with this transaction even when the insert is rejected.
  -- The insert has its own sub-block so a slot_taken error does not undo the sweep.
  perform public.expire_stale_pending_bookings();

  v_name := pg_catalog.btrim(p_customer_name);
  v_email := pg_catalog.lower(pg_catalog.btrim(p_customer_email));
  v_phone := pg_catalog.btrim(p_customer_phone);
  v_note := nullif(pg_catalog.btrim(p_customer_note), '');

  if p_price_paise is null or p_price_paise <= 0 then
    return pg_catalog.jsonb_build_object('ok', false, 'code', 'invalid_price');
  end if;

  if p_duration_minutes is null or p_duration_minutes < 15 or p_duration_minutes > 480 then
    return pg_catalog.jsonb_build_object('ok', false, 'code', 'invalid_duration');
  end if;

  if p_buffer_minutes is null or p_buffer_minutes < 0 or p_buffer_minutes > 120 then
    return pg_catalog.jsonb_build_object('ok', false, 'code', 'invalid_buffer');
  end if;

  if p_timezone is null or pg_catalog.btrim(p_timezone) = '' or not exists (
    select 1
    from pg_catalog.pg_timezone_names
    where name = p_timezone
  ) then
    return pg_catalog.jsonb_build_object('ok', false, 'code', 'invalid_timezone');
  end if;

  -- 120 days is a database backstop. The app enforces the real 60-day horizon.
  if p_start_at is null
    or p_start_at <= pg_catalog.now()
    or p_start_at > pg_catalog.now() + interval '120 days'
  then
    return pg_catalog.jsonb_build_object('ok', false, 'code', 'invalid_time');
  end if;

  if p_token_hash is null or p_token_hash !~ '^[0-9a-f]{64}$' then
    return pg_catalog.jsonb_build_object('ok', false, 'code', 'invalid_token');
  end if;

  if p_session_slug is null
    or p_session_slug !~ '^[a-z0-9-]{1,60}$'
    or p_session_name is null
    or pg_catalog.char_length(p_session_name) < 1
    or pg_catalog.char_length(p_session_name) > 120
    or v_name is null
    or pg_catalog.char_length(v_name) < 1
    or pg_catalog.char_length(v_name) > 100
    or v_email is null
    or pg_catalog.char_length(v_email) > 254
    or pg_catalog.strpos(v_email, '@') < 2
    or v_phone is null
    or pg_catalog.char_length(v_phone) < 7
    or pg_catalog.char_length(v_phone) > 20
    or (v_note is not null and pg_catalog.char_length(v_note) > 500)
  then
    return pg_catalog.jsonb_build_object('ok', false, 'code', 'invalid_input');
  end if;

  v_end := p_start_at + pg_catalog.make_interval(mins => p_duration_minutes);
  v_blocked := v_end + pg_catalog.make_interval(mins => p_buffer_minutes);
  v_hold := pg_catalog.now() + interval '15 minutes';

  begin
    insert into public.bookings (
      public_token_hash,
      session_slug,
      session_name,
      amount_paise,
      currency,
      duration_minutes,
      buffer_minutes,
      customer_name,
      customer_email,
      customer_phone,
      customer_note,
      starts_at,
      ends_at,
      blocked_until,
      timezone,
      booking_status,
      payment_status,
      hold_expires_at
    ) values (
      p_token_hash,
      p_session_slug,
      p_session_name,
      p_price_paise,
      'INR',
      p_duration_minutes,
      p_buffer_minutes,
      v_name,
      v_email,
      v_phone,
      v_note,
      p_start_at,
      v_end,
      v_blocked,
      p_timezone,
      'pending',
      'unpaid',
      v_hold
    )
    returning id into v_id;
  exception
    when exclusion_violation then
      return pg_catalog.jsonb_build_object('ok', false, 'code', 'slot_taken');
    when unique_violation then
      get stacked diagnostics v_constraint = constraint_name;
      if v_constraint = 'bookings_public_token_hash_key' then
        return pg_catalog.jsonb_build_object('ok', false, 'code', 'token_conflict');
      end if;
      return pg_catalog.jsonb_build_object('ok', false, 'code', 'invalid_input');
    when check_violation then
      return pg_catalog.jsonb_build_object('ok', false, 'code', 'invalid_input');
  end;

  -- price_paise / start_at / end_at are the jsonb contract from this phase.
  -- The stored columns are amount_paise / starts_at / ends_at.
  return pg_catalog.jsonb_build_object(
    'ok', true,
    'booking', pg_catalog.jsonb_build_object(
      'id', v_id,
      'session_name', p_session_name,
      'start_at', p_start_at,
      'end_at', v_end,
      'price_paise', p_price_paise,
      'currency', 'INR',
      'hold_expires_at', v_hold
    )
  );
end;
$$;

create or replace function public.attach_razorpay_order(
  p_booking_id uuid,
  p_order_id text
) returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v public.bookings%rowtype;
begin
  if p_booking_id is null then
    return pg_catalog.jsonb_build_object(
      'ok', false,
      'code', 'booking_not_found',
      'booking_id', null
    );
  end if;

  select *
  into v
  from public.bookings
  where id = p_booking_id
  for update;

  if not found then
    return pg_catalog.jsonb_build_object(
      'ok', false,
      'code', 'booking_not_found',
      'booking_id', null
    );
  end if;

  if v.booking_status <> 'pending' then
    return pg_catalog.jsonb_build_object(
      'ok', false,
      'code', 'not_pending',
      'booking_id', v.id
    );
  end if;

  if v.hold_expires_at is not null and v.hold_expires_at < pg_catalog.now() then
    return pg_catalog.jsonb_build_object(
      'ok', false,
      'code', 'hold_expired',
      'booking_id', v.id
    );
  end if;

  if p_order_id is null or pg_catalog.btrim(p_order_id) = '' then
    return pg_catalog.jsonb_build_object(
      'ok', false,
      'code', 'order_mismatch',
      'booking_id', v.id
    );
  end if;

  -- Same order id is a no-op, including when payment_status is already 'failed'
  -- after a declined attempt. A different id is rejected.
  if v.razorpay_order_id is not null and v.razorpay_order_id = p_order_id then
    return pg_catalog.jsonb_build_object(
      'ok', true,
      'code', 'already_attached',
      'booking_id', v.id
    );
  end if;

  if v.razorpay_order_id is not null and v.razorpay_order_id <> p_order_id then
    return pg_catalog.jsonb_build_object(
      'ok', false,
      'code', 'order_mismatch',
      'booking_id', v.id
    );
  end if;

  update public.bookings
  set
    razorpay_order_id = p_order_id,
    payment_status = 'pending'
  where id = v.id;

  return pg_catalog.jsonb_build_object(
    'ok', true,
    'code', 'attached',
    'booking_id', v.id
  );
exception
  when unique_violation then
    return pg_catalog.jsonb_build_object(
      'ok', false,
      'code', 'order_conflict',
      'booking_id', v.id
    );
end;
$$;

create or replace function public.confirm_booking_payment(
  p_razorpay_order_id text,
  p_razorpay_payment_id text,
  p_amount_paise integer,
  p_currency text
) returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v public.bookings%rowtype;
  v_lost boolean := false;
begin
  if p_razorpay_order_id is null
    or pg_catalog.btrim(p_razorpay_order_id) = ''
    or p_razorpay_payment_id is null
    or pg_catalog.btrim(p_razorpay_payment_id) = ''
  then
    return pg_catalog.jsonb_build_object(
      'ok', false,
      'code', 'order_not_found',
      'booking_id', null,
      'already_confirmed', false
    );
  end if;

  select *
  into v
  from public.bookings
  where razorpay_order_id = p_razorpay_order_id
  for update;

  -- 1. Unknown order.
  if not found then
    return pg_catalog.jsonb_build_object(
      'ok', false,
      'code', 'order_not_found',
      'booking_id', null,
      'already_confirmed', false
    );
  end if;

  -- 2. Already confirmed with this payment id. Change nothing.
  if v.booking_status = 'confirmed'
    and v.razorpay_payment_id = p_razorpay_payment_id
  then
    return pg_catalog.jsonb_build_object(
      'ok', true,
      'code', 'already_confirmed',
      'booking_id', v.id,
      'already_confirmed', true
    );
  end if;

  -- 3. Already confirmed with a different payment id. Do not overwrite the id.
  if v.booking_status = 'confirmed'
    and v.razorpay_payment_id is distinct from p_razorpay_payment_id
  then
    update public.bookings
    set
      needs_manual_review = true,
      review_reason = pg_catalog.left(
        'second payment received: ' || p_razorpay_payment_id,
        300
      )
    where id = v.id;

    return pg_catalog.jsonb_build_object(
      'ok', false,
      'code', 'duplicate_payment',
      'booking_id', v.id,
      'already_confirmed', false
    );
  end if;

  -- 4. Idempotent replay of a lost slot. Change nothing.
  if v.booking_status = 'failed'
    and v.payment_status = 'refund_pending'
    and v.razorpay_payment_id = p_razorpay_payment_id
  then
    return pg_catalog.jsonb_build_object(
      'ok', false,
      'code', 'paid_slot_lost',
      'booking_id', v.id,
      'already_confirmed', false
    );
  end if;

  -- 5. Amount or currency mismatch. Do not confirm and do not store the payment id.
  if p_amount_paise is distinct from v.amount_paise or p_currency is distinct from 'INR' then
    update public.bookings
    set
      needs_manual_review = true,
      review_reason = pg_catalog.left(
        'amount mismatch: expected '
          || v.amount_paise::text
          || ' INR, received '
          || coalesce(p_amount_paise::text, 'null')
          || ' '
          || coalesce(p_currency, 'null'),
        300
      )
    where id = v.id;

    return pg_catalog.jsonb_build_object(
      'ok', false,
      'code', 'amount_mismatch',
      'booking_id', v.id,
      'already_confirmed', false
    );
  end if;

  -- 6. Pending and the hold is still valid.
  if v.booking_status = 'pending'
    and (v.hold_expires_at is null or v.hold_expires_at >= pg_catalog.now())
  then
    update public.bookings
    set
      booking_status = 'confirmed',
      payment_status = 'paid',
      razorpay_payment_id = p_razorpay_payment_id,
      confirmed_at = pg_catalog.now(),
      calendar_sync_status = 'pending'
    where id = v.id;

    return pg_catalog.jsonb_build_object(
      'ok', true,
      'code', 'confirmed',
      'booking_id', v.id,
      'already_confirmed', false
    );
  end if;

  -- 7. Pending with an expired hold, or already swept as hold_expired.
  -- The inner block rolls back on its own if the exclusion constraint rejects
  -- the re-activation. The failure update must run after that block.
  if (
    v.booking_status = 'pending'
    and v.hold_expires_at is not null
    and v.hold_expires_at < pg_catalog.now()
  ) or (
    v.booking_status = 'cancelled'
    and v.cancel_reason = 'hold_expired'
  ) then
    begin
      update public.bookings
      set
        booking_status = 'confirmed',
        payment_status = 'paid',
        razorpay_payment_id = p_razorpay_payment_id,
        confirmed_at = pg_catalog.now(),
        calendar_sync_status = 'pending',
        cancel_reason = null,
        cancelled_at = null
      where id = v.id;
    exception
      when exclusion_violation then
        v_lost := true;
    end;

    if v_lost then
      update public.bookings
      set
        booking_status = 'failed',
        payment_status = 'refund_pending',
        razorpay_payment_id = p_razorpay_payment_id,
        needs_manual_review = true,
        review_reason = 'paid after hold expired and slot is taken; refund in Razorpay dashboard'
      where id = v.id;

      return pg_catalog.jsonb_build_object(
        'ok', false,
        'code', 'paid_slot_lost',
        'booking_id', v.id,
        'already_confirmed', false
      );
    end if;

    return pg_catalog.jsonb_build_object(
      'ok', true,
      'code', 'confirmed',
      'booking_id', v.id,
      'already_confirmed', false
    );
  end if;

  -- 8. Operator or customer cancellation, or any other state. Do not re-activate.
  update public.bookings
  set
    payment_status = 'refund_pending',
    razorpay_payment_id = p_razorpay_payment_id,
    needs_manual_review = true,
    review_reason = 'payment received after booking was cancelled or could not be confirmed; refund in Razorpay dashboard'
  where id = v.id;

  return pg_catalog.jsonb_build_object(
    'ok', false,
    'code', 'paid_but_cancelled',
    'booking_id', v.id,
    'already_confirmed', false
  );
exception
  when unique_violation then
    return pg_catalog.jsonb_build_object(
      'ok', false,
      'code', 'payment_id_conflict',
      'booking_id', v.id,
      'already_confirmed', false
    );
end;
$$;

create or replace function public.mark_payment_failed(
  p_razorpay_order_id text
) returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v public.bookings%rowtype;
begin
  if p_razorpay_order_id is null or pg_catalog.btrim(p_razorpay_order_id) = '' then
    return pg_catalog.jsonb_build_object('ok', false, 'code', 'order_not_found');
  end if;

  select *
  into v
  from public.bookings
  where razorpay_order_id = p_razorpay_order_id
  for update;

  if not found then
    return pg_catalog.jsonb_build_object('ok', false, 'code', 'order_not_found');
  end if;

  -- Only pending -> failed. The booking stays pending so the customer can retry
  -- until the hold expires. Confirmed, failed, and cancelled rows are untouched.
  if v.booking_status = 'pending' and v.payment_status = 'pending' then
    update public.bookings
    set payment_status = 'failed'
    where id = v.id;

    return pg_catalog.jsonb_build_object('ok', true, 'code', 'marked_failed');
  end if;

  return pg_catalog.jsonb_build_object('ok', true, 'code', 'unchanged');
end;
$$;

create or replace function public.record_razorpay_event(
  p_event_id text,
  p_event_type text,
  p_order_id text,
  p_payment_id text
) returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_count bigint;
begin
  if p_event_id is null
    or pg_catalog.btrim(p_event_id) = ''
    or p_event_type is null
    or pg_catalog.btrim(p_event_type) = ''
  then
    return false;
  end if;

  insert into public.payment_events (
    razorpay_event_id,
    event_type,
    razorpay_order_id,
    razorpay_payment_id
  ) values (
    p_event_id,
    p_event_type,
    p_order_id,
    p_payment_id
  )
  on conflict (razorpay_event_id) do nothing;

  get diagnostics v_count = row_count;
  return v_count > 0;
end;
$$;

create or replace function public.mark_razorpay_event_processed(
  p_event_id text
) returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_count bigint;
begin
  if p_event_id is null or pg_catalog.btrim(p_event_id) = '' then
    return false;
  end if;

  update public.payment_events
  set processed_at = pg_catalog.now()
  where razorpay_event_id = p_event_id
    and processed_at is null;

  get diagnostics v_count = row_count;
  return v_count > 0;
end;
$$;

create or replace function public.mark_calendar_synced(
  p_booking_id uuid,
  p_google_event_id text
) returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v public.bookings%rowtype;
begin
  if p_booking_id is null then
    return pg_catalog.jsonb_build_object('ok', false, 'code', 'booking_not_found');
  end if;

  if p_google_event_id is null or pg_catalog.btrim(p_google_event_id) = '' then
    return pg_catalog.jsonb_build_object('ok', false, 'code', 'invalid_input');
  end if;

  select *
  into v
  from public.bookings
  where id = p_booking_id
  for update;

  if not found then
    return pg_catalog.jsonb_build_object('ok', false, 'code', 'booking_not_found');
  end if;

  -- A second call with the same event id stores the same result.
  -- A different id is not written over the first one.
  if v.google_event_id is not null and v.google_event_id <> p_google_event_id then
    return pg_catalog.jsonb_build_object('ok', false, 'code', 'event_id_conflict');
  end if;

  update public.bookings
  set
    calendar_sync_status = 'created',
    google_event_id = p_google_event_id,
    calendar_error = null
  where id = v.id;

  return pg_catalog.jsonb_build_object('ok', true, 'code', 'synced');
exception
  when unique_violation then
    return pg_catalog.jsonb_build_object('ok', false, 'code', 'event_id_conflict');
end;
$$;

create or replace function public.mark_calendar_failed(
  p_booking_id uuid,
  p_error text
) returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v public.bookings%rowtype;
  v_attempts integer;
  v_review boolean;
begin
  if p_booking_id is null then
    return pg_catalog.jsonb_build_object(
      'ok', false,
      'code', 'booking_not_found',
      'calendar_attempts', null,
      'needs_manual_review', null
    );
  end if;

  select *
  into v
  from public.bookings
  where id = p_booking_id
  for update;

  if not found then
    return pg_catalog.jsonb_build_object(
      'ok', false,
      'code', 'booking_not_found',
      'calendar_attempts', null,
      'needs_manual_review', null
    );
  end if;

  v_attempts := v.calendar_attempts + 1;
  v_review := v.needs_manual_review or v_attempts >= 3;

  -- Does not change booking_status or payment_status.
  -- review_reason is set only when this failure is what raises the flag,
  -- so an earlier review reason is kept.
  update public.bookings
  set
    calendar_attempts = v_attempts,
    calendar_sync_status = 'failed',
    calendar_error = case
      when p_error is null then null
      else pg_catalog.left(p_error, 300)
    end,
    needs_manual_review = v_review,
    review_reason = case
      when v_attempts >= 3
        and (v.needs_manual_review = false or v.review_reason is null)
        then 'calendar event not created'
      else v.review_reason
    end
  where id = v.id;

  return pg_catalog.jsonb_build_object(
    'ok', true,
    'code', 'recorded',
    'calendar_attempts', v_attempts,
    'needs_manual_review', v_review
  );
end;
$$;

-- VOLATILE because it writes through expire_stale_pending_bookings.
create or replace function public.get_booked_ranges(
  p_from timestamptz,
  p_to timestamptz
) returns table (start_at timestamptz, blocked_until timestamptz)
language plpgsql
volatile
security definer
set search_path = ''
as $$
begin
  perform public.expire_stale_pending_bookings();

  if p_from is null or p_to is null or p_from >= p_to then
    return;
  end if;

  -- Output column start_at is the phase contract. The table column is starts_at.
  return query
  select b.starts_at, b.blocked_until
  from public.bookings b
  where b.booking_status in ('pending', 'confirmed')
    and tstzrange(b.starts_at, b.blocked_until, '[)')
      && tstzrange(p_from, p_to, '[)')
  order by b.starts_at;
end;
$$;

create or replace function public.get_booking_by_token_hash(
  p_token_hash text
) returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v public.bookings%rowtype;
begin
  if p_token_hash is null or p_token_hash !~ '^[0-9a-f]{64}$' then
    return pg_catalog.jsonb_build_object('ok', false, 'code', 'not_found');
  end if;

  select *
  into v
  from public.bookings
  where public_token_hash = p_token_hash;

  if not found then
    return pg_catalog.jsonb_build_object('ok', false, 'code', 'not_found');
  end if;

  -- No email, phone, or note. The route decides what the browser may see.
  return pg_catalog.jsonb_build_object(
    'ok', true,
    'booking', pg_catalog.jsonb_build_object(
      'booking_status', v.booking_status,
      'payment_status', v.payment_status,
      'session_name', v.session_name,
      'start_at', v.starts_at,
      'end_at', v.ends_at,
      'timezone', v.timezone,
      'customer_name', v.customer_name,
      'razorpay_order_id', v.razorpay_order_id,
      'id', v.id,
      'hold_expires_at', v.hold_expires_at,
      'calendar_sync_status', v.calendar_sync_status
    )
  );
end;
$$;

create or replace function public.check_rate_limit(
  p_key_hash text,
  p_limit integer,
  p_window_seconds integer
) returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_window timestamptz;
  v_count integer;
  v_allowed boolean;
  v_remaining integer;
  v_retry integer;
begin
  if p_limit is null
    or p_limit <= 0
    or p_window_seconds is null
    or p_window_seconds <= 0
    or p_key_hash is null
    or pg_catalog.char_length(p_key_hash) < 1
    or pg_catalog.char_length(p_key_hash) > 128
  then
    return pg_catalog.jsonb_build_object(
      'allowed', false,
      'remaining', 0,
      'retry_after_seconds', 0
    );
  end if;

  v_window := pg_catalog.to_timestamp(
    (
      floor(extract(epoch from pg_catalog.now()) / p_window_seconds)
      * p_window_seconds
    )::double precision
  );

  insert into public.rate_limits (key_hash, window_start, count)
  values (p_key_hash, v_window, 1)
  on conflict (key_hash, window_start)
  do update set count = public.rate_limits.count + 1
  returning count into v_count;

  v_allowed := v_count <= p_limit;
  v_remaining := greatest(p_limit - v_count, 0);

  if v_allowed then
    v_retry := 0;
  else
    v_retry := ceil(
      extract(
        epoch from (
          v_window
          + pg_catalog.make_interval(secs => p_window_seconds)
          - pg_catalog.now()
        )
      )
    )::integer;
    if v_retry < 1 then
      v_retry := 1;
    end if;
  end if;

  -- About 1% of calls drop windows older than a day. A deadlock here must not
  -- undo the counter increment, so the delete sits in its own sub-block.
  if pg_catalog.random() < 0.01 then
    begin
      delete from public.rate_limits
      where window_start < pg_catalog.now() - interval '1 day';
    exception
      when deadlock_detected then
        null;
    end;
  end if;

  return pg_catalog.jsonb_build_object(
    'allowed', v_allowed,
    'remaining', v_remaining,
    'retry_after_seconds', v_retry
  );
end;
$$;

create or replace function public.purge_old_rate_limits()
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_count bigint;
begin
  delete from public.rate_limits
  where window_start < pg_catalog.now() - interval '1 day';

  get diagnostics v_count = row_count;
  return v_count;
end;
$$;
