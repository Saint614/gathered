CREATE OR REPLACE FUNCTION get_farms_near(
  user_lat            FLOAT,
  user_lng            FLOAT,
  radius_km           FLOAT DEFAULT 50,
  filter_types        farm_type_enum[] DEFAULT NULL,
  open_to_public_only BOOLEAN DEFAULT FALSE
)
RETURNS TABLE (
  id              UUID,
  name            TEXT,
  slug            TEXT,
  city            TEXT,
  state           TEXT,
  cover_image_url TEXT,
  avatar_url      TEXT,
  location        GEOGRAPHY,
  distance_km     FLOAT
)
LANGUAGE sql STABLE AS $$
  SELECT
    f.id,
    f.name,
    f.slug,
    f.city,
    f.state,
    f.cover_image_url,
    f.avatar_url,
    f.location,
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

GRANT EXECUTE ON FUNCTION get_farms_near TO authenticated, anon;
