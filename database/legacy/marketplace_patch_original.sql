-- ============================================================
-- Marketplace Patch — run this in phpMyAdmin (Import tab)
-- Adds missing columns + seeds categories and listings
-- Safe for MySQL 5.7 and MySQL 8.0+
-- ============================================================

USE marketplace;

-- ── Add missing columns to listings ──────────────────────────
-- Run each ALTER separately; ignore errors if the column already exists

ALTER TABLE listings ADD COLUMN shipping    VARCHAR(50)  NULL AFTER seller;
ALTER TABLE listings ADD COLUMN accent      VARCHAR(20)  NULL AFTER badge;
ALTER TABLE listings ADD COLUMN created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP;

-- ── Seed categories ───────────────────────────────────────────
INSERT IGNORE INTO categories (id, name) VALUES
  (1, 'Graphics Cards'),
  (2, 'PC Builds'),
  (3, 'Monitors'),
  (4, 'Accessories');

-- ── Seed listings ─────────────────────────────────────────────
INSERT INTO listings (title, price, seller, shipping, badge, accent, location, condition_type, category_id) VALUES
  ('ASUS Dual GeForce RTX 4070 Super 12GB', 'HK$4,980', 'Northside Components', 'Buyer Protection', 'Top Rated',   '#8b5cf6', 'Mong Kok',      'Used',     1),
  ('MSI GeForce RTX 3080 Ti Ventus 3X',     'HK$3,580', 'Titan Forge Parts',    'Make Offer',       'Sale',        '#ec4899', 'Kwun Tong',     'Used',     1),
  ('SAPPHIRE NITRO+ Radeon RX 7900 XT',     'HK$4,888', 'FrameCraft PCs',       'Buyer Protection', 'Verified',    '#06b6d4', 'Central',       'Like New', 1),
  ('EVGA GeForce GTX 1080 Ti SC Black',     'HK$1,180', 'Official Store',       'Meet-up',          'Budget Pick', '#f59e0b', 'Tsuen Wan',     'Used',     1),
  ('PNY RTX 5060 Ti RGB OC 8GB',            'HK$3,280', 'Echo Ops Gaming',      'Buyer Protection', 'Fresh Drop',  '#10b981', 'Sha Tin',       'New',      1),
  ('Gigabyte Radeon RX 7800 XT Gaming OC',  'HK$3,950', 'Circuit City Hub',     'Make Offer',       'Hot Deal',    '#ef4444', 'Tsim Sha Tsui', 'Used',     1);
