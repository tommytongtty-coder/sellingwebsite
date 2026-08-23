import { getDb } from '../../database/connection';

export async function findAll() {
  const pool = await getDb();
  const [rows] = await pool.query(
    'SELECT id, name FROM categories ORDER BY id'
  );
  return rows;
}
