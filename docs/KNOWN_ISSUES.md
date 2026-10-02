# Known issues

Problems that hit the fix-loop limit, or that were left in place on purpose, are listed here.

## Open items

- Phase 2 SQL was not executed here. `psql` is not installed and no local Postgres was running. Remote database commands are forbidden, so the files were reviewed by reading. Follow the steps under "Not tested" in `supabase/README.md` before relying on the schema.

- **Phase 4c — No `image_alt` column on `events_workshops`**: The `events_workshops` table has an `image_path` column but no `image_alt` column. Event card images therefore use auto-generated alt text of the form `Photo for "<title>"`. A later migration could add an `image_alt` column (nullable text) to allow per-image alt text. Until then, do not edit `supabase/migrations`.

- **Phase 4d — Privacy claims describe the designed system**: The booking system is not built yet; re-verify each claim against the real code after the booking, payment and calendar phases.

- **Phase 4d — Calendar event title and location field in architecture**: While `docs/ARCHITECTURE.md` specifies that the customer note is included in the calendar event description, that `google_event_id` is tracked with deterministic IDs, and that the customer email is optionally added as an attendee invite, the exact event summary title format (e.g. session name with client name) and location field details are not explicitly detailed in the architecture doc. The privacy policy describes these details neutrally until implemented.

