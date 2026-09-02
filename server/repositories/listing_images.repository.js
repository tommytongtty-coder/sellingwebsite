import { getDb } from '../../database/connection';

export async function findByListingId(listingId) {
  const pool = await getDb();
  const [rows] = await pool.query(
    `SELECT id, image_url, sort_order, is_cover
       FROM listing_images
      WHERE listing_id = ?
      ORDER BY sort_order`,
    [listingId]
  );
  return rows;
}

export async function create(listingId, imageUrl, sortOrder, isCover) {
  const pool = await getDb();
  const [result] = await pool.query(
    `INSERT INTO listing_images (listing_id, image_url, sort_order, is_cover)
     VALUES (?, ?, ?, ?)`,
    [listingId, imageUrl, sortOrder || 0, isCover || false]
  );
  return { id: result.insertId, listing_id: listingId, image_url: imageUrl, sort_order: sortOrder || 0, is_cover: isCover || false };
}

export async function deleteByListingId(listingId) {
  const pool = await getDb();
  await pool.query(
    'DELETE FROM listing_images WHERE listing_id = ?',
    [listingId]
  );
}
