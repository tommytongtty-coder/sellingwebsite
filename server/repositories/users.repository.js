import { getDb } from '../../database/connection';

export async function findByEmail(email) {
  const pool = await getDb();
  const [rows] = await pool.query(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  return rows[0];
}

export async function findByUsername(username) {
  const pool = await getDb();
  const [rows] = await pool.query(
    'SELECT * FROM users WHERE username = ?',
    [username]
  );
  return rows[0];
}

export async function findById(id) {
  const pool = await getDb();
  const [rows] = await pool.query(
    `SELECT id, username, email, role, display_name, phone,
            avatar_url, rating, created_at
       FROM users WHERE id = ?`,
    [id]
  );
  return rows[0];
}

export async function create({ username, email, password_hash, role, display_name, phone }) {
  const pool = await getDb();
  const [result] = await pool.query(
    `INSERT INTO users (username, email, password_hash, role, display_name, phone)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [username, email, password_hash, role || 'buyer', display_name || null, phone || null]
  );
  return findById(result.insertId);
}

export async function getProfile(id) {
  const pool = await getDb();
  const [rows] = await pool.query(
    `SELECT id, username, display_name, avatar_url, rating, created_at
       FROM users WHERE id = ?`,
    [id]
  );
  return rows[0];
}

export async function getUserListings(userId) {
  const pool = await getDb();
  const [rows] = await pool.query(
    `SELECT l.id, l.title, l.price, l.status, l.\`condition\`, l.location,
            l.created_at, l.updated_at,
            c.name AS category,
            (SELECT li.image_url FROM listing_images li
               WHERE li.listing_id = l.id AND li.is_cover = TRUE
               LIMIT 1) AS cover_image
       FROM listings l
       LEFT JOIN categories c ON c.id = l.category_id
      WHERE l.seller_id = ?
      ORDER BY l.created_at DESC`,
    [userId]
  );
  return rows;
}

export async function getUserFavorites(userId) {
  const pool = await getDb();
  const [rows] = await pool.query(
    `SELECT l.id, l.title, l.price, l.status, l.\`condition\`, l.location,
            l.created_at,
            u.display_name AS seller_name,
            c.name AS category,
            (SELECT li.image_url FROM listing_images li
               WHERE li.listing_id = l.id AND li.is_cover = TRUE
               LIMIT 1) AS cover_image
       FROM favorites f
       JOIN listings l ON l.id = f.listing_id
       LEFT JOIN users u ON u.id = l.seller_id
       LEFT JOIN categories c ON c.id = l.category_id
      WHERE f.user_id = ?
      ORDER BY f.created_at DESC`,
    [userId]
  );
  return rows;
}

export async function getUserOffers(userId) {
  const pool = await getDb();
  const [rows] = await pool.query(
    `SELECT o.id, o.amount, o.status AS offer_status, o.created_at,
            l.id AS listing_id, l.title, l.price,
            (SELECT li.image_url FROM listing_images li
               WHERE li.listing_id = l.id AND li.is_cover = TRUE
               LIMIT 1) AS cover_image
       FROM offers o
       JOIN listings l ON l.id = o.listing_id
      WHERE o.buyer_id = ?
      ORDER BY o.created_at DESC`,
    [userId]
  );
  return rows;
}
