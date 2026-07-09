-- Dev seed data — South Coast MA / southeastern New England farms
-- Safe to re-run: farms use ON CONFLICT (slug) DO NOTHING; related tables use ON CONFLICT DO NOTHING

-- ============================================================
-- FARMS
-- ============================================================
INSERT INTO farms (id, name, slug, description, address, city, state, zip, location, phone, is_active, is_verified)
VALUES

-- Westport, MA
('00000000-0000-0000-0000-000000000001',
 'Aeonian Farm',
 'aeonian-farm',
 'A small family produce farm in Westport offering seasonal vegetables, CSA shares, and a welcoming farm stand open to the public.',
 '254 Old County Rd',
 'Westport', 'MA', '02790',
 ST_Point(-71.0682, 41.5831)::GEOGRAPHY,
 NULL, TRUE, FALSE),

('00000000-0000-0000-0000-000000000002',
 'Hilltop Farm',
 'hilltop-farm',
 'A 28-acre family farm in Westport growing a diverse mix of vegetables and offering CSA shares. The farm stand is open to the public throughout the growing season.',
 '672 Drift Rd',
 'Westport', 'MA', '02790',
 ST_Point(-71.0721, 41.5762)::GEOGRAPHY,
 NULL, TRUE, FALSE),

('00000000-0000-0000-0000-000000000003',
 'Cluck & Trowel',
 'cluck-and-trowel',
 'A vibrant Westport farm specializing in seasonal vegetables and cut flowers. Visit the on-site farm store for fresh produce, bouquets, and locally made goods.',
 '128 Sodom Rd',
 'Westport', 'MA', '02790',
 ST_Point(-71.0835, 41.5893)::GEOGRAPHY,
 NULL, TRUE, FALSE),

('00000000-0000-0000-0000-000000000004',
 'Golden Touch Farm',
 'golden-touch-farm',
 'Home to a herd of alpacas, Golden Touch Farm offers a charming farm store stocked with alpaca fiber products including yarn, roving, and finished goods. Open to the public.',
 '345 Hix Bridge Rd',
 'Westport', 'MA', '02790',
 ST_Point(-71.0903, 41.5778)::GEOGRAPHY,
 NULL, TRUE, FALSE),

('00000000-0000-0000-0000-000000000005',
 'Shy Brothers Farm',
 'shy-brothers-farm',
 'Shy Brothers Farm produces handcrafted artisan cheeses from their dairy herd in Westport. Their farm store carries fresh and aged cheeses made on the property.',
 '483 Crooked Ln',
 'Westport', 'MA', '02790',
 ST_Point(-71.0612, 41.5852)::GEOGRAPHY,
 NULL, TRUE, FALSE),

('00000000-0000-0000-0000-000000000006',
 'Westport Rivers Vineyard & Winery',
 'westport-rivers-vineyard',
 'One of the northernmost vineyards in the eastern United States, Westport Rivers has been producing estate wines from their Westport farm since 1988. Visit the farm store and tasting room, open to the public.',
 '417 Hix Bridge Rd',
 'Westport', 'MA', '02790',
 ST_Point(-71.0649, 41.5685)::GEOGRAPHY,
 NULL, TRUE, FALSE),

('00000000-0000-0000-0000-000000000007',
 'Westport Farmers'' Market',
 'westport-farmers-market',
 'A weekly outdoor farmers'' market held Saturday mornings at the Westport Town Hall Annex. Local vendors offer fresh produce, meats, dairy, baked goods, flowers, and artisan products from the South Coast region.',
 '856 Main Rd',
 'Westport', 'MA', '02790',
 ST_Point(-71.0801, 41.5901)::GEOGRAPHY,
 NULL, TRUE, FALSE),

-- South Dartmouth, MA
('00000000-0000-0000-0000-000000000008',
 'Apponagansett Farm',
 'apponagansett-farm',
 'A working farm in South Dartmouth producing vegetables and eggs. CSA shares are available seasonally, and the farm welcomes visitors to purchase fresh produce directly.',
 '111 Smith Neck Rd',
 'South Dartmouth', 'MA', '02748',
 ST_Point(-70.9891, 41.5812)::GEOGRAPHY,
 NULL, TRUE, FALSE),

('00000000-0000-0000-0000-000000000009',
 'Smith Neck Farm',
 'smith-neck-farm',
 'A small produce farm tucked away on Smith Neck Road in South Dartmouth, offering fresh seasonal vegetables to the local community.',
 '74 Smith Neck Rd',
 'South Dartmouth', 'MA', '02748',
 ST_Point(-70.9783, 41.5645)::GEOGRAPHY,
 NULL, TRUE, FALSE),

