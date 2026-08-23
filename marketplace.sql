-- ============================================================
-- Marketplace Database Setup
-- Run this file in MAMP phpMyAdmin or MySQL CLI
-- ============================================================

CREATE DATABASE IF NOT EXISTS marketplace CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE marketplace;

-- ── Categories ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id   INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

-- ── Listings ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS listings (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  title        VARCHAR(255) NOT NULL,
  price        VARCHAR(50),
  seller       VARCHAR(100),
  shipping     VARCHAR(50),
  badge        VARCHAR(50),
  accent       VARCHAR(20),
  location     VARCHAR(100),
  condition_type VARCHAR(50),
  category_id  INT,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- ── Seed: Categories ──────────────────────────────────────────
INSERT INTO categories (name) VALUES
  ('Graphics Cards'),
  ('PC Builds'),
  ('Monitors'),
  ('Accessories');

-- ── Seed: Listings ────────────────────────────────────────────
INSERT INTO listings (title, price, seller, shipping, badge, accent, location, condition_type, category_id) VALUES
  ('ASUS Dual GeForce RTX 4070 Super 12GB', 'HK$4,980', 'Northside Components', 'Buyer Protection', 'Top Rated', '#8b5cf6', 'Mong Kok',      'Used',     1),
  ('MSI GeForce RTX 3080 Ti Ventus 3X',     'HK$3,580', 'Titan Forge Parts',    'Make Offer',       'Sale',       '#ec4899', 'Kwun Tong',     'Used',     1),
  ('SAPPHIRE NITRO+ Radeon RX 7900 XT',     'HK$4,888', 'FrameCraft PCs',       'Buyer Protection', 'Verified',   '#06b6d4', 'Central',       'Like New', 1),
  ('EVGA GeForce GTX 1080 Ti SC Black',     'HK$1,180', 'Official Store',       'Meet-up',          'Budget Pick','#f59e0b', 'Tsuen Wan',     'Used',     1),
  ('PNY RTX 5060 Ti RGB OC 8GB',            'HK$3,280', 'Echo Ops Gaming',      'Buyer Protection', 'Fresh Drop', '#10b981', 'Sha Tin',       'New',      1),
  ('Gigabyte Radeon RX 7800 XT Gaming OC',  'HK$3,950', 'Circuit City Hub',     'Make Offer',       'Hot Deal',   '#ef4444', 'Tsim Sha Tsui', 'Used',     1);
