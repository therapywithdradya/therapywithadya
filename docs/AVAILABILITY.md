# Availability Engine

This document explains the slot availability engine in plain words. Code lives in `src/lib/availability/` and `src/lib/booking/booking-rules.ts`.

---

## What it does

Given a date range, a session length, a buffer, a set of working-hours rules, and two lists of already-blocked times, the engine produces the ordered set of UTC instants when a new session can start.

It also answers the narrower question: "is this specific requested start time still available?"

---

## Algorithm — plain words

### 1. Validate inputs

- `fromDate` and `toDate` must be `YYYY-MM-DD` strings representing real calendar dates.
- The span (`toDate - fromDate`) must not exceed `rules.maxRangeDays` (currently 62 days).
- `durationMinutes` must be a positive integer. `bufferMinutes` must be non-negative.
- `rules.slotIntervalMinutes` must be a positive integer that divides 60 exactly (e.g. 10, 15, 20, 30, 60).
- Working-hour windows for each weekday must have `start < end` and must not overlap.

Any violation throws **`AvailabilityInputError`** immediately.

---

### 2. Generate candidate slots

For each calendar day from `fromDate` to `toDate` (in the business timezone):

1. Look up the working-hour windows for that weekday (Monday = 1 … Sunday = 7).
2. For each window, step through start times at every `slotIntervalMinutes` increment.
3. A candidate at minute `m` is kept only if `m + durationMinutes ≤ windowEnd`. The session must **end** by the window close; the buffer may extend past it.
4. Build the local `DateTime` with Luxon in the **business timezone** (explicit IANA string, never the machine default).
5. **DST spring-forward safety**: if Luxon shifts the result (the constructed `hour:minute` differs from the target), that local time does not exist — skip it.
6. **DST fall-back deduplication**: track each `YYYY-MM-DDThh:mm` key in a `Set`. Emit only the first UTC instant per local label to avoid duplicate entries for the repeated hour.
7. **Minimum notice**: drop candidates that start before `now + minNoticeHours` (strict `<`; exactly at the boundary is allowed).
8. **Horizon**: drop candidates that start after `now + maxAdvanceDays × 24 h` (strict `>`; exactly at the boundary is allowed).

The `end` stored in a `Slot` object is `start + durationMinutes` (elapsed minutes). The buffer is not added to the stored `end`; it is only used during conflict checking.

---

### 3. Collect blocked intervals

Two sources are queried in parallel with a timeout (default 8 s):

| Source | Field names | Padding |
|--------|-------------|---------|
| Google Calendar free/busy | `start` / `end` | **Padded by `bufferMinutes` at the end** — a Google event does not reserve the practitioner's post-session break on the calendar. |
| Database `get_booked_ranges` | `start_at` / `blocked_until` | **Never padded** — `blocked_until` already equals `ends_at + buffer` as stored by `create_pending_booking`. |

After padding, each source's intervals are merged (overlapping or touching intervals collapse into one).

If either provider **rejects**, **times out**, or returns **invalid data**, the engine throws **`AvailabilityUnavailableError`** — fail closed. It never returns an empty slot list pretending nothing is booked.

---

### 4. Filter conflicts

For each candidate, form its **occupied interval**: `[start, start + duration + buffer)`.

A candidate is removed if its occupied interval **overlaps** any merged padded-busy or merged booked interval.

**Overlap uses half-open `[start, end)` semantics:**
- `A` and `B` overlap when `A.start < B.end && B.start < A.end`.
- Two intervals that share only an endpoint (e.g. one ends at 14:00, the next starts at 14:00) do **not** overlap. Back-to-back sessions are allowed.

---

### 5. Return

The surviving candidates are returned in chronological order. Each `Slot` object contains:

```typescript
{
  start: string;      // UTC ISO string (e.g. "2026-01-19T04:30:00.000Z")
  end: string;        // UTC ISO string = start + durationMinutes
  localDate: string;  // "YYYY-MM-DD" in business timezone
  localTime: string;  // "HH:mm"  in business timezone
}
```

---

## Single-slot validation (`isRequestedSlotAvailable`)

Checks a single requested start in the order below. Returns `{ ok: true }` or `{ ok: false, reason }`.

| Check | Reason |
|-------|--------|
| `start` is not a valid `Date` | `invalid_time` |
| `start` has nonzero seconds or milliseconds | `not_on_grid` |
| `start` is a DST spring-forward gap | `invalid_time` |
| `start < now + minNoticeHours` | `too_soon` |
| `start > now + maxAdvanceDays × 24 h` | `too_far` |
| Weekday has no windows, or `start` not in any window | `outside_hours` |
| `start + durationMinutes > windowEnd` | `outside_hours` |
| `(minuteOfDay − windowStart) % slotIntervalMinutes ≠ 0` | `not_on_grid` |
| Occupied interval overlaps padded-busy or booked | `conflict` |

