import { getDb } from '../../database/connection';

export async function getAllListings() {
  const pool = await getDb();
  const [rows] = await pool.query(
    `SELECT l.*, u.display_name AS seller_name,
            c.name AS category,
            (SELECT li.image_url FROM listing_images li
               WHERE li.listing_id = l.id AND li.is_cover = TRUE
               LIMIT 1) AS cover_image
       FROM listings l
       LEFT JOIN users u ON u.id = l.seller_id
       LEFT JOIN categories c ON c.id = l.category_id
      ORDER BY l.created_at DESC`
  );
  return rows;
}

export async function getListingById(id) {
  const pool = await getDb();
  const [rows] = await pool.query(
    `SELECT l.*, u.display_name AS seller_name,
            c.name AS category
       FROM listings l
       LEFT JOIN users u ON u.id = l.seller_id
       LEFT JOIN categories c ON c.id = l.category_id
      WHERE l.id = ?`,
    [id]
  );
  return rows[0];
}

export async function updateListing(id, data, adminId) {
  const pool = await getDb();
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [before] = await conn.query('SELECT * FROM listings WHERE id = ?', [id]);

    const fields = Object.keys(data).map((k) => `\`${k}\` = ?`).join(', ');
    const values = Object.values(data);
    await conn.query(`UPDATE listings SET ${fields} WHERE id = ?`, [...values, id]);

    const [after] = await conn.query('SELECT * FROM listings WHERE id = ?', [id]);

    await conn.query(
      `INSERT INTO admin_logs (admin_id, action, target_table, target_id, old_value, new_value)
       VALUES (?, 'update_listing', 'listings', ?, ?, ?)`,
      [adminId, id, JSON.stringify(before[0]), JSON.stringify(after[0])]
    );

    await conn.commit();
    return after[0];
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

export async function approveListing(id, adminId) {
  const pool = await getDb();
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    await conn.query(
      'UPDATE listings SET status = ?, is_certified = TRUE WHERE id = ?',
      ['active', id]
    );

    await conn.query(
      `INSERT INTO admin_logs (admin_id, action, target_table, target_id, new_value)
       VALUES (?, 'approve_listing', 'listings', ?, ?)`,
      [adminId, id, JSON.stringify({ status: 'active', is_certified: true })]
    );

    await conn.commit();
    return getListingById(id);
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

export async function rejectListing(id, adminId) {
  const pool = await getDb();
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    await conn.query(
      'UPDATE listings SET status = ? WHERE id = ?',
      ['rejected', id]
    );

    await conn.query(
      `INSERT INTO admin_logs (admin_id, action, target_table, target_id, new_value)
       VALUES (?, 'reject_listing', 'listings', ?, ?)`,
      [adminId, id, JSON.stringify({ status: 'rejected' })]
    );

    await conn.commit();
    return getListingById(id);
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

export async function getLogs() {
  const pool = await getDb();
  const [rows] = await pool.query(
    `SELECT al.*, u.display_name AS admin_name
       FROM admin_logs al
       LEFT JOIN users u ON u.id = al.admin_id
      ORDER BY al.created_at DESC`
  );
  return rows;
}

export async function getConversations() {
  const pool = await getDb();
  const [rows] = await pool.query(
    `SELECT cv.*,
            b.display_name AS buyer_name,
            s.display_name AS seller_name,
            l.title AS listing_title
       FROM conversations cv
       LEFT JOIN users b ON b.id = cv.buyer_id
       LEFT JOIN users s ON s.id = cv.seller_id
       LEFT JOIN listings l ON l.id = cv.listing_id
      ORDER BY cv.updated_at DESC`
  );
  return rows;
}
