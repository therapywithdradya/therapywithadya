# Known issues

Problems that hit the fix-loop limit, or that were left in place on purpose, are listed here.

## Open items

- Phase 2 SQL was not executed here. `psql` is not installed and no local Postgres was running. Remote database commands are forbidden, so the files were reviewed by reading. Follow the steps under "Not tested" in `supabase/README.md` before relying on the schema.

- **Phase 4c — No `image_alt` column on `events_workshops`**: The `events_workshops` table has an `image_path` column but no `image_alt` column. Event card images therefore use auto-generated alt text of the form `Photo for "<title>"`. A later migration could add an `image_alt` column (nullable text) to allow per-image alt text. Until then, do not edit `supabase/migrations`.