---

## Rules table

| Field | Default | Description |
|-------|---------|-------------|
| `timezone` | `Asia/Kolkata` | IANA timezone for all local-time arithmetic |
| `weeklyHours` | Mon–Sat 10:00–18:00, Sun closed | Working-hour windows per weekday (1 = Mon … 7 = Sun) |
| `slotIntervalMinutes` | 30 | Grid spacing; must divide 60 |
| `minNoticeHours` | 12 | Earliest bookable instant = `now + 12h` |
| `maxAdvanceDays` | 60 | Latest bookable instant = `now + 60 days` |
| `maxRangeDays` | 62 | Maximum span of a single query |
| `holdMinutes` | 15 | Must match `create_pending_booking` hard-coded hold |

All defaults are `DEFAULT` status and await client confirmation. See `src/lib/booking/booking-rules.ts`.

---

## Test suite overview

Four test files, 97 tests total, run with `npm run test` (`vitest run` — one-shot, never watch mode).

| File | Tests | What it covers |
|------|-------|----------------|
| `intervals.test.ts` | 24 | `parseIntervals`, `mergeIntervals`, `padEnd`, `overlaps`, `clipTo` |
| `slots.test.ts` | 46 | Candidate generation, notice/horizon boundaries, DST, conflict filtering, `isRequestedSlotAvailable` reasons, multi-day union, determinism |
| `service.test.ts` | 9 | Fail-closed provider errors, timeout, timer cleanup, happy path, input validation |
| `rules.test.ts` | 18 | `validateRules` valid/invalid cases, lunch-break multi-window, `bookingRules` self-validation |

### Key test scenarios

- **Test 0** – Machine TZ sanity: `getTimezoneOffset()` must return 480 (America/Los_Angeles = UTC-8). Catches CI machines with unexpected default zones.
- **Test 1** – Normal Mon slot generation: 60-min session / 30-min grid gives 15 slots 10:00–17:00; 90-min gives 14; Sunday gives 0.
- **Test 2** – Buffer pads Google busy: busy 12:00–13:00 IST with 15-min buffer blocks 11:00, 11:30, 12:00, 12:30, 13:00; 13:30 is free.
- **Test 3** – Booked ranges not padded: `blocked_until = 15:15 IST`; slot at 13:00 ends at 14:00 which **touches** the booked start (half-open → no conflict → offered); 13:30, 14:00, 14:30, 15:00 conflict.
- **Test 4** – Half-open touching boundary: slot starting exactly when a busy interval ends is allowed.
- **Test 5** – Notice boundary: slot at exactly `now + 12h` is included (strict `<`). Horizon: March 12 IST slots are within range; March 13 10:00 IST = 04:30 UTC exceeds `now + 60 days = March 13 00:00 UTC` → excluded.
- **Test 6** – Session end constraint: 17:00 start with 60-min session ends at 18:00 (allowed); 90-min would end at 18:30 (rejected).
- **Test 7** – DST: spring-forward gap produces no nonexistent local times; fall-back produces no duplicate local labels; elapsed ms is always correct.
- **Test 8** – UTC Z and +05:30 offset strings produce the same slot list.
- **Test 9** – Invalid provider data throws `AvailabilityUnavailableError`.
- **Test 10** – Provider rejection, provider timeout → `AvailabilityUnavailableError`; timeout timer is cleared.
- **Test 11** – Input validation: bad date string, inverted range, span > 62 days, non-integer or negative session fields.
- **Test 12** – `isRequestedSlotAvailable` returns each of the 7 possible outcomes.
- **Test 13** – Multi-day range equals union of per-day results; slots are strictly ascending; no duplicates.
- **Test 14** – Slot objects contain exactly `{start, end, localDate, localTime}`.
- **Test 15** – Identical inputs → identical output; `busy` and `booked` arrays are not mutated.
- **Test 16** – `validateRules` accepts valid configs (30-min grid, lunch-break two windows) and rejects overlapping windows, invalid intervals, non-dividing slot grids, negative notice.

---

## Module layout

```
src/lib/availability/
  types.ts        – Interval, SessionTiming, Slot, BusyProvider, BookedRangesProvider,
                    AvailabilityUnavailableError, AvailabilityInputError
  intervals.ts    – parseIntervals, mergeIntervals, padEnd, overlaps, clipTo
  slots.ts        – generateCandidateSlots, filterConflicts,
                    getAvailableSlots, isRequestedSlotAvailable
  service.ts      – getAvailability (parallel providers + timeout + fail-closed)

src/lib/booking/
  booking-rules.ts – BookingRules type, bookingRules const, validateRules
```

No module in this group imports `server-only`, `process.env`, Supabase, or any network client. They are safe to import from any server context.
