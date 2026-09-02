import { getDb } from '../../database/connection';

export async function findAll() {
  const pool = await getDb();
  const [rows] = await pool.query(
    `SELECT r.*, u.display_name AS reporter_name
       FROM reports r
       LEFT JOIN users u ON u.id = r.reporter_id
      ORDER BY r.created_at DESC`
  );
  return rows;
}

export async function findById(id) {
  const pool = await getDb();
  const [rows] = await pool.query(
    `SELECT r.*, u.display_name AS reporter_name
       FROM reports r
       LEFT JOIN users u ON u.id = r.reporter_id
      WHERE r.id = ?`,
    [id]
  );
  return rows[0];
}

export async function create({ reporter_id, target_listing_id, target_user_id, reason }) {
  const pool = await getDb();
  const [result] = await pool.query(
    `INSERT INTO reports (reporter_id, target_listing_id, target_user_id, reason)
     VALUES (?, ?, ?, ?)`,
    [reporter_id, target_listing_id || null, target_user_id || null, reason]
  );
  return findById(result.insertId);
}

export async function updateStatus(id, status) {
  const pool = await getDb();
  await pool.query(
    'UPDATE reports SET status = ? WHERE id = ?',
    [status, id]
  );
  return findById(id);
}