('00000000-0000-0000-0000-000000000010',
 'Round the Bend Farm',
 'round-the-bend-farm',
 'A 115-acre working farm and educational nonprofit in South Dartmouth raising heritage breeds including Tamworth pigs and Irish Dexter cattle. The farm produces goat''s milk, artisan cheese, and seasonal vegetables. Open year-round for frozen meats and seasonal items; farm tours and workshops offered throughout the year. CSA shares available.',
 '92 Allen Neck Rd',
 'South Dartmouth', 'MA', '02748',
 ST_Point(-70.9913, 41.5698)::GEOGRAPHY,
 NULL, TRUE, FALSE),

-- Dartmouth, MA
('00000000-0000-0000-0000-000000000011',
 'Dartmouth Farmers'' Market',
 'dartmouth-farmers-market',
 'A weekly Friday farmers'' market held in the parking lot of St. Mary''s Church in Dartmouth. Local farmers and artisans sell fresh produce, meats, baked goods, and handmade products every Friday from noon to 5pm.',
 '789 Dartmouth St',
 'Dartmouth', 'MA', '02747',
 ST_Point(-70.9320, 41.6223)::GEOGRAPHY,
 NULL, TRUE, FALSE),

-- Rehoboth, MA
('00000000-0000-0000-0000-000000000012',
 'Bettencourt Dairy Farm',
 'bettencourt-dairy-farm',
 'Established in 1891, Bettencourt Dairy Farm is the longest-running family farm in Rehoboth. The farm store carries raw milk, fresh eggs, beef, chicken, and homemade Gouda cheese made on the property. A true South Coast institution.',
 '258 Anawan St',
 'Rehoboth', 'MA', '02769',
 ST_Point(-71.4621, 41.8355)::GEOGRAPHY,
 NULL, TRUE, FALSE),

('00000000-0000-0000-0000-000000000013',
 'Meadow River Farm',
 'meadow-river-farm',
 'A Rehoboth poultry farm specializing in pasture-raised chicken, turkey, and other fowl. Meadow River Farm focuses on humane, low-stress raising practices for quality meat production.',
 '136 Perryville Rd',
 'Rehoboth', 'MA', '02769',
 ST_Point(-71.4528, 41.8442)::GEOGRAPHY,
 NULL, TRUE, FALSE),

-- Seekonk, MA
('00000000-0000-0000-0000-000000000014',
 'Hocus Pocus Farm',
 'hocus-pocus-farm',
 'A queer-owned, non-GMO, chemical-free farm in Seekonk producing seasonal vegetables and flowers. Hocus Pocus Farm offers CSA shares and is committed to inclusive, sustainable agriculture.',
 '392 Taunton Ave',
 'Seekonk', 'MA', '02771',
 ST_Point(-71.3217, 41.8368)::GEOGRAPHY,
 NULL, TRUE, FALSE),

-- Swansea, MA
('00000000-0000-0000-0000-000000000015',
 'Stony Creek Farm',
 'stony-creek-farm',
 'A family farm in Swansea raising 100% grass-fed beef sold direct to consumers. The farm stand is open to the public Thursday through Sunday. Stony Creek also hosts the Swansea Farmers'' Market on Sunday mornings.',
 '1210 Wilbur Ave',
 'Swansea', 'MA', '02777',
 ST_Point(-71.2178, 41.7621)::GEOGRAPHY,
 NULL, TRUE, FALSE),

('00000000-0000-0000-0000-000000000016',
 'Swansea Farmers'' Market',
 'swansea-farmers-market',
 'A Sunday morning farmers'' market hosted at Stony Creek Farm on Wilbur Avenue in Swansea. Local vendors offer fresh produce, meats, dairy, baked goods, and artisan goods from 10am to 2pm.',
 '1210 Wilbur Ave',
 'Swansea', 'MA', '02777',
 ST_Point(-71.2165, 41.7634)::GEOGRAPHY,
 NULL, TRUE, FALSE),

-- Somerset, MA
('00000000-0000-0000-0000-000000000017',
 'Quittacas Farm',
 'quittacas-farm',
 'A sustainable farm in Somerset raising pastured beef cattle and chickens alongside seasonal vegetables. CSA shares run June through October. Quittacas Farm is committed to regenerative, chemical-free growing practices.',
 '87 Riverside Ave',
 'Somerset', 'MA', '02726',
 ST_Point(-71.1495, 41.7415)::GEOGRAPHY,
 NULL, TRUE, FALSE),

