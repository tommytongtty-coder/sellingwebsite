-- ============================================================
-- Add a thread type to conversations
-- ============================================================
-- 'buyer_seller'  — a buyer asking a seller about a listing (the original use)
-- 'admin_support' — the seller's thread with the shop admin, opened
--                   automatically when a listing is published
--
-- For admin_support threads the admin occupies buyer_id, so the existing
-- UNIQUE (listing_id, buyer_id) key still guarantees one admin thread per
-- listing, and the participant checks in conversations.controller keep working.

-- Runs against the database selected by the connection (via .env).

ALTER TABLE conversations
  ADD COLUMN type ENUM('buyer_seller','admin_support')
    NOT NULL DEFAULT 'buyer_seller'
    AFTER seller_id;
