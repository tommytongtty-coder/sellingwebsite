import { getDb } from '../../database/connection';

export async function findAll() {
  const pool = await getDb();
  const [rows] = await pool.query(
    `SELECT
       l.id,
       l.title,
       l.price,
       l.seller,
       l.shipping,
       l.badge,
       l.accent,
       l.location,
       l.condition_type AS \`condition\`,
       c.name AS category
     FROM listings l
     LEFT JOIN categories c ON c.id = l.category_id
     ORDER BY l.created_at DESC`
  );
  return rows;
}
