-- ============================================================
-- Seed 002 — Sample data for full schema
-- Run AFTER migration 002_full_schema.sql
-- Passwords are bcrypt hashes of "password123"
-- ============================================================

USE marketplace;

-- ── Users ────────────────────────────────────────────────────
-- password_hash = bcrypt('password123', 10 rounds)
INSERT IGNORE INTO users (id, username, email, password_hash, role, display_name, phone, rating) VALUES
  (1, 'admin',       'admin@market.hk',       '$2b$10$pfC9NA4l8Su4Rff7.nuXqOz72Nm2dhT18SekP8zE9UfhfHq7vDaOG', 'admin',  'Admin',                '98765432', 5.0),
  (2, 'northside',   'northside@market.hk',   '$2b$10$pfC9NA4l8Su4Rff7.nuXqOz72Nm2dhT18SekP8zE9UfhfHq7vDaOG', 'seller', 'Northside Components', '91234567', 4.9),
  (3, 'titanforge',  'titanforge@market.hk',  '$2b$10$pfC9NA4l8Su4Rff7.nuXqOz72Nm2dhT18SekP8zE9UfhfHq7vDaOG', 'seller', 'Titan Forge Parts',    '92345678', 4.7),
  (4, 'framecraft',  'framecraft@market.hk',  '$2b$10$pfC9NA4l8Su4Rff7.nuXqOz72Nm2dhT18SekP8zE9UfhfHq7vDaOG', 'seller', 'FrameCraft PCs',       '93456789', 4.8),
  (5, 'officialshop','official@market.hk',    '$2b$10$pfC9NA4l8Su4Rff7.nuXqOz72Nm2dhT18SekP8zE9UfhfHq7vDaOG', 'seller', 'Official Store',       '94567890', 4.5),
  (6, 'echoops',     'echoops@market.hk',     '$2b$10$pfC9NA4l8Su4Rff7.nuXqOz72Nm2dhT18SekP8zE9UfhfHq7vDaOG', 'seller', 'Echo Ops Gaming',      '95678901', 4.6),
  (7, 'circuitcity', 'circuitcity@market.hk', '$2b$10$pfC9NA4l8Su4Rff7.nuXqOz72Nm2dhT18SekP8zE9UfhfHq7vDaOG', 'seller', 'Circuit City Hub',     '96789012', 4.4),
  (8, 'buyer1',      'buyer1@market.hk',      '$2b$10$pfC9NA4l8Su4Rff7.nuXqOz72Nm2dhT18SekP8zE9UfhfHq7vDaOG', 'buyer',  'Alex Chan',            '97890123', 5.0),
  (9, 'buyer2',      'buyer2@market.hk',      '$2b$10$pfC9NA4l8Su4Rff7.nuXqOz72Nm2dhT18SekP8zE9UfhfHq7vDaOG', 'buyer',  'TechParts HK',         '98901234', 4.2);

-- ── Categories ───────────────────────────────────────────────
INSERT IGNORE INTO categories (id, name, slug, parent_id) VALUES
  (1, 'PC Parts',       'pc-parts',       NULL),
  (2, 'Graphics Cards', 'graphics-cards', 1),
  (3, 'PC Builds',      'pc-builds',      1),
  (4, 'Monitors',       'monitors',       NULL),
  (5, 'Accessories',    'accessories',    NULL);

-- ── Listings ─────────────────────────────────────────────────
INSERT IGNORE INTO listings
  (id, seller_id, category_id, title, gpu_model, brand, manufacturer, vram_gb,
   description, price, is_fixed_price, `condition`, quantity, location,
   allow_meetup, allow_delivery, is_certified, status, views)