-- Berkley, MA
('00000000-0000-0000-0000-000000000018',
 'Heart Beets Farm',
 'heart-beets-farm',
 'A certified organic vegetable farm in Berkley founded in 2014 by Stephen and Sarah Murray. Heart Beets offers spring, summer, and fall CSA shares using chemical-free, organic practices.',
 '125 Bay View Ave',
 'Berkley', 'MA', '02779',
 ST_Point(-71.0791, 41.8312)::GEOGRAPHY,
 NULL, TRUE, FALSE),

('00000000-0000-0000-0000-000000000019',
 'Rock N'' Hill Farm',
 'rock-n-hill-farm',
 'A Berkley farm producing 100% grass-fed Angus beef that is USDA certified. Rock N'' Hill Farm sells direct to consumers with a focus on pasture-raised, sustainable beef.',
 '312 Berkley St',
 'Berkley', 'MA', '02779',
 ST_Point(-71.0901, 41.8438)::GEOGRAPHY,
 NULL, TRUE, FALSE),

('00000000-0000-0000-0000-000000000020',
 'Full EnVision Farm',
 'full-envision-farm',
 'A 41-acre equestrian and agritourism farm in Berkley home to horses, alpacas, goats, bunnies, chickens, and turkeys. Full EnVision Farm offers farm tours, events, workshops, and an on-site farm store.',
 '115R S Main St',
 'Berkley', 'MA', '02779',
 ST_Point(-71.08530, 41.82083)::GEOGRAPHY,
 NULL, TRUE, FALSE),

-- Tiverton, RI
('00000000-0000-0000-0000-000000000021',
 'Arruda''s Dairy',
 'arrudas-dairy',
 'A family-owned dairy farm in Tiverton, RI operating since 1917. This 180-acre farm milks 130 cows and is famous throughout the South Coast for its coffee milk, chocolate milk, strawberry milk, and seasonal eggnog. The farm store also carries Red Barn Beef, USDA certified from their own herd.',
 '408 Stafford Rd',
 'Tiverton', 'RI', '02878',
 ST_Point(-71.1958, 41.6245)::GEOGRAPHY,
 '(401) 624-8898', TRUE, FALSE)

ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- FARM TYPE TAGS
-- ============================================================
INSERT INTO farm_type_tags (farm_id, type) VALUES

-- 1. Aeonian Farm — produce, csa
('00000000-0000-0000-0000-000000000001', 'produce'),
('00000000-0000-0000-0000-000000000001', 'csa'),

-- 2. Hilltop Farm — produce, csa
('00000000-0000-0000-0000-000000000002', 'produce'),
('00000000-0000-0000-0000-000000000002', 'csa'),

-- 3. Cluck & Trowel — produce, flowers, farm_store
('00000000-0000-0000-0000-000000000003', 'produce'),
('00000000-0000-0000-0000-000000000003', 'flowers'),
('00000000-0000-0000-0000-000000000003', 'farm_store'),

-- 4. Golden Touch Farm — farm_store
('00000000-0000-0000-0000-000000000004', 'farm_store'),

-- 5. Shy Brothers Farm — dairy, farm_store
('00000000-0000-0000-0000-000000000005', 'dairy'),
('00000000-0000-0000-0000-000000000005', 'farm_store'),

-- 6. Westport Rivers Vineyard & Winery — farm_store
('00000000-0000-0000-0000-000000000006', 'farm_store'),

-- 7. Westport Farmers' Market — farmers_market
('00000000-0000-0000-0000-000000000007', 'farmers_market'),

-- 8. Apponagansett Farm — produce, dairy, csa
('00000000-0000-0000-0000-000000000008', 'produce'),
('00000000-0000-0000-0000-000000000008', 'dairy'),
('00000000-0000-0000-0000-000000000008', 'csa'),

-- 9. Smith Neck Farm — produce
('00000000-0000-0000-0000-000000000009', 'produce'),

-- 10. Round the Bend Farm — meat, produce, dairy
('00000000-0000-0000-0000-000000000010', 'meat'),
('00000000-0000-0000-0000-000000000010', 'produce'),
('00000000-0000-0000-0000-000000000010', 'dairy'),

