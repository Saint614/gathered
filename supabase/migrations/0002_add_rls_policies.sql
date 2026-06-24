-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE farm_type_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE farm_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE farm_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE farm_social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE farm_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE farm_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_farm_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE farm_images ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- profiles
-- INSERT is handled by the trigger below; no direct INSERT policy.
-- ============================================================
CREATE POLICY "profiles_select_own"
  ON profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  USING (id = auth.uid());

-- ============================================================
-- farms
-- ============================================================
CREATE POLICY "farms_select_active"
  ON farms FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "farms_insert_authenticated"
  ON farms FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "farms_update_owner"
  ON farms FOR UPDATE
  USING (owner_id = auth.uid());

CREATE POLICY "farms_delete_admin"
  ON farms FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  );

-- ============================================================
-- farm_type_tags
-- ============================================================
CREATE POLICY "farm_type_tags_select_public"
  ON farm_type_tags FOR SELECT
  USING (TRUE);

CREATE POLICY "farm_type_tags_insert_owner"
  ON farm_type_tags FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM farms
      WHERE farms.id = farm_type_tags.farm_id
        AND farms.owner_id = auth.uid()
    )
  );

CREATE POLICY "farm_type_tags_update_owner"
  ON farm_type_tags FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM farms
      WHERE farms.id = farm_type_tags.farm_id
        AND farms.owner_id = auth.uid()
    )
  );

CREATE POLICY "farm_type_tags_delete_owner"
  ON farm_type_tags FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM farms
      WHERE farms.id = farm_type_tags.farm_id
        AND farms.owner_id = auth.uid()
    )
  );

-- ============================================================
-- farm_features
-- ============================================================
CREATE POLICY "farm_features_select_public"
  ON farm_features FOR SELECT
  USING (TRUE);

CREATE POLICY "farm_features_insert_owner"
  ON farm_features FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM farms
      WHERE farms.id = farm_features.farm_id
        AND farms.owner_id = auth.uid()
    )
  );

CREATE POLICY "farm_features_update_owner"
  ON farm_features FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM farms
      WHERE farms.id = farm_features.farm_id
        AND farms.owner_id = auth.uid()
    )
  );

CREATE POLICY "farm_features_delete_owner"
  ON farm_features FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM farms
      WHERE farms.id = farm_features.farm_id
        AND farms.owner_id = auth.uid()
    )
  );

-- ============================================================
-- farm_hours
-- ============================================================
CREATE POLICY "farm_hours_select_public"
  ON farm_hours FOR SELECT
  USING (TRUE);

CREATE POLICY "farm_hours_insert_owner"
  ON farm_hours FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM farms
      WHERE farms.id = farm_hours.farm_id
        AND farms.owner_id = auth.uid()
    )
  );

CREATE POLICY "farm_hours_update_owner"
  ON farm_hours FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM farms
      WHERE farms.id = farm_hours.farm_id
        AND farms.owner_id = auth.uid()
    )
  );

CREATE POLICY "farm_hours_delete_owner"
  ON farm_hours FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM farms
      WHERE farms.id = farm_hours.farm_id
        AND farms.owner_id = auth.uid()
    )
  );

-- ============================================================
-- farm_social_links (owner only for all ops)
-- ============================================================
CREATE POLICY "farm_social_links_select_owner"
  ON farm_social_links FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM farms
      WHERE farms.id = farm_social_links.farm_id
        AND farms.owner_id = auth.uid()
    )
  );

CREATE POLICY "farm_social_links_insert_owner"
  ON farm_social_links FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM farms
      WHERE farms.id = farm_social_links.farm_id
        AND farms.owner_id = auth.uid()
    )
  );

CREATE POLICY "farm_social_links_update_owner"
  ON farm_social_links FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM farms
      WHERE farms.id = farm_social_links.farm_id
        AND farms.owner_id = auth.uid()
    )
  );

CREATE POLICY "farm_social_links_delete_owner"
  ON farm_social_links FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM farms
      WHERE farms.id = farm_social_links.farm_id
        AND farms.owner_id = auth.uid()
    )
  );

-- ============================================================
-- farm_events
-- SELECT is public; INSERT/UPDATE/DELETE require farm ownership
-- ============================================================
CREATE POLICY "farm_events_select_public"
  ON farm_events FOR SELECT
  USING (TRUE);

CREATE POLICY "farm_events_insert_owner"
  ON farm_events FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM farms
      WHERE farms.id = farm_events.farm_id
        AND farms.owner_id = auth.uid()
    )
  );

CREATE POLICY "farm_events_update_owner"
  ON farm_events FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM farms
      WHERE farms.id = farm_events.farm_id
        AND farms.owner_id = auth.uid()
    )
  );

CREATE POLICY "farm_events_delete_owner"
  ON farm_events FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM farms
      WHERE farms.id = farm_events.farm_id
        AND farms.owner_id = auth.uid()
    )
  );

-- ============================================================
-- farm_products
-- SELECT is public; INSERT/UPDATE/DELETE require farm ownership
-- ============================================================
CREATE POLICY "farm_products_select_public"
  ON farm_products FOR SELECT
  USING (TRUE);

CREATE POLICY "farm_products_insert_owner"
  ON farm_products FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM farms
      WHERE farms.id = farm_products.farm_id
        AND farms.owner_id = auth.uid()
    )
  );

CREATE POLICY "farm_products_update_owner"
  ON farm_products FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM farms
      WHERE farms.id = farm_products.farm_id
        AND farms.owner_id = auth.uid()
    )
  );

CREATE POLICY "farm_products_delete_owner"
  ON farm_products FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM farms
      WHERE farms.id = farm_products.farm_id
        AND farms.owner_id = auth.uid()
    )
  );

-- ============================================================
-- user_farm_follows
-- ============================================================
CREATE POLICY "user_farm_follows_select_own"
  ON user_farm_follows FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "user_farm_follows_insert_authenticated"
  ON user_farm_follows FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "user_farm_follows_update_own"
  ON user_farm_follows FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "user_farm_follows_delete_own"
  ON user_farm_follows FOR DELETE
  USING (user_id = auth.uid());

-- ============================================================
-- farm_images
-- SELECT is public; INSERT/UPDATE/DELETE require farm ownership
-- ============================================================
CREATE POLICY "farm_images_select_public"
  ON farm_images FOR SELECT
  USING (TRUE);

CREATE POLICY "farm_images_insert_owner"
  ON farm_images FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM farms
      WHERE farms.id = farm_images.farm_id
        AND farms.owner_id = auth.uid()
    )
  );

CREATE POLICY "farm_images_update_owner"
  ON farm_images FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM farms
      WHERE farms.id = farm_images.farm_id
        AND farms.owner_id = auth.uid()
    )
  );

CREATE POLICY "farm_images_delete_owner"
  ON farm_images FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM farms
      WHERE farms.id = farm_images.farm_id
        AND farms.owner_id = auth.uid()
    )
  );

-- ============================================================
-- Auto-create profile on signup
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
