-- Migration 0005: Gallery Categories & Custom Order
-- Allows Dr. Adya to customize category sequence, rename, add, and delete gallery categories.

create table if not exists public.gallery_categories (
  slug text primary key,
  label text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

comment on table public.gallery_categories is
  'Ordered list of gallery categories managed by Dr. Adya via /admin dashboard.';

-- Enable RLS
alter table public.gallery_categories enable row level security;

-- Public can read
create policy "Allow public read gallery_categories"
  on public.gallery_categories
  for select
  to anon, authenticated
  using (true);

-- Service role has full access
create policy "Allow service_role full access to gallery_categories"
  on public.gallery_categories
  for all
  to service_role
  using (true)
  with check (true);

-- Seed initial categories in standard order
insert into public.gallery_categories (slug, label, sort_order) values
  ('space', 'Therapy Space & Sanctuary', 1),
  ('workshop', 'Workshops & Speaking', 2),
  ('modalities', 'Therapeutic Modalities & Tools', 3),
  ('practice', 'Clinical Practice', 4),
  ('credentials', 'Credentials & Certifications', 5)
on conflict (slug) do nothing;