-- 11. Dartmouth Farmers' Market — farmers_market
('00000000-0000-0000-0000-000000000011', 'farmers_market'),

-- 12. Bettencourt Dairy Farm — dairy, meat, farm_store
('00000000-0000-0000-0000-000000000012', 'dairy'),
('00000000-0000-0000-0000-000000000012', 'meat'),
('00000000-0000-0000-0000-000000000012', 'farm_store'),

-- 13. Meadow River Farm — meat
('00000000-0000-0000-0000-000000000013', 'meat'),

-- 14. Hocus Pocus Farm — produce, flowers, csa
('00000000-0000-0000-0000-000000000014', 'produce'),
('00000000-0000-0000-0000-000000000014', 'flowers'),
('00000000-0000-0000-0000-000000000014', 'csa'),

-- 15. Stony Creek Farm — meat
('00000000-0000-0000-0000-000000000015', 'meat'),

-- 16. Swansea Farmers' Market — farmers_market
('00000000-0000-0000-0000-000000000016', 'farmers_market'),

-- 17. Quittacas Farm — produce, meat, dairy, csa
('00000000-0000-0000-0000-000000000017', 'produce'),
('00000000-0000-0000-0000-000000000017', 'meat'),
('00000000-0000-0000-0000-000000000017', 'dairy'),
('00000000-0000-0000-0000-000000000017', 'csa'),

-- 18. Heart Beets Farm — produce, csa
('00000000-0000-0000-0000-000000000018', 'produce'),
('00000000-0000-0000-0000-000000000018', 'csa'),

-- 19. Rock N' Hill Farm — meat
('00000000-0000-0000-0000-000000000019', 'meat'),

-- 20. Full EnVision Farm — farm_store
('00000000-0000-0000-0000-000000000020', 'farm_store'),

-- 21. Arruda's Dairy — dairy, meat, farm_store
('00000000-0000-0000-0000-000000000021', 'dairy'),
('00000000-0000-0000-0000-000000000021', 'meat'),
('00000000-0000-0000-0000-000000000021', 'farm_store')

ON CONFLICT DO NOTHING;

-- ============================================================
-- FARM FEATURES
-- ============================================================
INSERT INTO farm_features (farm_id, open_to_public, has_farm_store, offers_csa)
VALUES

-- 1. Aeonian Farm — public, CSA
('00000000-0000-0000-0000-000000000001', TRUE,  FALSE, TRUE),

-- 2. Hilltop Farm — public, CSA
('00000000-0000-0000-0000-000000000002', TRUE,  FALSE, TRUE),

-- 3. Cluck & Trowel — public, farm store
('00000000-0000-0000-0000-000000000003', TRUE,  TRUE,  FALSE),

-- 4. Golden Touch Farm — public, farm store
('00000000-0000-0000-0000-000000000004', TRUE,  TRUE,  FALSE),

-- 5. Shy Brothers Farm — farm store (not explicitly open to public in source)
('00000000-0000-0000-0000-000000000005', FALSE, TRUE,  FALSE),

-- 6. Westport Rivers Vineyard & Winery — public, farm store
('00000000-0000-0000-0000-000000000006', TRUE,  TRUE,  FALSE),

-- 7. Westport Farmers' Market — public
('00000000-0000-0000-0000-000000000007', TRUE,  FALSE, FALSE),

-- 8. Apponagansett Farm — public, CSA
('00000000-0000-0000-0000-000000000008', TRUE,  FALSE, TRUE),

-- 9. Smith Neck Farm — public
('00000000-0000-0000-0000-000000000009', TRUE,  FALSE, FALSE),

-- 10. Round the Bend Farm — public, CSA
('00000000-0000-0000-0000-000000000010', TRUE,  FALSE, TRUE),

-- 11. Dartmouth Farmers' Market — public
('00000000-0000-0000-0000-000000000011', TRUE,  FALSE, FALSE),

-- 12. Bettencourt Dairy Farm — public, farm store
('00000000-0000-0000-0000-000000000012', TRUE,  TRUE,  FALSE),

-- 13. Meadow River Farm — not listed as open to public
('00000000-0000-0000-0000-000000000013', FALSE, FALSE, FALSE),

-- 14. Hocus Pocus Farm — CSA (not listed as open to public walk-ins)
('00000000-0000-0000-0000-000000000014', FALSE, FALSE, TRUE),

-- 15. Stony Creek Farm — public
('00000000-0000-0000-0000-000000000015', TRUE,  FALSE, FALSE),

