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
    '11111111-1111-4111-8111-111111111101',
    'Anonymous',
    'Regarding the feedback, I must say I was in the right place when I needed it the most. All your efforts are clearly reflected in my progress, and your ability to deeply understand and listen to someone in need is remarkable. Every session I had with you was very calming at that time, and it helped me a lot in overcoming that phase. I would rate every session 10 on 10. Thank you for helping me and making me believe that I could do it. In short, I would recommend you to anyone without a second thought 💫',
    5,
    true,
    1
  ),
  (
    '11111111-1111-4111-8111-111111111102',
    'Anonymous',
    'Therapy sessions bahut helpful rahe. Therapist ne meri baat patience aur understanding ke saath suni. Unki guidance se mujhe anxiety aur fear ko better handle karne mein help mili. Sessions comfortable aur supportive feel hote hain. Main emotionally kaafi better feel kar rahi hoon. Highly recommended.',
    5,
    true,
    2
  ),
  (
    '11111111-1111-4111-8111-111111111103',
    'Anonymous',
    'Adya Vats is an amazing psychologist. She is sensitive, caring and judgement free. She is a good listener. She has great understanding of one’s feelings, she can understand whatever you are feeling. I will strongly recommend her therapy sessions, if you ever feel lonely and unworthy of your life. Please reach out to her. As a patient I have experienced that.',
    5,
    true,
    3
  ),
  (
    '11111111-1111-4111-8111-111111111104',
    'Anonymous',
    'My experience with Adya Vats has been truly wonderful. I started my sessions with her during one of the most difficult phases of my life, when I was dealing with a lot of emotional pain and personal challenges. She listened to me patiently, understood my feelings without judgment, and helped me feel lighter, calmer, and emotionally stronger. I am especially grateful for her kindness and support when I was facing financial difficulties. She even reduced her fees by half so I could continue my sessions. Thank you, Adya, for your empathy, kindness, and support. You made a real difference in my life.',
    5,
    true,
    4
  ),
  (
    '11111111-1111-4111-8111-111111111105',
    'Anonymous',
    'I''ve been seeing Adya for a long time and I can honestly say it''s been a life-changing experience. She created a safe, non-judgmental space for me to explore my thoughts, emotions, and concerns. Adya is an exceptional listener, empathetic, and insightful. She helped me identify emotional patterns, gain new perspectives, and develop coping strategies to manage stress, anxiety, and relationships. What I appreciate most is her warm, compassionate, and genuine approach. She is knowledgeable, experienced, and up-to-date with the latest techniques. If you''re struggling with mental health issues or simply seeking personal growth, I highly recommend Adya.',
    5,
    true,
    5
  ),
  (
    '11111111-1111-4111-8111-111111111106',
    'Anonymous',
    'I had an incredible experience with Adya Vats, a highly skilled psychologist and tarot reader. She provided exceptional guidance during a pivotal career decision, helping me weigh the pros and cons of choosing between a high-paying role and one offering better growth opportunities. Her insights were thoughtful, accurate, and deeply resonated with my situation. Adya''s empathetic and professional approach made me feel confident and clear-headed about my choice. I highly recommend her to anyone seeking clarity and guidance in life''s important decisions.',
    5,
    true,
    6
  ),
  (
    '11111111-1111-4111-8111-111111111107',
    'Anonymous',
    'It''s been a truly transformative experience. I want to express my heartfelt gratitude for your time and unwavering support. Through this journey, I learned to love myself more deeply, forgive others for their shortcomings, and embrace life''s challenges with resilience and grace. Thank you once again for being a guiding light on this incredible path of self-discovery. Your support has made all the difference!',
    5,
    true,
    7
  ),
  (
    '11111111-1111-4111-8111-111111111108',
    'Anonymous',
    'I wanted to take a moment to express my deepest appreciation for the incredible support and guidance you''ve provided me during our time together. Your unwavering dedication to my well-being has made an immeasurable difference in my life. Your compassionate listening, insightful feedback, and gentle encouragement have helped me navigate through some of the most challenging moments I''ve faced. Your expertise and professionalism shine through in every session, creating a safe and nurturing space for me to explore and grow. Your commitment to my mental health journey has been truly inspiring, and I am profoundly grateful for your presence in my life. Thank you for being the beacon of light during times of darkness and for empowering me to cultivate resilience and self-understanding. Please know that your work is immensely valued and appreciated. I am forever grateful for your kindness, empathy, and expertise.',
    5,
    true,
    8
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
