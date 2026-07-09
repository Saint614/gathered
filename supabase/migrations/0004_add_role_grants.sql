-- Role grants for anon, authenticated, and service_role.
-- RLS policies control row-level visibility; these grants allow the roles
-- to reach the tables at all. Without these, Postgres denies access
-- before RLS policies are even evaluated.

-- ── anon: read-only access to public data ──────────────────────────────────
GRANT SELECT ON public.farms             TO anon;
GRANT SELECT ON public.farm_type_tags    TO anon;
GRANT SELECT ON public.farm_features     TO anon;
GRANT SELECT ON public.farm_hours        TO anon;
GRANT SELECT ON public.farm_events       TO anon;
GRANT SELECT ON public.farm_products     TO anon;
GRANT SELECT ON public.farm_images       TO anon;

-- ── authenticated: read + write where RLS policies permit ──────────────────
GRANT SELECT, INSERT, UPDATE, DELETE ON public.farms             TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.farm_type_tags    TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.farm_features     TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.farm_hours        TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.farm_events       TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.farm_products     TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.farm_images       TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.farm_social_links TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_farm_follows TO authenticated;
GRANT SELECT, UPDATE                 ON public.profiles          TO authenticated;

-- ── service_role: full access for Edge Functions ───────────────────────────
GRANT SELECT, INSERT, UPDATE, DELETE ON public.farms             TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.farm_type_tags    TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.farm_features     TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.farm_hours        TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.farm_events       TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.farm_products     TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.farm_images       TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.farm_social_links TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_farm_follows TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles          TO service_role;
