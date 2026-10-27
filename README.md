# Dr. Adya's Practice Website

Production-ready web application for Dr. Adya's clinical psychology practice (`therapywithadya.com`), built with Next.js 16 (App Router, React 19, Node 24), Tailwind CSS v4, Supabase (PostgreSQL), Razorpay, and Google Calendar.

## Current State

- **Public Marketing Pages**: All 14 routes live and responsive (`/`, `/about`, `/services`, `/sessions`, `/events`, `/gallery`, `/reviews`, `/contact`, `/privacy`, `/terms-and-cancellation`).
- **Design & Content**: Dark luxury aesthetic inspired by Anchor & Sage with real practitioner copy, photos, and session pricing.
- **Availability Engine**: Functional slot algorithm respecting IST hours (Mon–Sat 10:00–18:00), 15-minute buffers, 12-hour notice, and holiday/busy blocking (97 unit tests passing).
- **Database Schema**: Supabase PostgreSQL tables, PL/pgSQL booking functions, and GiST exclusion constraints preventing double bookings.

## Quickstart

```bash
# Install dependencies
npm install

# Run local development server
npm run dev

# Run Vitest test suite
npm test

# Type safety and linting checks
npm run typecheck
npm run lint

# Placeholder string audit (0 matches)
npm run check:placeholders

# Production build check
npm run build
```

## Documentation

- **[Project Status & Roadmap](file:///d:/Major%20Project/adyas-project/docs/PROJECT_STATUS.md)**: Master completion roadmap, testing phase plan, and deployment guide.
- **[Deployment Runbook](file:///d:/Major%20Project/adyas-project/docs/DEPLOYMENT.md)**: Environment setup, operator runbook, and production cutover steps.
- **[System Architecture](file:///d:/Major%20Project/adyas-project/docs/ARCHITECTURE.md)**: Full state machine, concurrency protection, and security specifications.
- **[Decision Log](file:///d:/Major%20Project/adyas-project/docs/DECISIONS.md)**: Architectural and business decisions with client confirmation status.
- **[Known Issues](file:///d:/Major%20Project/adyas-project/docs/KNOWN_ISSUES.md)**: Documented caveats and intentional deferrals.

