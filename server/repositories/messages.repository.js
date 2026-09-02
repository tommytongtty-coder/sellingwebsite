import { getDb } from '../../database/connection';

export async function findByConversationId(conversationId) {
  const pool = await getDb();
  const [rows] = await pool.query(
    `SELECT m.*, u.display_name AS sender_name
       FROM messages m
       JOIN users u ON u.id = m.sender_id
      WHERE m.conversation_id = ?
      ORDER BY m.created_at ASC`,
    [conversationId]
  );
  return rows;
}

export async function create({ conversation_id, sender_id, body }) {
  const pool = await getDb();
  const [result] = await pool.query(
    `INSERT INTO messages (conversation_id, sender_id, body)
     VALUES (?, ?, ?)`,
    [conversation_id, sender_id, body]
  );
  await pool.query(
    'UPDATE conversations SET updated_at = NOW() WHERE id = ?',
    [conversation_id]
  );
  const [rows] = await pool.query(
    `SELECT m.*, u.display_name AS sender_name
       FROM messages m
       JOIN users u ON u.id = m.sender_id
      WHERE m.id = ?`,
    [result.insertId]
  );
  return rows[0];
}

export async function markAsRead(conversationId, userId) {
  const pool = await getDb();
  await pool.query(
    `UPDATE messages SET is_read = TRUE
      WHERE conversation_id = ? AND sender_id != ?`,
    [conversationId, userId]
  );
}
