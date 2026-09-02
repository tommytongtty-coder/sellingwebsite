import { getDb } from '../../database/connection';

export async function findByUserId(userId) {
  const pool = await getDb();
  const [rows] = await pool.query(
    `SELECT f.id, f.listing_id, f.created_at,
            l.title, l.price, l.condition_type AS \`condition\`, l.location
       FROM favorites f
       JOIN listings l ON l.id = f.listing_id
      WHERE f.user_id = ?
      ORDER BY f.created_at DESC`,
    [userId]
  );
  return rows;
}

export async function create(userId, listingId) {
  const pool = await getDb();
  await pool.query(
    'INSERT IGNORE INTO favorites (user_id, listing_id) VALUES (?, ?)',
    [userId, listingId]
  );
}

export async function remove(userId, listingId) {
  const pool = await getDb();
  await pool.query(
    'DELETE FROM favorites WHERE user_id = ? AND listing_id = ?',
    [userId, listingId]
  );
}

export async function isFavorited(userId, listingId) {
  const pool = await getDb();
  const [rows] = await pool.query(
    'SELECT 1 FROM favorites WHERE user_id = ? AND listing_id = ? LIMIT 1',
    [userId, listingId]
  );
  return rows.length > 0;
}
