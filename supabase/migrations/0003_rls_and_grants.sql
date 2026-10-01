-- Lock down every table. Apply after 0002_booking_functions.sql.
--
-- The service-role key bypasses row level security. It must live only in
-- server-side environment variables. Deny-by-default RLS means a leaked anon
-- key exposes nothing: RLS is enabled and there are no policies for any role.
--
-- None of these tables may be added to the supabase_realtime publication.

do $$
begin
  if not exists (select 1 from pg_catalog.pg_roles where rolname = 'anon')
    or not exists (select 1 from pg_catalog.pg_roles where rolname = 'authenticated')
    or not exists (select 1 from pg_catalog.pg_roles where rolname = 'service_role')
  then
    raise exception
      'Supabase roles anon, authenticated, and service_role must exist before 0003';
  end if;
end $$;

alter table public.bookings enable row level security;
alter table public.payment_events enable row level security;
alter table public.rate_limits enable row level security;
alter table public.testimonials enable row level security;
alter table public.events_workshops enable row level security;
alter table public.gallery_items enable row level security;

-- No create policy statements. Public content is read by the server with the service role.

revoke all on table
  public.bookings,
  public.payment_events,
  public.rate_limits,
  public.testimonials,
  public.events_workshops,
  public.gallery_items
from public, anon, authenticated;

grant select, insert, update, delete on table
  public.bookings,
  public.payment_events,
  public.rate_limits,
  public.testimonials,
  public.events_workshops,
  public.gallery_items
to service_role;

-- Functions are executable by PUBLIC by default. Revoke that on the functions
-- this migration set created, then grant service_role only. The name list
-- avoids touching extension functions that also live in public.
do $$
declare
  v_function record;
  v_count integer := 0;
begin
  for v_function in
    select
      n.nspname as schema_name,
      p.proname as function_name,
      pg_catalog.pg_get_function_identity_arguments(p.oid) as identity_args
    from pg_catalog.pg_proc p
    join pg_catalog.pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname in (
        'set_updated_at',
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
      )
  loop
    execute format(
      'revoke all on function %I.%I(%s) from public, anon, authenticated',
      v_function.schema_name,
      v_function.function_name,
      v_function.identity_args
    );
    execute format(
      'grant execute on function %I.%I(%s) to service_role',
      v_function.schema_name,
      v_function.function_name,
      v_function.identity_args
    );
    v_count := v_count + 1;
  end loop;

  if v_count <> 14 then
    raise exception 'Expected 14 project functions to lock down, found %', v_count;
  end if;
end $$;

-- supabase_admin is the role the dashboard uses to create objects. Changing its
-- default privileges stops a later click-created table from being granted to
-- anon. If this role cannot alter those defaults, the notice explains it.
do $$
begin
  if exists (select 1 from pg_catalog.pg_roles where rolname = 'supabase_admin') then
    begin
      execute 'alter default privileges for role supabase_admin in schema public revoke all on tables from public, anon, authenticated';
      execute 'alter default privileges for role supabase_admin in schema public revoke all on functions from public, anon, authenticated';
      execute 'alter default privileges for role supabase_admin in schema public revoke all on sequences from public, anon, authenticated';
    exception
      when insufficient_privilege then
        raise notice 'Could not change default privileges for supabase_admin. Revoke anon grants on any table created later in the dashboard.';
    end;
  end if;
end $$;

-- Future objects created by the role running this script.
alter default privileges in schema public revoke all on tables from public, anon, authenticated;
alter default privileges in schema public revoke all on functions from public, anon, authenticated;
alter default privileges in schema public revoke all on sequences from public, anon, authenticated;
alter default privileges in schema public grant all on tables to service_role;
alter default privileges in schema public grant all on functions to service_role;
alter default privileges in schema public grant all on sequences to service_role;

comment on table public.bookings is
  'Service-role key bypasses RLS and must live only in server-side env vars. Deny-by-default RLS (enabled, no policies) means a leaked anon key exposes nothing. Do not add this table to the supabase_realtime publication.';

comment on table public.payment_events is
  'Service-role key bypasses RLS and must live only in server-side env vars. Deny-by-default RLS (enabled, no policies) means a leaked anon key exposes nothing. Do not add this table to the supabase_realtime publication.';

comment on table public.rate_limits is
  'Service-role key bypasses RLS and must live only in server-side env vars. Deny-by-default RLS (enabled, no policies) means a leaked anon key exposes nothing. Do not add this table to the supabase_realtime publication.';

comment on table public.testimonials is
  'Service-role key bypasses RLS and must live only in server-side env vars. Deny-by-default RLS (enabled, no policies) means a leaked anon key exposes nothing. Do not add this table to the supabase_realtime publication.';

comment on table public.events_workshops is
  'Service-role key bypasses RLS and must live only in server-side env vars. Deny-by-default RLS (enabled, no policies) means a leaked anon key exposes nothing. Do not add this table to the supabase_realtime publication.';

comment on table public.gallery_items is
  'Service-role key bypasses RLS and must live only in server-side env vars. Deny-by-default RLS (enabled, no policies) means a leaked anon key exposes nothing. Do not add this table to the supabase_realtime publication.';
