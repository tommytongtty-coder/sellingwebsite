-- ============================================================
-- Rename the seeded admin (user id 1) to admin01
-- ============================================================
-- Updating in place rather than inserting a new row keeps the existing
-- admin_logs entries (admin_id = 1) attached to a live account.
--
-- Login:    admin01 / 123123
-- The login endpoint accepts a username or an email address.
-- password_hash = bcrypt('123123', 10 rounds)

-- Runs against the database selected by the connection (via .env).

UPDATE users
   SET username      = 'admin01',
       password_hash = '$2b$10$qCtkorxs2UT9yfG4s5.ImenbJ6iA.NqReE.MiqJtZrAKSxxtRn0Uy',
       display_name  = 'Admin',
       role          = 'admin'
 WHERE id = 1;
