# Gathered — Claude Code Harness

## Project Overview
Gathered is a two-sided local farm discovery platform targeting New England. Consumers find nearby farms, farm stands, farmers markets, and farm events on a map. Farm owners claim their listing and manage their own profile and events. Seeded with scraped farm data; farms can later link Facebook and Eventbrite to auto-sync events. MVP targets New Hampshire/New England with a goal of 50+ farms listed and 15+ claimed profiles at 60 days. Monetization TBD post-validation — free to start.

**This is a web-first MVP.** The mobile app (Expo) is deferred until the web MVP ships and validates. Do not scaffold mobile, install Expo packages, or reference NativeWind until explicitly instructed.

## Documentation Map
Before writing any code, read the relevant doc first:
- **Architecture & stack** → `docs/ARCHITECTURE.md`
- **Database schema** → `docs/DATABASE.md`
- **Full feature list** → `docs/FEATURES.md`
- **What to build right now** → `docs/MVP.md`
- **External API integrations** → `docs/API_INTEGRATIONS.md`
- **Code style & patterns** → `docs/CODING_STANDARDS.md`

---

## Project Structure
```
gathered/
├── CLAUDE.md                     ← you are here
├── docs/                         ← all planning docs
├── app/                          ← Next.js App Router
│   ├── (auth)/
│   ├── (marketing)/
│   ├── farms/[slug]/
│   ├── search/
│   ├── events/
│   └── dashboard/
├── components/
│   ├── farms/
│   ├── events/
│   ├── ui/
│   └── layout/
├── lib/
│   ├── supabase/
│   │   ├── client.ts             ← browser client
│   │   ├── server.ts             ← server client (Server Components)
│   │   └── types.ts              ← auto-generated, do not edit
│   ├── hooks/
│   ├── types/
│   └── utils/
├── supabase/
│   ├── migrations/
│   └── functions/
├── public/
├── .env.local
└── .env.example
```

---

## Key Commands
```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Run Supabase locally
supabase start

# Push DB migrations to remote
supabase db push

# Generate Supabase TypeScript types
supabase gen types typescript --local > lib/supabase/types.ts

# Type check
npm run typecheck

# Lint
npm run lint
```

---

## Environment Variables
Never commit `.env.local`. Always keep `.env.example` in sync.

**`.env.local`:**
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
GOOGLE_MAPS_SERVER_API_KEY=
# Phase 2 only — do not add until needed:
# META_APP_ID=
# META_APP_SECRET=
# EVENTBRITE_API_KEY=
```

---

## High-Level Rules for Claude Code
1. **Always read the relevant doc before starting a feature.**
2. **Never hardcode secrets or API keys.**
3. **All DB changes go in a Supabase migration file — never edit the schema directly.**
4. **Shared logic lives in `lib/` — types in `lib/types/`, utilities in `lib/utils/`.**
5. **All files are TypeScript — no `.js` files.**
6. **Row Level Security must be enabled on every Supabase table.**
7. **When adding a new page, update `docs/FEATURES.md` with its status.**
8. **Do not install Expo, NativeWind, or any React Native package. This is a web-only project until explicitly stated otherwise.**

---

## Critical Gotchas

### RLS — always write all four operations
SELECT, INSERT, UPDATE, DELETE. Omitting DELETE is a silent failure — Supabase returns no error and 0 rows affected.

### `service_role` — explicit grants required
Even with BYPASSRLS, Edge Functions need explicit table grants. Always add grants alongside `CREATE TABLE`.

### PostGIS — geography vs geometry
`farms.location` uses `GEOGRAPHY(POINT, 4326)` — not `GEOMETRY`. Use `ST_DWithin` and `ST_Distance` with geography types. Pass coordinates as `ST_Point(lng, lat)` (longitude first).

### Migration files are immutable once merged to main
Never edit an existing migration. Write a new one to alter.

### Supabase types — regenerate after every migration
Run `supabase gen types typescript --local > lib/supabase/types.ts` after every migration. Never hand-edit this file.

### Two Supabase clients
- `lib/supabase/client.ts` — browser client, use in Client Components and hooks
- `lib/supabase/server.ts` — server client, use in Server Components, Server Actions, and API routes
