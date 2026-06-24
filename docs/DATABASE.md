# Database Schema

All tables live in Supabase (PostgreSQL). Use PostGIS for geo queries.
Every migration goes in `supabase/migrations/`. Never edit prod schema directly.

---

## Extensions Required
```sql
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pg_trgm; -- for fuzzy text search on farm names
```

---

## Tables

### `profiles`
Extends Supabase auth.users. Created automatically via trigger on signup.
```sql
CREATE TABLE profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name  TEXT,
  avatar_url    TEXT,
  role          TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'farm_owner', 'admin')),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
```

---

### `farms`
Core farm record. One farm can have one owner (profile).
```sql
CREATE TABLE farms (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id        UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name            TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,         -- URL: /farms/maple-hill-farm
  description     TEXT,
  address         TEXT NOT NULL,
  city            TEXT NOT NULL,
  state           TEXT NOT NULL,
  zip             TEXT NOT NULL,
  location        GEOGRAPHY(POINT, 4326),       -- PostGIS point (lng, lat)
  phone           TEXT,
  email           TEXT,
  website_url     TEXT,
  cover_image_url TEXT,
  avatar_url      TEXT,
  is_verified     BOOLEAN DEFAULT FALSE,        -- admin verifies listing
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Spatial index for fast geo queries
CREATE INDEX farms_location_idx ON farms USING GIST (location);
-- Text search index
CREATE INDEX farms_name_trgm_idx ON farms USING GIN (name gin_trgm_ops);
```

---

### `farm_types`
A farm can have multiple types (many-to-many).
```sql
CREATE TYPE farm_type_enum AS ENUM (
  'produce',          -- vegetables, fruit
  'meat',             -- beef, pork, poultry, etc.
  'dairy',            -- milk, cheese, eggs
  'honey',
  'flowers',
  'orchard',          -- apples, peaches, etc.
  'u_pick',           -- you-pick operation
  'csa',              -- Community Supported Agriculture
  'farmers_market',   -- a market, not a farm
  'farm_store'        -- retail store selling local goods
);

CREATE TABLE farm_type_tags (
  farm_id   UUID REFERENCES farms(id) ON DELETE CASCADE,
  type      farm_type_enum NOT NULL,
  PRIMARY KEY (farm_id, type)
);
```

---

### `farm_features`
Flags for filterable features.
```sql
CREATE TABLE farm_features (
  farm_id                  UUID PRIMARY KEY REFERENCES farms(id) ON DELETE CASCADE,
  open_to_public           BOOLEAN DEFAULT FALSE,   -- tours, visits allowed
  has_farm_store           BOOLEAN DEFAULT FALSE,
  sells_online             BOOLEAN DEFAULT FALSE,
  offers_csa               BOOLEAN DEFAULT FALSE,
  pet_friendly             BOOLEAN DEFAULT FALSE,
  wheelchair_accessible    BOOLEAN DEFAULT FALSE,
  updated_at               TIMESTAMPTZ DEFAULT NOW()
);
```

---

### `farm_hours`
Operating hours per day of week. NULL = closed that day.
```sql
CREATE TABLE farm_hours (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id   UUID REFERENCES farms(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday
  open_time   TIME,
  close_time  TIME,
  note        TEXT,                                              -- e.g. "Seasonal only"
  UNIQUE (farm_id, day_of_week)
);
```

---

### `farm_social_links`
Linked external accounts per farm.
```sql
CREATE TABLE farm_social_links (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id             UUID REFERENCES farms(id) ON DELETE CASCADE,
  platform            TEXT NOT NULL CHECK (platform IN ('facebook', 'instagram', 'eventbrite', 'website')),
  external_page_id    TEXT,                         -- Facebook page ID, Eventbrite organizer ID
  page_url            TEXT NOT NULL,
  access_token        TEXT,                         -- encrypted; only for farm owner's own pages
  token_expires_at    TIMESTAMPTZ,
  last_synced_at      TIMESTAMPTZ,
  sync_enabled        BOOLEAN DEFAULT TRUE,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (farm_id, platform)
);
```
> ⚠️ `access_token` must be encrypted at rest. Use Supabase Vault or encrypt before insert.

---

