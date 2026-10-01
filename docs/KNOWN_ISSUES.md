# Known issues

Problems that hit the fix-loop limit, or that were left in place on purpose, are listed here. There are none yet.

## Open items

- Phase 2 SQL was not executed here. `psql` is not installed and no local Postgres was running. Remote database commands are forbidden, so the files were reviewed by reading. Follow the steps under "Not tested" in `supabase/README.md` before relying on the schema.