VALUES
  (1, 2, 2,
   'ASUS Dual GeForce RTX 4070 Super 12GB',
   'RTX 4070 Super', 'ASUS', 'NVIDIA', 12,
   'Used for about 6 months, runs perfectly. Never overclocked. Original box included.',
   4980.00, FALSE, 'used', 1, 'Mong Kok',
   TRUE, TRUE, TRUE, 'active', 156),

  (2, 3, 2,
   'MSI GeForce RTX 3080 Ti Ventus 3X',
   'RTX 3080 Ti', 'MSI', 'NVIDIA', 12,
   'Great condition, upgrading to 5000 series. Price negotiable.',
   3580.00, FALSE, 'used', 1, 'Kwun Tong',
   TRUE, FALSE, FALSE, 'active', 89),

  (3, 4, 2,
   'SAPPHIRE NITRO+ Radeon RX 7900 XT',
   'RX 7900 XT', 'SAPPHIRE', 'AMD', 20,
   'Like new condition, barely used for gaming. All accessories included.',
   4888.00, TRUE, 'like_new', 1, 'Central',
   FALSE, TRUE, TRUE, 'active', 234),

  (4, 5, 2,
   'EVGA GeForce GTX 1080 Ti SC Black',
   'GTX 1080 Ti', 'EVGA', 'NVIDIA', 11,
   'Reliable workhorse GPU. Perfect for budget builds. Meet at Tsuen Wan MTR.',
   1180.00, FALSE, 'used', 1, 'Tsuen Wan',
   TRUE, FALSE, FALSE, 'active', 312),

  (5, 6, 2,
   'PNY RTX 5060 Ti RGB OC 8GB',
   'RTX 5060 Ti', 'PNY', 'NVIDIA', 8,
   'Brand new, sealed in box. Latest generation card.',
   3280.00, TRUE, 'new', 1, 'Sha Tin',
   TRUE, TRUE, TRUE, 'active', 67),

  (6, 7, 2,
   'Gigabyte Radeon RX 7800 XT Gaming OC',
   'RX 7800 XT', 'Gigabyte', 'AMD', 16,
   'Open to offers. Used for 3 months, selling because switching to NVIDIA.',
   3950.00, FALSE, 'used', 1, 'Tsim Sha Tsui',
   TRUE, FALSE, FALSE, 'active', 198);

-- ── Listing images ───────────────────────────────────────────
INSERT IGNORE INTO listing_images (id, listing_id, image_url, sort_order, is_cover) VALUES
  (1, 1, '/uploads/rtx4070super_1.jpg', 0, TRUE),
  (2, 1, '/uploads/rtx4070super_2.jpg', 1, FALSE),
  (3, 2, '/uploads/rtx3080ti_1.jpg',    0, TRUE),
  (4, 3, '/uploads/rx7900xt_1.jpg',     0, TRUE),
  (5, 4, '/uploads/gtx1080ti_1.jpg',    0, TRUE),
  (6, 5, '/uploads/rtx5060ti_1.jpg',    0, TRUE),
  (7, 6, '/uploads/rx7800xt_1.jpg',     0, TRUE);

-- ── Favorites ────────────────────────────────────────────────
INSERT IGNORE INTO favorites (id, user_id, listing_id) VALUES
  (1, 8, 3),
  (2, 8, 5),
  (3, 9, 1),
  (4, 9, 4);

-- ── Offers ───────────────────────────────────────────────────
INSERT IGNORE INTO offers (id, listing_id, buyer_id, amount, message, status) VALUES
  (1, 5, 8, 3100.00, 'Can you do HK$3,100? I can meet at Mong Kok MTR.',    'pending'),
  (2, 1, 8, 4500.00, 'Would you take HK$4,500?',                             'pending'),
  (3, 2, 9, 3200.00, 'Interested! How about HK$3,200?',                      'accepted'),
  (4, 4, 9, 1000.00, 'Can do HK$1,000 cash, pickup today.',                  'rejected');

-- ── Conversations ────────────────────────────────────────────
INSERT IGNORE INTO conversations (id, listing_id, buyer_id, seller_id) VALUES
  (1, 5, 8, 6),
  (2, 1, 8, 2),
  (3, 4, 9, 5);

-- ── Messages ─────────────────────────────────────────────────
INSERT IGNORE INTO messages (id, conversation_id, sender_id, body, is_read) VALUES
  (1, 1, 8, 'Hi, is the RTX 5060 Ti still available?',                            TRUE),
  (2, 1, 6, 'Yes it is! Are you interested?',                                      TRUE),
  (3, 1, 8, 'Can you do HK$3,100? I can meet at Mong Kok MTR.',                   TRUE),
  (4, 1, 6, 'Sure, I can do HK$3,100. Meet at Mong Kok MTR?',                     FALSE),
  (5, 2, 8, 'Is the RTX 4070 Super still available?',                              FALSE),
  (6, 3, 9, 'Hi, interested in the GTX 1080 Ti. Can I pick up today at Tsuen Wan?', TRUE),
  (7, 3, 5, 'Sure! Im free after 6pm at Tsuen Wan MTR exit A.',                    TRUE),
  (8, 3, 9, 'Thanks for the purchase! Let me know when you test it.',               FALSE);

-- ── Reports ──────────────────────────────────────────────────
INSERT IGNORE INTO reports (id, reporter_id, target_listing_id, target_user_id, reason, status) VALUES
  (1, 8, NULL, NULL, 'Test report — ignore.', 'dismissed');

-- ── Admin logs ───────────────────────────────────────────────
INSERT IGNORE INTO admin_logs (id, admin_id, action, target_table, target_id, old_value, new_value) VALUES
  (1, 1, 'approve_listing', 'listings', 1, '{"status":"pending"}', '{"status":"active"}'),
  (2, 1, 'approve_listing', 'listings', 3, '{"status":"pending"}', '{"status":"active"}');
