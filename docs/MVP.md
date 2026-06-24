# MVP Scope

## Goal

Launch a working product in one specific region (South Coast Massachusetts (Somerset / Swansea / Rehoboth / Seekonk / Westport / Dartmouth / Berkley corridor)) that:

1. Shows users local farms on a map with filters
2. Lets farm owners claim a listing and post events
3. Proves people will open the app more than once

**This is a web MVP.** Mobile app (Expo) is not in scope until the web version ships and hits success metrics. Do not build Phase 2 or 3 features until MVP is live and getting real usage.

---

## MVP Build Order

Build in this exact sequence. Each step should be fully working before moving to the next.

### Step 1 — Supabase Foundation

- [ ] Set up Supabase project (local dev + cloud)
- [ ] Run migration: enable PostGIS + pg_trgm, create all tables from `docs/DATABASE.md`
- [ ] Run migration: add RLS policies
- [ ] Run migration: create `get_farms_near` RPC function
- [ ] Generate TypeScript types → `lib/supabase/types.ts`
- [ ] Seed 10–20 real New Hampshire farms manually for testing

### Step 2 — Next.js Project Setup

- [ ] Init Next.js 15 with App Router, TypeScript strict, Tailwind v4
- [ ] Configure Supabase browser + server clients in `lib/supabase/`
- [ ] Set up `.env.local` and `.env.example`
- [ ] Install TanStack Query, Zustand, React Hook Form, Zod
- [ ] Confirm `npm run dev` runs and `npm run typecheck` passes clean

### Step 3 — Auth (Web)

- [ ] Supabase Auth configured (email + Google)
- [ ] Login page (`/login`)
- [ ] Register page (`/register`)
- [ ] Auth middleware protecting `/dashboard` routes
- [ ] Profile auto-created on signup via DB trigger

### Step 4 — Farm Discovery (Web)

- [ ] `/search` page with Google Maps JavaScript API embed
- [ ] Call `get_farms_near` RPC with browser geolocation
- [ ] Farm pins on map
- [ ] Sidebar list of farms sorted by distance
- [ ] Filter chips: Produce, Meat, Open to Public, Farmers Market
- [ ] Click farm pin → highlight in list + show mini info card

### Step 5 — Farm Detail Page (Web)

- [ ] `/farms/[slug]` — farm name, description, address, hours
- [ ] Cover image + avatar
- [ ] Type badges (Produce, Meat, etc.)
- [ ] "Open to Public" badge if applicable
- [ ] Products available section
- [ ] Events tab (upcoming events from `farm_events`)
- [ ] "Get Directions" button (links to Google Maps)

### Step 6 — Farm Owner Dashboard (Web)

- [ ] `/dashboard` — overview with quick stats
- [ ] `/dashboard/profile` — edit all farm info
- [ ] Address → Geocoding API → save `location` PostGIS point
- [ ] Upload cover + avatar to Supabase Storage
- [ ] Set farm type tags
- [ ] Set farm features (open to public, etc.)
- [ ] Set operating hours

### Step 7 — Events (Web)

- [ ] `/dashboard/events` — list of farm's events
- [ ] Create event form (title, type, date/time, description, image)
- [ ] Edit / cancel event
- [ ] `/events` page — all upcoming events near user's location
- [ ] Events tab on farm detail page

### Step 8 — Polish & Launch Prep

- [ ] Responsive design audit (web — mobile browser, this is not the native app)
- [ ] Empty states (no farms near you, no upcoming events)
- [ ] Error states (location denied, network error)
- [ ] Loading skeletons
- [ ] SEO metadata on farm pages (Next.js `generateMetadata`)
- [ ] Sitemap for farm pages
- [ ] Farm registration / claim flow (public form to request a listing)

---

## What is Explicitly NOT in MVP

- Mobile app (Expo) — deferred until web MVP validates
- Facebook / Eventbrite sync — farms post natively only
- Push notifications
- Following farms
- Reviews or ratings
- Admin panel
- Featured listings / monetization
- Photo gallery (just cover image + avatar)
- Apple OAuth (required before any iOS submission — not needed for web)

---

## Post-MVP: Mobile App

Once success metrics are hit, the mobile app decision looks like this:

- New `gathered-mobile` Expo repo that consumes the same Supabase project
- Or monorepo consolidation — evaluate at that point based on how much logic actually needs sharing
- Do not make this decision speculatively. Build it when there's evidence users want a native app.

---

## MVP Success Metrics

After launch, these are the numbers that tell us if it's working:

| Metric                                         | Target at 60 days     |
| ---------------------------------------------- | --------------------- |
| Farms listed                                   | 50+ in NH/New England |
| Farms with claimed profiles                    | 15+                   |
| Monthly active users                           | 200+                  |
| Events posted                                  | 30+                   |
| Return visit rate (users who open it 2+ times) | >30%                  |

If these numbers are hit → build Phase 2 (social features, Facebook sync, mobile app).
If not → talk to users first before building more.
