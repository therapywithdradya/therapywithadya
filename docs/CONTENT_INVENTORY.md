# Content inventory

Read on 2026-10-01 from `reference docs/`. That folder holds two JPEG screenshots and no other files. Wording below is the reading of those screenshots. Nothing from them is published on the site except the email address, which appears once and is not contradicted.

The two screenshots are different “About me” texts. Where they disagree, neither version is published.

| Item | Source file | Status | Used where |
| --- | --- | --- | --- |
| Practitioner name | Both screenshots | MISSING | Not shown. The email local-part is not treated as a name. `siteName` stays `Practice [DUMMY]`. |
| Professional title | `photo_2026-10-01_15-58-29.jpg` says “Psychologist” and “trauma-informed psychologist”. `photo_2026-10-01_15-58-30.jpg` does not use that title. | NEEDS CLIENT CONFIRMATION | Not published. |
| Tagline | `photo_2026-10-01_15-58-29.jpg`: “I am here to help you heal, feel empowered, and connect with your truest self.” The other screenshot opens differently. | NEEDS CLIENT CONFIRMATION | Not published. The site tagline stays marked `[DUMMY]`. |
| Short intro | Same two openings. | NEEDS CLIENT CONFIRMATION | Not published. |
| Full bio | Both screenshots, full text quoted under “Screenshot readings”. | NEEDS CLIENT CONFIRMATION | Not published. About page is still a placeholder. |
| Professional background | First screenshot: “over 3+ years of experience” and clients aged 16 to 50. Second: “over 2.5 years of professional practice and 5+ years of dedicated study” and ages 18 to 40. | NEEDS CLIENT CONFIRMATION | Not published. The figures conflict. |
| Qualifications | First: Psychologist; Hypnotherapist; Graphologist; Tarot Reader; chakra healer. Second: “certified CBT & REBT practitioner, hypnotherapist, art therapist, trauma-informed therapist, career counselor, Tarot card reader, and graphologist.” No issuing body is named in either file. | NEEDS CLIENT CONFIRMATION | Not published. |
| Approach / philosophy | Both describe a personalised, non-judgmental or flexible approach, in different sentences. | NEEDS CLIENT CONFIRMATION | Not published. |
| Services | Both mention one-to-one work, school workshops, and training or supervision. The first also says corporate settings and events. The second also says internships and named workshop topics. | PARTIAL | Not published. Services page is still a placeholder. |
| Session type A | Neither file | MISSING | `session-config.ts` stays the 60-minute dummy, `pricePaise` 0. |
| Session type B | Neither file | MISSING | `session-config.ts` stays the 90-minute dummy, `pricePaise` 0. |
| Session mode | Neither file states online or in person. | MISSING | Existing default remains online and is not presented as a client fact. |
| Cancellation / refund policy | Neither file | MISSING | `policies.confirmed` is false. Default policy text is unchanged and is not shown as legal copy. |
| Working hours | Neither file | MISSING | Not published. |
| Email | `photo_2026-10-01_15-58-29.jpg`: `adyavats13@gmail.com` | FILLED | `src/content/site.ts`, shown in the footer. |
| Phone | Neither file | MISSING | Hidden. |
| WhatsApp | Neither file | MISSING | Hidden. |
| Location | Neither file | MISSING | Hidden. |
| Social links | Neither file | MISSING | Hidden. |
| Client count | Neither file | MISSING | Not stored and not shown. |
| Testimonials | Neither file | MISSING | Dummy testimonials in `src/content/dummy-data.ts` stay marked `[PLACEHOLDER]`. |
| Events / workshops | Mentioned as something the practitioner conducts. No titles, dates, or listings. | PARTIAL | Dummy events stay marked `[DUMMY]`. |
| Gallery images | Neither file is a gallery photograph. | MISSING | No files copied to `public/images`. |
| Portrait / hero | `photo_2026-10-01_15-58-29.jpg` contains a portrait inside an about-page screenshot. It is not a standalone website file. | NEEDS CLIENT CONFIRMATION | Not copied and not published. |
| Logo | Neither file | MISSING | Wordmark is the dummy site name. |
| Brand colours / fonts | Neither file states brand colours or fonts. | MISSING | Visual style comes from the separate anchor & sage reference, not from these screenshots. |

## Screenshot readings

`photo_2026-10-01_15-58-29.jpg` (about 61 KB). A light-blue about page. Left: a portrait of a person in a pink shirt against a wooden wall, then the lines “Psychologist”, “Hypnotherapist, Graphologist”, “Tarot Reader, chakra healer”. Right, under “About Me”, with “Email: adyavats13@gmail.com”:

> I am here to help you heal, feel empowered, and connect with your truest self. I am a trauma-informed psychologist with over 3+ years of experience, supporting individuals through a wide range of concerns including anxiety, stress, depression, self-doubt, trauma, grief, abuse, relationship issues, career-related challenges, disordered eating, sleep difficulties, and OCD. I have mostly worked with clients between the ages of 16 to 50 years, tailoring my therapeutic approach to meet each person's unique emotional and psychological needs.
>
> My goal is to provide a safe, compassionate, and non-judgmental space where you can begin your healing journey and work towards lasting personal growth.
>
> In addition to one-on-one therapy, I also conduct mental health workshops in schools and corporate settings, and organize events on emotional well-being and other mental health-related topics. I provide supervision and training to budding psychologists to support their learning and professional growth.

`photo_2026-10-01_15-58-30.jpg` (about 205 KB). A cream panel on a lilac background, script heading “About me”, no photograph and no contact line:

> With over 2.5 years of professional practice and 5+ years of dedicated study, I bring a deep passion for psychology and healing to my work. As a certified CBT & REBT practitioner, hypnotherapist, art therapist, trauma-informed therapist, career counselor, Tarot card reader, and graphologist, I believe in a flexible, personalized approach that acknowledges every individual's uniqueness. I specialize in working with individuals aged 18 to 40, addressing a wide range of issues including self-esteem, anxiety, depression, OCD, distorted eating habits, sleep disorders, relationship challenges, career concerns, stress, trauma, abuse, and grief. My mission is to empower individuals to heal, grow, and thrive by regaining control of their lives. Beyond therapy, I provide internships and training for psychology students and organize workshops and events in schools. These sessions cover essential mental health topics like emotional well-being, stress management, communication skills, fostering resilience, and more, tailored for teachers and students alike. Additionally, I conduct workshops on self-confidence, self-esteem, and personal growth, offering tools to help individuals unlock their potential.

## Questions for the client

- What public name and site name should the header use?
- Which about text is the one to publish, or should a new one be written? The two screenshots disagree.
- Which experience figures are accurate: “over 3+ years”, or “2.5 years of professional practice and 5+ years of dedicated study”?
- Which age range is accurate: 16 to 50, or 18 to 40?
- Which titles should appear, and which body issued each one? Neither screenshot names an issuing body.
- May the portrait inside the first screenshot be used on the site, and can a standalone photo file be supplied?
- What are the two bookable sessions: name, description, who it is for, duration, and fee in rupees?
- Are sessions online, in person, or both? If there is a place, may it be shown?
- What is the cancellation and refund policy?
- What are the working hours?
- Is `adyavats13@gmail.com` the public email?
- What phone number and WhatsApp number should be shown, if any?
- Which social profiles should be linked?
- Are there approved testimonials, and how should each person be named?
- Are there real events, workshops, or gallery photos to publish?
- Is there a logo, and are there brand colours or fonts to use instead of the current dark-and-gold style?