### `farm_events`
Events from any source — Facebook, Eventbrite, or posted natively.
```sql
CREATE TYPE event_source_enum AS ENUM ('native', 'facebook', 'eventbrite');

CREATE TABLE farm_events (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id             UUID REFERENCES farms(id) ON DELETE CASCADE,
  source              event_source_enum NOT NULL DEFAULT 'native',
  external_event_id   TEXT,                         -- ID from Facebook or Eventbrite
  external_url        TEXT,                         -- link back to original
  title               TEXT NOT NULL,
  description         TEXT,
  event_type          TEXT CHECK (event_type IN ('open_farm_day', 'farmers_market', 'food_truck', 'u_pick', 'csa_pickup', 'workshop', 'other')),
  image_url           TEXT,
  starts_at           TIMESTAMPTZ NOT NULL,
  ends_at             TIMESTAMPTZ,
  is_recurring        BOOLEAN DEFAULT FALSE,
  recurrence_rule     TEXT,                         -- iCal RRULE string
  is_cancelled        BOOLEAN DEFAULT FALSE,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (farm_id, source, external_event_id)       -- prevent duplicate syncs
);

CREATE INDEX farm_events_farm_id_idx ON farm_events (farm_id);
CREATE INDEX farm_events_starts_at_idx ON farm_events (starts_at);
```

---

### `farm_products`
What a farm currently has available. Farm owners update this.
```sql
CREATE TABLE farm_products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id     UUID REFERENCES farms(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,              -- "Heirloom Tomatoes", "Pastured Eggs"
  category    TEXT,                       -- "Vegetables", "Eggs & Dairy"
  in_season   BOOLEAN DEFAULT TRUE,
  note        TEXT,                       -- "Available June–September"
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
```

---

### `user_farm_follows`
Users following farms to get notifications.
```sql
CREATE TABLE user_farm_follows (
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE,
  farm_id     UUID REFERENCES farms(id) ON DELETE CASCADE,
  notify      BOOLEAN DEFAULT TRUE,       -- whether to send push notifications
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, farm_id)
);
```

---

### `farm_images`
Photo gallery for a farm.
```sql
CREATE TABLE farm_images (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id     UUID REFERENCES farms(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,             -- Supabase storage path
  caption     TEXT,
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Key Supabase RPC Functions

### `get_farms_near(lat, lng, radius_km, filters)`
Used for the main discovery map/list. Returns farms sorted by distance.
```sql
CREATE OR REPLACE FUNCTION get_farms_near(
  user_lat    FLOAT,
  user_lng    FLOAT,
  radius_km   FLOAT DEFAULT 50,
  filter_types farm_type_enum[] DEFAULT NULL,
  open_to_public_only BOOLEAN DEFAULT FALSE
)
RETURNS TABLE (
  id UUID, name TEXT, slug TEXT, city TEXT, state TEXT,
  cover_image_url TEXT, avatar_url TEXT, location GEOGRAPHY,
  distance_km FLOAT
)
LANGUAGE sql STABLE AS $$
  SELECT
    f.id, f.name, f.slug, f.city, f.state,
    f.cover_image_url, f.avatar_url, f.location,
    ST_Distance(f.location, ST_Point(user_lng, user_lat)::GEOGRAPHY) / 1000 AS distance_km
  FROM farms f
  LEFT JOIN farm_features ff ON ff.farm_id = f.id
  WHERE
    f.is_active = TRUE
    AND ST_DWithin(f.location, ST_Point(user_lng, user_lat)::GEOGRAPHY, radius_km * 1000)
    AND (filter_types IS NULL OR EXISTS (
      SELECT 1 FROM farm_type_tags ftt
      WHERE ftt.farm_id = f.id AND ftt.type = ANY(filter_types)
    ))
    AND (open_to_public_only = FALSE OR ff.open_to_public = TRUE)
  ORDER BY distance_km;
$$;
```

---

## RLS Policies (Summary)

| Table | Select | Insert | Update | Delete |
|---|---|---|---|---|
| `profiles` | own row | on signup (trigger) | own row | no |
| `farms` | all active | authenticated | owner only | admin only |
| `farm_events` | all | owner only | owner only | owner only |
| `farm_social_links` | owner only | owner only | owner only | owner only |
| `user_farm_follows` | own rows | authenticated | own rows | own rows |
| `farm_products` | all | owner only | owner only | owner only |

> Every table must have RLS enabled. Default deny, then add explicit policies.
