# Features

Status key: `[ ]` not started · `[~]` in progress · `[x]` complete

---

## Phase 1 — MVP (Launch Target)
> Goal: enough to validate that users will use it and farms will claim listings.
> See `docs/MVP.md` for scope detail.

### Discovery (User-Facing)
- [ ] Location permission prompt (mobile) / browser geolocation (web)
- [ ] Map view showing nearby farms
- [ ] List view of nearby farms (sorted by distance)
- [ ] Farm type filters: produce, meat, dairy, open to public, farmers market, farm store
- [ ] Search by name or city
- [ ] Farm detail page — info, photos, hours, products available
- [ ] Farm events tab on farm detail page
- [ ] "Get directions" button (links to Apple Maps / Google Maps)

### Farm Profiles
- [ ] Farm registration form (name, address, type, description)
- [ ] Farm owner dashboard (simple — edit profile, manage events)
- [ ] Upload cover photo and avatar
- [ ] Set operating hours
- [ ] Add/edit products currently available
- [ ] Mark farm as "open to public"

### Events
- [ ] Farm owner creates a native event (title, date/time, description, image, type)
- [ ] Event shows on farm detail page
- [ ] Events feed — upcoming events near user (across all farms)
- [ ] Event detail view

### Auth
- [ ] Sign up / log in (email + password)
- [ ] Google OAuth
- [ ] Apple OAuth (required for iOS App Store)
- [ ] Role assignment: user vs farm_owner

---

## Phase 2 — Growth Features

### Social / Engagement
- [ ] Follow a farm
- [ ] Push notifications for followed farm events (mobile)
- [ ] Email notifications for followed farm events (web)
- [ ] "Farms I Follow" tab in user account
- [ ] Farm follower count shown on farm page

### External Integrations
- [ ] Link Facebook Page to farm profile
- [ ] Auto-sync Facebook events every 6 hours (Edge Function)
- [ ] Link Eventbrite organizer to farm profile
- [ ] Auto-sync Eventbrite events
- [ ] "View original on Facebook/Eventbrite" link on synced events

### Enhanced Discovery
- [ ] Filter by "has events this weekend"
- [ ] Filter by specific farm type (u-pick, CSA, etc.)
- [ ] Seasonal availability badges on farm cards
- [ ] "New farms near you" weekly digest email

### Farm Owner Tools
- [ ] Integration status dashboard (last synced, errors)
- [ ] Event analytics (views, clicks)
- [ ] Product availability quick-update (mobile-friendly toggle)
- [ ] Photo gallery management

---

## Phase 3 — Monetization & Scale

### Farm Owner Premium
- [ ] Featured placement in search results
- [ ] "Verified Farm" badge (admin reviewed)
- [ ] Promoted events
- [ ] Advanced analytics

### Platform
- [ ] Admin dashboard (verify farms, moderate content, manage reports)
- [ ] Farm claiming flow (for pre-seeded farm records)
- [ ] USDA National Farmers Market Directory import
- [ ] Crowdsourced farm submissions (users suggest farms)
- [ ] Report incorrect info on a farm listing

### Community
- [ ] Reviews / ratings for farms
- [ ] Photo uploads from visitors
- [ ] Q&A on farm pages ("Do you ship?" "Are dogs allowed?")

---

## Screen / Page Inventory

### Web (Next.js)
| Route | Description | Phase |
|---|---|---|
| `/` | Marketing landing page | 1 |
| `/search` | Map + list discovery | 1 |
| `/farms/[slug]` | Farm detail page | 1 |
| `/farms/[slug]/events` | Farm events list | 1 |
| `/events` | All upcoming events near user | 1 |
| `/login` | Auth page | 1 |
| `/register` | Sign up | 1 |
| `/dashboard` | Farm owner dashboard home | 1 |
| `/dashboard/profile` | Edit farm profile | 1 |
| `/dashboard/events` | Manage events | 1 |
| `/dashboard/integrations` | Link Facebook, Eventbrite | 2 |
| `/dashboard/analytics` | Event + profile views | 3 |
| `/account` | User settings, followed farms | 2 |
| `/admin` | Admin panel | 3 |

### Mobile (Expo Router)
| Screen | Description | Phase |
|---|---|---|
| `(tabs)/index` | Discover map tab | 1 |
| `(tabs)/search` | Search + filter tab | 1 |
| `(tabs)/events` | Events feed near me | 1 |
| `(tabs)/saved` | Followed farms | 2 |
| `(tabs)/profile` | User profile + settings | 1 |
| `farm/[id]` | Farm detail | 1 |
| `farm/[id]/events` | Farm events | 1 |
| `onboarding/location` | Location permission screen | 1 |
| `onboarding/interests` | Farm type interests | 2 |
| `auth/login` | Login | 1 |
| `auth/register` | Sign up | 1 |
