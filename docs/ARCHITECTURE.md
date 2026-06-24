# Architecture

## Current Approach: Web-First

Gathered ships as a Next.js web app first. The mobile app (Expo) is deferred until the web MVP is live and validated. This keeps the initial build surface small and avoids Turborepo/Metro configuration complexity before the product has proven itself.

**When to add mobile:** After MVP success metrics are hit (see `docs/MVP.md`). At that point, evaluate whether to add an Expo app as a second repo or consolidate into a monorepo.

---

## Why These Choices

### Web: Next.js 15 (App Router)
- Server Components for fast initial loads (farm pages, search results)
- API routes for webhook endpoints (Facebook, Eventbrite callbacks — Phase 2)
- Easy Vercel deployment with zero config
- SEO matters here — farm pages should be indexable by Google ("farms near Concord NH")

### Backend: Supabase
Dedicated Gathered project. Gives us:
- **PostgreSQL + PostGIS** — relational DB with native geo query support
- **Auth** — email, Google, Apple OAuth out of the box
- **Storage** — farm photos, event images
- **Realtime** — live event feed updates (Phase 2)
- **Edge Functions** — serverless functions for webhook processing (Phase 2)
- **Row Level Security** — data access rules enforced at the DB level

### Maps: Google Maps Platform
- **Maps JavaScript API** — web map view
- **Geocoding API** — convert farm address → lat/lng on registration
- **Places Autocomplete API** — address input on farm registration form

### Styling: Tailwind CSS v4
Tailwind only. No CSS modules, no inline styles, no styled-components.
Mobile-first responsive: default = mobile browser, `md:` = tablet, `lg:` = desktop.

### State Management
- **Server state**: TanStack Query for all Supabase calls — never fetch in `useEffect`
- **Client state**: Zustand for user location and active filters
- **Forms**: React Hook Form + Zod for validation and runtime type safety

### Deployment
- **Web**: Vercel — auto-deploys on push to `main`
- **Database**: Supabase cloud (prod) + local Supabase for development

---

## Folder Structure

```
gathered/
├── CLAUDE.md
├── docs/                         ← all planning docs
├── app/                          ← Next.js App Router
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (marketing)/              ← landing page, about
│   ├── farms/
│   │   └── [slug]/               ← farm detail page
│   │       └── events/           ← farm events list
│   ├── search/                   ← discovery page with map + filters
│   ├── events/                   ← all upcoming events near user
│   └── dashboard/                ← farm owner dashboard (protected)
│       ├── profile/
│       └── events/
├── components/
│   ├── farms/                    ← FarmCard, FarmMap, FarmHeader
│   ├── events/                   ← EventCard, EventFeed
│   ├── ui/                       ← Button, Badge, Avatar, Input (shared primitives)
│   └── layout/                   ← Navbar, Footer
├── lib/
│   ├── supabase/
│   │   ├── client.ts             ← browser Supabase client
│   │   ├── server.ts             ← server Supabase client (Server Components)
│   │   └── types.ts              ← auto-generated DB types (do not edit)
│   ├── maps/                     ← Google Maps helpers, geocoding
│   ├── hooks/                    ← useLocation, useFarmsNear, useEvents
│   ├── types/                    ← Farm, FarmEvent, User, SearchFilters
│   └── utils/                    ← geo helpers, date formatting, slugify
├── supabase/
│   ├── migrations/
│   │   ├── 0001_initial_schema.sql
│   │   ├── 0002_add_rls_policies.sql
│   │   └── 0003_add_postgis.sql
│   └── functions/
│       ├── sync-farm-events/     ← Phase 2: scheduled Facebook/Eventbrite sync
│       └── facebook-webhook/     ← Phase 2: processes Facebook Page updates
├── public/
├── .env.local                    ← never commit
├── .env.example
└── package.json
```

> **Note on `lib/` vs `packages/`:** Types, utils, and Supabase helpers live in `lib/` within the single repo. If a mobile app is added later, shared logic will be extracted into a `packages/` monorepo structure at that point — not speculatively now.

---

## Data Flow

### User discovering farms
```
User opens /search
→ Browser geolocation API gets { lat, lng }
→ Zustand stores coordinates
→ TanStack Query calls Supabase RPC get_farms_near(lat, lng, radius_km)
→ Returns farms with distance, filtered by active RLS policies
→ Renders on Google Maps + sidebar list
```

### Farm owner posts a native event
```
Farm owner fills out event form in /dashboard/events
→ React Hook Form + Zod validates
→ Server Action or API route writes to Supabase
→ Event inserted into farm_events with source='native'
→ Appears on farm detail page immediately
```

### Farm event sync — Facebook (Phase 2)
```
Farm owner links Facebook Page in /dashboard/integrations
→ page_access_token stored encrypted in farm_social_links
→ Supabase Edge Function runs every 6 hours
→ Calls Meta Graph API: GET /{page-id}/events
→ Upserts events into farm_events with source='facebook'
```

---

## Mobile App — Deferred

The mobile app (Expo + React Native) is not part of the MVP. Do not scaffold it, install Expo dependencies, or configure NativeWind until the web MVP has shipped and validated.

When mobile is ready:
- Evaluate monorepo (Turborepo + pnpm workspaces) vs separate repo
- `lib/types` and `lib/utils` become `packages/types` and `packages/utils`
- Supabase client config is extracted to `packages/supabase`
- Metro bundler config requires a spike before committing to any tooling
