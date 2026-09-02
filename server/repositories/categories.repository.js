import { getDb } from '../../database/connection';

export async function findAll() {
  const pool = await getDb();
  const [rows] = await pool.query(
    'SELECT id, name, slug, parent_id FROM categories ORDER BY id'
  );
  return rows;
}

export async function findById(id) {
  const pool = await getDb();
  const [rows] = await pool.query(
    'SELECT id, name, slug, parent_id FROM categories WHERE id = ?',
    [id]
  );
  return rows[0];
}
