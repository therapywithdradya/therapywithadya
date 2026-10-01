-- DUMMY CONTENT ONLY.
-- Every row is fake. None of these are real clients, events, reviews, or photos.
-- Re-runnable: fixed ids and ON CONFLICT DO NOTHING.
-- Dates are computed from now() on the first successful insert. A later re-run
-- does not refresh them. Delete the dummy rows first if you need new dates.
-- No session types (those live in server code). Never seed bookings.

insert into public.testimonials (
  id,
  display_name,
  quote,
  rating,
  is_approved,
  sort_order
) values
  (
    '11111111-1111-4111-8111-111111111111',
    'Dummy Client A',
    '[PLACEHOLDER] This is dummy review text for layout only. It is not a real client testimonial.',
    5,
    true,
    1
  ),
  (
    '11111111-1111-4111-8111-111111111112',
    'Dummy Client B',
    '[PLACEHOLDER] This is dummy review text for layout only. It is not a real client testimonial.',
    4,
    true,
    2
  ),
  (
    '11111111-1111-4111-8111-111111111113',
    'Dummy Client C',
    '[PLACEHOLDER] This is dummy review text for layout only. It is not a real client testimonial.',
    null,
    true,
    3
  )
on conflict (id) do nothing;

insert into public.events_workshops (
  id,
  slug,
  kind,
  title,
  description,
  starts_at,
  ends_at,
  location,
  is_published
) values
  (
    '22222222-2222-4222-8222-222222222221',
    'dummy-upcoming-event',
    'event',
    '[DUMMY] Upcoming event',
    '[DUMMY] Placeholder description. This is not a real event.',
    now() + interval '21 days',
    now() + interval '21 days 2 hours',
    null,
    false
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    'dummy-upcoming-workshop',
    'workshop',
    '[DUMMY] Upcoming workshop',
    '[DUMMY] Placeholder description. This is not a real workshop.',
    now() + interval '35 days',
    now() + interval '35 days 3 hours',
    null,
    false
  ),
  (
    '22222222-2222-4222-8222-222222222223',
    'dummy-past-event',
    'event',
    '[DUMMY] Past event',
    '[DUMMY] Placeholder description. This is not a real event.',
    now() - interval '21 days',
    now() - interval '21 days' + interval '2 hours',
    null,
    false
  ),
  (
    '22222222-2222-4222-8222-222222222224',
    'dummy-past-workshop',
    'workshop',
    '[DUMMY] Past workshop',
    '[DUMMY] Placeholder description. This is not a real workshop.',
    now() - interval '40 days',
    now() - interval '40 days' + interval '2 hours',
    null,
    false
  )
on conflict (id) do nothing;

insert into public.gallery_items (
  id,
  image_path,
  alt_text,
  caption,
  category,
  sort_order,
  is_published
) values
  (
    '33333333-3333-4333-8333-333333333331',
    '/placeholders/gallery-1.svg',
    'Placeholder line drawing of an empty chair beside a bright window, dummy gallery image 1.',
    '[DUMMY] Not a real photograph.',
    'placeholder',
    1,
    false
  ),
  (
    '33333333-3333-4333-8333-333333333332',
    '/placeholders/gallery-2.svg',
    'Placeholder line drawing of an open notebook on a wooden table, dummy gallery image 2.',
    '[DUMMY] Not a real photograph.',
    'placeholder',
    2,
    false
  ),
  (
    '33333333-3333-4333-8333-333333333333',
    '/placeholders/gallery-3.svg',
    'Placeholder line drawing of a potted plant on a shelf, dummy gallery image 3.',
    '[DUMMY] Not a real photograph.',
    'placeholder',
    3,
    false
  ),
  (
    '33333333-3333-4333-8333-333333333334',
    '/placeholders/gallery-4.svg',
    'Placeholder line drawing of two ceramic cups on a tray, dummy gallery image 4.',
    '[DUMMY] Not a real photograph.',
    'placeholder',
    4,
    false
  ),
  (
    '33333333-3333-4333-8333-333333333335',
    '/placeholders/gallery-5.svg',
    'Placeholder line drawing of a quiet hallway with a closed door, dummy gallery image 5.',
    '[DUMMY] Not a real photograph.',
    'placeholder',
    5,
    false
  ),
  (
    '33333333-3333-4333-8333-333333333336',
    '/placeholders/gallery-6.svg',
    'Placeholder line drawing of folded fabric on a bench, dummy gallery image 6.',
    '[DUMMY] Not a real photograph.',
    'placeholder',
    6,
    false
  )
on conflict (id) do nothing;
