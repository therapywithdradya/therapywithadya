-- Manual verification. Run the whole file in one go, after 0001, 0002, and 0003.
-- It opens a transaction and ends with ROLLBACK, so it does not keep bookings.
-- Expected results are in the comments above each check.
-- Success ends with the notice: VERIFICATION PASSED.
-- A warning VERIFICATION FAILED lists the checks that did not match. The
-- rollback still runs.
--
-- now() is frozen for this transaction, so a second write of confirmed_at
-- would not change the timestamp. Checks that a confirm was a no-op compare ctid.

begin;

do $verify$
declare
  v_failures text[] := array[]::text[];
  v_seq integer := 0;
  v_hash text;
  v_hash_1 text;
  v_hash_8 text;
  v_hash_9 text;
  v_hash_14a text;
  v_hash_14b text;
  v_start timestamptz;
  v_t1 timestamptz;
  v_result jsonb;
  v_id uuid;
  v_id_11 uuid;
  v_id_14_free uuid;
  v_id_14_lost uuid;
  v_id_16 uuid;
  v_id_18 uuid;
  v_ends timestamptz;
  v_blocked timestamptz;
  v_hold timestamptz;
  v_email text;
  v_note text;
  v_status text;
  v_payment text;
  v_reason text;
  v_payment_id text;
  v_review boolean;
  v_attempts integer;
  v_calendar text;
  v_event text;
  v_ctid tid;
  v_ctid_after tid;
  v_confirmed_at timestamptz;
  v_confirmed_at_after timestamptz;
  v_count bigint;
  v_allowed boolean;
  v_retry integer;
  v_inserted boolean;
  v_range_count bigint;
  v_names text[];
  v_table text;
  v_role text;
  v_denied boolean;
  v_visible bigint;
  v_definer boolean;
