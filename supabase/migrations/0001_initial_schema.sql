-- Extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Enum types
CREATE TYPE farm_type_enum AS ENUM (
  'produce',
  'meat',
  'dairy',
  'honey',
  'flowers',
  'orchard',
  'u_pick',
  'csa',
  'farmers_market',
  'farm_store'
);

CREATE TYPE event_source_enum AS ENUM ('native', 'facebook', 'eventbrite');

-- profiles
-- Extends auth.users. Created automatically via trigger on signup.
CREATE TABLE profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name  TEXT,
  avatar_url    TEXT,
  role          TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'farm_owner', 'admin')),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- farms
CREATE TABLE farms (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id        UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name            TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  description     TEXT,
  address         TEXT NOT NULL,
  city            TEXT NOT NULL,
  state           TEXT NOT NULL,
  zip             TEXT NOT NULL,
  location        GEOGRAPHY(POINT, 4326),
  phone           TEXT,
  email           TEXT,
  website_url     TEXT,
  cover_image_url TEXT,
  avatar_url      TEXT,
  is_verified     BOOLEAN DEFAULT FALSE,
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX farms_location_idx ON farms USING GIST (location);
CREATE INDEX farms_name_trgm_idx ON farms USING GIN (name gin_trgm_ops);

-- farm_type_tags
CREATE TABLE farm_type_tags (
  farm_id   UUID REFERENCES farms(id) ON DELETE CASCADE,
  type      farm_type_enum NOT NULL,
  PRIMARY KEY (farm_id, type)
);

-- farm_features
CREATE TABLE farm_features (
  farm_id                UUID PRIMARY KEY REFERENCES farms(id) ON DELETE CASCADE,
  open_to_public         BOOLEAN DEFAULT FALSE,
  has_farm_store         BOOLEAN DEFAULT FALSE,
  sells_online           BOOLEAN DEFAULT FALSE,
  offers_csa             BOOLEAN DEFAULT FALSE,
  pet_friendly           BOOLEAN DEFAULT FALSE,
  wheelchair_accessible  BOOLEAN DEFAULT FALSE,
  updated_at             TIMESTAMPTZ DEFAULT NOW()
);

-- farm_hours
CREATE TABLE farm_hours (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id     UUID REFERENCES farms(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  open_time   TIME,
  close_time  TIME,
  note        TEXT,
  UNIQUE (farm_id, day_of_week)
);

-- farm_social_links
CREATE TABLE farm_social_links (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id           UUID REFERENCES farms(id) ON DELETE CASCADE,
  platform          TEXT NOT NULL CHECK (platform IN ('facebook', 'instagram', 'eventbrite', 'website')),
  external_page_id  TEXT,
  page_url          TEXT NOT NULL,
  access_token      TEXT,
  token_expires_at  TIMESTAMPTZ,
  last_synced_at    TIMESTAMPTZ,
  sync_enabled      BOOLEAN DEFAULT TRUE,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (farm_id, platform)
);

-- farm_events
CREATE TABLE farm_events (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id           UUID REFERENCES farms(id) ON DELETE CASCADE,
  source            event_source_enum NOT NULL DEFAULT 'native',
  external_event_id TEXT,
  external_url      TEXT,
  title             TEXT NOT NULL,
  description       TEXT,
  event_type        TEXT CHECK (event_type IN ('open_farm_day', 'farmers_market', 'food_truck', 'u_pick', 'csa_pickup', 'workshop', 'other')),
  image_url         TEXT,
  starts_at         TIMESTAMPTZ NOT NULL,
  ends_at           TIMESTAMPTZ,
  is_recurring      BOOLEAN DEFAULT FALSE,
  recurrence_rule   TEXT,
  is_cancelled      BOOLEAN DEFAULT FALSE,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (farm_id, source, external_event_id)
);

CREATE INDEX farm_events_farm_id_idx ON farm_events (farm_id);
CREATE INDEX farm_events_starts_at_idx ON farm_events (starts_at);

-- farm_products
CREATE TABLE farm_products (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id    UUID REFERENCES farms(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  category   TEXT,
  in_season  BOOLEAN DEFAULT TRUE,
  note       TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- user_farm_follows
CREATE TABLE user_farm_follows (
  user_id    UUID REFERENCES profiles(id) ON DELETE CASCADE,
  farm_id    UUID REFERENCES farms(id) ON DELETE CASCADE,
  notify     BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, farm_id)
);

-- farm_images
CREATE TABLE farm_images (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id      UUID REFERENCES farms(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  caption      TEXT,
  sort_order   INT DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Grants to authenticated and service_role
GRANT SELECT, INSERT, UPDATE, DELETE ON profiles TO authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON farms TO authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON farm_type_tags TO authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON farm_features TO authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON farm_hours TO authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON farm_social_links TO authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON farm_events TO authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON farm_products TO authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON user_farm_follows TO authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON farm_images TO authenticated, service_role;
