import { getDb } from '../../database/connection';

export async function findByUserId(userId) {
  const pool = await getDb();
  const [rows] = await pool.query(
    `SELECT c.id, c.listing_id, c.buyer_id, c.seller_id, c.updated_at,
            l.title AS listing_title,
            CASE WHEN c.buyer_id = ? THEN s.display_name ELSE b.display_name END AS other_user_name,
            CASE WHEN c.buyer_id = ? THEN c.seller_id ELSE c.buyer_id END AS other_user_id,
            m.body AS last_message_body,
            m.created_at AS last_message_time,
            m.is_read AS last_message_read,
            (SELECT COUNT(*) FROM messages
              WHERE conversation_id = c.id AND sender_id != ? AND is_read = FALSE
            ) AS unread_count
       FROM conversations c
       JOIN listings l ON l.id = c.listing_id
       JOIN users b ON b.id = c.buyer_id
       JOIN users s ON s.id = c.seller_id
       LEFT JOIN messages m ON m.id = (
         SELECT m2.id FROM messages m2
          WHERE m2.conversation_id = c.id
          ORDER BY m2.created_at DESC LIMIT 1
       )
      WHERE c.buyer_id = ? OR c.seller_id = ?
      ORDER BY c.updated_at DESC`,
    [userId, userId, userId, userId, userId]
  );
  return rows;
}

export async function findById(id) {
  const pool = await getDb();
  const [rows] = await pool.query(
    `SELECT c.*, l.title AS listing_title,
            b.display_name AS buyer_name, s.display_name AS seller_name
       FROM conversations c
       JOIN listings l ON l.id = c.listing_id
       JOIN users b ON b.id = c.buyer_id
       JOIN users s ON s.id = c.seller_id
      WHERE c.id = ?`,
    [id]
  );
  return rows[0];
}

export async function create({ listing_id, buyer_id, seller_id }) {
  const pool = await getDb();
  await pool.query(
    `INSERT IGNORE INTO conversations (listing_id, buyer_id, seller_id)
     VALUES (?, ?, ?)`,
    [listing_id, buyer_id, seller_id]
  );
  const [rows] = await pool.query(
    `SELECT * FROM conversations WHERE listing_id = ? AND buyer_id = ?`,
    [listing_id, buyer_id]
  );
  return rows[0];
}
