-- ============================================================
-- Migration 001 — Create core tables
-- Idempotent: safe to run multiple times (uses IF NOT EXISTS)
-- ============================================================

CREATE DATABASE IF NOT EXISTS marketplace
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE marketplace;

-- ── categories ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id   INT          AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── listings ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS listings (
  id             INT          AUTO_INCREMENT PRIMARY KEY,
  title          VARCHAR(255) NOT NULL,
  price          VARCHAR(50)  NULL,
  seller         VARCHAR(100) NULL,
  shipping       VARCHAR(50)  NULL,
  badge          VARCHAR(50)  NULL,
  accent         VARCHAR(20)  NULL,
  location       VARCHAR(100) NULL,
  condition_type VARCHAR(50)  NULL,
  category_id    INT          NULL,
  created_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_listings_category
    FOREIGN KEY (category_id) REFERENCES categories(id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
