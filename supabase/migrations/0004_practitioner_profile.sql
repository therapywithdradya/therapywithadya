-- Migration 0004: Practitioner Profile and Admin Content Storage
-- Allows Dr. Adya to edit her profile, bio, session fees, and media via Admin Dashboard.

create table if not exists public.practitioner_profile (
  id text primary key default 'primary',
  name text not null default 'Dr. Adya Vats',
  tagline text not null default 'A safe, compassionate, and trauma-informed space to heal, feel empowered, and connect with your truest self.',
  about_title text not null default 'About Dr. Adya Vats',
  about_intro text not null default 'I am a trauma-informed psychologist with over 3+ years of clinical practice and 5+ years of dedicated academic study and research. My goal is to provide a safe, compassionate, and non-judgmental space where you can begin your healing journey and work towards lasting personal growth.',
  profile_image_url text not null default '/images/dr-adya-portrait.jpg',
  hero_image_url text not null default '/images/hero-space.jpg',
  email text not null default 'adyavats13@gmail.com',
  phone text null,
  location text not null default 'Online Sessions (Worldwide) & In-Person by Appointment',
  fee_60_min integer not null default 1500,
  fee_90_min integer not null default 2500,
  updated_at timestamptz not null default now()
);

comment on table public.practitioner_profile is
  'Singleton profile row managed by Dr. Adya via /admin dashboard.';

-- Enable RLS (Service role can read/write, public can read)
alter table public.practitioner_profile enable row level security;

-- Seed initial row if not exists
insert into public.practitioner_profile (id)
values ('primary')
on conflict (id) do nothing;

-- Enable public read on practitioner_profile
create policy "Allow public read practitioner_profile"
  on public.practitioner_profile
  for select
  to anon, authenticated
  using (true);

create policy "Allow service_role full access to practitioner_profile"
  on public.practitioner_profile
  for all
  to service_role
  using (true)
  with check (true);