begin
  -- Expected: every booking function except set_updated_at is security definer.
  select bool_and(p.prosecdef)
  into v_definer
  from pg_catalog.pg_proc p
  join pg_catalog.pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public'
    and p.proname in (
      'expire_stale_pending_bookings',
      'create_pending_booking',
      'attach_razorpay_order',
      'confirm_booking_payment',
      'mark_payment_failed',
      'record_razorpay_event',
      'mark_razorpay_event_processed',
      'mark_calendar_synced',
      'mark_calendar_failed',
      'get_booked_ranges',
      'get_booking_by_token_hash',
      'check_rate_limit',
      'purge_old_rate_limits'
    );

  if coalesce(v_definer, false) is not true then
    v_failures := v_failures || 'security definer flag missing';
    raise notice 'FAIL security definer flags';
  else
    raise notice 'PASS security definer flags';
  end if;

  if exists (
    select 1
    from pg_catalog.pg_proc p
    join pg_catalog.pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname = 'set_updated_at'
      and p.prosecdef
  ) then
    v_failures := v_failures || 'set_updated_at should not be security definer';
    raise notice 'FAIL set_updated_at security definer';
  end if;

  v_t1 := date_trunc('hour', pg_catalog.now()) + interval '10 days';

  -- 1. Expected: ok true, a pending hold, and no token or customer fields in the jsonb.
  v_seq := v_seq + 1;
  v_hash := lpad(to_hex(v_seq), 64, '0');
  v_hash_1 := v_hash;
  v_result := public.create_pending_booking(
    'session-a-60',
    '[DUMMY] Session A (60 min)',
    50000,
    60,
    15,
    v_t1,
    'Test Person',
    'person@example.com',
    '9999999999',
    null,
    'Asia/Kolkata',
    v_hash
  );

  if coalesce((v_result ->> 'ok')::boolean, false) is not true
    or v_result -> 'booking' ->> 'price_paise' is distinct from '50000'
    or v_result::text like '%customer_email%'
    or v_result::text like '%public_token_hash%'
  then
    v_failures := v_failures || '1 free slot';
    raise notice 'FAIL 1 code=%', v_result ->> 'code';
  else
    v_id := (v_result -> 'booking' ->> 'id')::uuid;
    select b.ends_at, b.blocked_until, b.hold_expires_at
    into v_ends, v_blocked, v_hold
    from public.bookings b
    where b.id = v_id;

    if v_ends is distinct from v_t1 + interval '60 minutes'
      or v_blocked is distinct from v_ends + interval '15 minutes'
      or v_hold is distinct from pg_catalog.now() + interval '15 minutes'
    then
      v_failures := v_failures || '1 stored end, buffer, or hold';
      raise notice 'FAIL 1 stored times';
    else
      raise notice 'PASS 1 free slot';
    end if;
  end if;

  -- 2. Expected: slot_taken.
  v_seq := v_seq + 1;
  v_result := public.create_pending_booking(
    'session-a-60', '[DUMMY] Session A (60 min)', 50000, 60, 15, v_t1,
    'Test Person', 'person@example.com', '9999999999', null, 'Asia/Kolkata',
    lpad(to_hex(v_seq), 64, '0')
  );
  if v_result ->> 'code' is distinct from 'slot_taken' then
    v_failures := v_failures || '2 same slot';
    raise notice 'FAIL 2 code=%', v_result ->> 'code';
  else
    raise notice 'PASS 2 same slot';
  end if;

  -- 3. Expected: slot_taken for a start 20 minutes into the first booking.
  v_seq := v_seq + 1;
  v_result := public.create_pending_booking(
    'session-a-60', '[DUMMY] Session A (60 min)', 50000, 60, 15, v_t1 + interval '20 minutes',
    'Test Person', 'person@example.com', '9999999999', null, 'Asia/Kolkata',
    lpad(to_hex(v_seq), 64, '0')
  );
  if v_result ->> 'code' is distinct from 'slot_taken' then
    v_failures := v_failures || '3 overlap 20 minutes';
    raise notice 'FAIL 3 code=%', v_result ->> 'code';
  else
    raise notice 'PASS 3 overlap 20 minutes';
  end if;

  -- 4. Expected: slot_taken inside the buffer; ok exactly at blocked_until.
  v_seq := v_seq + 1;
  v_result := public.create_pending_booking(
    'session-a-60', '[DUMMY] Session A (60 min)', 50000, 60, 15, v_t1 + interval '70 minutes',
    'Test Person', 'person@example.com', '9999999999', null, 'Asia/Kolkata',
    lpad(to_hex(v_seq), 64, '0')
  );
  if v_result ->> 'code' is distinct from 'slot_taken' then
    v_failures := v_failures || '4 inside buffer';
    raise notice 'FAIL 4 buffer code=%', v_result ->> 'code';
  else
    raise notice 'PASS 4 inside buffer';
  end if;

  v_seq := v_seq + 1;
  v_result := public.create_pending_booking(
    'session-a-60', '[DUMMY] Session A (60 min)', 50000, 60, 15, v_t1 + interval '75 minutes',
    'Test Person', 'person@example.com', '9999999999', null, 'Asia/Kolkata',
    lpad(to_hex(v_seq), 64, '0')
  );
  if coalesce((v_result ->> 'ok')::boolean, false) is not true then
    v_failures := v_failures || '4 exact blocked_until';
    raise notice 'FAIL 4 boundary code=%', v_result ->> 'code';
  else
    raise notice 'PASS 4 exact blocked_until';
  end if;

  -- 5. Expected: invalid_time for a past start and for a start beyond 120 days.
  v_seq := v_seq + 1;
  v_result := public.create_pending_booking(
    'session-a-60', '[DUMMY] Session A (60 min)', 50000, 60, 15, pg_catalog.now() - interval '1 hour',
    'Test Person', 'person@example.com', '9999999999', null, 'Asia/Kolkata',
    lpad(to_hex(v_seq), 64, '0')
  );
  if v_result ->> 'code' is distinct from 'invalid_time' then
    v_failures := v_failures || '5 past start';
    raise notice 'FAIL 5 past code=%', v_result ->> 'code';
  else
    raise notice 'PASS 5 past start';
  end if;

  v_seq := v_seq + 1;
  v_result := public.create_pending_booking(
    'session-a-60', '[DUMMY] Session A (60 min)', 50000, 60, 15, pg_catalog.now() + interval '121 days',
    'Test Person', 'person@example.com', '9999999999', null, 'Asia/Kolkata',
    lpad(to_hex(v_seq), 64, '0')
  );
  if v_result ->> 'code' is distinct from 'invalid_time' then
    v_failures := v_failures || '5 beyond 120 days';
    raise notice 'FAIL 5 horizon code=%', v_result ->> 'code';
  else
    raise notice 'PASS 5 beyond 120 days';
  end if;

  -- 6. Expected: invalid_price, invalid_duration, invalid_timezone.
  -- Also invalid_buffer for a negative buffer (function contract).
  v_seq := v_seq + 1;
  v_hash := lpad(to_hex(v_seq), 64, '0');
  v_start := v_t1 + interval '4 days';
  v_result := public.create_pending_booking(
    'session-a-60', '[DUMMY] Session A (60 min)', 0, 60, 15, v_start,
    'Test Person', 'person@example.com', '9999999999', null, 'Asia/Kolkata', v_hash
  );
  if v_result ->> 'code' is distinct from 'invalid_price' then
    v_failures := v_failures || '6 price 0';
    raise notice 'FAIL 6 zero price code=%', v_result ->> 'code';
  else
    raise notice 'PASS 6 price 0';
  end if;

  v_result := public.create_pending_booking(
    'session-a-60', '[DUMMY] Session A (60 min)', -1, 60, 15, v_start,
    'Test Person', 'person@example.com', '9999999999', null, 'Asia/Kolkata', v_hash
  );
  if v_result ->> 'code' is distinct from 'invalid_price' then
    v_failures := v_failures || '6 negative price';
    raise notice 'FAIL 6 negative price code=%', v_result ->> 'code';
  else
    raise notice 'PASS 6 negative price';
  end if;

  v_result := public.create_pending_booking(
    'session-a-60', '[DUMMY] Session A (60 min)', 50000, 10, 15, v_start,
    'Test Person', 'person@example.com', '9999999999', null, 'Asia/Kolkata', v_hash
  );
  if v_result ->> 'code' is distinct from 'invalid_duration' then
    v_failures := v_failures || '6 bad duration';
    raise notice 'FAIL 6 duration code=%', v_result ->> 'code';
  else
    raise notice 'PASS 6 bad duration';
  end if;

  v_result := public.create_pending_booking(
    'session-a-60', '[DUMMY] Session A (60 min)', 50000, 60, -1, v_start,
    'Test Person', 'person@example.com', '9999999999', null, 'Asia/Kolkata', v_hash
  );
  if v_result ->> 'code' is distinct from 'invalid_buffer' then
    v_failures := v_failures || '6 bad buffer';
    raise notice 'FAIL 6 buffer code=%', v_result ->> 'code';
  else
    raise notice 'PASS 6 bad buffer';
  end if;

  v_result := public.create_pending_booking(
    'session-a-60', '[DUMMY] Session A (60 min)', 50000, 60, 15, v_start,
    'Test Person', 'person@example.com', '9999999999', null, 'Not/AZone', v_hash
  );
  if v_result ->> 'code' is distinct from 'invalid_timezone' then
    v_failures := v_failures || '6 bad timezone';
    raise notice 'FAIL 6 timezone code=%', v_result ->> 'code';
  else
    raise notice 'PASS 6 bad timezone';
  end if;

  -- 7. Expected: token_conflict, then invalid_token.
  v_seq := v_seq + 1;
  v_hash := lpad(to_hex(v_seq), 64, '0');
  v_result := public.create_pending_booking(
    'session-a-60', '[DUMMY] Session A (60 min)', 50000, 60, 15, v_t1 + interval '6 days',
    'Test Person', 'person@example.com', '9999999999', null, 'Asia/Kolkata', v_hash
  );
  if coalesce((v_result ->> 'ok')::boolean, false) is not true then
    v_failures := v_failures || '7 setup';
    raise notice 'FAIL 7 setup code=%', v_result ->> 'code';
  end if;

  v_seq := v_seq + 1;
  v_result := public.create_pending_booking(
    'session-a-60', '[DUMMY] Session A (60 min)', 50000, 60, 15, v_t1 + interval '8 days',
    'Test Person', 'person@example.com', '9999999999', null, 'Asia/Kolkata', v_hash
  );
  if v_result ->> 'code' is distinct from 'token_conflict' then
    v_failures := v_failures || '7 duplicate token';
    raise notice 'FAIL 7 token_conflict code=%', v_result ->> 'code';
  else
    raise notice 'PASS 7 duplicate token';
  end if;

  v_result := public.create_pending_booking(
    'session-a-60', '[DUMMY] Session A (60 min)', 50000, 60, 15, v_t1 + interval '8 days',
    'Test Person', 'person@example.com', '9999999999', null, 'Asia/Kolkata', 'abc'
  );
  if v_result ->> 'code' is distinct from 'invalid_token' then
    v_failures := v_failures || '7 malformed token';
    raise notice 'FAIL 7 invalid_token code=%', v_result ->> 'code';
  else
    raise notice 'PASS 7 malformed token';
  end if;

  -- 8. Expected: stored email is foo@example.com. Empty note is stored as null.
  v_seq := v_seq + 1;
  v_hash_8 := lpad(to_hex(v_seq), 64, '0');
  v_result := public.create_pending_booking(
    'session-a-60', '[DUMMY] Session A (60 min)', 50000, 60, 15, v_t1 + interval '12 days',
    '  Test Person  ',
    'Foo@Example.COM ',
    '9999999999',
    '   ',
    'Asia/Kolkata',
    v_hash_8
  );
  select b.customer_email, b.customer_note
  into v_email, v_note
  from public.bookings b
  where b.public_token_hash = v_hash_8;

  if v_email is distinct from 'foo@example.com' or v_note is not null then
    v_failures := v_failures || '8 email normalization';
    raise notice 'FAIL 8 email or note';
  else
    raise notice 'PASS 8 email normalization';
  end if;

  v_result := public.get_booking_by_token_hash(v_hash_8);
  if coalesce((v_result ->> 'ok')::boolean, false) is not true
    or v_result::text like '%customer_email%'
    or v_result::text like '%customer_phone%'
    or v_result::text like '%customer_note%'
  then
    v_failures := v_failures || '8 token lookup leaks contact fields';
    raise notice 'FAIL 8 token lookup shape';
  else
    raise notice 'PASS 8 token lookup shape';
  end if;

  -- 9. Expected: after backdating the hold, get_booked_ranges frees the slot,
  -- a new booking succeeds, and the old row is cancelled with hold_expired.
  v_seq := v_seq + 1;
  v_hash_9 := lpad(to_hex(v_seq), 64, '0');
  v_start := v_t1 + interval '16 days';
  v_result := public.create_pending_booking(
    'session-a-60', '[DUMMY] Session A (60 min)', 50000, 60, 15, v_start,
    'Test Person', 'person@example.com', '9999999999', null, 'Asia/Kolkata', v_hash_9
  );
  v_id := (v_result -> 'booking' ->> 'id')::uuid;
  update public.bookings
  set hold_expires_at = pg_catalog.now() - interval '1 minute'
  where id = v_id;

  select count(*)
  into v_range_count
  from public.get_booked_ranges(v_start - interval '1 hour', v_start + interval '2 hours') r
  where r.start_at = v_start;

  v_seq := v_seq + 1;
  v_result := public.create_pending_booking(
    'session-a-60', '[DUMMY] Session A (60 min)', 50000, 60, 15, v_start,
    'Test Person', 'person@example.com', '9999999999', null, 'Asia/Kolkata',
    lpad(to_hex(v_seq), 64, '0')
  );

  select b.booking_status, b.cancel_reason
  into v_status, v_reason
  from public.bookings b
  where b.id = v_id;

  if v_range_count <> 0
    or coalesce((v_result ->> 'ok')::boolean, false) is not true
    or v_status is distinct from 'cancelled'
    or v_reason is distinct from 'hold_expired'
  then
    v_failures := v_failures || '9 hold expiry';
    raise notice 'FAIL 9 ranges=% new=% status=%', v_range_count, v_result ->> 'code', v_status;
  else
    raise notice 'PASS 9 hold expiry';
  end if;

  -- 10. Expected: same order id is idempotent; a different order id is order_mismatch.
  v_seq := v_seq + 1;
  v_result := public.create_pending_booking(
    'session-a-60', '[DUMMY] Session A (60 min)', 50000, 60, 15, v_t1 + interval '20 days',
    'Test Person', 'person@example.com', '9999999999', null, 'Asia/Kolkata',
    lpad(to_hex(v_seq), 64, '0')
  );
  v_id := (v_result -> 'booking' ->> 'id')::uuid;
  v_result := public.attach_razorpay_order(v_id, 'order_verify_10');
  if v_result ->> 'code' is distinct from 'attached' then
    v_failures := v_failures || '10 first attach';
    raise notice 'FAIL 10 first code=%', v_result ->> 'code';
  end if;
  v_result := public.attach_razorpay_order(v_id, 'order_verify_10');
  if coalesce((v_result ->> 'ok')::boolean, false) is not true
    or v_result ->> 'code' is distinct from 'already_attached'
  then
    v_failures := v_failures || '10 idempotent attach';
    raise notice 'FAIL 10 second code=%', v_result ->> 'code';
  else
    raise notice 'PASS 10 idempotent attach';
  end if;
  v_result := public.attach_razorpay_order(v_id, 'order_verify_10_other');
  if v_result ->> 'code' is distinct from 'order_mismatch' then
    v_failures := v_failures || '10 order mismatch';
    raise notice 'FAIL 10 mismatch code=%', v_result ->> 'code';
  else
    raise notice 'PASS 10 order mismatch';
  end if;

  -- 11. Expected: second confirm is already_confirmed and confirmed_at is unchanged.
  -- ctid must also stay the same, because now() would not show a second write.
  v_seq := v_seq + 1;
  v_result := public.create_pending_booking(
    'session-a-60', '[DUMMY] Session A (60 min)', 50000, 60, 15, v_t1 + interval '24 days',
    'Test Person', 'person@example.com', '9999999999', null, 'Asia/Kolkata',
    lpad(to_hex(v_seq), 64, '0')
  );
  v_id_11 := (v_result -> 'booking' ->> 'id')::uuid;
  perform public.attach_razorpay_order(v_id_11, 'order_verify_11');
  v_result := public.confirm_booking_payment('order_verify_11', 'pay_verify_11', 50000, 'INR');
  select b.ctid, b.confirmed_at
  into v_ctid, v_confirmed_at
  from public.bookings b
  where b.id = v_id_11;
  v_result := public.confirm_booking_payment('order_verify_11', 'pay_verify_11', 50000, 'INR');
  select b.ctid, b.confirmed_at
  into v_ctid_after, v_confirmed_at_after
  from public.bookings b
  where b.id = v_id_11;
  if v_result ->> 'code' is distinct from 'already_confirmed'
    or coalesce((v_result ->> 'already_confirmed')::boolean, false) is not true
    or v_confirmed_at is distinct from v_confirmed_at_after
    or v_ctid is distinct from v_ctid_after
  then
    v_failures := v_failures || '11 already confirmed';
    raise notice 'FAIL 11 code=%', v_result ->> 'code';
  else
    raise notice 'PASS 11 already confirmed';
  end if;

  -- 12. Expected: duplicate_payment, needs_manual_review, original payment id kept.
  v_result := public.confirm_booking_payment('order_verify_11', 'pay_verify_11_other', 50000, 'INR');
  select b.needs_manual_review, b.razorpay_payment_id, b.booking_status
  into v_review, v_payment_id, v_status
  from public.bookings b
  where b.id = v_id_11;
  if v_result ->> 'code' is distinct from 'duplicate_payment'
    or v_review is not true
    or v_payment_id is distinct from 'pay_verify_11'
    or v_status is distinct from 'confirmed'
  then
    v_failures := v_failures || '12 duplicate payment';
    raise notice 'FAIL 12 code=%', v_result ->> 'code';
  else
    raise notice 'PASS 12 duplicate payment';
  end if;

  -- 13. Expected: amount_mismatch, booking stays pending, review flag set.
  v_seq := v_seq + 1;
  v_result := public.create_pending_booking(
    'session-a-60', '[DUMMY] Session A (60 min)', 50000, 60, 15, v_t1 + interval '28 days',
    'Test Person', 'person@example.com', '9999999999', null, 'Asia/Kolkata',
    lpad(to_hex(v_seq), 64, '0')
  );
  v_id := (v_result -> 'booking' ->> 'id')::uuid;
  perform public.attach_razorpay_order(v_id, 'order_verify_13');
  v_result := public.confirm_booking_payment('order_verify_13', 'pay_verify_13', 1, 'INR');
  select b.booking_status, b.payment_status, b.needs_manual_review, b.review_reason, b.razorpay_payment_id
  into v_status, v_payment, v_review, v_reason, v_payment_id
  from public.bookings b
  where b.id = v_id;
  if v_result ->> 'code' is distinct from 'amount_mismatch'
    or v_status is distinct from 'pending'
    or v_payment is distinct from 'pending'
    or v_review is not true
    or v_payment_id is not null
    or coalesce(v_reason, '') not like '%50000%'
    or coalesce(v_reason, '') not like '%1%'
  then
    v_failures := v_failures || '13 amount mismatch';
    raise notice 'FAIL 13 code=%', v_result ->> 'code';
  else
    raise notice 'PASS 13 amount mismatch';
  end if;

  -- 14a. Expected: paid after expiry with the slot free becomes confirmed.
  v_seq := v_seq + 1;
  v_hash_14a := lpad(to_hex(v_seq), 64, '0');
  v_result := public.create_pending_booking(
    'session-a-60', '[DUMMY] Session A (60 min)', 50000, 60, 15, v_t1 + interval '32 days',
    'Test Person', 'person@example.com', '9999999999', null, 'Asia/Kolkata', v_hash_14a
  );
  v_id_14_free := (v_result -> 'booking' ->> 'id')::uuid;
  perform public.attach_razorpay_order(v_id_14_free, 'order_verify_14_free');
  update public.bookings
  set hold_expires_at = pg_catalog.now() - interval '1 minute'
  where id = v_id_14_free;
  v_result := public.confirm_booking_payment('order_verify_14_free', 'pay_verify_14_free', 50000, 'INR');
  select b.booking_status, b.payment_status
  into v_status, v_payment
  from public.bookings b
  where b.id = v_id_14_free;
  if v_result ->> 'code' is distinct from 'confirmed'
    or v_status is distinct from 'confirmed'
    or v_payment is distinct from 'paid'
  then
    v_failures := v_failures || '14 late payment slot free';
    raise notice 'FAIL 14 free code=% status=%', v_result ->> 'code', v_status;
  else
    raise notice 'PASS 14 late payment slot free';
  end if;

  -- 14b. Expected: paid after expiry with the slot taken is paid_slot_lost.
  -- A second confirm with the same ids returns paid_slot_lost and does not write.
  v_seq := v_seq + 1;
  v_hash_14b := lpad(to_hex(v_seq), 64, '0');
  v_start := v_t1 + interval '36 days';
  v_result := public.create_pending_booking(
    'session-a-60', '[DUMMY] Session A (60 min)', 50000, 60, 15, v_start,
    'Test Person', 'person@example.com', '9999999999', null, 'Asia/Kolkata', v_hash_14b
  );
  v_id_14_lost := (v_result -> 'booking' ->> 'id')::uuid;
  perform public.attach_razorpay_order(v_id_14_lost, 'order_verify_14_lost');
  update public.bookings
  set hold_expires_at = pg_catalog.now() - interval '1 minute'
  where id = v_id_14_lost;
  perform public.expire_stale_pending_bookings();
  v_seq := v_seq + 1;
  v_result := public.create_pending_booking(
    'session-a-60', '[DUMMY] Session A (60 min)', 50000, 60, 15, v_start,
    'Test Person', 'person@example.com', '9999999999', null, 'Asia/Kolkata',
    lpad(to_hex(v_seq), 64, '0')
  );
  if coalesce((v_result ->> 'ok')::boolean, false) is not true then
    v_failures := v_failures || '14 replacement booking';
    raise notice 'FAIL 14 replacement code=%', v_result ->> 'code';
  end if;
  v_result := public.confirm_booking_payment('order_verify_14_lost', 'pay_verify_14_lost', 50000, 'INR');
  select b.ctid, b.booking_status, b.payment_status, b.needs_manual_review, b.razorpay_payment_id
  into v_ctid, v_status, v_payment, v_review, v_payment_id
  from public.bookings b
  where b.id = v_id_14_lost;
  if v_result ->> 'code' is distinct from 'paid_slot_lost'
    or v_status is distinct from 'failed'
    or v_payment is distinct from 'refund_pending'
    or v_review is not true
    or v_payment_id is distinct from 'pay_verify_14_lost'
  then
    v_failures := v_failures || '14 paid slot lost';
    raise notice 'FAIL 14 lost code=% status=% payment=%', v_result ->> 'code', v_status, v_payment;
  else
    raise notice 'PASS 14 paid slot lost';
  end if;
  v_result := public.confirm_booking_payment('order_verify_14_lost', 'pay_verify_14_lost', 50000, 'INR');
  select b.ctid
  into v_ctid_after
  from public.bookings b
  where b.id = v_id_14_lost;
  if v_result ->> 'code' is distinct from 'paid_slot_lost' or v_ctid is distinct from v_ctid_after then
    v_failures := v_failures || '14 paid slot lost replay';
    raise notice 'FAIL 14 replay code=%', v_result ->> 'code';
  else
    raise notice 'PASS 14 paid slot lost replay';
  end if;

  -- 15. Expected: operator-cancelled booking is not re-activated. Code paid_but_cancelled.
  v_seq := v_seq + 1;
  v_result := public.create_pending_booking(
    'session-a-60', '[DUMMY] Session A (60 min)', 50000, 60, 15, v_t1 + interval '40 days',
    'Test Person', 'person@example.com', '9999999999', null, 'Asia/Kolkata',
    lpad(to_hex(v_seq), 64, '0')
  );
  v_id := (v_result -> 'booking' ->> 'id')::uuid;
  perform public.attach_razorpay_order(v_id, 'order_verify_15');
  update public.bookings
  set
    booking_status = 'cancelled',
    cancel_reason = 'operator',
    cancelled_at = pg_catalog.now()
  where id = v_id;
  v_result := public.confirm_booking_payment('order_verify_15', 'pay_verify_15', 50000, 'INR');
  select b.booking_status, b.payment_status, b.needs_manual_review
  into v_status, v_payment, v_review
  from public.bookings b
  where b.id = v_id;
  if v_result ->> 'code' is distinct from 'paid_but_cancelled'
    or v_status is distinct from 'cancelled'
    or v_payment is distinct from 'refund_pending'
    or v_review is not true
  then
    v_failures := v_failures || '15 paid but cancelled';
    raise notice 'FAIL 15 code=% status=%', v_result ->> 'code', v_status;
  else
    raise notice 'PASS 15 paid but cancelled';
  end if;

  -- 16. Expected: mark_payment_failed sets failed on a pending booking, and a
  -- later confirm still confirms. On a confirmed booking it changes nothing.
  v_seq := v_seq + 1;
  v_result := public.create_pending_booking(
    'session-a-60', '[DUMMY] Session A (60 min)', 50000, 60, 15, v_t1 + interval '44 days',
    'Test Person', 'person@example.com', '9999999999', null, 'Asia/Kolkata',
    lpad(to_hex(v_seq), 64, '0')
  );
  v_id_16 := (v_result -> 'booking' ->> 'id')::uuid;
  perform public.attach_razorpay_order(v_id_16, 'order_verify_16');
  v_result := public.mark_payment_failed('order_verify_16');
  select b.booking_status, b.payment_status
  into v_status, v_payment
  from public.bookings b
  where b.id = v_id_16;
  if v_result ->> 'code' is distinct from 'marked_failed'
    or v_status is distinct from 'pending'
    or v_payment is distinct from 'failed'
  then
    v_failures := v_failures || '16 mark failed';
    raise notice 'FAIL 16 mark code=%', v_result ->> 'code';
  else
    raise notice 'PASS 16 mark failed';
  end if;
  v_result := public.confirm_booking_payment('order_verify_16', 'pay_verify_16', 50000, 'INR');
  select b.booking_status, b.payment_status
  into v_status, v_payment
  from public.bookings b
  where b.id = v_id_16;
  if v_result ->> 'code' is distinct from 'confirmed'
    or v_status is distinct from 'confirmed'
    or v_payment is distinct from 'paid'
  then
    v_failures := v_failures || '16 confirm after failed payment';
    raise notice 'FAIL 16 confirm code=%', v_result ->> 'code';
  else
    raise notice 'PASS 16 confirm after failed payment';
  end if;

  select b.ctid, b.payment_status, b.booking_status
  into v_ctid, v_payment, v_status
  from public.bookings b
  where b.id = v_id_11;
  v_result := public.mark_payment_failed('order_verify_11');
  select b.ctid, b.payment_status, b.booking_status
  into v_ctid_after, v_payment, v_status
  from public.bookings b
  where b.id = v_id_11;
  if v_result ->> 'code' is distinct from 'unchanged'
    or v_ctid is distinct from v_ctid_after
    or v_payment is distinct from 'paid'
    or v_status is distinct from 'confirmed'
  then
    v_failures := v_failures || '16 confirmed booking unchanged';
    raise notice 'FAIL 16 unchanged code=%', v_result ->> 'code';
  else
    raise notice 'PASS 16 confirmed booking unchanged';
  end if;

  -- 17. Expected: true, then false.
  v_inserted := public.record_razorpay_event('evt_verify_17', 'payment.captured', 'order_verify_11', 'pay_verify_11');
  if v_inserted is not true then
    v_failures := v_failures || '17 first event';
    raise notice 'FAIL 17 first insert';
  else
    raise notice 'PASS 17 first event';
  end if;
  v_inserted := public.record_razorpay_event('evt_verify_17', 'payment.captured', 'order_verify_11', 'pay_verify_11');
  if v_inserted is not false then
    v_failures := v_failures || '17 duplicate event';
    raise notice 'FAIL 17 duplicate insert';
  else
    raise notice 'PASS 17 duplicate event';
  end if;

  -- 18. Expected: three calendar failures raise needs_manual_review.
  -- Two sync calls leave calendar_sync_status created. booking_status stays confirmed.
  v_seq := v_seq + 1;
  v_result := public.create_pending_booking(
    'session-a-60', '[DUMMY] Session A (60 min)', 50000, 60, 15, v_t1 + interval '48 days',
    'Test Person', 'person@example.com', '9999999999', null, 'Asia/Kolkata',
    lpad(to_hex(v_seq), 64, '0')
  );
  v_id_18 := (v_result -> 'booking' ->> 'id')::uuid;
  perform public.attach_razorpay_order(v_id_18, 'order_verify_18');
  perform public.confirm_booking_payment('order_verify_18', 'pay_verify_18', 50000, 'INR');
  perform public.mark_calendar_failed(v_id_18, 'temporary calendar error');
  perform public.mark_calendar_failed(v_id_18, 'temporary calendar error');
  v_result := public.mark_calendar_failed(v_id_18, repeat('e', 400));
  select b.needs_manual_review, b.calendar_attempts, b.booking_status, b.payment_status, b.calendar_error
  into v_review, v_attempts, v_status, v_payment, v_reason
  from public.bookings b
  where b.id = v_id_18;
  if coalesce((v_result ->> 'needs_manual_review')::boolean, false) is not true
    or v_review is not true
    or v_attempts is distinct from 3
    or v_status is distinct from 'confirmed'
    or v_payment is distinct from 'paid'
    or pg_catalog.char_length(coalesce(v_reason, '')) > 300
  then
    v_failures := v_failures || '18 calendar failures';
    raise notice 'FAIL 18 attempts=% review=%', v_attempts, v_review;
  else
    raise notice 'PASS 18 calendar failures';
  end if;

  v_result := public.mark_calendar_synced(v_id_18, 'google_event_verify_18');
  v_result := public.mark_calendar_synced(v_id_18, 'google_event_verify_18');
  select b.calendar_sync_status, b.google_event_id, b.booking_status, b.calendar_error
  into v_calendar, v_event, v_status, v_reason
  from public.bookings b
  where b.id = v_id_18;
  if v_result ->> 'code' is distinct from 'synced'
    or v_calendar is distinct from 'created'
    or v_event is distinct from 'google_event_verify_18'
    or v_status is distinct from 'confirmed'
    or v_reason is not null
  then
    v_failures := v_failures || '18 calendar sync';
    raise notice 'FAIL 18 sync code=%', v_result ->> 'code';
  else
    raise notice 'PASS 18 calendar sync';
  end if;

  -- 19. Expected: limit 3 allows the first three calls, denies the fourth with
  -- retry_after_seconds > 0. A different key is unaffected.
  v_result := public.check_rate_limit(repeat('1', 64), 3, 60);
  if coalesce((v_result ->> 'allowed')::boolean, false) is not true then
    v_failures := v_failures || '19 first allowed';
  end if;
  v_result := public.check_rate_limit(repeat('1', 64), 3, 60);
  if coalesce((v_result ->> 'allowed')::boolean, false) is not true then
    v_failures := v_failures || '19 second allowed';
  end if;
  v_result := public.check_rate_limit(repeat('1', 64), 3, 60);
  if coalesce((v_result ->> 'allowed')::boolean, false) is not true then
    v_failures := v_failures || '19 third allowed';
  end if;
  v_result := public.check_rate_limit(repeat('1', 64), 3, 60);
  v_allowed := coalesce((v_result ->> 'allowed')::boolean, true);
  v_retry := coalesce((v_result ->> 'retry_after_seconds')::integer, 0);
  if v_allowed or v_retry <= 0 then
    v_failures := v_failures || '19 fourth denied';
    raise notice 'FAIL 19 fourth allowed=% retry=%', v_allowed, v_retry;
  else
    raise notice 'PASS 19 fourth denied';
  end if;
  v_result := public.check_rate_limit(repeat('2', 64), 3, 60);
  if coalesce((v_result ->> 'allowed')::boolean, false) is not true then
    v_failures := v_failures || '19 other key';
    raise notice 'FAIL 19 other key';
  else
    raise notice 'PASS 19 other key';
  end if;

  -- 20. Expected: confirmed without a payment id fails; end before start fails;
  -- two rows with a null razorpay_order_id both insert.
  begin
    insert into public.bookings (
      public_token_hash, session_slug, session_name, amount_paise, duration_minutes,
      customer_name, customer_email, customer_phone, starts_at, ends_at, blocked_until,
      booking_status, payment_status
    ) values (
      lpad(to_hex(200), 64, '0'),
      'session-a-60',
      '[DUMMY] Session A (60 min)',
      50000,
      60,
      'Test Person',
      'person@example.com',
      '9999999999',
      v_t1 + interval '70 days',
      v_t1 + interval '70 days 1 hour',
      v_t1 + interval '70 days 75 minutes',
      'confirmed',
      'paid'
    );
    v_failures := v_failures || '20 confirmed without payment id was inserted';
    raise notice 'FAIL 20 confirmed without payment id';
  exception
    when check_violation then
      raise notice 'PASS 20 confirmed without payment id';
  end;

  begin
    insert into public.bookings (
      public_token_hash, session_slug, session_name, amount_paise, duration_minutes,
      customer_name, customer_email, customer_phone, starts_at, ends_at, blocked_until
    ) values (
      lpad(to_hex(201), 64, '0'),
      'session-a-60',
      '[DUMMY] Session A (60 min)',
      50000,
      60,
      'Test Person',
      'person@example.com',
      '9999999999',
      v_t1 + interval '72 days',
      v_t1 + interval '72 days' - interval '1 minute',
      v_t1 + interval '72 days 1 hour'
    );
    v_failures := v_failures || '20 end before start was inserted';
    raise notice 'FAIL 20 end before start';
  exception
    when check_violation then
      raise notice 'PASS 20 end before start';
  end;

  insert into public.bookings (
    public_token_hash, session_slug, session_name, amount_paise, duration_minutes,
    customer_name, customer_email, customer_phone, starts_at, ends_at, blocked_until
  ) values
    (
      lpad(to_hex(202), 64, '0'),
      'session-a-60',
      '[DUMMY] Session A (60 min)',
      50000,
      60,
      'Test Person',
      'person@example.com',
      '9999999999',
      v_t1 + interval '74 days',
      v_t1 + interval '74 days 1 hour',
      v_t1 + interval '74 days 75 minutes'
    ),
    (
      lpad(to_hex(203), 64, '0'),
      'session-a-60',
      '[DUMMY] Session A (60 min)',
      50000,
      60,
      'Test Person',
      'person@example.com',
      '9999999999',
      v_t1 + interval '76 days',
      v_t1 + interval '76 days 1 hour',
      v_t1 + interval '76 days 75 minutes'
    );
  select count(*)
  into v_count
  from public.bookings
  where public_token_hash in (lpad(to_hex(202), 64, '0'), lpad(to_hex(203), 64, '0'))
    and razorpay_order_id is null;
  if v_count is distinct from 2 then
    v_failures := v_failures || '20 two null order ids';
    raise notice 'FAIL 20 null order ids count=%', v_count;
  else
    raise notice 'PASS 20 two null order ids';
  end if;

  -- 21. Expected: anon and authenticated cannot read rows (privilege error or
  -- empty result) and cannot execute functions.
  if not exists (select 1 from pg_catalog.pg_roles where rolname = 'anon')
    or not exists (select 1 from pg_catalog.pg_roles where rolname = 'authenticated')
  then
    v_failures := v_failures || '21 roles missing';
    raise notice 'FAIL 21 anon or authenticated role is missing';
  else
    foreach v_role in array array['anon', 'authenticated']
    loop
      foreach v_table in array array[
        'bookings',
        'payment_events',
        'rate_limits',
        'testimonials',
        'events_workshops',
        'gallery_items'
      ]
      loop
        v_denied := false;
        v_visible := 0;
        begin
          execute format('set local role %I', v_role);
          execute format('select count(*) from public.%I', v_table) into v_visible;
          execute 'reset role';
        exception
          when insufficient_privilege then
            v_denied := true;
            execute 'reset role';
        end;

        if v_denied then
          raise notice 'PASS 21 % select % denied', v_role, v_table;
        elsif v_visible = 0 then
          raise notice 'PASS 21 % select % returned nothing', v_role, v_table;
        else
          v_failures := v_failures || ('21 ' || v_role || ' saw ' || v_table);
          raise notice 'FAIL 21 % saw % rows in %', v_role, v_visible, v_table;
        end if;
      end loop;

      v_denied := false;
      begin
        execute format('set local role %I', v_role);
        perform public.expire_stale_pending_bookings();
        execute 'reset role';
      exception
        when insufficient_privilege then
          v_denied := true;
          execute 'reset role';
      end;
      if not v_denied then
        v_failures := v_failures || ('21 ' || v_role || ' executed expire_stale_pending_bookings');
        raise notice 'FAIL 21 % executed expire', v_role;
      else
        raise notice 'PASS 21 % execute expire denied', v_role;
      end if;

      if exists (
        select 1
        from pg_catalog.pg_proc p
        join pg_catalog.pg_namespace n on n.oid = p.pronamespace
        where n.nspname = 'public'
          and p.proname in (
            'expire_stale_pending_bookings',
            'create_pending_booking',
            'attach_razorpay_order',
            'confirm_booking_payment',
            'mark_payment_failed',
            'record_razorpay_event',
            'mark_razorpay_event_processed',
            'mark_calendar_synced',
            'mark_calendar_failed',
            'get_booked_ranges',
            'get_booking_by_token_hash',
            'check_rate_limit',
            'purge_old_rate_limits',
            'set_updated_at'
          )
          and has_function_privilege(v_role, p.oid, 'execute')
      ) then
        v_failures := v_failures || ('21 ' || v_role || ' still has execute');
        raise notice 'FAIL 21 % has execute on a project function', v_role;
      else
        raise notice 'PASS 21 % has no execute on project functions', v_role;
      end if;
    end loop;
  end if;

  if exists (
    select 1
    from pg_catalog.pg_class c
    join pg_catalog.pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relname in (
        'bookings',
        'payment_events',
        'rate_limits',
        'testimonials',
        'events_workshops',
        'gallery_items'
      )
      and c.relrowsecurity is not true
  ) or exists (
    select 1
    from pg_catalog.pg_policies
    where schemaname = 'public'
      and tablename in (
        'bookings',
        'payment_events',
        'rate_limits',
        'testimonials',
        'events_workshops',
        'gallery_items'
      )
  ) then
    v_failures := v_failures || '21 rls not deny-by-default';
    raise notice 'FAIL 21 rls or policies';
  else
    raise notice 'PASS 21 rls enabled and no policies';
  end if;

  -- 22. Expected: output columns are only start_at and blocked_until.
  -- start_at is bookings.starts_at. The function is volatile because it expires holds.
  select coalesce(array_agg(u.arg_name order by u.ordinality), array[]::text[])
  into v_names
  from pg_catalog.pg_proc p
  join pg_catalog.pg_namespace n on n.oid = p.pronamespace
  cross join lateral unnest(p.proargnames, p.proargmodes)
    with ordinality as u(arg_name, arg_mode, ordinality)
  where n.nspname = 'public'
    and p.proname = 'get_booked_ranges'
    and u.arg_mode = 't';

  select p.provolatile = 'v'
  into v_definer
  from pg_catalog.pg_proc p
  join pg_catalog.pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public'
    and p.proname = 'get_booked_ranges';

  if v_names is distinct from array['start_at', 'blocked_until']::text[]
    or coalesce(v_definer, false) is not true
  then
    v_failures := v_failures || '22 booked range columns';
    raise notice 'FAIL 22 columns';
  else
    raise notice 'PASS 22 booked range columns';
  end if;

  if coalesce(array_length(v_failures, 1), 0) = 0 then
    raise notice 'VERIFICATION PASSED';
  else
    raise warning 'VERIFICATION FAILED (%): %',
      array_length(v_failures, 1),
      array_to_string(v_failures, '; ');
  end if;
end
$verify$;

rollback;