-- 16. Swansea Farmers' Market — public
('00000000-0000-0000-0000-000000000016', TRUE,  FALSE, FALSE),

-- 17. Quittacas Farm — CSA
('00000000-0000-0000-0000-000000000017', FALSE, FALSE, TRUE),

-- 18. Heart Beets Farm — CSA
('00000000-0000-0000-0000-000000000018', FALSE, FALSE, TRUE),

-- 19. Rock N' Hill Farm — direct-to-consumer but not a walk-in store
('00000000-0000-0000-0000-000000000019', FALSE, FALSE, FALSE),

-- 20. Full EnVision Farm — public, farm store
('00000000-0000-0000-0000-000000000020', TRUE,  TRUE,  FALSE),

-- 21. Arruda's Dairy — public, farm store
('00000000-0000-0000-0000-000000000021', TRUE,  TRUE,  FALSE)

ON CONFLICT DO NOTHING;

-- ============================================================
-- FARM HOURS
-- day_of_week: 0=Sun 1=Mon 2=Tue 3=Wed 4=Thu 5=Fri 6=Sat
-- ============================================================
INSERT INTO farm_hours (farm_id, day_of_week, open_time, close_time, note)
VALUES

-- Arruda's Dairy (21): Mon/Wed/Sat 7:30am–7pm; Sun/Tue/Thu/Fri 7:30am–9pm
('00000000-0000-0000-0000-000000000021', 0, '07:30', '21:00', NULL),  -- Sun
('00000000-0000-0000-0000-000000000021', 1, '07:30', '19:00', NULL),  -- Mon
('00000000-0000-0000-0000-000000000021', 2, '07:30', '21:00', NULL),  -- Tue
('00000000-0000-0000-0000-000000000021', 3, '07:30', '19:00', NULL),  -- Wed
('00000000-0000-0000-0000-000000000021', 4, '07:30', '21:00', NULL),  -- Thu
('00000000-0000-0000-0000-000000000021', 5, '07:30', '21:00', NULL),  -- Fri
('00000000-0000-0000-0000-000000000021', 6, '07:30', '19:00', NULL),  -- Sat

-- Stony Creek Farm (15): Thu–Sun 9am–5pm
('00000000-0000-0000-0000-000000000015', 0, '09:00', '17:00', NULL),  -- Sun
('00000000-0000-0000-0000-000000000015', 4, '09:00', '17:00', NULL),  -- Thu
('00000000-0000-0000-0000-000000000015', 5, '09:00', '17:00', NULL),  -- Fri
('00000000-0000-0000-0000-000000000015', 6, '09:00', '17:00', NULL),  -- Sat

-- Bettencourt Dairy Farm (12): Tue–Sat 9am–5pm
('00000000-0000-0000-0000-000000000012', 2, '09:00', '17:00', NULL),  -- Tue
('00000000-0000-0000-0000-000000000012', 3, '09:00', '17:00', NULL),  -- Wed
('00000000-0000-0000-0000-000000000012', 4, '09:00', '17:00', NULL),  -- Thu
('00000000-0000-0000-0000-000000000012', 5, '09:00', '17:00', NULL),  -- Fri
('00000000-0000-0000-0000-000000000012', 6, '09:00', '17:00', NULL),  -- Sat

-- Full EnVision Farm (20): Mon–Fri 11am–4:30pm, Sun 11am–2pm
('00000000-0000-0000-0000-000000000020', 0, '11:00', '14:00', NULL),  -- Sun
('00000000-0000-0000-0000-000000000020', 1, '11:00', '16:30', NULL),  -- Mon
('00000000-0000-0000-0000-000000000020', 2, '11:00', '16:30', NULL),  -- Tue
('00000000-0000-0000-0000-000000000020', 3, '11:00', '16:30', NULL),  -- Wed
('00000000-0000-0000-0000-000000000020', 4, '11:00', '16:30', NULL),  -- Thu
('00000000-0000-0000-0000-000000000020', 5, '11:00', '16:30', NULL),  -- Fri

-- Dartmouth Farmers' Market (11): Friday only, 12pm–5pm
('00000000-0000-0000-0000-000000000011', 5, '12:00', '17:00', 'St. Mary''s Church parking lot'),

-- Swansea Farmers' Market (16): Sunday only, 10am–2pm
('00000000-0000-0000-0000-000000000016', 0, '10:00', '14:00', 'Hosted at Stony Creek Farm')

ON CONFLICT DO NOTHING;
