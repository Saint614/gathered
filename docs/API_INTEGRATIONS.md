# API Integrations

These are Phase 2 features. Do not start until MVP is live. This doc exists so the architecture decisions made in MVP (DB schema, Edge Function scaffolding) correctly support these later.

---

## Google Maps Platform (MVP — needed from day 1)

### APIs Needed
- **Maps JavaScript API** — web map
- **Maps SDK for Android / iOS** — used via `react-native-maps` in Expo
- **Geocoding API** — convert farm address → lat/lng on farm registration
- **Places Autocomplete API** — address input on farm registration form

### Setup
1. Create project at [console.cloud.google.com](https://console.cloud.google.com)
2. Enable: Maps JS API, Geocoding API, Places API
3. Create two API keys: one for web (restrict to your domain), one for mobile (restrict to app bundle ID)
4. Add to `.env.local`

### Usage Pattern (Web — Geocoding on farm save)
```typescript
// packages/utils/src/geo.ts
export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.status !== 'OK') return null;
  const { lat, lng } = data.results[0].geometry.location;
  return { lat, lng };
}
```

### Cost Notes
- Geocoding: $5 per 1,000 requests (farm registration only — very low volume)
- Maps JS API: $7 per 1,000 loads — use session-based loading, don't re-init on every render
- $200/month free credit covers significant traffic at MVP scale

---

## Meta Graph API (Facebook + Instagram) — Phase 2

### What We Can Get
| Data | Available | Notes |
|---|---|---|
| Page name, address, phone | ✅ | Public page data |
| Page events | ✅ | Requires `pages_read_engagement` permission |
| Page posts | ⚠️ | Limited; mostly text, not structured data |
| Instagram posts | ✅ | Via Instagram Graph API (same Meta app) |
| User's list of pages they manage | ✅ | Requires `pages_show_list` permission |

### App Setup
1. Create a Meta Developer App at [developers.facebook.com](https://developers.facebook.com)
2. Add **Facebook Login** product
3. Add **Pages API** product
4. Request permissions: `pages_show_list`, `pages_read_engagement`, `pages_manage_metadata`
5. Go through Meta App Review (required for any non-test users)

> ⚠️ Meta App Review takes 1–4 weeks. Start this process early.

### OAuth Flow (Farm Owner Links Their Page)
```
1. Farm owner clicks "Connect Facebook Page" in dashboard
2. Redirect to Meta OAuth:
   https://www.facebook.com/v18.0/dialog/oauth
     ?client_id={META_APP_ID}
     &redirect_uri={YOUR_DOMAIN}/api/auth/facebook/callback
     &scope=pages_show_list,pages_read_engagement
     &response_type=code

3. Meta redirects back with ?code=...
4. Exchange code for user access token (server-side, never expose client_secret)
5. Exchange user token for page access token for the specific page
6. Store page_access_token encrypted in farm_social_links
```

### Supabase Edge Function: `sync-farm-events`
Runs on a schedule (every 6 hours via pg_cron or Supabase scheduled functions).
```typescript
// supabase/functions/sync-farm-events/index.ts
// For each farm with facebook link and sync_enabled:
//   GET https://graph.facebook.com/v18.0/{page-id}/events
//     ?fields=id,name,description,start_time,end_time,cover,place
//     &access_token={page_access_token}
// Upsert into farm_events with source='facebook', external_event_id=event.id
```

### Event Type Mapping (Facebook → Gathered)
```typescript
// Facebook doesn't have structured event types, so we infer:
const inferEventType = (name: string): string => {
  const lower = name.toLowerCase();
  if (lower.includes('open farm') || lower.includes('farm tour')) return 'open_farm_day';
  if (lower.includes('market') || lower.includes('farmers market')) return 'farmers_market';
  if (lower.includes('food truck')) return 'food_truck';
  if (lower.includes('pick') || lower.includes('u-pick')) return 'u_pick';
  if (lower.includes('csa') || lower.includes('pickup')) return 'csa_pickup';
  if (lower.includes('workshop') || lower.includes('class')) return 'workshop';
  return 'other';
};
```

---

## Eventbrite API — Phase 2

### What We Can Get
- Organizer's events (structured: title, description, date, image, ticket URL)
- Event categories
- Venue information

### Setup
1. Create an Eventbrite account and app at [eventbrite.com/platform](https://eventbrite.com/platform)
2. Get a private token for server-side calls
3. For farm owners to link their own organizer: use Eventbrite OAuth

### Key Endpoints
```
GET https://www.eventbriteapi.com/v3/organizers/{organizer_id}/events/
  ?status=live
  &token={EVENTBRITE_API_KEY}
```

### Advantage Over Facebook
Eventbrite events are structured data — dates, descriptions, images, and event types are all explicit fields. Much easier to sync cleanly than Facebook posts.

---

## Supabase Storage (MVP — needed from day 1)

### Buckets
```
farm-images/
  {farm_id}/cover.jpg
  {farm_id}/avatar.jpg
  {farm_id}/gallery/{image_id}.jpg

event-images/
  {farm_id}/{event_id}.jpg
```

### Policies
- Public read on `farm-images` and `event-images`
- Write only by authenticated farm owner (check `farms.owner_id = auth.uid()`)

### Usage Pattern
```typescript
// Upload farm cover image
const { data, error } = await supabase.storage
  .from('farm-images')
  .upload(`${farmId}/cover.jpg`, file, { upsert: true });

// Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('farm-images')
  .getPublicUrl(`${farmId}/cover.jpg`);
```

---

## Push Notifications (Phase 2 — Expo)

### Setup
- Use **Expo Push Notifications** service (free, works on iOS + Android)
- Store `expo_push_token` on the user's profile row in Supabase
- When a farm creates an event → trigger Supabase Edge Function
- Edge Function queries `user_farm_follows` for followers with `notify=true`
- Sends push via Expo Push API: `https://exp.host/--/api/v2/push/send`

### Token Registration (Mobile)
```typescript
// Register for push notifications on app load
const token = await Notifications.getExpoPushTokenAsync();
await supabase.from('profiles').update({ expo_push_token: token.data });
```
