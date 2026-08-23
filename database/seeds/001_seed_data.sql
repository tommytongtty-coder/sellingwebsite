-- ============================================================
-- Seed 001 — Default categories and sample listings
-- Idempotent: uses INSERT IGNORE so re-running is safe.
-- Run AFTER migration 001_create_tables.sql.
-- ============================================================

USE marketplace;

-- ── Categories ────────────────────────────────────────────────
INSERT IGNORE INTO categories (id, name) VALUES
  (1, 'Graphics Cards'),
  (2, 'PC Builds'),
  (3, 'Monitors'),
  (4, 'Accessories');

-- ── Sample listings ───────────────────────────────────────────
-- INSERT IGNORE relies on PRIMARY KEY uniqueness.
-- These IDs are fixed so re-running never duplicates rows.
INSERT IGNORE INTO listings
  (id, title, price, seller, shipping, badge, accent, location, condition_type, category_id)
VALUES
  (1,  'ASUS Dual GeForce RTX 4070 Super 12GB', 'HK$4,980', 'Northside Components', 'Buyer Protection', 'Top Rated',   '#8b5cf6', 'Mong Kok',      'Used',     1),
  (2,  'MSI GeForce RTX 3080 Ti Ventus 3X',     'HK$3,580', 'Titan Forge Parts',    'Make Offer',       'Sale',        '#ec4899', 'Kwun Tong',     'Used',     1),
  (3,  'SAPPHIRE NITRO+ Radeon RX 7900 XT',     'HK$4,888', 'FrameCraft PCs',       'Buyer Protection', 'Verified',    '#06b6d4', 'Central',       'Like New', 1),
  (4,  'EVGA GeForce GTX 1080 Ti SC Black',     'HK$1,180', 'Official Store',       'Meet-up',          'Budget Pick', '#f59e0b', 'Tsuen Wan',     'Used',     1),
  (5,  'PNY RTX 5060 Ti RGB OC 8GB',            'HK$3,280', 'Echo Ops Gaming',      'Buyer Protection', 'Fresh Drop',  '#10b981', 'Sha Tin',       'New',      1),
  (6,  'Gigabyte Radeon RX 7800 XT Gaming OC',  'HK$3,950', 'Circuit City Hub',     'Make Offer',       'Hot Deal',    '#ef4444', 'Tsim Sha Tsui', 'Used',     1);
