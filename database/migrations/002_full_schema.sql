-- ============================================================
-- Migration 002 — Full marketplace schema (clean slate)
-- Drops old tables and creates all 10 tables from scratch.
-- Safe to re-run: uses DROP IF EXISTS + IF NOT EXISTS.
-- ============================================================

CREATE DATABASE IF NOT EXISTS marketplace
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE marketplace;

-- ── Drop old tables (reverse FK order) ───────────────────────
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS admin_logs;
DROP TABLE IF EXISTS reports;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS conversations;
DROP TABLE IF EXISTS offers;
DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS listing_images;
DROP TABLE IF EXISTS listings;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- ──────────────────────────────────────────────────────────────
-- 1. users
-- ──────────────────────────────────────────────────────────────
CREATE TABLE users (
  id            INT          AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(50)  NOT NULL UNIQUE,
  email         VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('buyer','seller','admin') NOT NULL DEFAULT 'buyer',
  display_name  VARCHAR(100),
  phone         VARCHAR(20),
  avatar_url    VARCHAR(500),
  rating        DECIMAL(2,1) NOT NULL DEFAULT 0.0,
  created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────────────────────
-- 2. categories (with parent_id for subcategories)
-- ──────────────────────────────────────────────────────────────
CREATE TABLE categories (
  id        INT          AUTO_INCREMENT PRIMARY KEY,
  name      VARCHAR(100) NOT NULL,
  slug      VARCHAR(100),
  parent_id INT          NULL,
  CONSTRAINT fk_categories_parent
    FOREIGN KEY (parent_id) REFERENCES categories(id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────────────────────
-- 3. listings
-- ──────────────────────────────────────────────────────────────
CREATE TABLE listings (
  id              INT            AUTO_INCREMENT PRIMARY KEY,
  seller_id       INT            NOT NULL,
  category_id     INT            NULL,
  title           VARCHAR(255)   NOT NULL,
  gpu_model       VARCHAR(100),
  brand           VARCHAR(100),
  manufacturer    VARCHAR(100),
  vram_gb         TINYINT UNSIGNED,
  description     TEXT,
  price           DECIMAL(10,2)  NOT NULL,
  is_fixed_price  BOOLEAN        NOT NULL DEFAULT FALSE,
  `condition`     ENUM('new','like_new','used','open_box') NOT NULL DEFAULT 'used',
  quantity        TINYINT UNSIGNED NOT NULL DEFAULT 1,
  location        VARCHAR(100),
  allow_meetup    BOOLEAN        NOT NULL DEFAULT FALSE,
  allow_delivery  BOOLEAN        NOT NULL DEFAULT FALSE,
  is_certified    BOOLEAN        NOT NULL DEFAULT FALSE,
  status          ENUM('draft','pending','active','sold','rejected') NOT NULL DEFAULT 'pending',
  views           INT UNSIGNED   NOT NULL DEFAULT 0,
  created_at      TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_listings_seller
    FOREIGN KEY (seller_id) REFERENCES users(id),
  CONSTRAINT fk_listings_category
    FOREIGN KEY (category_id) REFERENCES categories(id)
    ON DELETE SET NULL,
  INDEX idx_listings_status (status),
  INDEX idx_listings_seller (seller_id),
  INDEX idx_listings_category (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────────────────────
-- 4. listing_images
-- ──────────────────────────────────────────────────────────────
CREATE TABLE listing_images (
  id          INT          AUTO_INCREMENT PRIMARY KEY,
  listing_id  INT          NOT NULL,
  image_url   VARCHAR(500) NOT NULL,
  sort_order  TINYINT UNSIGNED NOT NULL DEFAULT 0,
  is_cover    BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_images_listing
    FOREIGN KEY (listing_id) REFERENCES listings(id)
    ON DELETE CASCADE,
  INDEX idx_images_listing (listing_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────────────────────
-- 5. favorites
-- ──────────────────────────────────────────────────────────────
CREATE TABLE favorites (
  id          INT       AUTO_INCREMENT PRIMARY KEY,
  user_id     INT       NOT NULL,
  listing_id  INT       NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_favorite (user_id, listing_id),
  CONSTRAINT fk_favorites_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_favorites_listing
    FOREIGN KEY (listing_id) REFERENCES listings(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────────────────────
-- 6. offers
-- ──────────────────────────────────────────────────────────────
CREATE TABLE offers (
  id          INT           AUTO_INCREMENT PRIMARY KEY,
  listing_id  INT           NOT NULL,
  buyer_id    INT           NOT NULL,
  amount      DECIMAL(10,2) NOT NULL,
  message     VARCHAR(500),
  status      ENUM('pending','accepted','rejected','withdrawn') NOT NULL DEFAULT 'pending',
  created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_offers_listing
    FOREIGN KEY (listing_id) REFERENCES listings(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_offers_buyer
    FOREIGN KEY (buyer_id) REFERENCES users(id),
  INDEX idx_offers_listing (listing_id),
  INDEX idx_offers_buyer (buyer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────────────────────
-- 7. conversations
-- ──────────────────────────────────────────────────────────────
CREATE TABLE conversations (
  id          INT       AUTO_INCREMENT PRIMARY KEY,
  listing_id  INT       NOT NULL,
  buyer_id    INT       NOT NULL,
  seller_id   INT       NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_conversation (listing_id, buyer_id),
  CONSTRAINT fk_conversations_listing
    FOREIGN KEY (listing_id) REFERENCES listings(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_conversations_buyer
    FOREIGN KEY (buyer_id) REFERENCES users(id),
  CONSTRAINT fk_conversations_seller
    FOREIGN KEY (seller_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────────────────────
-- 8. messages
-- ──────────────────────────────────────────────────────────────
CREATE TABLE messages (
  id               INT       AUTO_INCREMENT PRIMARY KEY,
  conversation_id  INT       NOT NULL,
  sender_id        INT       NOT NULL,
  body             TEXT      NOT NULL,
  is_read          BOOLEAN   NOT NULL DEFAULT FALSE,
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_messages_conversation
    FOREIGN KEY (conversation_id) REFERENCES conversations(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_messages_sender
    FOREIGN KEY (sender_id) REFERENCES users(id),
  INDEX idx_messages_conversation (conversation_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────────────────────
-- 9. reports
-- ──────────────────────────────────────────────────────────────
CREATE TABLE reports (
  id                INT          AUTO_INCREMENT PRIMARY KEY,
  reporter_id       INT          NOT NULL,
  target_listing_id INT          NULL,
  target_user_id    INT          NULL,
  reason            VARCHAR(500) NOT NULL,
  status            ENUM('open','reviewed','dismissed') NOT NULL DEFAULT 'open',
  created_at        TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_reports_reporter
    FOREIGN KEY (reporter_id) REFERENCES users(id),
  CONSTRAINT fk_reports_target_listing
    FOREIGN KEY (target_listing_id) REFERENCES listings(id)
    ON DELETE SET NULL,
  CONSTRAINT fk_reports_target_user
    FOREIGN KEY (target_user_id) REFERENCES users(id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────────────────────
-- 10. admin_logs
-- ──────────────────────────────────────────────────────────────
CREATE TABLE admin_logs (
  id           INT          AUTO_INCREMENT PRIMARY KEY,
  admin_id     INT          NOT NULL,
  action       VARCHAR(100) NOT NULL,
  target_table VARCHAR(50),
  target_id    INT,
  old_value    JSON,
  new_value    JSON,
  created_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_admin_logs_admin
    FOREIGN KEY (admin_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
