import { getDb } from '../../database/connection';

export async function findByListingId(listingId) {
  const pool = await getDb();
  const [rows] = await pool.query(
    `SELECT o.*, u.display_name AS buyer_name
       FROM offers o
       JOIN users u ON u.id = o.buyer_id
      WHERE o.listing_id = ?
      ORDER BY o.created_at DESC`,
    [listingId]
  );
  return rows;
}

export async function findByBuyerId(buyerId) {
  const pool = await getDb();
  const [rows] = await pool.query(
    `SELECT o.*, l.title AS listing_title, l.price AS listing_price
       FROM offers o
       JOIN listings l ON l.id = o.listing_id
      WHERE o.buyer_id = ?
      ORDER BY o.created_at DESC`,
    [buyerId]
  );
  return rows;
}

export async function findById(id) {
  const pool = await getDb();
  const [rows] = await pool.query(
    `SELECT o.*, l.title AS listing_title, l.price AS listing_price,
            l.seller_id, u.display_name AS buyer_name
       FROM offers o
       JOIN listings l ON l.id = o.listing_id
       JOIN users u ON u.id = o.buyer_id
      WHERE o.id = ?`,
    [id]
  );
  return rows[0];
}

export async function create({ listing_id, buyer_id, amount, message }) {
  const pool = await getDb();
  const [result] = await pool.query(
    `INSERT INTO offers (listing_id, buyer_id, amount, message)
     VALUES (?, ?, ?, ?)`,
    [listing_id, buyer_id, amount, message || null]
  );
  return findById(result.insertId);
}

export async function updateStatus(id, status) {
  const pool = await getDb();
  await pool.query(
    'UPDATE offers SET status = ? WHERE id = ?',
    [status, id]
  );
  return findById(id);
}
